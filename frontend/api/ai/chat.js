import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'rongzhushou-secret-key-2026'

// AI 响应模板
const responses = {
  '贷款': `根据您的需求，我建议考虑以下几种贷款产品：

**1. 信用贷款**
- 额度：最高100万
- 利率：3.5%-8%
- 特点：无需抵押，审批快速

**2. 抵押贷款**
- 额度：最高1000万
- 利率：3.2%-6%
- 特点：利率低，期限长

**3. 政策性贷款**
- 额度：最高300万
- 利率：2.5%-4.5%
- 特点：政府贴息，专项支持

请问您的企业类型是什么？需要的贷款金额大约是多少？`,

  '利率': `贷款利率主要受以下因素影响：

1. **贷款类型**：抵押贷款利率通常低于信用贷款
2. **企业资质**：纳税等级、信用记录越好，利率越低
3. **贷款期限**：期限越长，利率可能越高
4. **担保方式**：有抵押担保可获得更优惠利率

目前市场主流利率参考：
- 信用贷款：3.5%-8%
- 抵押贷款：3.2%-6%
- 政策性贷款：2.5%-4.5%

具体利率需要根据您的企业情况评估。`,

  '条件': `申请贷款基本条件：

**企业要求：**
- 注册满1年以上
- 正常经营，有稳定收入
- 纳税记录良好
- 信用记录无严重逾期

**法人要求：**
- 年龄22-60周岁
- 信用记录良好
- 在贷款企业持股或任职

**其他材料：**
- 营业执照
- 财务报表
- 纳税证明
- 银行流水

不同产品具体要求不同，您可以告诉我您的企业情况，我帮您匹配最适合的产品。`,

  '流程': `贷款申请流程：

1. **在线申请**（5分钟）
   - 填写基本信息

2. **资质评估**（1小时）
   - AI智能评估
   - 推荐合适产品

3. **材料准备**（1-3天）
   - 按要求准备材料

4. **银行审批**（3-7天）
   - 银行审核
   - 视频/面签

5. **放款**（1-3天）
   - 签署合同
   - 放款到账

全流程约7-15个工作日，部分产品可加急处理。`,

  '材料': `贷款所需材料：

**基础材料：**
- 营业执照副本
- 企业章程
- 法定代表人身份证

**经营证明：**
- 近1年财务报表
- 银行流水（近6个月）
- 纳税证明

**资产证明：**
- 房产证（抵押贷款）
- 车辆行驶证

**其他：**
- 上下游合同
- 经营场所租赁合同`
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, message: 'Method not allowed' })
  }

  // 验证 Token（可选，未登录也可使用有限次数）
  let user = null
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7)
      user = jwt.verify(token, JWT_SECRET)
    } catch (e) {
      // Token 无效，继续作为游客处理
    }
  }

  try {
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({
        code: 400,
        message: '请输入问题'
      })
    }

    // 匹配关键词
    let response = null
    for (const [key, value] of Object.entries(responses)) {
      if (message.includes(key)) {
        response = value
        break
      }
    }

    // 默认回复
    if (!response) {
      response = `感谢您的咨询！

根据您的描述，我建议：

1. **点击"免费咨询"** - 专业顾问一对一服务
2. **使用"贷款计算器"** - 测算您的贷款成本
3. **查看"贷款产品"** - 匹配最适合您的方案

如果您有具体的企业类型和贷款需求，我可以为您做更精准的推荐。`
    }

    return res.status(200).json({
      code: 0,
      data: {
        response,
        suggestions: ['我想贷款', '贷款利率', '需要什么条件', '贷款流程']
      }
    })

  } catch (error) {
    console.error('AI chat error:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}
