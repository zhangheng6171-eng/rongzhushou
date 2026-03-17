<template>
  <div class="membership-page">
    <!-- Hero区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>升级会员，解锁全部功能</h1>
        <p>专业融资顾问服务，助您轻松获得贷款</p>
      </div>
    </div>
    
    <!-- 套餐对比 -->
    <div class="packages-section">
      <div class="section-header">
        <h2>选择适合您的套餐</h2>
        <p>灵活选择，按需付费</p>
      </div>
      
      <div class="packages-grid">
        <!-- 月度会员 -->
        <div class="package-card" :class="{ popular: false }">
          <div class="package-header">
            <h3 class="package-name">月度会员</h3>
            <div class="package-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">29</span>
              <span class="price-unit">/月</span>
            </div>
            <p class="package-desc">适合短期需求</p>
          </div>
          
          <ul class="package-features">
            <li><span class="check">✓</span> AI咨询无限次</li>
            <li><span class="check">✓</span> 贷款计算器完整功能</li>
            <li><span class="check">✓</span> 全部文章免费阅读</li>
            <li><span class="check">✓</span> 政策资讯推送</li>
            <li class="disabled"><span class="cross">✕</span> 专属顾问服务</li>
            <li class="disabled"><span class="cross">✕</span> 优先审批通道</li>
          </ul>
          
          <div class="package-action">
            <el-button 
              type="default" 
              size="large"
              @click="selectPackage('monthly')"
            >
              选择套餐
            </el-button>
          </div>
        </div>
        
        <!-- 年度会员 -->
        <div class="package-card popular">
          <div class="popular-badge">最受欢迎</div>
          <div class="package-header">
            <h3 class="package-name">年度会员</h3>
            <div class="package-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">199</span>
              <span class="price-unit">/年</span>
            </div>
            <p class="package-desc">省¥149，相当于4.3折</p>
          </div>
          
          <ul class="package-features">
            <li><span class="check">✓</span> AI咨询无限次</li>
            <li><span class="check">✓</span> 贷款计算器完整功能</li>
            <li><span class="check">✓</span> 全部文章免费阅读</li>
            <li><span class="check">✓</span> 政策资讯推送</li>
            <li><span class="check">✓</span> 专属顾问服务</li>
            <li class="disabled"><span class="cross">✕</span> 优先审批通道</li>
          </ul>
          
          <div class="package-action">
            <el-button 
              type="primary" 
              size="large"
              @click="selectPackage('yearly')"
            >
              选择套餐
            </el-button>
          </div>
        </div>
        
        <!-- 超级会员 -->
        <div class="package-card premium">
          <div class="premium-badge">专业版</div>
          <div class="package-header">
            <h3 class="package-name">超级会员</h3>
            <div class="package-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">499</span>
              <span class="price-unit">/年</span>
            </div>
            <p class="package-desc">专业企业首选</p>
          </div>
          
          <ul class="package-features">
            <li><span class="check">✓</span> AI咨询无限次</li>
            <li><span class="check">✓</span> 贷款计算器完整功能</li>
            <li><span class="check">✓</span> 全部文章免费阅读</li>
            <li><span class="check">✓</span> 政策资讯推送</li>
            <li><span class="check">✓</span> 专属顾问服务</li>
            <li><span class="check">✓</span> 优先审批通道</li>
          </ul>
          
          <div class="package-action">
            <el-button 
              type="primary" 
              size="large"
              class="premium-btn"
              @click="selectPackage('premium')"
            >
              选择套餐
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 权益对比 -->
    <div class="features-section">
      <div class="section-header">
        <h2>会员权益详情</h2>
      </div>
      
      <el-card class="features-card">
        <el-table :data="featureTable" style="width: 100%">
          <el-table-column prop="feature" label="权益项目" width="200" />
          <el-table-column label="免费用户" align="center">
            <template #default="{ row }">
              <span v-if="row.free === true" class="status-yes">✓</span>
              <span v-else-if="row.free === false" class="status-no">✕</span>
              <span v-else>{{ row.free }}</span>
            </template>
          </el-table-column>
          <el-table-column label="月度会员" align="center">
            <template #default="{ row }">
              <span v-if="row.monthly === true" class="status-yes">✓</span>
              <span v-else-if="row.monthly === false" class="status-no">✕</span>
              <span v-else>{{ row.monthly }}</span>
            </template>
          </el-table-column>
          <el-table-column label="年度会员" align="center">
            <template #default="{ row }">
              <span v-if="row.yearly === true" class="status-yes">✓</span>
              <span v-else-if="row.yearly === false" class="status-no">✕</span>
              <span v-else>{{ row.yearly }}</span>
            </template>
          </el-table-column>
          <el-table-column label="超级会员" align="center">
            <template #default="{ row }">
              <span v-if="row.premium === true" class="status-yes">✓</span>
              <span v-else-if="row.premium === false" class="status-no">✕</span>
              <span v-else>{{ row.premium }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <!-- 常见问题 -->
    <div class="faq-section">
      <div class="section-header">
        <h2>常见问题</h2>
      </div>
      
      <el-collapse accordion>
        <el-collapse-item 
          v-for="(item, index) in faqs" 
          :key="index"
          :title="item.question"
          :name="index"
        >
          <div class="faq-answer" v-html="item.answer"></div>
        </el-collapse-item>
      </el-collapse>
    </div>
    
    <!-- 支付弹窗 -->
    <el-dialog 
      v-model="showPayment" 
      title="确认订阅" 
      width="480px"
      :close-on-click-modal="false"
    >
      <div class="payment-summary">
        <div class="summary-item">
          <span class="label">套餐</span>
          <span class="value">{{ selectedPackage?.name }}</span>
        </div>
        <div class="summary-item">
          <span class="label">有效期</span>
          <span class="value">{{ selectedPackage?.duration }}</span>
        </div>
        <div class="summary-item total">
          <span class="label">支付金额</span>
          <span class="value price">¥{{ selectedPackage?.price }}</span>
        </div>
      </div>
      
      <div class="payment-methods">
        <h4>选择支付方式</h4>
        <div class="method-list">
          <div 
            class="method-item" 
            :class="{ active: paymentMethod === 'wechat' }"
            @click="paymentMethod = 'wechat'"
          >
            <span class="pay-icon">💬</span>
            <span>微信支付</span>
          </div>
          <div 
            class="method-item" 
            :class="{ active: paymentMethod === 'alipay' }"
            @click="paymentMethod = 'alipay'"
          >
            <span class="pay-icon">💳</span>
            <span>支付宝</span>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showPayment = false">取消</el-button>
        <el-button type="primary" @click="confirmPayment" :loading="paying">
          确认支付
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 支付成功弹窗 -->
    <el-dialog 
      v-model="showSuccess" 
      title="支付成功" 
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="success-content">
        <div class="success-icon">🎉</div>
        <h3>恭喜您，会员开通成功！</h3>
        <p>您已成为{{ selectedPackage?.name }}，有效期至{{ expireDate }}</p>
      </div>
      
      <template #footer>
        <el-button type="primary" @click="goToDashboard">
          开始使用
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 套餐数据
const packages = {
  monthly: {
    id: 'monthly',
    name: '月度会员',
    price: 29,
    duration: '30天',
    level: 1
  },
  yearly: {
    id: 'yearly',
    name: '年度会员',
    price: 199,
    duration: '365天',
    level: 1
  },
  premium: {
    id: 'premium',
    name: '超级会员',
    price: 499,
    duration: '365天',
    level: 2
  }
}

const selectedPackage = ref(null)
const showPayment = ref(false)
const showSuccess = ref(false)
const paymentMethod = ref('wechat')
const paying = ref(false)

// 权益对比表
const featureTable = [
  { feature: 'AI智能咨询', free: '3次/天', monthly: true, yearly: true, premium: true },
  { feature: '贷款计算器', free: '基础版', monthly: '完整版', yearly: '完整版', premium: '完整版' },
  { feature: '文章阅读', free: '部分免费', monthly: true, yearly: true, premium: true },
  { feature: '政策资讯', free: false, monthly: true, yearly: true, premium: true },
  { feature: '专属顾问', free: false, monthly: false, yearly: true, premium: true },
  { feature: '优先审批', free: false, monthly: false, yearly: false, premium: true },
  { feature: '发票服务', free: false, monthly: true, yearly: true, premium: true },
  { feature: '优惠券', free: false, monthly: false, yearly: '每月1张', premium: '每月2张' }
]

// 常见问题
const faqs = [
  {
    question: '会员可以退款吗？',
    answer: '会员服务开通后，如因服务质量问题不满意，可在开通后7天内申请全额退款。'
  },
  {
    question: '会员到期后怎么办？',
    answer: '会员到期后，系统会自动降级为免费用户。您可以在到期前续费，享受续费优惠。'
  },
  {
    question: '升级会员后，之前的数据会丢失吗？',
    answer: '不会。您的所有数据（对话记录、收藏等）都会保留，升级后可以继续使用。'
  },
  {
    question: '专属顾问是什么服务？',
    answer: '专属顾问是指定一名专业融资顾问，为您提供一对一的咨询服务，包括方案定制、材料准备指导等。'
  },
  {
    question: '优先审批通道是什么？',
    answer: '优先审批通道是指我们与银行合作的绿色通道，可加快您的贷款审批速度，通常可缩短3-5个工作日。'
  }
]

// 到期日期
const expireDate = computed(() => {
  if (!selectedPackage.value) return ''
  const date = new Date()
  if (selectedPackage.value.id === 'monthly') {
    date.setMonth(date.getMonth() + 1)
  } else {
    date.setFullYear(date.getFullYear() + 1)
  }
  return date.toLocaleDateString('zh-CN')
})

// 选择套餐
function selectPackage(id) {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  selectedPackage.value = packages[id]
  showPayment.value = true
}

// 确认支付
async function confirmPayment() {
  if (!paymentMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }
  
  paying.value = true
  
  try {
    // 模拟支付流程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 更新会员状态
    userStore.updateMemberLevel(selectedPackage.value.level)
    
    showPayment.value = false
    showSuccess.value = true
    
  } catch (error) {
    ElMessage.error('支付失败，请重试')
  } finally {
    paying.value = false
  }
}

// 跳转到用户中心
function goToDashboard() {
  showSuccess.value = false
  router.push('/dashboard')
}
</script>

<style scoped>
.membership-page {
  background: #f5f7fa;
  padding-bottom: 60px;
}

/* Hero区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
  text-align: center;
  color: #fff;
}

.hero-content h1 {
  font-size: 42px;
  margin-bottom: 16px;
  animation: fadeInUp 0.6s ease;
}

.hero-content p {
  font-size: 20px;
  opacity: 0.9;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 套餐区域 */
.packages-section {
  max-width: 1200px;
  margin: -60px auto 0;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 32px;
  color: #333;
  margin-bottom: 12px;
}

.section-header p {
  font-size: 16px;
  color: #666;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* 套餐卡片 */
.package-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  position: relative;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.package-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.package-card.popular {
  border-color: #667eea;
  transform: scale(1.05);
}

.package-card.popular:hover {
  transform: scale(1.05) translateY(-8px);
}

.package-card.premium {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
}

.popular-badge,
.premium-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #667eea;
  color: #fff;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.premium-badge {
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
}

.package-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.package-card.premium .package-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.package-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

.package-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price-symbol {
  font-size: 20px;
  color: #667eea;
}

.price-value {
  font-size: 56px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.package-card.premium .price-symbol,
.package-card.premium .price-value {
  color: #fff;
}

.price-unit {
  font-size: 16px;
  color: #666;
}

.package-desc {
  margin-top: 12px;
  font-size: 14px;
  color: #667eea;
}

.package-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}

.package-features li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.package-card.premium .package-features li {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.package-features li:last-child {
  border-bottom: none;
}

.package-features li.disabled {
  color: #999;
}

.check {
  color: #52c41a;
  font-weight: bold;
}

.cross {
  color: #ff4d4f;
}

.package-action {
  text-align: center;
}

.package-action .el-button {
  width: 100%;
}

.premium-btn {
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
  border: none;
}

/* 权益对比 */
.features-section {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

.features-card {
  border-radius: 12px;
}

.status-yes {
  color: #52c41a;
  font-size: 20px;
}

.status-no {
  color: #ff4d4f;
  font-size: 20px;
}

/* 常见问题 */
.faq-section {
  max-width: 800px;
  margin: 60px auto;
  padding: 0 20px;
}

.faq-answer {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  line-height: 1.8;
}

/* 支付弹窗 */
.payment-summary {
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.summary-item.total {
  border-bottom: none;
  padding-top: 16px;
}

.summary-item .label {
  color: #666;
}

.summary-item .value {
  font-weight: 600;
}

.summary-item .value.price {
  font-size: 24px;
  color: #ff4d4f;
}

.payment-methods h4 {
  margin-bottom: 16px;
  font-size: 16px;
}

.method-list {
  display: flex;
  gap: 16px;
}

.method-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.method-item:hover,
.method-item.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.method-item .pay-icon {
  font-size: 32px;
}

/* 成功弹窗 */
.success-content {
  text-align: center;
  padding: 24px;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.success-content h3 {
  font-size: 24px;
  margin-bottom: 12px;
}

.success-content p {
  color: #666;
}

/* 响应式 */
@media (max-width: 1024px) {
  .packages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .package-card.popular {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 28px;
  }
  
  .packages-grid {
    grid-template-columns: 1fr;
  }
  
  .price-value {
    font-size: 42px;
  }
}
</style>
