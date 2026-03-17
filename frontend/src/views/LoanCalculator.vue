<template>
  <div class="loan-calculator-page">
    <div class="calculator-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>贷款计算器</h1>
        <p>精准计算贷款成本，选择最优还款方案</p>
      </div>
      
      <div class="calculator-wrapper">
        <!-- 输入区域 -->
        <div class="input-section">
          <el-card class="input-card">
            <template #header>
              <div class="card-header">
                <span class="title">贷款信息</span>
              </div>
            </template>
            
            <!-- 贷款金额 -->
            <div class="form-item">
              <label class="form-label">
                <el-icon><Money /></el-icon>
                贷款金额
              </label>
              <div class="amount-input-wrapper">
                <el-slider
                  v-model="form.amount"
                  :min="10000"
                  :max="loanType.maxAmount"
                  :step="10000"
                  show-stops
                />
                <div class="amount-display">
                  <span class="amount-value">{{ formatAmount(form.amount) }}</span>
                  <span class="amount-unit">元</span>
                </div>
              </div>
              <el-input-number
                v-model="form.amount"
                :min="10000"
                :max="loanType.maxAmount"
                :step="10000"
                controls-position="right"
              />
            </div>
            
            <!-- 贷款期限 -->
            <div class="form-item">
              <label class="form-label">
                <el-icon><Calendar /></el-icon>
                贷款期限
              </label>
              <div class="term-options">
                <button
                  v-for="m in availableMonths"
                  :key="m"
                  :class="['term-btn', { active: form.months === m }]"
                  @click="form.months = m"
                >
                  {{ formatMonth(m) }}
                </button>
              </div>
            </div>
            
            <!-- 年利率 -->
            <div class="form-item">
              <label class="form-label">
                <el-icon><TrendCharts /></el-icon>
                年利率
              </label>
              <div class="rate-wrapper">
                <el-slider
                  v-model="form.rate"
                  :min="loanType.minRate"
                  :max="loanType.maxRate"
                  :step="0.01"
                  show-stops
                />
                <div class="rate-display">
                  <span class="rate-value">{{ form.rate.toFixed(2) }}%</span>
                </div>
              </div>
            </div>
            
            <!-- 还款方式 -->
            <div class="form-item">
              <label class="form-label">
                <el-icon><List /></el-icon>
                还款方式
              </label>
              <div class="method-options">
                <button
                  v-for="method in paymentMethods"
                  :key="method.value"
                  :class="['method-btn', { active: form.method === method.value }]"
                  @click="form.method = method.value"
                >
                  <div class="method-name">{{ method.name }}</div>
                  <div class="method-desc">{{ method.shortDesc }}</div>
                </button>
              </div>
            </div>
            
            <!-- 计算按钮 -->
            <div class="calc-btn-wrapper">
              <el-button 
                type="primary" 
                size="large" 
                :icon="'Calculate'"
                @click="calculate"
              >
                计算还款
              </el-button>
              <el-button 
                size="large"
                @click="resetForm"
              >
                重置
              </el-button>
            </div>
          </el-card>
        </div>
        
        <!-- 结果区域 -->
        <div class="result-section" v-if="result">
          <!-- 计算结果概览 -->
          <el-card class="result-card">
            <template #header>
              <div class="card-header">
                <span class="title">计算结果</span>
                <el-tag type="success" v-if="form.method === 'equal_payment'">等额本息</el-tag>
                <el-tag type="success" v-if="form.method === 'equal_principal'">等额本金</el-tag>
                <el-tag type="success" v-if="form.method === 'interest_only'">先息后本</el-tag>
              </div>
            </template>
            
            <div class="result-overview">
              <div class="result-item primary">
                <div class="item-label">月供</div>
                <div class="item-value">{{ formatCurrency(result.monthlyPayment || result.monthlyInterest) }}</div>
                <div class="item-unit">元/月</div>
              </div>
              
              <div class="result-grid">
                <div class="result-item">
                  <div class="item-label">还款总额</div>
                  <div class="item-value highlight">{{ formatCurrency(result.totalPayment) }}</div>
                </div>
                <div class="result-item">
                  <div class="item-label">利息总额</div>
                  <div class="item-value">{{ formatCurrency(result.totalInterest) }}</div>
                </div>
                <div class="result-item">
                  <div class="item-label">贷款本金</div>
                  <div class="item-value">{{ formatCurrency(form.amount) }}</div>
                </div>
                <div class="result-item">
                  <div class="item-label">还款月数</div>
                  <div class="item-value">{{ form.months }}个月</div>
                </div>
              </div>
            </div>
          </el-card>
          
          <!-- 还款计划表 -->
          <el-card class="schedule-card">
            <template #header>
              <div class="card-header">
                <span class="title">还款计划表</span>
                <div class="header-actions">
                  <el-button 
                    type="primary" 
                    link
                    @click="showAllSchedule = !showAllSchedule"
                  >
                    {{ showAllSchedule ? '收起' : '查看全部' }}
                  </el-button>
                  <el-button type="primary" link @click="exportSchedule">
                    <el-icon><Download /></el-icon>
                    导出
                  </el-button>
                </div>
              </div>
            </template>
            
            <el-table 
              :data="displaySchedule" 
              style="width: 100%"
              max-height="400"
            >
              <el-table-column prop="period" label="期数" width="80" align="center" />
              <el-table-column prop="payment" label="月供" width="120" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.payment) }}
                </template>
              </el-table-column>
              <el-table-column prop="principal" label="本金" width="120" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.principal) }}
                </template>
              </el-table-column>
              <el-table-column prop="interest" label="利息" width="120" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.interest) }}
                </template>
              </el-table-column>
              <el-table-column prop="remainingPrincipal" label="剩余本金" width="120" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.remainingPrincipal) }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          
          <!-- 对比分析 -->
          <el-card class="comparison-card">
            <template #header>
              <div class="card-header">
                <span class="title">还款方式对比</span>
              </div>
            </template>
            
            <div class="comparison-table">
              <div class="comparison-row header">
                <div class="comparison-cell">对比项</div>
                <div class="comparison-cell">等额本息</div>
                <div class="comparison-cell">等额本金</div>
                <div class="comparison-cell">先息后本</div>
              </div>
              <div class="comparison-row">
                <div class="comparison-cell">首月还款</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.equalPayment.firstMonth) }}</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.equalPrincipal.firstMonth) }}</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.interestOnly.monthlyInterest) }}</div>
              </div>
              <div class="comparison-row">
                <div class="comparison-cell">末月还款</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.equalPayment.lastMonth) }}</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.equalPrincipal.lastMonth) }}</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.interestOnly.finalPayment) }}</div>
              </div>
              <div class="comparison-row">
                <div class="comparison-cell">利息总额</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.equalPayment.totalInterest) }}</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.equalPrincipal.totalInterest) }}</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.interestOnly.totalInterest) }}</div>
              </div>
              <div class="comparison-row">
                <div class="comparison-cell">总还款额</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.equalPayment.totalPayment) }}</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.equalPrincipal.totalPayment) }}</div>
                <div class="comparison-cell">{{ formatCurrency(comparison.interestOnly.totalPayment) }}</div>
              </div>
            </div>
            
            <div class="comparison-tip">
              <el-alert
                type="info"
                :closable="false"
                show-icon
              >
                <template #title>
                  <strong>选择建议：</strong>
                </template>
                <div class="tip-content">
                  <p><strong>等额本息：</strong>每月还款固定，适合收入稳定、希望月供均衡的人群</p>
                  <p><strong>等额本金：</strong>总利息最少，适合前期资金充裕、希望总利息最少的人群</p>
                  <p><strong>先息后本：</strong>前期压力最小，适合短期周转、资金回报周期较长的项目</p>
                </div>
              </el-alert>
            </div>
          </el-card>
          
          <!-- 推荐产品 -->
          <el-card class="recommend-card">
            <template #header>
              <div class="card-header">
                <span class="title">为您推荐</span>
              </div>
            </template>
            
            <div class="recommend-products">
              <div 
                v-for="product in recommendProducts" 
                :key="product.id"
                class="recommend-item"
              >
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-rate">年化 {{ product.rate }}%</div>
                </div>
                <el-button type="primary" link @click="applyLoan(product)">
                  立即申请
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Money, Calendar, TrendCharts, List, Download } from '@element-plus/icons-vue'
import { 
  calculateEqualPayment, 
  calculateEqualPrincipal, 
  calculateInterestOnly,
  loanTypes,
  paymentMethodDesc
} from '../composables/useCalculator'

// 贷款类型
const loanType = ref(loanTypes[0])

// 还款方式列表
const paymentMethods = [
  { 
    value: 'equal_payment', 
    name: '等额本息', 
    shortDesc: '每月还款固定'
  },
  { 
    value: 'equal_principal', 
    name: '等额本金', 
    shortDesc: '总利息最少'
  },
  { 
    value: 'interest_only', 
    name: '先息后本', 
    shortDesc: '前期压力小'
  }
]

// 可用期限
const availableMonths = [3, 6, 12, 18, 24, 36]

// 表单数据
const form = reactive({
  amount: 500000,
  months: 12,
  rate: 4.35,
  method: 'equal_payment'
})

// 计算结果
const result = ref(null)
const schedule = ref([])
const showAllSchedule = ref(false)

// 对比数据
const comparison = ref({
  equalPayment: {},
  equalPrincipal: {},
  interestOnly: {}
})

// 推荐产品
const recommendProducts = ref([
  { id: 1, name: '工商银行-经营快贷', rate: '4.35', link: '/loan/products/1' },
  { id: 2, name: '建设银行-小微快贷', rate: '4.05', link: '/loan/products/2' },
  { id: 3, name: '农业银行-纳税e贷', rate: '4.35', link: '/loan/products/3' }
])

// 计算
function calculate() {
  try {
    switch (form.method) {
      case 'equal_payment':
        result.value = calculateEqualPayment(form.amount, form.rate, form.months)
        break
      case 'equal_principal':
        result.value = calculateEqualPrincipal(form.amount, form.rate, form.months)
        break
      case 'interest_only':
        result.value = calculateInterestOnly(form.amount, form.rate, form.months)
        break
    }
    
    schedule.value = result.value.schedule
    calculateComparison()
    
    ElMessage.success('计算完成')
  } catch (error) {
    ElMessage.error('计算失败，请检查输入')
  }
}

// 计算对比
function calculateComparison() {
  comparison.value.equalPayment = calculateEqualPayment(form.amount, form.rate, form.months)
  comparison.value.equalPrincipal = calculateEqualPrincipal(form.amount, form.rate, form.months)
  comparison.value.interestOnly = calculateInterestOnly(form.amount, form.rate, form.months)
  
  comparison.value.equalPayment.firstMonth = comparison.value.equalPayment.monthlyPayment
  comparison.value.equalPayment.lastMonth = comparison.value.equalPayment.monthlyPayment
  comparison.value.equalPrincipal.firstMonth = comparison.value.equalPrincipal.firstMonthPayment
  comparison.value.equalPrincipal.lastMonth = comparison.value.equalPrincipal.lastMonthPayment
  comparison.value.interestOnly.monthlyInterest = comparison.value.interestOnly.monthlyInterest
  comparison.value.interestOnly.finalPayment = comparison.value.interestOnly.finalPayment
}

// 重置表单
function resetForm() {
  form.amount = 500000
  form.months = 12
  form.rate = 4.35
  form.method = 'equal_payment'
  result.value = null
  schedule.value = []
}

// 格式化金额
function formatCurrency(value) {
  if (!value) return '0.00'
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 格式化金额（简化）
function formatAmount(value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(0) + '万'
  }
  return value.toString()
}

// 格式化月份
function formatMonth(months) {
  if (months >= 12) {
    const years = Math.floor(months / 12)
    const remaining = months % 12
    if (remaining === 0) {
      return `${years}年`
    }
    return `${years}年${remaining}月`
  }
  return `${months}个月`
}

// 显示的计划
const displaySchedule = computed(() => {
  if (showAllSchedule.value) {
    return schedule.value
  }
  return schedule.value.slice(0, 12)
})

// 导出计划表
function exportSchedule() {
  ElMessage.info('导出功能开发中')
}

// 申请贷款
function applyLoan(product) {
  ElMessage.success(`已为您跳转到${product.name}申请页面`)
}

// 初始化计算
onMounted(() => {
  calculate()
})
</script>

<style scoped>
.loan-calculator-page {
  padding: 40px 0;
  background: #f5f7fa;
  min-height: calc(100vh - 70px);
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 12px;
}

.page-header p {
  font-size: 18px;
  color: #666;
}

.calculator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.calculator-wrapper {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
}

/* 输入区域 */
.input-card,
.result-card,
.schedule-card,
.comparison-card,
.recommend-card {
  border-radius: 12px;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header .title {
  font-size: 18px;
  font-weight: 600;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.form-label .el-icon {
  color: #667eea;
}

/* 金额输入 */
.amount-input-wrapper,
.rate-wrapper {
  margin-bottom: 12px;
}

.amount-display,
.rate-display {
  text-align: center;
  margin-top: 8px;
}

.amount-value,
.rate-value {
  font-size: 24px;
  font-weight: 600;
  color: #667eea;
}

/* 期限选项 */
.term-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.term-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.term-btn:hover,
.term-btn.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

/* 还款方式 */
.method-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-btn {
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
}

.method-btn:hover,
.method-btn.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.method-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.method-desc {
  font-size: 14px;
  color: #666;
}

/* 计算按钮 */
.calc-btn-wrapper {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.calc-btn-wrapper .el-button {
  flex: 1;
}

/* 结果区域 */
.result-overview {
  text-align: center;
}

.result-item.primary {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;
  margin-bottom: 24px;
}

.result-item.primary .item-label {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.result-item.primary .item-value {
  font-size: 48px;
  font-weight: 700;
}

.result-item.primary .item-unit {
  font-size: 18px;
  margin-top: 8px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.result-item {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.result-item .item-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.result-item .item-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.result-item .item-value.highlight {
  color: #667eea;
}

/* 对比表格 */
.comparison-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.comparison-row {
  display: grid;
  grid-template-columns: 100px repeat(3, 1fr);
  border-bottom: 1px solid #e0e0e0;
}

.comparison-row:last-child {
  border-bottom: none;
}

.comparison-row.header {
  background: #f5f7fa;
  font-weight: 600;
}

.comparison-cell {
  padding: 12px;
  text-align: center;
  border-right: 1px solid #e0e0e0;
}

.comparison-cell:last-child {
  border-right: none;
}

.comparison-tip {
  margin-top: 20px;
}

.tip-content p {
  margin: 8px 0;
  line-height: 1.6;
}

/* 推荐产品 */
.recommend-products {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.product-rate {
  font-size: 14px;
  color: #667eea;
}

/* 响应式 */
@media (max-width: 1024px) {
  .calculator-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .result-grid {
    grid-template-columns: 1fr;
  }
  
  .comparison-row {
    grid-template-columns: 80px repeat(3, 1fr);
  }
  
  .comparison-cell {
    padding: 8px;
    font-size: 14px;
  }
}
</style>
