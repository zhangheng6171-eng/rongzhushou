# 融智助手 UI 设计规范

## 品牌色彩

### 主色调
- **主色**：#2E7D32 (绿色 - 代表财富增长、信任)
- **主色浅**：#4CAF50
- **主色深**：#1B5E20

### 辅助色
- **辅助色**：#1976D2 (蓝色 - 代表专业、稳重)
- **成功色**：#4CAF50
- **警告色**：#FF9800
- **错误色**：#F44336
- **信息色**：#2196F3

### 中性色
- **文字主色**：#212121
- **文字次色**：#757575
- **文字辅助**：#9E9E9E
- **边框色**：#E0E0E0
- **背景色**：#F5F5F5
- **白色**：#FFFFFF

## 字体规范

### 字体家族
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 
             'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', 
             Helvetica, Arial, sans-serif;
```

### 字号规范
- **H1 标题**：32px / font-weight: 600
- **H2 副标题**：24px / font-weight: 600
- **H3 小标题**：20px / font-weight: 500
- **正文**：16px / font-weight: 400
- **小字**：14px / font-weight: 400
- **辅助文字**：12px / font-weight: 400

## 间距规范

采用 8px 网格系统：
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

## 圆角规范

- **按钮**：4px
- **卡片**：8px
- **输入框**：4px
- **标签**：4px
- **弹窗**：8px

## 阴影规范

```css
/* 卡片阴影 */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

/* 悬浮阴影 */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

/* 弹窗阴影 */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
```

## 页面布局

### 响应式断点
- **xs**: < 576px (手机)
- **sm**: ≥ 576px (大手机)
- **md**: ≥ 768px (平板)
- **lg**: ≥ 992px (桌面)
- **xl**: ≥ 1200px (大桌面)
- **xxl**: ≥ 1600px (超大桌面)

### 栅格系统
- 总共 24 栅格
- 内容最大宽度：1200px
- 左右边距：24px（移动端 16px）

## 组件规范

### 按钮

**主要按钮**
```css
background: #2E7D32;
color: #FFFFFF;
border-radius: 4px;
padding: 12px 24px;
font-size: 16px;
font-weight: 500;
```

**次要按钮**
```css
background: #FFFFFF;
color: #2E7D32;
border: 1px solid #2E7D32;
border-radius: 4px;
padding: 12px 24px;
```

### 输入框
```css
border: 1px solid #E0E0E0;
border-radius: 4px;
padding: 12px 16px;
font-size: 16px;
```

### 卡片
```css
background: #FFFFFF;
border-radius: 8px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
padding: 24px;
```

## 首页设计

### Hero 区域
- 高度：600px（桌面）/ 500px（移动端）
- 背景：渐变色 #2E7D32 → #1976D2
- 文字：白色，居中
- CTA按钮：白色背景，主色文字

### 功能特性区
- 4 列网格（桌面）/ 2 列网格（移动端）
- 每个特性卡片包含：图标 + 标题 + 描述

### 文章列表区
- 3 列网格（桌面）/ 1 列网格（移动端）
- 每个卡片包含：封面图 + 标题 + 摘要 + 阅读量

## 管理后台设计

### 导航
- 左侧固定导航栏（240px 宽）
- 顶部工具栏（64px 高）
- 右侧主内容区

### 导航菜单项
- 📊 仪表盘
- 📝 文章管理
- 👥 用户管理
- 💰 订单管理
- 🏦 贷款产品管理
- 🤖 AI配置
- ⚙️ 系统设置

---

**创建日期**: 2026年3月17日
