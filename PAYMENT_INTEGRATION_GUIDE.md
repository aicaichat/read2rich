# 🔥 微信支付和支付宝支付集成指南

## 📋 概述

本项目集成了完整的支付解决方案，支持：
- ✅ **支付宝支付** - 网页跳转支付
- ✅ **微信支付** - 扫码支付
- ✅ **信用卡支付** - Stripe集成
- ✅ **支付状态轮询** - 实时状态更新
- ✅ **支付回调处理** - 安全验证

## 🚀 快速开始

### 1. 安装依赖

```bash
# 前端依赖已包含在现有项目中
cd apps/web && npm install

# 后端Python依赖
cd apps/api && pip install fastapi uvicorn httpx pycryptodome stripe
```

### 2. 配置环境变量

复制 `apps/web/env.payment.example` 到 `.env.local` 并填入真实配置：

```bash
cp apps/web/env.payment.example apps/web/.env.local
```

**关键配置项：**

```env
# 微信支付
NEXT_PUBLIC_WECHAT_APP_ID=wx1234567890abcdef
WECHAT_MERCHANT_ID=1234567890
WECHAT_API_KEY=your_32_char_api_key

# 支付宝
NEXT_PUBLIC_ALIPAY_APP_ID=2021001234567890
ALIPAY_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nyour_private_key\n-----END RSA PRIVATE KEY-----"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### 3. 启动服务

```bash
# 启动前端 (已运行)
cd apps/web && npm run dev

# 启动后端API
cd apps/api && uvicorn main:app --host 0.0.0.0 --port 8000
```

## 💳 支付流程

### 支付宝支付流程

1. **创建订单** → 调用支付宝API生成支付链接
2. **跳转支付** → 用户在新窗口完成支付
3. **状态轮询** → 前端轮询支付状态
4. **支付完成** → 自动下载报告

```javascript
// 支付宝支付示例
const paymentResult = await paymentService.createPayment(
  PaymentMethod.ALIPAY, 
  {
    amount: 29,
    currency: 'USD',
    orderId: 'order_123456',
    description: '购买AI职业规划师报告'
  }
);

if (paymentResult.success) {
  // 跳转到支付宝支付页面
  window.open(paymentResult.paymentUrl, '_blank');
}
```

### 微信支付流程

1. **创建订单** → 调用微信统一下单API
2. **显示二维码** → 用户扫码支付
3. **状态轮询** → 检查支付状态
4. **支付完成** → 自动下载报告

```javascript
// 微信支付示例
const paymentResult = await paymentService.createPayment(
  PaymentMethod.WECHAT, 
  paymentParams
);

if (paymentResult.success && paymentResult.qrCode) {
  // 显示二维码供用户扫描
  setQrCodeUrl(paymentResult.qrCode);
}
```

### 信用卡支付流程

1. **创建支付意图** → 调用Stripe API
2. **跳转支付** → Stripe托管支付页面
3. **支付完成** → Webhook通知结果

## 🔧 API接口说明

### 创建支付订单

**POST** `/api/payment/{method}/create`

```json
{
  "amount": 29.00,
  "currency": "USD",
  "orderId": "order_123456",
  "description": "购买报告",
  "notifyUrl": "https://your-domain.com/api/payment/notify",
  "returnUrl": "https://your-domain.com/payment/success"
}
```

### 查询支付状态

**POST** `/api/payment/query`

```json
{
  "paymentId": "payment_123456",
  "method": "alipay"
}
```

**响应：**

```json
{
  "status": "success", // pending | success | failed
  "transactionId": "2021123456789",
  "paidAt": "2021-12-01T10:00:00Z"
}
```

## 🔐 安全特性

### 签名验证

所有支付请求都包含安全签名：

```python
# 微信支付签名生成
def generate_wechat_sign(params: dict, api_key: str) -> str:
    sorted_params = sorted(params.items())
    query_string = '&'.join([f'{k}={v}' for k, v in sorted_params])
    query_string += f'&key={api_key}'
    return hashlib.md5(query_string.encode('utf-8')).hexdigest().upper()

# 支付宝RSA签名
def generate_alipay_sign(params: dict, private_key: str) -> str:
    key = RSA.import_key(private_key)
    h = SHA256.new(query_string.encode('utf-8'))
    signature = pkcs1_15.new(key).sign(h)
    return base64.b64encode(signature).decode('utf-8')
```

### 回调验证

```python
# 微信支付回调验证
@router.post("/wechat/notify")
async def wechat_payment_notify(request: Request):
    xml_data = await request.body()
    result = xml_to_dict(xml_data.decode('utf-8'))
    
    # 验证签名
    sign = result.pop('sign', '')
    if not verify_wechat_sign(result, sign, WECHAT_API_KEY):
        return {'return_code': 'FAIL', 'return_msg': '签名验证失败'}
    
    # 处理支付成功逻辑
    if result.get('result_code') == 'SUCCESS':
        await process_payment_success(result)
        return {'return_code': 'SUCCESS', 'return_msg': 'OK'}
```

## 📱 前端组件使用

### PaymentModal 组件

```jsx
import PaymentModal from '@/components/PaymentModal';

<PaymentModal
  isOpen={isPaymentModalOpen}
  onClose={() => setIsPaymentModalOpen(false)}
  opportunityId="1"
  opportunityTitle="AI职业路径规划师"
  price={29}
  onPaymentSuccess={(reportData) => {
    // 处理支付成功
    console.log('支付成功:', reportData);
  }}
/>
```

### 支付状态轮询

```javascript
import { PaymentStatusPoller } from '@/lib/paymentService';

const poller = new PaymentStatusPoller();

poller.startPolling(
  paymentId,
  PaymentMethod.ALIPAY,
  (status) => {
    if (status === PaymentStatus.SUCCESS) {
      handlePaymentSuccess();
    }
  },
  () => {
    // 超时处理
    handleTimeout();
  }
);
```

## 🧪 测试指南

### 支付宝测试

1. 使用支付宝沙箱环境
2. 配置沙箱应用信息
3. 使用沙箱账户测试

```env
# 沙箱配置
ALIPAY_GATEWAY_URL=https://openapi.alipaydev.com/gateway.do
NEXT_PUBLIC_ALIPAY_APP_ID=your_sandbox_app_id
```

### 微信支付测试

1. 申请微信支付测试号
2. 配置测试商户号
3. 使用微信开发者工具扫码

### Stripe测试

```env
# Stripe测试密钥
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

**测试卡号：**
- 成功：4242 4242 4242 4242
- 失败：4000 0000 0000 0002

## 🚨 注意事项

### 生产环境部署

1. **HTTPS必须** - 所有支付都要求HTTPS
2. **域名备案** - 支付宝要求域名备案
3. **ICP证书** - 微信支付需要ICP证书
4. **回调地址** - 必须是公网可访问的地址

### 错误处理

```javascript
try {
  const result = await paymentService.createPayment(method, params);
  if (!result.success) {
    throw new Error(result.error);
  }
} catch (error) {
  // 显示用户友好的错误信息
  setErrorMessage('支付系统暂时不可用，请稍后重试');
}
```

### 订单状态管理

```javascript
// 防止重复支付
const [paymentProcessing, setPaymentProcessing] = useState(false);

const handlePayment = async () => {
  if (paymentProcessing) return;
  
  setPaymentProcessing(true);
  try {
    // 支付逻辑
  } finally {
    setPaymentProcessing(false);
  }
};
```

## 📞 技术支持

如遇到集成问题，请检查：

1. **环境变量配置** - 确保所有必需的配置项都已设置
2. **网络连接** - 确保能访问支付平台API
3. **签名验证** - 检查私钥格式和签名算法
4. **回调地址** - 确保回调URL可公网访问

**常见问题：**

- ❌ 签名验证失败 → 检查私钥格式和参数排序
- ❌ 网络超时 → 增加请求超时时间
- ❌ 回调未收到 → 检查防火墙和域名解析

---

🎉 **集成完成！** 现在你的应用支持完整的支付功能，用户可以通过支付宝、微信支付和信用卡购买报告了！