// 模拟文章数据
const articles = [
  {
    id: 1,
    title: '2026年小微企业贷款政策解读',
    summary: '最新小微企业贷款政策分析，帮助企业主了解优惠政策和申请条件。',
    content: `
# 2026年小微企业贷款政策解读

## 一、政策背景

2026年，国家继续加大对小微企业的金融支持力度，出台了一系列优惠政策...

## 二、主要优惠措施

1. **利率优惠**：部分贷款利率可低至3.5%
2. **担保减免**：信用贷款额度提升
3. **审批加速**：最快3天放款

## 三、申请条件

- 企业注册满1年
- 纳税记录良好
- 信用记录无重大逾期

## 四、申请流程

在线申请 → 资质评估 → 材料准备 → 银行审批 → 放款
    `,
    category: '政策解读',
    tags: ['贷款政策', '小微企业', '优惠'],
    cover: 'https://picsum.photos/800/400?random=1',
    author: '融智助手',
    viewCount: 1234,
    likeCount: 89,
    publishTime: '2026-03-15T10:00:00Z',
    isVipOnly: false
  },
  {
    id: 2,
    title: '如何提高贷款审批通过率？',
    summary: '掌握这些技巧，让您的贷款申请更容易获批。',
    content: `
# 如何提高贷款审批通过率？

## 一、维护良好信用记录

按时还款，避免逾期...

## 二、准备完整材料

确保材料真实完整...

## 三、选择合适产品

根据企业情况选择最适合的贷款产品...
    `,
    category: '贷款技巧',
    tags: ['审批技巧', '贷款申请'],
    cover: 'https://picsum.photos/800/400?random=2',
    author: '融智助手',
    viewCount: 856,
    likeCount: 67,
    publishTime: '2026-03-14T10:00:00Z',
    isVipOnly: false
  },
  {
    id: 3,
    title: '小微企业税收优惠政策汇总',
    summary: '2026年小微企业可享受的税收优惠政策详解。',
    content: `
# 小微企业税收优惠政策汇总

## 一、增值税优惠

月销售额10万元以下免征增值税...

## 二、企业所得税优惠

年应纳税所得额100万元以下，按2.5%征收...
    `,
    category: '税务筹划',
    tags: ['税收优惠', '小微企业'],
    cover: 'https://picsum.photos/800/400?random=3',
    author: '融智助手',
    viewCount: 678,
    likeCount: 45,
    publishTime: '2026-03-13T10:00:00Z',
    isVipOnly: true
  },
  {
    id: 4,
    title: '贷款计算器使用指南',
    summary: '手把手教您使用贷款计算器，精准计算贷款成本。',
    content: `
# 贷款计算器使用指南

## 一、等额本息

每月还款金额相同...

## 二、等额本金

每月还款本金相同，利息递减...

## 三、先息后本

前期只还利息，到期归还本金...
    `,
    category: '工具使用',
    tags: ['贷款计算器', '使用指南'],
    cover: 'https://picsum.photos/800/400?random=4',
    author: '融智助手',
    viewCount: 432,
    likeCount: 28,
    publishTime: '2026-03-12T10:00:00Z',
    isVipOnly: false
  },
  {
    id: 5,
    title: '银行贷款产品对比分析',
    summary: '主流银行小微企业贷款产品详细对比。',
    content: `
# 银行贷款产品对比分析

## 工商银行 - 经营快贷

额度：最高100万
利率：3.5%-6%
期限：最长3年

## 建设银行 - 小微快贷

额度：最高200万
利率：3.8%-5.5%
期限：最长1年
    `,
    category: '产品分析',
    tags: ['银行贷款', '产品对比'],
    cover: 'https://picsum.photos/800/400?random=5',
    author: '融智助手',
    viewCount: 567,
    likeCount: 34,
    publishTime: '2026-03-11T10:00:00Z',
    isVipOnly: false
  }
]

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ code: 405, message: 'Method not allowed' })
  }

  try {
    const { page = 1, pageSize = 10, category, keyword } = req.query

    let filtered = [...articles]

    // 分类筛选
    if (category && category !== 'all') {
      filtered = filtered.filter(a => a.category === category)
    }

    // 关键词搜索
    if (keyword) {
      const kw = keyword.toLowerCase()
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(kw) ||
        a.summary.toLowerCase().includes(kw) ||
        a.tags.some(t => t.toLowerCase().includes(kw))
      )
    }

    // 分页
    const start = (parseInt(page) - 1) * parseInt(pageSize)
    const end = start + parseInt(pageSize)
    const list = filtered.slice(start, end)

    return res.status(200).json({
      code: 0,
      data: {
        list,
        total: filtered.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        hasMore: end < filtered.length
      }
    })

  } catch (error) {
    console.error('Articles error:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}
