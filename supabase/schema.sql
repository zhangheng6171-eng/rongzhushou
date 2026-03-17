-- 融智助手 - Supabase 数据库 Schema
-- 在 Supabase SQL Editor 中执行

-- ========================================
-- 1. 用户表
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(11) UNIQUE NOT NULL,
  nickname VARCHAR(50) DEFAULT '',
  avatar TEXT DEFAULT '',
  vip_level INTEGER DEFAULT 0,
  vip_expire_time TIMESTAMP WITH TIME ZONE,
  points INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. 文章表
-- ========================================
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  summary TEXT,
  content TEXT,
  category VARCHAR(50),
  tags TEXT[],
  cover VARCHAR(500),
  author VARCHAR(50) DEFAULT '融智助手',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_vip_only BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  publish_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. AI对话记录表
-- ========================================
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT,
  points_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. 贷款计算记录表
-- ========================================
CREATE TABLE IF NOT EXISTS loan_calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount DECIMAL(12,2) NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  months INTEGER NOT NULL,
  method VARCHAR(20) NOT NULL,
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. 会员订单表
-- ========================================
CREATE TABLE IF NOT EXISTS member_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  package_id VARCHAR(20) NOT NULL,
  package_name VARCHAR(50),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. 短信验证码表
-- ========================================
CREATE TABLE IF NOT EXISTS sms_codes (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(11) NOT NULL,
  code VARCHAR(6) NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expire_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. 创建索引
-- ========================================
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_publish_time ON articles(publish_time DESC);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_codes_phone ON sms_codes(phone);

-- ========================================
-- 8. 插入示例文章数据
-- ========================================
INSERT INTO articles (title, summary, content, category, tags, view_count, like_count, is_vip_only) VALUES
('2026年小微企业贷款政策解读', '最新小微企业贷款政策分析，帮助企业主了解优惠政策和申请条件。', '# 2026年小微企业贷款政策解读\n\n## 一、政策背景\n\n2026年，国家继续加大对小微企业的金融支持力度...', '政策解读', ARRAY['贷款政策', '小微企业', '优惠'], 1234, 89, FALSE),
('如何提高贷款审批通过率？', '掌握这些技巧，让您的贷款申请更容易获批。', '# 如何提高贷款审批通过率？\n\n## 一、维护良好信用记录...', '贷款技巧', ARRAY['审批技巧', '贷款申请'], 856, 67, FALSE),
('小微企业税收优惠政策汇总', '2026年小微企业可享受的税收优惠政策详解。', '# 小微企业税收优惠政策汇总\n\n## 一、增值税优惠...', '税务筹划', ARRAY['税收优惠', '小微企业'], 678, 45, TRUE),
('贷款计算器使用指南', '手把手教您使用贷款计算器，精准计算贷款成本。', '# 贷款计算器使用指南\n\n## 一、等额本息...', '工具使用', ARRAY['贷款计算器', '使用指南'], 432, 28, FALSE),
('银行贷款产品对比分析', '主流银行小微企业贷款产品详细对比。', '# 银行贷款产品对比分析\n\n## 工商银行...', '产品分析', ARRAY['银行贷款', '产品对比'], 567, 34, FALSE);

-- ========================================
-- 9. 创建更新时间触发器
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ========================================
-- 10. 创建 Row Level Security 策略
-- ========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的数据
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- 所有人可以查看已发布的文章
CREATE POLICY "Articles are viewable by everyone" ON articles
  FOR SELECT USING (is_published = TRUE);
