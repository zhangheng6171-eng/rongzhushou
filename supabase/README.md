# Supabase 配置指南

## 1. 创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 创建新组织（如果还没有）
5. 创建新项目：
   - 名称：`rongzhushou`
   - 数据库密码：自己设置并记住
   - 区域：选择离中国最近的（Singapore 或 Tokyo）

## 2. 获取 API 密钥

项目创建后：

1. 进入项目 → Settings → API
2. 记录以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

## 3. 配置数据库

1. 进入项目 → SQL Editor
2. 点击 "New query"
3. 复制 `supabase/schema.sql` 的内容
4. 点击 "Run" 执行

## 4. 配置 Vercel 环境变量

在 Vercel 项目设置中添加：

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
JWT_SECRET=your-jwt-secret-key
```

## 5. 免费额度

Supabase 免费计划包括：
- 500MB 数据库存储
- 1GB 文件存储
- 50,000 月活用户
- 无限 API 请求

对于小型网站完全够用！
