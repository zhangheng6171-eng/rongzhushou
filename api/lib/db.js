import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured, using in-memory storage')
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// 内存存储（开发/演示模式）
const memoryStorage = {
  users: new Map(),
  smsCodes: new Map(),
  articles: [
    {
      id: 1,
      title: '2026年小微企业贷款政策解读',
      summary: '最新小微企业贷款政策分析，帮助企业主了解优惠政策和申请条件。',
      category: '政策解读',
      tags: ['贷款政策', '小微企业', '优惠'],
      view_count: 1234,
      like_count: 89,
      publish_time: '2026-03-15T10:00:00Z',
      is_vip_only: false
    },
    {
      id: 2,
      title: '如何提高贷款审批通过率？',
      summary: '掌握这些技巧，让您的贷款申请更容易获批。',
      category: '贷款技巧',
      tags: ['审批技巧', '贷款申请'],
      view_count: 856,
      like_count: 67,
      publish_time: '2026-03-14T10:00:00Z',
      is_vip_only: false
    },
    {
      id: 3,
      title: '小微企业税收优惠政策汇总',
      summary: '2026年小微企业可享受的税收优惠政策详解。',
      category: '税务筹划',
      tags: ['税收优惠', '小微企业'],
      view_count: 678,
      like_count: 45,
      publish_time: '2026-03-13T10:00:00Z',
      is_vip_only: true
    },
    {
      id: 4,
      title: '贷款计算器使用指南',
      summary: '手把手教您使用贷款计算器，精准计算贷款成本。',
      category: '工具使用',
      tags: ['贷款计算器', '使用指南'],
      view_count: 432,
      like_count: 28,
      publish_time: '2026-03-12T10:00:00Z',
      is_vip_only: false
    },
    {
      id: 5,
      title: '银行贷款产品对比分析',
      summary: '主流银行小微企业贷款产品详细对比。',
      category: '产品分析',
      tags: ['银行贷款', '产品对比'],
      view_count: 567,
      like_count: 34,
      publish_time: '2026-03-11T10:00:00Z',
      is_vip_only: false
    }
  ]
}

export { memoryStorage }
