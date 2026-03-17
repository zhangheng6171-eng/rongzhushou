# 融智助手 - 后端API文档

## 项目概述

融智助手是一个小微企业融资智能平台的后端服务，基于腾讯云CloudBase云开发构建。

## 技术栈

- **运行时**: Node.js 16.13
- **平台**: 腾讯云 CloudBase (云函数 + 数据库)
- **认证**: JWT Token
- **短信服务**: 腾讯云短信API

## 目录结构

```
backend/
├── common/              # 公共模块
│   └── utils.js         # 工具类（响应、验证、JWT、日志）
├── functions/           # 云函数
│   ├── user/           # 用户模块
│   ├── article/        # 文章模块
│   ├── ai/             # AI对话模块
│   ├── loan/           # 贷款计算模块
│   ├── order/          # 订单模块
│   └── member/         # 会员模块
└── cloudbaserc.json    # CloudBase部署配置
```

## API接口文档

### 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "timestamp": 1703275200000
}
```

### 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |
| 1001 | 短信发送失败 |
| 1002 | 验证码错误 |
| 2001 | 用户不存在 |
| 2002 | 用户已存在 |
| 3001 | 会员已过期 |
| 4001 | 支付失败 |

---

## 1. 用户模块

### 1.1 发送验证码

**接口**: `user-sms`  
**方法**: POST  
**鉴权**: 无需鉴权

**请求参数**:
```json
{
  "phone": "13012345678",
  "type": "login"
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "发送成功",
  "data": {
    "message": "验证码已发送"
  }
}
```

---

### 1.2 用户注册

**接口**: `user-register`  
**方法**: POST  
**鉴权**: 无需鉴权

**请求参数**:
```json
{
  "phone": "13012345678",
  "code": "123456",
  "nickname": "张三",
  "password": "password123"
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "phone": "130****5678",
      "nickname": "张三",
      "memberLevel": 0
    }
  }
}
```

---

### 1.3 用户登录

**接口**: `user-login`  
**方法**: POST  
**鉴权**: 无需鉴权

**请求参数**:
```json
{
  "phone": "13012345678",
  "code": "123456"
}
```
或
```json
{
  "phone": "13012345678",
  "password": "password123"
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "phone": "130****5678",
      "nickname": "张三",
      "avatar": "https://...",
      "memberLevel": 1,
      "memberExpireTime": 1735689600000
    },
    "isNewUser": false
  }
}
```

---

### 1.4 获取个人资料

**接口**: `user-profile`  
**方法**: GET  
**鉴权**: 需要Token

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": "user_123",
    "phone": "130****5678",
    "nickname": "张三",
    "avatar": "https://...",
    "gender": 1,
    "birthday": "1990-01-01",
    "company": "XX公司",
    "position": "总经理",
    "memberLevel": 1,
    "memberExpireTime": 1735689600000
  }
}
```

---

### 1.5 更新个人资料

**接口**: `user-profile`  
**方法**: PUT  
**鉴权**: 需要Token

**请求参数**:
```json
{
  "nickname": "李四",
  "avatar": "https://...",
  "gender": 1,
  "company": "新公司"
}
```

---

### 1.6 用户登出

**接口**: `user-logout`  
**方法**: POST  
**鉴权**: 需要Token

---

## 2. 文章模块

### 2.1 文章列表

**接口**: `article-list`  
**方法**: GET  
**鉴权**: 无需鉴权

**请求参数**:
```json
{
  "categoryId": "cat_123",
  "keyword": "贷款",
  "page": 1,
  "pageSize": 10,
  "sortBy": "createdAt",
  "sortOrder": "desc"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "_id": "article_123",
        "title": "小微企业贷款攻略",
        "summary": "本文详细介绍...",
        "cover": "https://...",
        "categoryId": "cat_123",
        "categoryName": "贷款知识",
        "author": "融智团队",
        "viewCount": 1234,
        "likeCount": 56,
        "createdAt": 1703275200000
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

### 2.2 文章详情

**接口**: `article-detail`  
**方法**: GET  
**鉴权**: 无需鉴权（登录用户可获取收藏/点赞状态）

**请求参数**:
```json
{
  "id": "article_123"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "article": {
      "id": "article_123",
      "title": "小微企业贷款攻略",
      "content": "详细内容...",
      "viewCount": 1235,
      "likeCount": 56,
      "isFavorite": false,
      "isLiked": false
    },
    "relatedArticles": [...]
  }
}
```

---

### 2.3 文章分类列表

**接口**: `article-categories`  
**方法**: GET  
**鉴权**: 无需鉴权

---

## 3. AI对话模块

### 3.1 AI对话

**接口**: `ai-chat`  
**方法**: POST  
**鉴权**: 需要Token

**请求参数**:
```json
{
  "message": "我想了解小微企业贷款",
  "sessionId": "session_123",
  "context": {}
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "sessionId": "session_123",
    "response": "您好，我是您的专属融资顾问...",
    "suggestions": ["如何申请贷款？", "需要哪些材料？"],
    "isMember": true
  }
}
```

**注意**: 
- 非会员用户每日对话次数限制为10次
- 会员用户无限制

---

### 3.2 对话历史

**接口**: `ai-history`  
**方法**: GET  
**鉴权**: 需要Token

**请求参数**:
```json
{
  "sessionId": "session_123",  // 可选，不传则返回会话列表
  "page": 1,
  "pageSize": 20
}
```

---

## 4. 贷款计算模块

### 4.1 贷款计算

**接口**: `loan-calculate`  
**方法**: POST  
**鉴权**: 无需鉴权

**请求参数**:
```json
{
  "principal": 1000000,
  "annualRate": 4.35,
  "months": 36,
  "repaymentType": "equal-principal-interest"
}
```

**还款方式**:
- `equal-principal-interest`: 等额本息
- `equal-principal`: 等额本金
- `interest-first`: 先息后本

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "monthlyPayment": 29729.88,
    "totalPayment": 1070275.68,
    "totalInterest": 70275.68,
    "schedule": [
      {
        "month": 1,
        "payment": 29729.88,
        "principal": 26121.55,
        "interest": 3608.33,
        "remainingPrincipal": 973878.45
      }
    ]
  }
}
```

---

### 4.2 贷款产品列表

**接口**: `loan-products`  
**方法**: GET  
**鉴权**: 无需鉴权

**请求参数**:
```json
{
  "type": "经营贷",
  "minAmount": 500000,
  "maxAmount": 2000000,
  "page": 1,
  "pageSize": 10
}
```

---

## 5. 订单模块

### 5.1 创建订单

**接口**: `order-create`  
**方法**: POST  
**鉴权**: 需要Token

**请求参数**:
```json
{
  "productType": "member",
  "paymentMethod": "wechat"
}
```

**产品类型**:
- `member`: 月度会员 (29.9元)
- `member-year`: 年度会员 (299元)

**支付方式**:
- `wechat`: 微信支付
- `alipay`: 支付宝支付

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "orderId": "order_123",
    "orderNo": "RZ20231223000001",
    "productName": "月度会员",
    "amount": 29.9,
    "paymentMethod": "wechat",
    "paymentInfo": {
      "appId": "wx...",
      "timeStamp": "1703275200",
      "nonceStr": "...",
      "package": "prepay_id=...",
      "signType": "MD5",
      "paySign": "..."
    },
    "expiredAt": 1703293200000
  }
}
```

---

### 5.2 支付回调

**接口**: `order-pay`  
**方法**: POST  
**鉴权**: 无需鉴权（用于支付平台回调）

**请求参数**:
```json
{
  "orderNo": "RZ20231223000001",
  "transactionId": "wx_trans_123",
  "paymentResult": "success"
}
```

---

### 5.3 订单列表

**接口**: `order-list`  
**方法**: GET  
**鉴权**: 需要Token

**请求参数**:
```json
{
  "status": 1,  // 可选：0-待支付 1-已支付 2-已取消 3-已退款
  "page": 1,
  "pageSize": 10
}
```

---

## 6. 会员模块

### 6.1 会员订阅

**接口**: `member-subscribe`  
**方法**: POST  
**鉴权**: 需要Token

**请求参数**:
```json
{
  "planType": "yearly",
  "couponCode": "VIP2024"
}
```

**套餐类型**:
- `monthly`: 月度会员 (29.9元/月)
- `yearly`: 年度会员 (299元/年)

---

### 6.2 会员状态

**接口**: `member-status`  
**方法**: GET  
**鉴权**: 需要Token

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "member": {
      "level": 1,
      "levelName": "月度会员",
      "isActive": true,
      "expireTime": 1735689600000,
      "daysRemaining": 30,
      "features": ["无限AI对话", "专属贷款方案", "优先客服支持"]
    },
    "usage": {
      "todayChatCount": 15,
      "totalChatCount": 1234,
      "chatLimit": "unlimited"
    }
  }
}
```

---

## 数据库表结构

### users (用户表)
```javascript
{
  _id: String,
  phone: String,
  nickname: String,
  avatar: String,
  gender: Number,        // 0-未知 1-男 2-女
  birthday: String,
  company: String,
  position: String,
  memberLevel: Number,   // 0-普通 1-月度 2-年度
  memberExpireTime: Number,
  createdAt: Number,
  updatedAt: Number,
  lastLoginAt: Number
}
```

### articles (文章表)
```javascript
{
  _id: String,
  title: String,
  content: String,
  summary: String,
  cover: String,
  categoryId: String,
  categoryName: String,
  author: String,
  status: Number,        // 0-草稿 1-已发布 2-已下架
  viewCount: Number,
  likeCount: Number,
  commentCount: Number,
  createdAt: Number,
  updatedAt: Number
}
```

### orders (订单表)
```javascript
{
  _id: String,
  orderNo: String,
  userId: String,
  userPhone: String,
  productType: String,
  productName: String,
  amount: Number,
  discountAmount: Number,
  finalAmount: Number,
  duration: Number,      // 会员天数
  memberLevel: Number,
  paymentMethod: String,
  status: Number,        // 0-待支付 1-已支付 2-已取消 3-已退款
  transactionId: String,
  couponCode: String,
  createdAt: Number,
  paidAt: Number,
  expiredAt: Number
}
```

---

## 部署说明

### 1. 环境变量配置

在CloudBase控制台配置以下环境变量：

```bash
# JWT密钥
JWT_SECRET=your-jwt-secret-key

# 腾讯云短信配置
TENCENT_SECRET_ID=your-secret-id
TENCENT_SECRET_KEY=your-secret-key
SMS_APP_ID=your-sms-app-id
SMS_TEMPLATE_ID=your-template-id
SMS_SIGN=融智助手

# 微信支付配置
WECHAT_APP_ID=your-wechat-app-id

# AI模型配置
AI_API_KEY=your-ai-api-key
AI_MODEL=hunyuan-2.0-instruct
```

### 2. 部署命令

```bash
# 安装依赖
npm install

# 部署所有云函数
tcb fn deploy --force

# 或部署单个云函数
tcb fn deploy user-login
```

### 3. 初始化数据库

在CloudBase控制台创建以下数据表：
- users
- articles
- article_categories
- article_likes
- user_favorites
- user_logs
- ai_sessions
- ai_chat_logs
- loan_products
- orders
- payment_logs
- coupons

---

## 开发建议

### 生产环境注意事项

1. **安全性**
   - 使用环境变量存储敏感信息
   - 密码使用bcrypt加密存储
   - 启用请求频率限制
   - 配置HTTPS

2. **性能优化**
   - 使用Redis存储验证码和会话
   - 开启云函数并发
   - 配置CDN加速静态资源

3. **监控告警**
   - 配置云函数日志
   - 设置错误告警
   - 监控数据库性能

---

## 联系方式

技术支持: support@rongzhi.com
文档更新: 2024-01-01
