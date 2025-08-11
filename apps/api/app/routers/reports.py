from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi import Depends
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db import models
import uuid
import smtplib
from email.mime.text import MIMEText
from email.utils import formataddr
import os
from datetime import datetime, timedelta

STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'reports')
os.makedirs(STATIC_DIR, exist_ok=True)

router = APIRouter()

class ReportRequest(BaseModel):
    project_id: str
    title_zh: Optional[str] = None
    title_en: Optional[str] = None

class ReportResponse(BaseModel):
    html: str

@router.post("/api/v1/reports/html", response_model=ReportResponse)
async def generate_html_report(req: ReportRequest):
    """
    极简后端：接收 project_id，返回 HTML 字符串。
    说明：先返回HTML字符串，后续可替换为服务端渲染+存储并返回url。
    """
    try:
        # 为了避免后端依赖前端代码，这里直接返回占位模板。
        # 真实项目中，这里调用共享层的生成器或独立服务。
        title_zh = req.title_zh or "项目深度报告"
        title_en = req.title_en or "Project Deep Report"
        html = f"""<!DOCTYPE html><html lang='zh-CN'><head><meta charset='utf-8'/><meta name='viewport' content='width=device-width,initial-scale=1'/><title>{title_zh}（{title_en}）深度报告</title></head><body><h1>{title_zh}（{title_en}）深度报告</h1><p>这是一份占位HTML。请在后续版本中接入服务端模板引擎或渲染服务，基于 project_id={req.project_id} 生成完整报告HTML。</p></body></html>"""
        return ReportResponse(html=html)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class CustomOrderRequest(BaseModel):
    project_id: Optional[str] = None
    project_title: Optional[str] = None
    company: str
    name: str
    contact: str
    requirement: str
    budget_timeline: Optional[str] = ""

class CustomOrderResponse(BaseModel):
    order_number: str
    status: str


@router.post("/api/v1/orders/custom", response_model=CustomOrderResponse)
async def create_custom_order(req: CustomOrderRequest, db: Session = Depends(get_db)):
    """创建定制需求订单，并向负责人发送邮件通知。"""
    try:
        order_number = f"CO_{uuid.uuid4().hex[:12]}"
        db_order = models.CustomOrder(
            order_number=order_number,
            project_id=req.project_id,
            project_title=req.project_title,
            company=req.company,
            name=req.name,
            contact=req.contact,
            requirement=req.requirement,
            budget_timeline=req.budget_timeline or "",
            status="new"
        )
        db.add(db_order)
        db.commit()
        
        # 发送邮件（best-effort，不阻塞接口）
        try:
            to_email = "lzg@bless.top"
            subject = f"[定制预约] {req.project_title or req.project_id or ''} - {req.company} {req.name}"
            content = f"""
新定制预约：{order_number}

项目：{req.project_title or ''} ({req.project_id or ''})
公司/团队：{req.company}
联系人：{req.name}
微信/电话：{req.contact}
需求说明：{req.requirement}
预算与时间：{req.budget_timeline or '-'}
            """
            msg = MIMEText(content, 'plain', 'utf-8')
            msg['From'] = formataddr(("DeepNeed Bot", "no-reply@deepneed.com"))
            msg['To'] = to_email
            msg['Subject'] = subject

            # 优先使用数据库配置，其次环境变量，最后本机SMTP
            email_cfg = db.query(models.EmailSettings).order_by(models.EmailSettings.updated_at.desc()).first()
            smtp_host = (email_cfg.smtp_host if email_cfg else None) or os.getenv('SMTP_HOST', 'localhost')
            smtp_port = int((email_cfg.smtp_port if email_cfg else None) or os.getenv('SMTP_PORT', '25'))
            smtp_user = (email_cfg.smtp_user if email_cfg else None) or os.getenv('SMTP_USER')
            smtp_pass = (email_cfg.smtp_pass if email_cfg else None) or os.getenv('SMTP_PASS')
            use_tls = (email_cfg.use_tls if email_cfg is not None else None)
            if use_tls is None:
                use_tls = os.getenv('SMTP_TLS', 'false').lower() == 'true'
            from_addr = (email_cfg.from_address if email_cfg else None) or 'no-reply@deepneed.com'

            if smtp_user and smtp_pass:
                server = smtplib.SMTP(smtp_host, smtp_port)
                server.starttls() if use_tls else None
                server.login(smtp_user, smtp_pass)
                server.sendmail(from_addr, [to_email], msg.as_string())
                server.quit()
            else:
                with smtplib.SMTP(smtp_host, smtp_port) as server:
                    server.sendmail(from_addr, [to_email], msg.as_string())
        except Exception:
            pass

        return CustomOrderResponse(order_number=order_number, status="new")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


class CustomOrderListItem(BaseModel):
    order_number: str
    company: str
    name: str
    contact: str
    status: str
    project_title: Optional[str] = None
    created_at: Optional[str] = None


@router.get("/api/v1/orders/custom")
async def list_custom_orders(db: Session = Depends(get_db)):
    orders = db.query(models.CustomOrder).order_by(models.CustomOrder.created_at.desc()).limit(200).all()
    return [
        {
            "order_number": o.order_number,
            "company": o.company,
            "name": o.name,
            "contact": o.contact,
            "status": o.status,
            "project_title": o.project_title,
            "created_at": o.created_at.isoformat() if o.created_at else None,
        }
        for o in orders
    ]


class EmailSettingsRequest(BaseModel):
    smtp_host: str
    smtp_port: int
    smtp_user: str | None = None
    smtp_pass: str | None = None
    use_tls: bool = False
    from_address: str = "no-reply@deepneed.com"


@router.get("/api/v1/email/settings")
async def get_email_settings(db: Session = Depends(get_db)):
    cfg = db.query(models.EmailSettings).order_by(models.EmailSettings.updated_at.desc()).first()
    if not cfg:
        return {
            "smtp_host": os.getenv('SMTP_HOST', 'localhost'),
            "smtp_port": int(os.getenv('SMTP_PORT', '25')),
            "smtp_user": os.getenv('SMTP_USER', ''),
            "smtp_pass": "",
            "use_tls": os.getenv('SMTP_TLS', 'false').lower() == 'true',
            "from_address": 'no-reply@deepneed.com'
        }
    return {
        "smtp_host": cfg.smtp_host,
        "smtp_port": cfg.smtp_port,
        "smtp_user": cfg.smtp_user,
        "smtp_pass": "",  # 不回传密码
        "use_tls": cfg.use_tls,
        "from_address": cfg.from_address
    }


@router.post("/api/v1/email/settings")
async def save_email_settings(req: EmailSettingsRequest, db: Session = Depends(get_db)):
    cfg = db.query(models.EmailSettings).first()
    if not cfg:
        cfg = models.EmailSettings()
        db.add(cfg)
    cfg.smtp_host = req.smtp_host
    cfg.smtp_port = req.smtp_port
    cfg.smtp_user = req.smtp_user or ""
    cfg.smtp_pass = req.smtp_pass or ""
    cfg.use_tls = req.use_tls
    cfg.from_address = req.from_address
    db.commit()
    return {"message": "saved"}


class AnalyticsEventRequest(BaseModel):
    name: str
    ts: Optional[float] = None
    props: Optional[dict] = None


@router.post('/api/v1/analytics')
async def save_analytics_event(evt: AnalyticsEventRequest, db: Session = Depends(get_db)):
    try:
        rec = models.AnalyticsEvent(
            name=evt.name,
            props=evt.props or {}
        )
        db.add(rec)
        db.commit()
        return {"ok": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/api/v1/analytics')
async def list_analytics(days: int = 30, limit: int = 5000, db: Session = Depends(get_db)):
    try:
        since = datetime.utcnow() - timedelta(days=days)
        q = db.query(models.AnalyticsEvent).filter(models.AnalyticsEvent.ts >= since).order_by(models.AnalyticsEvent.ts.desc()).limit(limit)
        rows = q.all()
        return [
            {
                "id": r.id,
                "name": r.name,
                "ts": r.ts.isoformat() if r.ts else None,
                "props": r.props or {}
            } for r in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class PublishRequest(BaseModel):
    project_id: str
    title: str
    html: str

class PublishResponse(BaseModel):
    htmlUrl: str
    pdfUrl: Optional[str] = None
    storage: str = "static"

def _sanitize_filename(name: str) -> str:
    return ''.join([c if c.isalnum() or c in ('_', '-', '(', ')') else '_' for c in name])

@router.post("/api/v1/reports/publish", response_model=PublishResponse)
async def publish_report(req: PublishRequest):
    """
    接收HTML，生成静态HTML与PDF；优先本地static目录，若配置了OSS则上传后返回URL。
    环境变量（可选）：
      OSS_ENDPOINT, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BUCKET, OSS_BASE_URL
    依赖（可选）：pip install oss2 playwright && playwright install
    """
    try:
        ts = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        base_name = f"{_sanitize_filename(req.title)}_{req.project_id}_{ts}"
        html_filename = base_name + '.html'
        pdf_filename = base_name + '.pdf'

        # 写入本地 HTML
        html_path = os.path.join(STATIC_DIR, html_filename)
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(req.html)

        html_url = f"/static/reports/{html_filename}"
        pdf_url: Optional[str] = None

        # 生成 PDF（best-effort）
        try:
            from playwright.async_api import async_playwright
            import asyncio

            async def render_pdf():
                async with async_playwright() as pw:
                    browser = await pw.chromium.launch()
                    page = await browser.new_page()
                    await page.set_content(req.html, wait_until='load')
                    pdf_path = os.path.join(STATIC_DIR, pdf_filename)
                    await page.pdf(path=pdf_path, print_background=True, format='A4')
                    await browser.close()
                    return pdf_path

            pdf_path = await render_pdf()
            if os.path.exists(pdf_path):
                pdf_url = f"/static/reports/{pdf_filename}"
        except Exception:
            # 无法生成PDF则忽略
            pdf_url = None

        # 可选：上传到OSS
        if os.getenv('OSS_ENDPOINT') and os.getenv('OSS_BUCKET'):
            try:
                import oss2  # type: ignore
                auth = oss2.Auth(os.getenv('OSS_ACCESS_KEY_ID'), os.getenv('OSS_ACCESS_KEY_SECRET'))
                bucket = oss2.Bucket(auth, os.getenv('OSS_ENDPOINT'), os.getenv('OSS_BUCKET'))
                base_url = os.getenv('OSS_BASE_URL') or ''

                with open(html_path, 'rb') as f:
                    bucket.put_object(f"reports/{html_filename}", f)
                html_url = f"{base_url}/reports/{html_filename}" if base_url else html_url

                if pdf_url:
                    pdf_path = os.path.join(STATIC_DIR, pdf_filename)
                    if os.path.exists(pdf_path):
                        with open(pdf_path, 'rb') as f:
                            bucket.put_object(f"reports/{pdf_filename}", f)
                        pdf_url = f"{base_url}/reports/{pdf_filename}" if base_url else pdf_url

                return PublishResponse(htmlUrl=html_url, pdfUrl=pdf_url, storage='oss')
            except Exception:
                # OSS失败则返回本地URL
                pass

        return PublishResponse(htmlUrl=html_url, pdfUrl=pdf_url, storage='static')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== WeChat OAuth & Pay (占位接口) =====
from fastapi import Request
from ..core.config import settings


class JsapiOrderReq(BaseModel):
    amount: int
    title: str
    openid: str
    out_trade_no: Optional[str] = None


@router.get("/api/v1/wx/oauth/me")
async def wechat_oauth_me(code: Optional[str] = None):
    # TODO: 用 code 调用微信网页授权换取 openid（snsapi_base），此处占位
    if not code:
        return {"openid": "test-openid-placeholder"}
    return {"openid": "test-openid-from-code"}


@router.post("/api/v1/wxpay/jsapi/create")
async def wechat_jsapi_create(req: JsapiOrderReq, db: Session = Depends(get_db)):
    # TODO: 调用微信支付V3统一下单（JSAPI），生成 prepay_id 并二次签名
    # 占位：写入订单 pending
    try:
        order_number = req.out_trade_no or f"WX_{uuid.uuid4().hex[:14]}"
        db_order = models.Order(
            order_number=order_number,
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
    except Exception:
        db.rollback()
    return {
        "appId": settings.WECHAT_APPID,
        "timeStamp": "1700000000",
        "nonceStr": "demo-nonce",
        "package": "prepay_id=demo-prepay-id",
        "signType": "RSA",
        "paySign": "demo-sign",
    }


@router.post("/api/v1/wxpay/notify")
async def wechat_pay_notify(request: Request, db: Session = Depends(get_db)):
    # TODO: 校验签名、解密resource、更新订单
    body = await request.body()
    try:
        # 占位：将最后一个 pending 订单置为 paid
        order = db.query(models.Order).order_by(models.Order.created_at.desc()).first()
        if order:
            order.status = 'paid'
            order.payment_time = datetime.utcnow()
            order.raw_notify = {"raw": body.decode('utf-8', errors='ignore')}
            db.commit()
    except Exception:
        db.rollback()
    return {"code": "SUCCESS", "message": "OK"}

