"""
支付路由 - 处理微信支付和支付宝支付
"""

import hashlib
import json
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import Dict, Any
import httpx
import hmac
import base64
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
import os
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db.models import PaymentSettings
from ..core.auth import get_current_active_user

router = APIRouter()

# 支付配置
class PaymentConfig:
    # 微信支付配置
    WECHAT_APP_ID = os.getenv('WECHAT_APP_ID', '')
    WECHAT_MERCHANT_ID = os.getenv('WECHAT_MERCHANT_ID', '')
    WECHAT_API_KEY = os.getenv('WECHAT_API_KEY', '')
    WECHAT_CERT_PATH = os.getenv('WECHAT_CERT_PATH', '')
    WECHAT_KEY_PATH = os.getenv('WECHAT_KEY_PATH', '')
    
    # 支付宝配置
    ALIPAY_APP_ID = os.getenv('ALIPAY_APP_ID', '')
    ALIPAY_PRIVATE_KEY = os.getenv('ALIPAY_PRIVATE_KEY', '')
    ALIPAY_PUBLIC_KEY = os.getenv('ALIPAY_PUBLIC_KEY', '')
    ALIPAY_GATEWAY_URL = 'https://openapi.alipay.com/gateway.do'
    
    # Stripe配置
    STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
    STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', '')

config = PaymentConfig()

# 请求模型
class WeChatUnifiedOrderRequest(BaseModel):
    appid: str
    mch_id: str
    nonce_str: str
    body: str
    out_trade_no: str
    total_fee: int
    spbill_create_ip: str
    notify_url: str
    trade_type: str
    sign: str

class AlipaySignRequest(BaseModel):
    data: str

class PaymentQueryRequest(BaseModel):
    paymentId: str
    method: str

class StripePaymentIntentRequest(BaseModel):
    amount: int
    currency: str
    orderId: str
    description: str
    metadata: Dict[str, Any] = {}


class PaymentSettingsSchema(BaseModel):
    # WeChat
    wechat_app_id: str = ""
    wechat_merchant_id: str = ""
    wechat_api_key: str = ""
    wechat_cert_path: str = ""
    wechat_key_path: str = ""
    # Alipay
    alipay_app_id: str = ""
    alipay_private_key: str = ""
    alipay_public_key: str = ""
    # Stripe
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

    class Config:
        orm_mode = True

# 工具函数
def generate_wechat_sign(params: Dict[str, Any], api_key: str) -> str:
    """生成微信支付签名"""
    # 排序参数
    sorted_params = sorted(params.items())
    query_string = '&'.join([f'{k}={v}' for k, v in sorted_params if v != '' and k != 'sign'])
    query_string += f'&key={api_key}'
    
    # MD5加密
    return hashlib.md5(query_string.encode('utf-8')).hexdigest().upper()

def verify_wechat_sign(params: Dict[str, Any], sign: str, api_key: str) -> bool:
    """验证微信支付签名"""
    calculated_sign = generate_wechat_sign(params, api_key)
    return calculated_sign == sign

def generate_alipay_sign(params: Dict[str, Any], private_key: str) -> str:
    """生成支付宝签名"""
    # 排序参数
    sorted_params = sorted(params.items())
    query_string = '&'.join([f'{k}={v}' for k, v in sorted_params if v != '' and k != 'sign'])
    
    # RSA签名
    try:
        key = RSA.import_key(private_key)
        h = SHA256.new(query_string.encode('utf-8'))
        signature = pkcs1_15.new(key).sign(h)
        return base64.b64encode(signature).decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成签名失败: {str(e)}")

def dict_to_xml(data: Dict[str, Any]) -> str:
    """字典转XML"""
    xml = '<xml>'
    for key, value in data.items():
        xml += f'<{key}><![CDATA[{value}]]></{key}>'
    xml += '</xml>'
    return xml

def xml_to_dict(xml_str: str) -> Dict[str, Any]:
    """XML转字典"""
    root = ET.fromstring(xml_str)
    return {child.tag: child.text for child in root}

# 微信支付统一下单
@router.post("/wechat/unifiedorder")
async def wechat_unified_order(request: WeChatUnifiedOrderRequest):
    """微信支付统一下单"""
    try:
        # 验证签名
        params = request.dict()
        sign = params.pop('sign')
        
        if not verify_wechat_sign(params, sign, config.WECHAT_API_KEY):
            raise HTTPException(status_code=400, detail="签名验证失败")
        
        # 重新生成签名
        params['sign'] = generate_wechat_sign(params, config.WECHAT_API_KEY)
        
        # 转换为XML
        xml_data = dict_to_xml(params)
        
        # 调用微信API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                'https://api.mch.weixin.qq.com/pay/unifiedorder',
                content=xml_data,
                headers={'Content-Type': 'application/xml'},
                timeout=30.0
            )
        
        # 解析响应
        result = xml_to_dict(response.text)
        
        if result.get('return_code') == 'SUCCESS':
            return result
        else:
            raise HTTPException(status_code=400, detail=result.get('return_msg', '微信支付API调用失败'))
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"微信支付统一下单失败: {str(e)}")

# 支付宝签名生成
@router.post("/alipay/sign")
async def alipay_sign(request: AlipaySignRequest):
    """生成支付宝签名"""
    try:
        # 使用配置的私钥生成签名
        sign = generate_alipay_sign({'data': request.data}, config.ALIPAY_PRIVATE_KEY)
        return {"sign": sign}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成支付宝签名失败: {str(e)}")

# Stripe支付意图创建
@router.post("/stripe/create-payment-intent")
async def create_stripe_payment_intent(request: StripePaymentIntentRequest):
    """创建Stripe支付意图"""
    try:
        import stripe
        stripe.api_key = config.STRIPE_SECRET_KEY
        
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            metadata={
                'order_id': request.orderId,
                'description': request.description,
                **request.metadata
            },
            automatic_payment_methods={'enabled': True}
        )
        
        return {
            "success": True,
            "paymentIntentId": intent.id,
            "clientSecret": intent.client_secret
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"创建Stripe支付意图失败: {str(e)}"
        }

# 支付状态查询
@router.post("/query")
async def query_payment_status(request: PaymentQueryRequest):
    """查询支付状态"""
    try:
        payment_id = request.paymentId
        method = request.method
        
        if method == 'wechat':
            # 查询微信支付状态
            return await query_wechat_payment(payment_id)
        elif method == 'alipay':
            # 查询支付宝支付状态
            return await query_alipay_payment(payment_id)
        elif method == 'credit':
            # 查询Stripe支付状态
            return await query_stripe_payment(payment_id)
        else:
            raise HTTPException(status_code=400, detail="不支持的支付方式")
            
    except Exception as e:
        return {"status": "failed", "error": str(e)}

async def query_wechat_payment(payment_id: str) -> Dict[str, Any]:
    """查询微信支付状态"""
    try:
        # 提取订单号
        out_trade_no = payment_id.replace('wechat_', '')
        
        params = {
            'appid': config.WECHAT_APP_ID,
            'mch_id': config.WECHAT_MERCHANT_ID,
            'out_trade_no': out_trade_no,
            'nonce_str': generate_nonce_str()
        }
        
        # 生成签名
        params['sign'] = generate_wechat_sign(params, config.WECHAT_API_KEY)
        
        # 转换为XML
        xml_data = dict_to_xml(params)
        
        # 调用微信API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                'https://api.mch.weixin.qq.com/pay/orderquery',
                content=xml_data,
                headers={'Content-Type': 'application/xml'},
                timeout=30.0
            )
        
        result = xml_to_dict(response.text)
        
        # 转换状态
        if result.get('trade_state') == 'SUCCESS':
            return {"status": "success"}
        elif result.get('trade_state') in ['PAYERROR', 'CLOSED']:
            return {"status": "failed"}
        else:
            return {"status": "pending"}
            
    except Exception as e:
        return {"status": "failed", "error": str(e)}

async def query_alipay_payment(payment_id: str) -> Dict[str, Any]:
    """查询支付宝支付状态"""
    try:
        # 提取订单号
        out_trade_no = payment_id.replace('alipay_', '')
        
        params = {
            'method': 'alipay.trade.query',
            'app_id': config.ALIPAY_APP_ID,
            'charset': 'utf-8',
            'sign_type': 'RSA2',
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'version': '1.0',
            'biz_content': json.dumps({
                'out_trade_no': out_trade_no
            })
        }
        
        # 生成签名
        params['sign'] = generate_alipay_sign(params, config.ALIPAY_PRIVATE_KEY)
        
        # 调用支付宝API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                config.ALIPAY_GATEWAY_URL,
                data=params,
                timeout=30.0
            )
        
        result = response.json()
        
        # 解析响应
        if 'alipay_trade_query_response' in result:
            trade_status = result['alipay_trade_query_response'].get('trade_status')
            if trade_status == 'TRADE_SUCCESS':
                return {"status": "success"}
            elif trade_status in ['TRADE_CLOSED', 'TRADE_FINISHED']:
                return {"status": "failed"}
            else:
                return {"status": "pending"}
        else:
            return {"status": "failed", "error": "查询失败"}
            
    except Exception as e:
        return {"status": "failed", "error": str(e)}

async def query_stripe_payment(payment_id: str) -> Dict[str, Any]:
    """查询Stripe支付状态"""
    try:
        import stripe
        stripe.api_key = config.STRIPE_SECRET_KEY
        
        intent = stripe.PaymentIntent.retrieve(payment_id)
        
        if intent.status == 'succeeded':
            return {"status": "success"}
        elif intent.status in ['canceled', 'payment_failed']:
            return {"status": "failed"}
        else:
            return {"status": "pending"}
            
    except Exception as e:
        return {"status": "failed", "error": str(e)}

# 微信支付回调
@router.post("/wechat/notify")
async def wechat_payment_notify(request: Request):
    """微信支付回调处理"""
    try:
        xml_data = await request.body()
        result = xml_to_dict(xml_data.decode('utf-8'))
        
        # 验证签名
        sign = result.pop('sign', '')
        if not verify_wechat_sign(result, sign, config.WECHAT_API_KEY):
            return dict_to_xml({'return_code': 'FAIL', 'return_msg': '签名验证失败'})
        
        # 处理支付成功逻辑
        if result.get('result_code') == 'SUCCESS':
            out_trade_no = result.get('out_trade_no')
            transaction_id = result.get('transaction_id')
            total_fee = result.get('total_fee')
            
            # 这里添加业务逻辑，如更新订单状态、发送通知等
            # await process_payment_success(out_trade_no, transaction_id, total_fee)
            
            return dict_to_xml({'return_code': 'SUCCESS', 'return_msg': 'OK'})
        else:
            return dict_to_xml({'return_code': 'FAIL', 'return_msg': '支付失败'})
            
    except Exception as e:
        return dict_to_xml({'return_code': 'FAIL', 'return_msg': str(e)})

# 支付宝回调
@router.post("/alipay/notify")
async def alipay_payment_notify(request: Request):
    """支付宝支付回调处理"""
    try:
        form_data = await request.form()
        params = dict(form_data)
        
        # 验证签名（这里需要实现支付宝公钥验证）
        # 实际生产环境中需要用支付宝公钥验证签名
        
        # 处理支付成功逻辑
        if params.get('trade_status') == 'TRADE_SUCCESS':
            out_trade_no = params.get('out_trade_no')
            trade_no = params.get('trade_no')
            total_amount = params.get('total_amount')
            
            # 这里添加业务逻辑，如更新订单状态、发送通知等
            # await process_payment_success(out_trade_no, trade_no, total_amount)
            
            return "success"
        else:
            return "fail"
            
    except Exception as e:
        return "fail"

# Stripe回调
@router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    """Stripe支付回调处理"""
    try:
        import stripe
        
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        event = stripe.Webhook.construct_event(
            payload, sig_header, config.STRIPE_WEBHOOK_SECRET
        )
        
        # 处理不同类型的事件
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            
            # 处理支付成功逻辑
            order_id = payment_intent['metadata'].get('order_id')
            amount = payment_intent['amount']
            
            # 这里添加业务逻辑
            # await process_payment_success(order_id, payment_intent['id'], amount)
            
        return {"received": True}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def generate_nonce_str() -> str:
    """生成随机字符串"""
    import random
    import string
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

# 验证支付回调
@router.post("/verify-callback")
async def verify_payment_callback(request: Request):
    """验证支付回调数据"""
    try:
        data = await request.json()
        method = data.get('method')
        callback_data = data.get('data')
        
        if method == 'wechat':
            # 验证微信回调
            sign = callback_data.pop('sign', '')
            verified = verify_wechat_sign(callback_data, sign, config.WECHAT_API_KEY)
        elif method == 'alipay':
            # 验证支付宝回调（需要实现支付宝公钥验证）
            verified = True  # 简化处理
        else:
            verified = False
            
        return {"verified": verified}
        
    except Exception as e:
        return {"verified": False, "error": str(e)}


# 管理接口：获取/更新支付配置（需要登录）
@router.get("/settings", response_model=PaymentSettingsSchema)
async def get_payment_settings(
    db: Session = Depends(get_db),
    user=Depends(get_current_active_user)
):
    settings_row = db.query(PaymentSettings).order_by(PaymentSettings.id.desc()).first()
    if not settings_row:
        settings_row = PaymentSettings()
        db.add(settings_row)
        db.commit()
        db.refresh(settings_row)
    return settings_row


@router.put("/settings", response_model=PaymentSettingsSchema)
async def update_payment_settings(
    payload: PaymentSettingsSchema,
    db: Session = Depends(get_db),
    user=Depends(get_current_active_user)
):
    settings_row = db.query(PaymentSettings).order_by(PaymentSettings.id.desc()).first()
    if not settings_row:
        settings_row = PaymentSettings()
        db.add(settings_row)
    # 更新字段
    for field, value in payload.dict().items():
        setattr(settings_row, field, value)
    db.commit()
    db.refresh(settings_row)

    # 同步到运行时配置（仅内存，进程重启会恢复为环境变量）
    config.WECHAT_APP_ID = settings_row.wechat_app_id
    config.WECHAT_MERCHANT_ID = settings_row.wechat_merchant_id
    config.WECHAT_API_KEY = settings_row.wechat_api_key
    config.WECHAT_CERT_PATH = settings_row.wechat_cert_path
    config.WECHAT_KEY_PATH = settings_row.wechat_key_path
    config.ALIPAY_APP_ID = settings_row.alipay_app_id
    config.ALIPAY_PRIVATE_KEY = settings_row.alipay_private_key
    config.ALIPAY_PUBLIC_KEY = settings_row.alipay_public_key
    config.STRIPE_SECRET_KEY = settings_row.stripe_secret_key
    config.STRIPE_WEBHOOK_SECRET = settings_row.stripe_webhook_secret

    return settings_row