# 融智助手 部署指南

## 一、CloudBase 环境配置

### 1.1 创建 CloudBase 环境

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入 [CloudBase 控制台](https://console.cloud.tencent.com/tcb)
3. 点击「新建环境」
4. 选择：
   - 环境名称：`rongzhi-assistant`
   - 计费方式：按量付费
   - 套餐：基础版（免费额度足够初期使用）

### 1.2 开通服务

在 CloudBase 控制台开通以下服务：
- ✅ 静态网站托管
- ✅ 云函数
- ✅ 云数据库（MySQL）
- ✅ 云数据库（NoSQL）
- ✅ 云存储

### 1.3 配置域名

1. 在静态托管设置中添加自定义域名
2. 推荐：`rongzhi.help` 或 `rongzhishou.com`
3. 配置 SSL 证书（CloudBase 自动配置）

## 二、本地开发环境配置

### 2.1 安装 CloudBase CLI

```bash
npm install -g @cloudbase/cli
```

### 2.2 登录 CloudBase

```bash
tcb login
```

### 2.3 初始化项目

```bash
cd passive-income-platform
tcb init
```

## 三、数据库初始化

### 3.1 创建 MySQL 数据库

在 CloudBase 控制台：
1. 进入「数据库」→「MySQL」
2. 点击「新建数据库」
3. 选择配置：
   - 规格：基础版（1核1G）
   - 存储：1GB

### 3.2 执行初始化脚本

```bash
# 连接到 MySQL
mysql -h <mysql_host> -u <username> -p < database/schema.sql
```

或在 CloudBase 控制台的 MySQL 管理页面导入 `database/schema.sql`

## 四、部署步骤

### 4.1 部署云函数

```bash
cd backend
tcb fn deploy user --force
tcb fn deploy article --force
tcb fn deploy payment --force
tcb fn deploy ai --force
```

### 4.2 部署前端

```bash
cd frontend
npm run build
tcb hosting:deploy ./dist -e <env-id>
```

### 4.3 配置环境变量

在 CloudBase 控制台设置环境变量：

```
# AI 配置
AI_MODEL=deepseek-v3.2
AI_API_KEY=<your-api-key>

# 支付配置
WECHAT_APP_ID=<your-app-id>
WECHAT_MCH_ID=<your-mch-id>
WECHAT_API_KEY=<your-api-key>

# 短信配置
SMS_APP_ID=<your-app-id>
SMS_APP_KEY=<your-app-key>
```

## 五、支付配置

### 5.1 微信支付商户号

1. 申请微信支付商户号
2. 在 CloudBase 控制台配置支付参数
3. 设置支付回调地址：`https://<your-domain>/api/payment/callback`

### 5.2 支付宝商户

1. 申请支付宝企业账户
2. 创建应用并配置密钥
3. 设置回调地址

## 六、监控与日志

### 6.1 查看日志

```bash
# 云函数日志
tcb fn log <function-name>

# 访问日志
tcb hosting:log
```

### 6.2 设置告警

在 CloudBase 控制台：
- 错误率告警
- 函数超时告警
- 费用告警

## 七、备份策略

### 7.1 数据库备份

- 开启 MySQL 自动备份（每日）
- 保留 7 天备份

### 7.2 代码备份

```bash
# 定期推送到 GitHub
git add .
git commit -m "backup: $(date +%Y%m%d)"
git push origin main
```

## 八、费用预估

| 服务 | 月费用 |
|------|--------|
| 云函数 | ~15元 |
| MySQL | ~30元 |
| NoSQL | ~20元 |
| 静态托管 | ~10元 |
| CDN | ~15元 |
| AI调用 | ~50元 |
| **合计** | **~140元/月** |

---

**创建日期**: 2026年3月17日
