"""
WeChat Pay V3 helper (skeleton)
- create_jsapi_order: build and sign request to unified order API
- build_jsapi_invoke_params: second signature for JSAPI invoke
- verify_callback_signature: verify Wechatpay-Signature headers
- decrypt_callback_resource: AES-GCM decrypt of resource.ciphertext using apiv3Key

Note: This is a skeleton for wiring; fill real keys/paths from settings and enable real HTTP calls.
"""
from __future__ import annotations
from typing import Dict, Any
import time
import json

from ..core.config import settings


def create_jsapi_order(out_trade_no: str, amount_fen: int, title: str, openid: str) -> Dict[str, Any]:
    """Return {'prepay_id': '...'} after calling WeChat V3 unified order.
    Skeleton: return demo prepay.
    """
    return {"prepay_id": "demo-prepay-id"}


def build_jsapi_invoke_params(prepay_id: str) -> Dict[str, Any]:
    ts = str(int(time.time()))
    nonce = "demo-nonce"
    # paySign should be RSA-SHA256 over appId\n timeStamp\n nonceStr\n prepay_id=xxx\n
    return {
        "appId": settings.WECHAT_APPID,
        "timeStamp": ts,
        "nonceStr": nonce,
        "package": f"prepay_id={prepay_id}",
        "signType": "RSA",
        "paySign": "demo-sign",
    }


def verify_callback_signature(headers: Dict[str, str], body: bytes) -> bool:
    """Verify Wechatpay-Signature (skeleton)."""
    return True


def decrypt_callback_resource(resource: Dict[str, Any]) -> Dict[str, Any]:
    """AES-GCM decrypt resource.ciphertext (skeleton)."""
    # Return demo plaintext structure with out_trade_no
    return {
        "out_trade_no": "demo-out-trade-no",
        "transaction_id": "demo-txid",
        "payer": {"openid": "demo-openid"},
        "amount": {"payer_total": 1},
        "trade_state": "SUCCESS",
    }


