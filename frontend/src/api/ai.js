import request from './request'

/**
 * AI顾问相关API
 */
export const aiApi = {
  // 发送消息（普通模式）
  chat: (data) => request.post('/ai/chat', data),

  // 发送消息（流式响应）
  chatStream: async (data, onMessage, onEnd, onError) => {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      onError?.(error.message || '请求失败')
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          onEnd?.()
          break
        }

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              onEnd?.()
              return
            }
            try {
              const parsed = JSON.parse(data)
              onMessage?.(parsed)
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      onError?.(error.message)
    }
  },

  // 获取对话历史
  getHistory: (params) => request.get('/ai/history', { params }),

  // 获取单个对话详情
  getConversation: (conversationId) =>
    request.get(`/ai/conversation/${conversationId}`),

  // 创建新对话
  createConversation: (title) =>
    request.post('/ai/conversation', { title }),

  // 删除对话
  deleteConversation: (conversationId) =>
    request.delete(`/ai/conversation/${conversationId}`),

  // 更新对话标题
  updateConversationTitle: (conversationId, title) =>
    request.put(`/ai/conversation/${conversationId}`, { title }),

  // 获取快捷问题
  getQuickQuestions: () => request.get('/ai/quick-questions'),

  // 获取积分余额
  getPointsBalance: () => request.get('/ai/points/balance'),

  // 消耗积分
  consumePoints: (amount, description) =>
    request.post('/ai/points/consume', { amount, description }),

  // 获取积分消耗记录
  getPointsHistory: (params) =>
    request.get('/ai/points/history', { params }),

  // 获取AI推荐问题
  getRecommendedQuestions: (context) =>
    request.post('/ai/recommended-questions', { context }),

  // 反馈回答质量
  feedback: (messageId, rating, comment) =>
    request.post('/ai/feedback', { messageId, rating, comment }),

  // 导出对话记录
  exportConversation: (conversationId, format = 'txt') =>
    request.get(`/ai/conversation/${conversationId}/export`, {
      params: { format },
      responseType: 'blob'
    })
}

export default aiApi
