from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db import models
from ..services.wechat_pay import create_jsapi_order, build_jsapi_invoke_params, verify_callback_signature, decrypt_callback_resource
from ..core.config import settings
from datetime import datetime
import uuid

router = APIRouter()


class JsapiOrderReq(BaseModel):
    amount: int
    title: str
    openid: str
    out_trade_no: Optional[str] = None


@router.post("/api/v1/wxpay/jsapi/create")
async def wxpay_jsapi_create(req: JsapiOrderReq, db: Session = Depends(get_db)):
    try:
        out_trade_no = req.out_trade_no or f"WX_{uuid.uuid4().hex[:14]}"
        # DB: create pending
        db_order = models.Order(
            order_number=out_trade_no,
            user_id=0,
            course_id=0,
            amount=req.amount / 100.0,
            original_amount=req.amount / 100.0,
            discount=0.0,
            payment_method='wechat',
            status='pending',
            notes=req.title,
            channel='wechat_h5',
            product_type='premium_report',
            order_source='website'
        )
        db.add(db_order)
        db.commit()

        # Create prepay and build invoke params
        prepay = create_jsapi_order(out_trade_no, req.amount, req.title, req.openid)
        params = build_jsapi_invoke_params(prepay.get('prepay_id', ''))
        return params
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/v1/wxpay/notify")
async def wxpay_notify(request: Request, db: Session = Depends(get_db)):
    # Verify signature (skeleton)
    headers = {k: v for k, v in request.headers.items()}
    body = await request.body()
    try:
        if not verify_callback_signature(headers, body):
            raise HTTPException(status_code=400, detail="invalid signature")
        payload = await request.json()
        resource = payload.get('resource') or {}
        plain = decrypt_callback_resource(resource)
        out_trade_no = plain.get('out_trade_no')
        if not out_trade_no:
            raise HTTPException(status_code=400, detail="missing out_trade_no")
        order = db.query(models.Order).filter(models.Order.order_number == out_trade_no).first()
        if not order:
            raise HTTPException(status_code=404, detail="order not found")
        order.status = 'paid'
        order.payment_time = datetime.utcnow()
        order.raw_notify = payload
        db.commit()
        return {"code": "SUCCESS", "message": "OK"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))



