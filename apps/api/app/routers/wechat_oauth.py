from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


@router.get("/api/v1/wx/oauth/me")
async def oauth_me(code: Optional[str] = None):
    # TODO: H5: use code (snsapi_base) to exchange openid
    # TODO: Mini Program: use code2Session
    if not code:
        return {"openid": "test-openid-placeholder"}
    return {"openid": "test-openid-from-code"}


@router.get("/api/v1/wx/jssdk/sign")
async def jssdk_sign(url: str):
    # TODO: cache access_token/jsapi_ticket; build signature for the given URL
    return {
        "appId": "",
        "timestamp": 1700000000,
        "nonceStr": "demo-nonce",
        "signature": "demo-signature"
    }



