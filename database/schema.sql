-- =====================================================
-- 融智助手 - 小微企业融资智能平台 数据库设计
-- 数据库: MySQL (CloudBase)
-- 创建时间: 2025-03-17
-- =====================================================

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. 用户表 (users)
-- =====================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `openid` VARCHAR(128) NOT NULL COMMENT '微信OpenID',
  `unionid` VARCHAR(128) DEFAULT NULL COMMENT '微信UnionID',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `nickname` VARCHAR(64) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(512) DEFAULT NULL COMMENT '头像URL',
  `member_level` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员等级: 0普通/1付费/2超级',
  `member_expire` DATETIME DEFAULT NULL COMMENT '会员到期时间',
  `ai_credits` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'AI对话积分余额',
  `total_spent` DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '累计消费金额',
  `status` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态: 0禁用/1正常',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_member_level` (`member_level`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =====================================================
-- 2. 会员等级表 (member_levels)
-- =====================================================
DROP TABLE IF EXISTS `member_levels`;
CREATE TABLE `member_levels` (
  `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '等级ID',
  `level` TINYINT UNSIGNED NOT NULL COMMENT '等级: 0普通/1付费/2超级',
  `name` VARCHAR(32) NOT NULL COMMENT '等级名称',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '等级描述',
  `monthly_price` DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '月费价格',
  `yearly_price` DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '年费价格',
  `ai_credits_monthly` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '每月赠送AI积分',
  `max_articles_per_day` INT UNSIGNED NOT NULL DEFAULT 10 COMMENT '每日可看文章数',
  `can_view_member_content` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '可查看会员专属内容',
  `can_use_ai_consult` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '可使用AI咨询',
  `can_view_loan_details` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '可查看贷款产品详情',
  `priority_support` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '优先客服支持',
  `features` JSON DEFAULT NULL COMMENT '其他权益配置(JSON)',
  `icon` VARCHAR(255) DEFAULT NULL COMMENT '等级图标',
  `color` VARCHAR(16) DEFAULT NULL COMMENT '等级颜色',
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
  `status` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态: 0禁用/1启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_level` (`level`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员等级表';

-- =====================================================
-- 3. 订单表 (orders)
-- =====================================================
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(64) NOT NULL COMMENT '订单号',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `product_type` VARCHAR(32) NOT NULL COMMENT '商品类型: member_monthly/member_yearly/credits_pack',
  `product_name` VARCHAR(128) NOT NULL COMMENT '商品名称',
  `amount` DECIMAL(10,2) UNSIGNED NOT NULL COMMENT '订单金额',
  `discount_amount` DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '优惠金额',
  `pay_amount` DECIMAL(10,2) UNSIGNED NOT NULL COMMENT '实付金额',
  `pay_method` VARCHAR(32) DEFAULT NULL COMMENT '支付方式: wechat/alipay',
  `trade_no` VARCHAR(128) DEFAULT NULL COMMENT '第三方交易号',
  `status` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '订单状态: 0待支付/1已支付/2已取消/3已退款',
  `paid_at` DATETIME DEFAULT NULL COMMENT '支付时间',
  `cancelled_at` DATETIME DEFAULT NULL COMMENT '取消时间',
  `refunded_at` DATETIME DEFAULT NULL COMMENT '退款时间',
  `extra_data` JSON DEFAULT NULL COMMENT '扩展数据',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_product_type` (`product_type`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_paid_at` (`paid_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- =====================================================
-- 4. 分类表 (categories)
-- =====================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `parent_id` INT UNSIGNED DEFAULT NULL COMMENT '父分类ID',
  `name` VARCHAR(64) NOT NULL COMMENT '分类名称',
  `slug` VARCHAR(64) NOT NULL COMMENT 'URL别名',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '分类描述',
  `icon` VARCHAR(255) DEFAULT NULL COMMENT '分类图标',
  `color` VARCHAR(16) DEFAULT NULL COMMENT '分类颜色',
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
  `article_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '文章数量(缓存)',
  `status` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态: 0禁用/1启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- =====================================================
-- 5. 文章表 (articles)
-- =====================================================
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文章ID',
  `category_id` INT UNSIGNED DEFAULT NULL COMMENT '分类ID',
  `author_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '作者ID(管理员)',
  `title` VARCHAR(255) NOT NULL COMMENT '文章标题',
  `slug` VARCHAR(255) NOT NULL COMMENT 'URL别名',
  `summary` VARCHAR(500) DEFAULT NULL COMMENT '文章摘要',
  `content` LONGTEXT NOT NULL COMMENT '文章内容(富文本)',
  `cover_image` VARCHAR(512) DEFAULT NULL COMMENT '封面图片',
  `tags` JSON DEFAULT NULL COMMENT '标签(JSON数组)',
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `like_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  `comment_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '评论数',
  `is_member_only` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否会员专享',
  `is_published` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否发布',
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否推荐',
  `is_original` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否原创',
  `source_url` VARCHAR(512) DEFAULT NULL COMMENT '来源URL(转载时)',
  `seo_title` VARCHAR(128) DEFAULT NULL COMMENT 'SEO标题',
  `seo_description` VARCHAR(255) DEFAULT NULL COMMENT 'SEO描述',
  `seo_keywords` VARCHAR(255) DEFAULT NULL COMMENT 'SEO关键词',
  `published_at` DATETIME DEFAULT NULL COMMENT '发布时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_author_id` (`author_id`),
  KEY `idx_is_published` (`is_published`),
  KEY `idx_is_member_only` (`is_member_only`),
  KEY `idx_is_featured` (`is_featured`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_view_count` (`view_count`),
  KEY `idx_created_at` (`created_at`),
  FULLTEXT KEY `ft_title_content` (`title`, `content`),
  CONSTRAINT `fk_articles_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- =====================================================
-- 6. 贷款产品表 (loan_products)
-- =====================================================
DROP TABLE IF EXISTS `loan_products`;
CREATE TABLE `loan_products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '产品ID',
  `name` VARCHAR(128) NOT NULL COMMENT '产品名称',
  `bank` VARCHAR(64) NOT NULL COMMENT '银行/机构名称',
  `bank_logo` VARCHAR(512) DEFAULT NULL COMMENT '银行Logo',
  `product_type` VARCHAR(32) NOT NULL COMMENT '产品类型: credit/mortgage/guarantee/policy',
  `rate_min` DECIMAL(5,2) UNSIGNED NOT NULL COMMENT '最低年利率(%)',
  `rate_max` DECIMAL(5,2) UNSIGNED NOT NULL COMMENT '最高年利率(%)',
  `rate_type` VARCHAR(32) NOT NULL DEFAULT 'fixed' COMMENT '利率类型: fixed/floating',
  `amount_min` DECIMAL(15,2) UNSIGNED NOT NULL COMMENT '最低贷款额度',
  `amount_max` DECIMAL(15,2) UNSIGNED NOT NULL COMMENT '最高贷款额度',
  `term_min` INT UNSIGNED NOT NULL COMMENT '最短期限(月)',
  `term_max` INT UNSIGNED NOT NULL COMMENT '最长期限(月)',
  `repayment_method` VARCHAR(32) NOT NULL COMMENT '还款方式: equal_principal_interest/equal_principal/interest_only',
  `requirements` JSON NOT NULL COMMENT '申请条件(JSON)',
  `features` JSON DEFAULT NULL COMMENT '产品特点(JSON)',
  `materials` JSON DEFAULT NULL COMMENT '所需材料(JSON)',
  `process_steps` JSON DEFAULT NULL COMMENT '办理流程(JSON)',
  `target_customers` VARCHAR(255) DEFAULT NULL COMMENT '目标客户群',
  `approval_time` VARCHAR(64) DEFAULT NULL COMMENT '审批时效',
  `quota_note` VARCHAR(255) DEFAULT NULL COMMENT '额度说明',
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `apply_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '申请次数',
  `is_hot` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否热门',
  `is_recommended` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否推荐',
  `is_member_only` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否会员专享',
  `status` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态: 0下架/1上架',
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_bank` (`bank`),
  KEY `idx_product_type` (`product_type`),
  KEY `idx_status` (`status`),
  KEY `idx_is_hot` (`is_hot`),
  KEY `idx_is_recommended` (`is_recommended`),
  KEY `idx_view_count` (`view_count`),
  KEY `idx_amount_range` (`amount_min`, `amount_max`),
  KEY `idx_rate_range` (`rate_min`, `rate_max`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='贷款产品表';

-- =====================================================
-- 7. AI对话记录表 (ai_conversations)
-- =====================================================
DROP TABLE IF EXISTS `ai_conversations`;
CREATE TABLE `ai_conversations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `title` VARCHAR(255) DEFAULT NULL COMMENT '会话标题',
  `messages` JSON NOT NULL COMMENT '对话消息(JSON数组)',
  `model` VARCHAR(64) DEFAULT 'hunyuan-lite' COMMENT '使用的AI模型',
  `credits_used` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '消耗积分',
  `message_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '消息数量',
  `is_archived` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否归档',
  `last_message_at` DATETIME DEFAULT NULL COMMENT '最后消息时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_archived` (`is_archived`),
  KEY `idx_last_message_at` (`last_message_at`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_ai_conversations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI对话记录表';

-- =====================================================
-- 8. 用户行为日志表 (user_actions)
-- =====================================================
DROP TABLE IF EXISTS `user_actions`;
CREATE TABLE `user_actions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '用户ID(匿名用户为NULL)',
  `session_id` VARCHAR(64) DEFAULT NULL COMMENT '会话ID',
  `action` VARCHAR(32) NOT NULL COMMENT '行为类型: view/like/share/apply/search',
  `target_type` VARCHAR(32) NOT NULL COMMENT '目标类型: article/product/category/page',
  `target_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '目标ID',
  `target_title` VARCHAR(255) DEFAULT NULL COMMENT '目标标题(冗余)',
  `extra_data` JSON DEFAULT NULL COMMENT '扩展数据',
  `ip` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(512) DEFAULT NULL COMMENT 'User-Agent',
  `referer` VARCHAR(512) DEFAULT NULL COMMENT '来源页面',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_action` (`action`),
  KEY `idx_target` (`target_type`, `target_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户行为日志表';

-- =====================================================
-- 9. 积分流水表 (credit_logs) - 扩展表
-- =====================================================
DROP TABLE IF EXISTS `credit_logs`;
CREATE TABLE `credit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '流水ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `type` VARCHAR(32) NOT NULL COMMENT '类型: purchase/gift/use/refund',
  `amount` INT NOT NULL COMMENT '变动数量(正负)',
  `balance_before` INT UNSIGNED NOT NULL COMMENT '变动前余额',
  `balance_after` INT UNSIGNED NOT NULL COMMENT '变动后余额',
  `related_type` VARCHAR(32) DEFAULT NULL COMMENT '关联类型: order/conversation/admin',
  `related_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联ID',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_credit_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分流水表';

-- =====================================================
-- 10. 用户收藏表 (user_favorites) - 扩展表
-- =====================================================
DROP TABLE IF EXISTS `user_favorites`;
CREATE TABLE `user_favorites` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(32) NOT NULL COMMENT '目标类型: article/product',
  `target_id` BIGINT UNSIGNED NOT NULL COMMENT '目标ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_type`, `target_id`),
  KEY `idx_target` (`target_type`, `target_id`),
  CONSTRAINT `fk_user_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户收藏表';

-- =====================================================
-- 11. 文章评论表 (article_comments) - 扩展表
-- =====================================================
DROP TABLE IF EXISTS `article_comments`;
CREATE TABLE `article_comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `article_id` BIGINT UNSIGNED NOT NULL COMMENT '文章ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父评论ID',
  `reply_to_user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '回复用户ID',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `like_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  `status` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态: 0待审核/1正常/2已删除',
  `ip` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_article_id` (`article_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_article_comments_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_article_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章评论表';

-- =====================================================
-- 示例数据插入
-- =====================================================

-- -----------------------------------------------------
-- 会员等级数据
-- -----------------------------------------------------
INSERT INTO `member_levels` (`level`, `name`, `description`, `monthly_price`, `yearly_price`, `ai_credits_monthly`, `max_articles_per_day`, `can_view_member_content`, `can_use_ai_consult`, `can_view_loan_details`, `priority_support`, `features`, `icon`, `color`, `sort_order`, `status`) VALUES
(0, '普通会员', '免费注册用户，可浏览公开内容', 0.00, 0.00, 10, 5, 0, 1, 0, 0, '{"features": ["每日5篇免费文章", "AI咨询每日10次", "基础贷款产品浏览"]}', 'icon-free.png', '#909399', 0, 1),
(1, '付费会员', '解锁全部会员权益，专业融资助手', 29.90, 299.00, 100, 999, 1, 1, 1, 0, '{"features": ["无限文章阅读", "AI咨询每日100次", "全部贷款产品详情", "专属融资方案", "在线客服支持"]}', 'icon-vip.png', '#E6A23C', 1, 1),
(2, '超级会员', '一对一专属服务，融资无忧', 99.90, 999.00, 999, 999, 1, 1, 1, 1, '{"features": ["所有付费会员权益", "AI咨询无限次", "一对一专属顾问", "优先审批通道", "VIP客服热线", "专属线下服务"]}', 'icon-svip.png', '#F56C6C', 2, 1);

-- -----------------------------------------------------
-- 分类数据 (5个)
-- -----------------------------------------------------
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `description`, `icon`, `color`, `sort_order`, `status`) VALUES
(1, NULL, '融资知识', 'financing-knowledge', '小微企业融资知识科普与技巧分享', 'icon-book.svg', '#409EFF', 1, 1),
(2, NULL, '政策解读', 'policy-interpretation', '最新融资政策解读与申请指南', 'icon-policy.svg', '#67C23A', 2, 1),
(3, NULL, '产品推荐', 'product-recommendation', '优质贷款产品推荐与对比分析', 'icon-product.svg', '#E6A23C', 3, 1),
(4, NULL, '成功案例', 'success-stories', '真实融资成功案例分享', 'icon-case.svg', '#F56C6C', 4, 1),
(5, NULL, '经营智慧', 'business-wisdom', '小微企业经营技巧与管理心得', 'icon-wisdom.svg', '#909399', 5, 1);

-- -----------------------------------------------------
-- 文章数据 (10篇)
-- -----------------------------------------------------
INSERT INTO `articles` (`id`, `category_id`, `title`, `slug`, `summary`, `content`, `cover_image`, `tags`, `view_count`, `is_member_only`, `is_published`, `is_featured`, `is_original`, `seo_title`, `seo_description`, `seo_keywords`, `published_at`) VALUES
(1, 1, '小微企业融资入门指南：从零开始了解融资渠道', 'small-business-financing-guide-2024', '本文为小微企业主详细介绍各种融资渠道，包括银行贷款、小额贷款、政府补贴等，帮助您快速了解适合自己的融资方式。', 
'<h2>一、小微企业融资渠道概览</h2><p>小微企业融资是指企业通过一定渠道获得资金支持的过程。常见的融资渠道包括：</p><ul><li><strong>银行贷款</strong>：传统的融资方式，利率相对较低</li><li><strong>小额贷款公司</strong>：审批快，适合短期周转</li><li><strong>政府补贴和担保</strong>：政策扶持，成本较低</li><li><strong>股权融资</strong>：出让部分股权获得资金</li><li><strong>供应链金融</strong>：基于上下游关系融资</li></ul><h2>二、如何选择适合的融资方式</h2><p>选择融资方式时需要考虑以下因素：</p><ol><li>资金用途和期限</li><li>企业资质和信用状况</li><li>融资成本和还款压力</li><li>审批速度和资金到位时间</li></ol>', 
'/images/articles/financing-guide.jpg', '["融资", "小微企业", "银行贷款", "入门指南"]', 1256, 0, 1, 1, 1, 
'小微企业融资入门指南 | 融智助手', '小微企业融资全攻略：详细介绍银行贷款、小额贷款、政府补贴等融资渠道，帮助小微企业主找到最适合的融资方式。', '小微企业融资,银行贷款,融资渠道,融资指南,小微企业', '2024-01-15 10:00:00'),

(2, 1, '信用贷款vs抵押贷款：哪种方式更适合你的企业？', 'credit-vs-mortgage-loan-comparison', '深入对比信用贷款和抵押贷款的优缺点，帮助小微企业主根据自身情况做出最优选择。', 
'<h2>信用贷款的特点</h2><p>信用贷款是基于企业信用状况发放的贷款，无需提供抵押物。</p><h3>优势：</h3><ul><li>审批速度快，一般1-3个工作日</li><li>无需抵押物，降低资产风险</li><li>手续简单，材料要求较少</li></ul><h3>劣势：</h3><ul><li>额度相对较低，一般100万以内</li><li>利率较高，年化8%-18%</li><li>对企业资质要求较高</li></ul><h2>抵押贷款的特点</h2><p>抵押贷款需要提供房产、土地等资产作为担保。</p><h3>优势：</h3><ul><li>额度高，可达抵押物价值70%</li><li>利率低，年化4%-8%</li><li>期限长，最长可达10年</li></ul><h3>劣势：</h3><ul><li>审批流程复杂，需要评估、登记</li><li>有失去抵押物的风险</li><li>放款周期长，一般2-4周</li></ul>', 
'/images/articles/credit-mortgage.jpg', '["信用贷款", "抵押贷款", "对比", "选择建议"]', 892, 0, 1, 0, 1,
'信用贷款和抵押贷款对比分析 | 融智助手', '详细对比信用贷款与抵押贷款的利率、额度、审批速度等关键指标，帮助小微企业主选择最适合的贷款方式。', '信用贷款,抵押贷款,贷款对比,小微企业贷款', '2024-01-20 14:30:00'),

(3, 2, '2024年小微企业普惠金融政策最新解读', '2024-inclusive-finance-policy', '详解2024年国家对小微企业普惠金融的最新扶持政策，包括贷款贴息、税收优惠、担保补贴等。', 
'<h2>2024年普惠金融政策要点</h2><p>2024年，国家继续加大对小微企业的金融支持力度，主要政策包括：</p><h3>1. 贷款贴息政策</h3><p>对符合条件的小微企业贷款给予贴息支持，贴息比例最高可达50%。</p><h3>2. 税收优惠政策</h3><ul><li>小型微利企业减按25%计入应纳税所得额</li><li>增值税小规模纳税人月销售额10万以下免税</li></ul><h3>3. 担保费补贴</h3><p>政府性融资担保机构担保费率降至1%以下，部分地区全额补贴。</p><h3>4. 创业担保贷款</h3><p>个人创业担保贷款最高20万元，小微企业最高300万元，财政给予贴息。</p>', 
'/images/articles/policy-2024.jpg', '["普惠金融", "政策", "2024年", "小微企业扶持"]', 2341, 0, 1, 1, 1,
'2024年小微企业普惠金融政策解读 | 融智助手', '全面解读2024年小微企业普惠金融政策，包括贷款贴息、税收优惠、担保补贴等，助您把握政策红利。', '普惠金融,小微企业政策,贷款贴息,创业担保贷款', '2024-02-01 09:00:00'),

(4, 2, '如何申请政府贴息贷款？完整流程指南', 'government-subsidized-loan-guide', '手把手教你申请政府贴息贷款，从准备材料到成功获批的完整流程。', 
'<h2>政府贴息贷款申请流程</h2><h3>第一步：确认申请条件</h3><p>一般需要满足以下条件：</p><ul><li>企业注册时间满1年</li><li>正常经营，无不良信用记录</li><li>符合当地产业发展方向</li><li>吸纳就业达到一定数量</li></ul><h3>第二步：准备申请材料</h3><ul><li>营业执照副本</li><li>财务报表（近两年）</li><li>纳税证明</li><li>社保缴纳证明</li><li>贷款用途说明</li><li>贴息申请表</li></ul><h3>第三步：提交申请</h3><p>向当地人社局或中小企业服务中心提交申请材料。</p><h3>第四步：审核与放款</h3><p>一般审核周期为15-30个工作日，审核通过后银行放款。</p>', 
'/images/articles/gov-loan.jpg', '["政府贴息", "申请流程", "创业贷款", "政策性贷款"]', 1567, 1, 1, 0, 1,
'政府贴息贷款申请指南 | 融智助手', '详细介绍政府贴息贷款的申请条件、所需材料和完整流程，帮助小微企业顺利获得贴息贷款支持。', '政府贴息贷款,创业贷款申请,贷款流程,小微企业扶持', '2024-02-10 11:00:00'),

(5, 3, '工商银行经营快贷：额度最高100万，线上秒批', 'icbc-quick-loan-review', '详解工商银行经营快贷产品特点、申请条件和操作流程，适合急需资金周转的小微企业主。', 
'<h2>产品介绍</h2><p>工商银行经营快贷是一款面向小微企业和个体工商户的线上信用贷款产品。</p><h3>产品特点</h3><ul><li><strong>纯信用</strong>：无需抵押担保</li><li><strong>线上办理</strong>：全程手机操作</li><li><strong>秒批秒贷</strong>：最快1分钟到账</li><li><strong>随借随还</strong>：按天计息，灵活还款</li></ul><h3>贷款条件</h3><ul><li>营业执照满1年</li><li>工商银行客户或结算客户</li><li>经营流水稳定</li><li>信用记录良好</li></ul><h3>利率与额度</h3><ul><li>额度：最高100万元</li><li>利率：年化4.35%-7.2%</li><li>期限：最长1年</li></ul><p>该产品特别适合有工商银行结算流水的小微企业主，审批速度快，利率合理，是短期周转的好选择。</p>', 
'/images/articles/icbc-quick.jpg', '["工商银行", "经营快贷", "信用贷款", "线上贷款"]', 1892, 0, 1, 0, 1,
'工商银行经营快贷产品评测 | 融智助手', '详细评测工商银行经营快贷，包括申请条件、利率、额度和审批流程，帮助您快速了解这款热门信用贷款产品。', '工商银行经营快贷,经营快贷,工行贷款,小微企业信用贷款', '2024-02-15 16:00:00'),

(6, 3, '建设银行云税贷：以税定贷，额度最高300万', 'ccb-tax-loan-review', '建设银行云税贷依托纳税信用评估授信，额度高、利率低，是纳税规范企业的优选贷款产品。', 
'<h2>产品概述</h2><p>建设银行云税贷是基于企业纳税信息发放的线上信用贷款，纳税越多额度越高。</p><h3>核心优势</h3><ul><li><strong>高额度</strong>：最高300万元</li><li><strong>低利率</strong>：年化4.05%起</li><li><strong>纯信用</strong>：无需抵押担保</li><li><strong>秒审批</strong>：线上申请，实时审批</li></ul><h3>申请条件</h3><ul><li>企业正常纳税满2年</li><li>纳税信用等级A级或B级</li><li>年纳税额5000元以上</li><li>无不良信用记录</li></ul><h3>申请流程</h3><ol><li>登录建行惠懂你APP</li><li>完成企业认证和税务授权</li><li>系统自动测算额度</li><li>在线签约并提款</li></ol><p>对于纳税规范的小微企业，云税贷是性价比极高的选择，建议优先考虑。</p>', 
'/images/articles/ccb-tax.jpg', '["建设银行", "云税贷", "纳税贷款", "税贷"]', 2156, 1, 1, 1, 1,
'建设银行云税贷详细评测 | 融智助手', '深度评测建设银行云税贷产品，包括申请条件、额度计算、利率水平和申请流程，助您了解这款热门税贷产品。', '建设银行云税贷,云税贷,纳税贷款,小微企业税贷', '2024-02-20 10:30:00'),

(7, 4, '案例：餐饮店如何3天获批50万经营贷', 'restaurant-success-case', '分享一家餐饮店通过准备充分材料，成功在3天内获批50万经营贷款的真实案例。', 
'<h2>客户背景</h2><p>王先生经营一家特色餐饮店，已开业3年，月营业额约30万元。因准备开分店，急需50万启动资金。</p><h2>融资难点</h2><ul><li>餐饮行业银行贷款相对困难</li><li>时间紧迫，1周内需要资金到位</li><li>无房产可供抵押</li></ul><h2>解决方案</h2><h3>1. 产品选择</h3><p>推荐申请建设银行云税贷，因为：</p><ul><li>企业纳税记录良好（年纳税约8万）</li><li>审批速度快，线上操作</li><li>纯信用，无需抵押</li></ul><h3>2. 材料准备</h3><ul><li>营业执照、法人身份证</li><li>近两年纳税申报表</li><li>银行流水（近6个月）</li><li>门店租赁合同</li></ul><h3>3. 申请过程</h3><p>Day 1：准备材料，完成税务授权<br/>Day 2：线上提交申请，系统显示预批额度58万<br/>Day 3：签约提款，资金到账50万</p><h2>关键成功因素</h2><ol><li>纳税规范，信用良好</li><li>选择适合的贷款产品</li><li>材料准备充分</li><li>及时跟进审批进度</li></ol>', 
'/images/articles/case-restaurant.jpg', '["成功案例", "餐饮行业", "经营贷", "云税贷"]', 1678, 0, 1, 0, 1,
'餐饮店融资成功案例 | 融智助手', '真实案例分享：餐饮店如何在3天内成功获批50万经营贷款，详细介绍申请过程和成功关键。', '餐饮店贷款,经营贷案例,小微企业贷款案例,融资成功故事', '2024-02-25 14:00:00'),

(8, 4, '案例：科技公司如何获得200万政府贴息贷款', 'tech-company-subsidized-loan', '分享一家科技公司成功申请200万政府贴息贷款的完整经历，包括政策匹配、材料准备和审批过程。', 
'<h2>企业情况</h2><p>某科技公司，主营业务为软件开发，成立4年，团队15人，年营收约500万。因业务扩张需要200万资金。</p><h2>融资方案</h2><p>经分析，企业符合以下政策条件：</p><ul><li>高新技术企业</li><li>软件企业</li><li>科技型中小企业</li></ul><p>推荐申请科技型中小企业贷款风险补偿资金池贷款，可享受政府贴息。</p><h2>申请过程</h2><h3>第一阶段：政策匹配（1周）</h3><ul><li>查询当地科技部门相关政策</li><li>确认符合申请条件</li><li>选择合作银行</li></ul><h3>第二阶段：材料准备（2周）</h3><ul><li>高新技术企业证书</li><li>软件企业认定证明</li><li>近三年财务报表</li><li>项目可行性报告</li><li>贷款申请书</li></ul><h3>第三阶段：审核与放款（3周）</h3><ul><li>提交银行审核</li><li>科技部门复核</li><li>签订贷款合同</li><li>资金到账</li></ul><h2>最终结果</h2><ul><li>获批金额：200万元</li><li>贷款期限：2年</li><li>贷款利率：4.35%</li><li>政府贴息：2%（实际利率2.35%）</li></ul>', 
'/images/articles/case-tech.jpg', '["成功案例", "科技公司", "政府贴息", "科技贷款"]', 1432, 1, 1, 0, 1,
'科技公司政府贴息贷款案例 | 融智助手', '科技公司成功申请200万政府贴息贷款的完整案例，详解政策匹配、申请流程和贴息计算。', '科技公司贷款,政府贴息案例,科技贷款,高新技术企业融资', '2024-03-01 09:30:00'),

(9, 5, '小微企业如何建立良好的银企关系', 'bank-enterprise-relationship', '良好的银企关系是融资成功的关键，本文分享建立和维护银企关系的实用技巧。', 
'<h2>为什么要建立银企关系</h2><p>良好的银企关系可以带来：</p><ul><li>更高的贷款获批率</li><li>更优惠的贷款利率</li><li>更快的审批速度</li><li>更多的增值服务</li></ul><h2>如何建立银企关系</h2><h3>1. 选择主力银行</h3><p>建议选择1-2家银行作为主力合作银行，集中结算和融资业务。</p><h3>2. 规范财务管理</h3><ul><li>保持规范的财务报表</li><li>银行流水稳定</li><li>按时还本付息</li></ul><h3>3. 主动沟通</h3><ul><li>定期向客户经理汇报经营情况</li><li>遇到困难及时沟通</li><li>参与银行组织的企业活动</li></ul><h3>4. 维护信用</h3><ul><li>按时还款，不逾期</li><li>避免多头借贷</li><li>保持良好的征信记录</li></ul><h2>注意事项</h2><ul><li>不要频繁更换合作银行</li><li>不要隐瞒重要信息</li><li>不要过度透支信用额度</li></ul>', 
'/images/articles/bank-relationship.jpg', '["银企关系", "银行合作", "融资技巧", "企业管理"]', 987, 0, 1, 0, 1,
'小微企业银企关系建设指南 | 融智助手', '教您如何建立和维护良好的银企关系，提高贷款获批率，获得更优惠的融资条件。', '银企关系,银行合作,小微企业融资技巧,贷款技巧', '2024-03-05 15:00:00'),

(10, 5, '小微企业财务管理的5个关键要点', 'financial-management-tips', '规范的财务管理是企业健康发展的基础，也是获得融资的重要条件。本文分享5个关键要点。', 
'<h2>小微企业财务管理关键要点</h2><h3>1. 规范记账</h3><ul><li>选择合适的财务软件</li><li>按月编制财务报表</li><li>确保账目清晰准确</li></ul><h3>2. 分清公私</h3><ul><li>公司账户与个人账户分开</li><li>规范费用报销流程</li><li>避免挪用公司资金</li></ul><h3>3. 管理现金流</h3><ul><li>监控资金流入流出</li><li>预留3-6个月运营资金</li><li>控制应收账款周期</li></ul><h3>4. 合理税务筹划</h3><ul><li>按时申报纳税</li><li>充分利用税收优惠</li><li>保持良好纳税信用</li></ul><h3>5. 定期财务分析</h3><ul><li>分析盈利能力</li><li>监控成本费用</li><li>评估偿债能力</li></ul><h2>财务管理对融资的帮助</h2><p>规范的财务管理可以：</p><ul><li>提高贷款审批通过率</li><li>获得更优惠的贷款条件</li><li>缩短贷款审批时间</li><li>提升企业形象和信用</li></ul>', 
'/images/articles/financial-management.jpg', '["财务管理", "现金管理", "税务筹划", "经营技巧"]', 1123, 0, 1, 0, 1,
'小微企业财务管理指南 | 融智助手', '小微企业财务管理的5个关键要点，包括规范记账、现金流管理、税务筹划等，助力企业健康发展。', '财务管理,小微企业现金管理,税务筹划,企业财务', '2024-03-10 11:30:00');

-- -----------------------------------------------------
-- 贷款产品数据 (5个)
-- -----------------------------------------------------
INSERT INTO `loan_products` (`id`, `name`, `bank`, `bank_logo`, `product_type`, `rate_min`, `rate_max`, `rate_type`, `amount_min`, `amount_max`, `term_min`, `term_max`, `repayment_method`, `requirements`, `features`, `materials`, `process_steps`, `target_customers`, `approval_time`, `quota_note`, `view_count`, `is_hot`, `is_recommended`, `is_member_only`, `status`, `sort_order`) VALUES
(1, '经营快贷', '中国工商银行', '/images/banks/icbc.png', 'credit', 4.35, 7.20, 'fixed', 10000.00, 1000000.00, 1, 12, 'equal_principal_interest', 
'{"business_years": "营业执照满1年", "credit_requirement": "信用记录良好", "flow_requirement": "有稳定经营流水", "other": "工商银行结算客户优先"}', 
'["纯信用无抵押", "线上申请秒审批", "随借随还", "按日计息"]', 
'["营业执照", "法人身份证", "银行流水", "经营场所证明"]', 
'["线上申请", "系统审批", "签约放款"]', 
'小微企业主、个体工商户', 
'最快1分钟', 
'根据经营流水和信用评估', 
3567, 1, 1, 0, 1, 1),

(2, '云税贷', '中国建设银行', '/images/banks/ccb.png', 'credit', 4.05, 6.09, 'fixed', 10000.00, 3000000.00, 1, 12, 'equal_principal_interest', 
'{"tax_years": "正常纳税满2年", "tax_credit": "纳税信用等级A级或B级", "tax_amount": "年纳税额5000元以上", "credit_requirement": "信用记录良好"}', 
'["以税定贷额度高", "利率低至4.05%", "纯信用无抵押", "线上秒审批"]', 
'["营业执照", "法人身份证", "税务授权", "银行流水"]', 
'["税务授权", "额度测算", "在线签约", "提款使用"]', 
'纳税规范的小微企业', 
'最快当天', 
'根据年纳税额评估，一般为纳税额的20-50倍', 
4892, 1, 1, 1, 1, 2),

(3, '小微易贷', '中国农业银行', '/images/banks/abc.png', 'credit', 4.35, 6.52, 'fixed', 10000.00, 1000000.00, 1, 12, 'equal_principal_interest', 
'{"business_years": "营业执照满1年", "credit_requirement": "信用记录良好", "flow_requirement": "有稳定经营流水或纳税记录", "other": "农业银行客户优先"}', 
'["纯信用无抵押", "循环额度", "随借随还", "手机银行办理"]', 
'["营业执照", "法人身份证", "银行流水或纳税证明"]', 
'["线上申请", "自动审批", "签约放款"]', 
'小微企业主、个体工商户', 
'最快1天', 
'根据经营情况评估', 
2891, 0, 1, 0, 1, 3),

(4, '创业担保贷款', '政府合作银行', '/images/banks/gov.png', 'guarantee', 2.35, 4.35, 'fixed', 10000.00, 3000000.00, 6, 36, 'equal_principal_interest', 
'{"business_years": "营业执照满半年", "employee_requirement": "吸纳就业达到要求", "credit_requirement": "信用记录良好", "other": "符合当地创业政策条件"}', 
'["政府贴息", "利率低", "担保费减免", "期限长"]', 
'["营业执照", "法人身份证", "创业计划书", "就业证明", "财务报表"]', 
'["政策咨询", "材料准备", "银行审核", "政府复核", "贴息放款"]', 
'创业人员、吸纳就业的小微企业', 
'15-30个工作日', 
'个人最高20万，企业最高300万', 
1234, 1, 0, 1, 1, 4),

(5, '经营抵押贷', '中国银行', '/images/banks/boc.png', 'mortgage', 3.85, 5.65, 'fixed', 100000.00, 50000000.00, 12, 120, 'equal_principal_interest', 
'{"collateral": "有房产或土地可供抵押", "business_years": "营业执照满1年", "credit_requirement": "信用记录良好", "flow_requirement": "有稳定经营收入"}', 
'["额度高", "利率低", "期限长", "还款方式灵活"]', 
'["营业执照", "法人身份证", "房产证或土地证", "财务报表", "银行流水"]', 
'["申请提交", "房产评估", "银行审批", "抵押登记", "放款"]', 
'有资产可供抵押的小微企业', 
'7-15个工作日', 
'抵押物评估价值的50-70%', 
2156, 0, 1, 0, 1, 5);

-- -----------------------------------------------------
-- 更新分类文章数量
-- -----------------------------------------------------
UPDATE `categories` c SET `article_count` = (
  SELECT COUNT(*) FROM `articles` a WHERE a.`category_id` = c.`id` AND a.`is_published` = 1
);

-- =====================================================
-- 触发器：更新文章评论数
-- =====================================================
DELIMITER //
CREATE TRIGGER `trg_article_comment_insert` AFTER INSERT ON `article_comments`
FOR EACH ROW
BEGIN
  IF NEW.`status` = 1 THEN
    UPDATE `articles` SET `comment_count` = `comment_count` + 1 WHERE `id` = NEW.`article_id`;
  END IF;
END//

CREATE TRIGGER `trg_article_comment_delete` AFTER DELETE ON `article_comments`
FOR EACH ROW
BEGIN
  IF OLD.`status` = 1 THEN
    UPDATE `articles` SET `comment_count` = GREATEST(0, `comment_count` - 1) WHERE `id` = OLD.`article_id`;
  END IF;
END//
DELIMITER ;

-- =====================================================
-- 存储过程：用户积分变动
-- =====================================================
DELIMITER //
CREATE PROCEDURE `sp_user_credit_change`(
  IN p_user_id BIGINT,
  IN p_type VARCHAR(32),
  IN p_amount INT,
  IN p_related_type VARCHAR(32),
  IN p_related_id BIGINT,
  IN p_remark VARCHAR(255),
  OUT p_result INT
)
BEGIN
  DECLARE v_balance_before INT;
  DECLARE v_balance_after INT;
  
  -- 获取当前余额
  SELECT `ai_credits` INTO v_balance_before FROM `users` WHERE `id` = p_user_id FOR UPDATE;
  
  -- 计算新余额
  SET v_balance_after = v_balance_before + p_amount;
  
  -- 检查余额是否足够（如果是扣减）
  IF p_amount < 0 AND v_balance_after < 0 THEN
    SET p_result = -1; -- 余额不足
  ELSE
    -- 更新用户余额
    UPDATE `users` SET `ai_credits` = v_balance_after WHERE `id` = p_user_id;
    
    -- 记录流水
    INSERT INTO `credit_logs` (`user_id`, `type`, `amount`, `balance_before`, `balance_after`, `related_type`, `related_id`, `remark`)
    VALUES (p_user_id, p_type, p_amount, v_balance_before, v_balance_after, p_related_type, p_related_id, p_remark);
    
    SET p_result = 1; -- 成功
  END IF;
END//
DELIMITER ;

-- =====================================================
-- 视图：热门文章视图
-- =====================================================
CREATE OR REPLACE VIEW `v_hot_articles` AS
SELECT 
  a.`id`,
  a.`title`,
  a.`slug`,
  a.`summary`,
  a.`cover_image`,
  a.`view_count`,
  a.`like_count`,
  a.`comment_count`,
  a.`is_member_only`,
  a.`published_at`,
  c.`name` AS `category_name`,
  c.`slug` AS `category_slug`
FROM `articles` a
LEFT JOIN `categories` c ON a.`category_id` = c.`id`
WHERE a.`is_published` = 1
ORDER BY a.`view_count` DESC, a.`like_count` DESC
LIMIT 100;

-- =====================================================
-- 视图：热门贷款产品视图
-- =====================================================
CREATE OR REPLACE VIEW `v_hot_products` AS
SELECT 
  `id`,
  `name`,
  `bank`,
  `bank_logo`,
  `product_type`,
  `rate_min`,
  `rate_max`,
  `amount_min`,
  `amount_max`,
  `term_min`,
  `term_max`,
  `view_count`,
  `apply_count`,
  `is_hot`,
  `is_recommended`,
  `is_member_only`
FROM `loan_products`
WHERE `status` = 1
ORDER BY `is_hot` DESC, `view_count` DESC, `apply_count` DESC;

-- =====================================================
-- 恢复外键检查
-- =====================================================
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 数据库设计完成
-- =====================================================
