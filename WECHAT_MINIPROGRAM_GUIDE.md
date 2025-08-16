# 微信小程序对接与最简骨架

本文档用于指导 DeepNeed 与微信小程序打通支付与交付闭环。当前后端已提供占位接口，参数就绪后只需替换密钥即可启用正式流程。

## 一、准备工作
- 实名认证：小程序、微信支付（V3）
- 获取参数：
  - AppID：WECHAT_APPID
  - AppSecret：WECHAT_APPSECRET
  - 商户号：WECHAT_MCHID
  - APIv3Key：WECHAT_APIv3_KEY
  - 商户证书序列号：WECHAT_MCH_SERIAL_NO
  - 商户私钥路径：WECHAT_MCH_PRIVATE_KEY_PATH（apiclient_key.pem）
  - 微信平台证书路径：WECHAT_PLATFORM_CERT_PATH（可自动拉取）
  - 回调 URL：WECHAT_NOTIFY_URL（如 https://deepneed.com.cn/api/v1/wxpay/notify）
- 小程序合法域名配置：
  - request 合法域名：https://deepneed.com.cn
  - 业务域名：https://deepneed.com.cn

## 二、后端接口（FastAPI）
- OpenID：GET /api/v1/wx/oauth/me?code=wx.login 返回 { openid }
- JSSDK 签名：GET /api/v1/wx/jssdk/sign?url=
- JSAPI 下单：POST /api/v1/wxpay/jsapi/create
  - 入参：{ amount(分), title, openid, out_trade_no }
  - 出参：用于 wx.requestPayment 的参数
- 支付回调：POST /api/v1/wxpay/notify（V3 验签+解密 → 更新订单 paid）
- 管理订单：GET /api/v1/admin/orders

当前仓库中的占位代码：
- apps/api/app/services/wechat_pay.py（V3 签名/验签/解密骨架）
- apps/api/app/routers/wechat_oauth.py（openid / jssdk 占位）
- apps/api/app/routers/payments.py（create / notify 路由）

## 三、最简小程序骨架（示例）
建议路径：apps/miniprogram/deepneed-mp/
- utils/request.js：简易请求封装
- pages/goods/index：商品列表示例
- pages/pay/confirm：确认下单与 wx.requestPayment
- pages/delivery/index：支付后跳转交付（web-view 打开 H5 交付页 /delivery）
- pages/webview/index：容器页

开发步骤：
1) 用微信开发者工具打开 apps/miniprogram/deepneed-mp 目录
2) 在 app.json 中按需调整 pages 顺序/窗口标题
3) 在 pages/goods/index 里替换商品信息（机会 ID、标题、价格）
4) 在 pages/pay/confirm 中保持 amount 单位“分”，title 对应后端白名单
5) 在 pages/delivery/index 选择内嵌 web-view 或原生展示交付

## 四、价格与商品映射
- 后端维护 SKU→金额（分）白名单，create_jsapi_order 前校验，不信任前端价格
- 三层商品：29.9/299/2999，对应不同机会/课程/定制服务

## 五、日志与安全
- 订单落库：pending→paid，写 raw_notify 以便回溯
- 金额/商户/appid/openid 一致性校验
- 回调验签失败/解密失败记录错误码与 body 哈希

## 六、上线与测试
- 小程序：体验版 → 成员支付联调 → 提交审核（含隐私、支付与说明）
- 回调：确保 Nginx 不改写回调 body；超时重试策略生效
- 管理端：/admin/orders 观察 pending→paid 流转

如需，我可在拿到参数后：
- 启用 V3 实签与验签/解密
- 完成 code2Session 与 JSSDK 签名缓存
- 增加订单筛选导出、退款/关单预留接口



