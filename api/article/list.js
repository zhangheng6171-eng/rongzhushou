import { supabase, memoryStorage } from '../lib/db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ code: 405, message: 'Method not allowed' })

  try {
    const { page = 1, pageSize = 10, category, keyword } = req.query

    let articles
    let total

    if (supabase) {
      // 使用 Supabase
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .order('publish_time', { ascending: false })

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      if (keyword) {
        query = query.or(`title.ilike.%${keyword}%,summary.ilike.%${keyword}%`)
      }

      const start = (parseInt(page) - 1) * parseInt(pageSize)
      query = query.range(start, start + parseInt(pageSize) - 1)

      const { data, error, count } = await query

      if (error) throw error

      articles = data
      total = count
    } else {
      // 使用内存存储
      let filtered = [...memoryStorage.articles]

      if (category && category !== 'all') {
        filtered = filtered.filter(a => a.category === category)
      }

      if (keyword) {
        const kw = keyword.toLowerCase()
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(kw) ||
          a.summary.toLowerCase().includes(kw)
        )
      }

      total = filtered.length
      const start = (parseInt(page) - 1) * parseInt(pageSize)
      const end = start + parseInt(pageSize)
      articles = filtered.slice(start, end)
    }

    return res.status(200).json({
      code: 0,
      data: {
        list: articles,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        hasMore: (parseInt(page) * parseInt(pageSize)) < total
      }
    })
  } catch (error) {
    console.error('Articles error:', error)
    return res.status(500).json({ code: 500, message: '服务器错误' })
  }
}
