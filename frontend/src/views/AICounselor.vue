<template>
  <div class="ai-counselor-page">
    <div class="chat-container">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="header-left">
          <div class="bot-avatar">
            <span class="bot-icon">🤖</span>
            <span class="status-dot" :class="{ online: true }"></span>
          </div>
          <div class="bot-info">
            <h3>融智助手</h3>
            <p>AI智能顾问 · 在线</p>
          </div>
        </div>
        <div class="header-right">
          <el-tooltip content="清空对话" placement="bottom">
            <el-button circle @click="clearChat">
              <el-icon><Delete /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      
      <!-- 消息列表 -->
      <div class="messages-container" ref="messagesRef">
        <div class="messages-list">
          <!-- 欢迎消息 -->
          <div class="message bot" v-if="messages.length === 0">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="message-bubble">
                <p>您好！我是融智助手AI顾问，很高兴为您服务！</p>
                <p>我可以帮您解答以下问题：</p>
                <ul>
                  <li>贷款申请条件和流程</li>
                  <li>贷款利率和计算方式</li>
                  <li>推荐合适的贷款产品</li>
                  <li>融资方案定制</li>
                </ul>
              </div>
              <div class="message-time">刚刚</div>
            </div>
          </div>
          
          <!-- 历史消息 -->
          <div 
            v-for="(msg, index) in messages" 
            :key="index" 
            :class="['message', msg.role]"
          >
            <div class="message-avatar" v-if="msg.role === 'bot'">🤖</div>
            <div class="message-content">
              <div class="message-bubble" v-html="formatMessage(msg.content)"></div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
            <div class="message-avatar" v-if="msg.role === 'user'">{{ userAvatar }}</div>
          </div>
          
          <!-- 打字动画 -->
          <div class="message bot" v-if="isTyping">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="message-bubble typing">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 快捷问题 -->
      <div class="quick-questions" v-if="showQuickQuestions && messages.length < 3">
        <p class="quick-title">您可以问我：</p>
        <div class="quick-list">
          <button 
            v-for="(q, i) in quickQuestions" 
            :key="i"
            class="quick-btn"
            @click="sendQuickQuestion(q)"
          >
            {{ q }}
          </button>
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="input-area">
        <div class="input-wrapper">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="1"
            :autosize="{ minRows: 1, maxRows: 4 }"
            placeholder="请输入您的问题..."
            @keydown.enter.prevent="handleEnter"
            :disabled="isTyping || !canChat"
          />
          <el-button 
            type="primary" 
            :icon="isTyping ? '' : 'Position'"
            :loading="isTyping"
            :disabled="!inputMessage.trim() || !canChat"
            @click="sendMessage"
          >
            {{ isTyping ? '思考中' : '发送' }}
          </el-button>
        </div>
        
        <!-- 会员提示 -->
        <div class="member-tip" v-if="!isMember && remainingChats <= 3">
          <p>
            <el-icon><Warning /></el-icon>
            您今日还可咨询 {{ remainingChats }} 次，
            <router-link to="/membership">升级会员</router-link>
            获得无限次咨询
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { generateAIResponse, quickQuestions as defaultQuickQuestions } from '../composables/useAIChat'
import { ElMessage } from 'element-plus'
import { Delete, Warning } from '@element-plus/icons-vue'

const userStore = useUserStore()

// 状态
const messages = ref([])
const inputMessage = ref('')
const isTyping = ref(false)
const messagesRef = ref(null)
const showQuickQuestions = ref(true)

// 计算属性
const isMember = computed(() => userStore.isMember)
const userAvatar = computed(() => userStore.userInfo?.nickname?.charAt(0) || '我')
const remainingChats = computed(() => {
  // 非会员每天10次
  return Math.max(0, 10 - messages.value.filter(m => m.role === 'user').length)
})
const canChat = computed(() => isMember.value || remainingChats.value > 0)

// 快捷问题
const quickQuestions = ref(defaultQuickQuestions.slice(0, 6))

// 发送消息
async function sendMessage() {
  const message = inputMessage.value.trim()
  if (!message || isTyping.value) return
  
  // 检查是否可以聊天
  if (!canChat.value) {
    ElMessage.warning('您今日的咨询次数已用完，请升级会员获得无限次咨询')
    return
  }
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message,
    time: formatTime(new Date())
  })
  
  inputMessage.value = ''
  showQuickQuestions.value = false
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  // 模拟AI思考
  isTyping.value = true
  
  try {
    // 生成AI回复
    const response = generateAIResponse(message, userStore.userInfo)
    
    // 模拟打字延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    // 添加AI回复
    messages.value.push({
      role: 'bot',
      content: response.text,
      time: formatTime(new Date()),
      suggestions: response.suggestions
    })
    
    // 非会员消耗次数
    if (!isMember.value) {
      userStore.consumeCredits(1)
    }
    
  } catch (error) {
    ElMessage.error('抱歉，出现了错误，请稍后重试')
  } finally {
    isTyping.value = false
    await nextTick()
    scrollToBottom()
  }
}

// 发送快捷问题
function sendQuickQuestion(question) {
  inputMessage.value = question
  sendMessage()
}

// 回车发送
function handleEnter(e) {
  if (!e.shiftKey) {
    sendMessage()
  }
}

// 清空对话
function clearChat() {
  messages.value = []
  showQuickQuestions.value = true
  ElMessage.success('对话已清空')
}

// 格式化时间
function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// 格式化消息（支持Markdown基础语法）
function formatMessage(content) {
  if (!content) return ''
  
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

// 滚动到底部
function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// 监听消息变化自动滚动
watch(messages, () => {
  nextTick(scrollToBottom)
}, { deep: true })

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.ai-counselor-page {
  height: calc(100vh - 70px);
  display: flex;
  background: #f5f7fa;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 头部 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bot-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bot-icon {
  font-size: 24px;
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #ff4d4f;
  border-radius: 50%;
  border: 2px solid #fff;
}

.status-dot.online {
  background: #52c41a;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.bot-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.bot-info p {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
}

.header-right .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
}

.header-right .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 消息区域 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fafafa;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  background: #f0f0f0;
}

.message.user .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 16px;
}

.message-content {
  max-width: 70%;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.message-bubble ul {
  margin: 8px 0;
  padding-left: 20px;
}

.message-bubble li {
  margin: 4px 0;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.message.user .message-time {
  text-align: left;
}

/* 打字动画 */
.message-bubble.typing {
  display: flex;
  gap: 4px;
  padding: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #ddd;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    background: #ddd;
  }
  40% {
    transform: scale(1);
    background: #667eea;
  }
}

/* 快捷问题 */
.quick-questions {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #eee;
}

.quick-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

/* 输入区域 */
.input-area {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #eee;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-wrapper .el-textarea {
  flex: 1;
}

.input-wrapper .el-textarea :deep(.el-textarea__inner) {
  border-radius: 20px;
  padding: 10px 16px;
  resize: none;
}

.member-tip {
  margin-top: 12px;
  padding: 10px 16px;
  background: #fffbe6;
  border-radius: 8px;
  font-size: 14px;
}

.member-tip p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #d48806;
}

.member-tip a {
  color: #667eea;
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 768px) {
  .ai-counselor-page {
    height: calc(100vh - 60px);
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .quick-btn {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style>
