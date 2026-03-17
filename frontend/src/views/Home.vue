<template>
  <div class="home">
    <!-- Hero区域 -->
    <section class="hero">
      <div class="hero-particles" ref="particlesContainer"></div>
      <div class="container hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-line" v-for="(line, index) in heroLines" :key="index" :style="{ animationDelay: `${index * 0.2}s` }">
              {{ line }}
            </span>
          </h1>
          <p class="hero-subtitle" style="animation-delay: 0.6s">
            AI驱动的智能融资顾问，为您提供专业的融资方案、<br>实时政策解读和一站式贷款服务
          </p>
          <div class="hero-actions" style="animation-delay: 0.8s">
            <router-link to="/ai-counselor" class="btn-primary btn-animated">
              <span class="btn-text">免费咨询</span>
              <span class="btn-icon">→</span>
            </router-link>
            <router-link to="/loan-calculator" class="btn-secondary">贷款计算器</router-link>
          </div>
        </div>
        <div class="hero-image">
          <div class="hero-illustration">
            <div class="illustration-bg"></div>
            <div class="illustration-ring ring-1"></div>
            <div class="illustration-ring ring-2"></div>
            <div class="illustration-ring ring-3"></div>
            <div class="illustration-icon">💰</div>
            <div class="floating-icons">
              <span class="float-icon fi-1">📈</span>
              <span class="float-icon fi-2">🏦</span>
              <span class="float-icon fi-3">💼</span>
              <span class="float-icon fi-4">🤝</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f5f7fa"/>
        </svg>
      </div>
    </section>
    
    <!-- 特性展示区 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title section-title-animated" ref="featuresTitle">
          核心功能
          <span class="title-decoration"></span>
        </h2>
        <div class="features-grid">
          <div 
            class="feature-card" 
            v-for="(feature, index) in features" 
            :key="index"
            :style="{ animationDelay: `${index * 0.1}s` }"
            ref="featureCards"
          >
            <div class="feature-icon-wrapper">
              <div class="feature-icon">{{ feature.icon }}</div>
              <div class="icon-bg"></div>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
            <div class="card-shine"></div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 数据统计区 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card" v-for="(stat, index) in stats" :key="index">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-number" ref="statNumbers">
              <span class="number-value">{{ stat.displayValue }}</span>
              <span class="number-suffix">{{ stat.suffix }}</span>
            </div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 用户评价区 -->
    <section class="testimonials">
      <div class="container">
        <h2 class="section-title">
          用户评价
          <span class="title-decoration"></span>
        </h2>
        <div class="testimonials-wrapper">
          <div class="testimonials-slider" ref="slider">
            <div 
              class="testimonial-card"
              v-for="(testimonial, index) in testimonials" 
              :key="index"
              :class="{ active: currentTestimonial === index }"
            >
              <div class="quote-icon">"</div>
              <div class="testimonial-content">
                <p>{{ testimonial.content }}</p>
              </div>
              <div class="testimonial-author">
                <div class="author-avatar">{{ testimonial.avatar }}</div>
                <div class="author-info">
                  <h4>{{ testimonial.name }}</h4>
                  <p>{{ testimonial.title }}</p>
                </div>
                <div class="rating">
                  <span v-for="i in 5" :key="i">⭐</span>
                </div>
              </div>
            </div>
          </div>
          <div class="testimonial-dots">
            <button 
              v-for="(_, index) in testimonials" 
              :key="index"
              :class="{ active: currentTestimonial === index }"
              @click="currentTestimonial = index"
            ></button>
          </div>
          <button class="slider-btn prev" @click="prevTestimonial">
            <span>←</span>
          </button>
          <button class="slider-btn next" @click="nextTestimonial">
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
    
    <!-- CTA区域 -->
    <section class="cta">
      <div class="cta-bg"></div>
      <div class="container cta-content">
        <h2 class="cta-title">准备好开始您的融资之旅了吗？</h2>
        <p class="cta-subtitle">立即注册，享受AI智能顾问一对一服务，免费获取专属融资方案</p>
        <div class="cta-actions">
          <router-link to="/register" class="btn-primary btn-cta">
            <span>立即注册</span>
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <router-link to="/ai-counselor" class="btn-outline btn-cta">先咨询一下</router-link>
        </div>
        <div class="cta-stats">
          <div class="cta-stat" v-for="(stat, index) in ctaStats" :key="index">
            <div class="cta-stat-number">{{ stat.value }}</div>
            <div class="cta-stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const heroLines = ['智能融资，', '助力小微企业成长']

const features = [
  { icon: '🤖', title: 'AI智能顾问', desc: '7×24小时在线答疑，智能分析企业融资需求，提供个性化融资建议' },
  { icon: '📊', title: '贷款计算器', desc: '精准计算贷款成本，对比不同还款方式，帮您选择最优融资方案' },
  { icon: '📰', title: '政策资讯', desc: '实时更新普惠金融政策，解读最新贷款产品，把握融资机遇' },
  { icon: '🎯', title: '精准匹配', desc: '智能匹配银行产品，对接多家金融机构，提高贷款成功率' }
]

const stats = ref([
  { icon: '🏢', value: 10000, suffix: '+', displayValue: '0', label: '服务企业' },
  { icon: '💰', value: 50, suffix: '亿+', displayValue: '0', label: '融资金额' },
  { icon: '⭐', value: 98, suffix: '%', displayValue: '0', label: '满意度' },
  { icon: '🤝', value: 200, suffix: '+', displayValue: '0', label: '合作银行' }
])

const testimonials = [
  { 
    content: '融智助手帮我解决了融资难题，AI顾问非常专业，推荐的贷款方案也很适合我们企业。整体服务体验非常棒！', 
    name: '张先生', 
    title: '某科技公司 CEO',
    avatar: '张'
  },
  { 
    content: '贷款计算器很实用，帮我算清了各种费用，选择了一个最省钱的还款方式。节省了不少成本！', 
    name: '李女士', 
    title: '某贸易公司 财务总监',
    avatar: '李'
  },
  { 
    content: '政策资讯更新很及时，第一时间了解到政府的贴息贷款政策，把握住了融资机会。非常推荐！', 
    name: '王先生', 
    title: '某制造企业 总经理',
    avatar: '王'
  },
  { 
    content: 'AI顾问回答问题非常专业，比传统咨询方便多了。24小时在线随时能解决问题，太方便了！', 
    name: '赵女士', 
    title: '某餐饮连锁 创始人',
    avatar: '赵'
  }
]

const ctaStats = [
  { value: '10,000+', label: '服务企业' },
  { value: '50亿+', label: '融资金额' },
  { value: '98%', label: '满意度' }
]

const currentTestimonial = ref(0)
let testimonialTimer = null

const prevTestimonial = () => {
  currentTestimonial.value = currentTestimonial.value === 0 
    ? testimonials.length - 1 
    : currentTestimonial.value - 1
}

const nextTestimonial = () => {
  currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.length
}

// 数字滚动动画
const animateNumber = (element, target, duration = 2000, suffix = '') => {
  const start = 0
  const increment = target / (duration / 16)
  let current = start
  
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current).toLocaleString()
  }, 16)
}

// 滚动动画观察器
let scrollObserver = null

onMounted(() => {
  // 自动轮播评价
  testimonialTimer = setInterval(nextTestimonial, 5000)
  
  // 滚动动画
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
        
        // 数字动画
        if (entry.target.classList.contains('stat-card')) {
          const numberEl = entry.target.querySelector('.number-value')
          const statData = stats.value.find(s => entry.target.textContent.includes(s.label))
          if (statData && numberEl) {
            animateNumber(numberEl, statData.value, 2000, statData.suffix)
          }
        }
      }
    })
  }, { threshold: 0.2 })
  
  // 观察需要动画的元素
  document.querySelectorAll('.feature-card, .stat-card').forEach(el => {
    scrollObserver.observe(el)
  })
})

onUnmounted(() => {
  if (testimonialTimer) clearInterval(testimonialTimer)
  if (scrollObserver) scrollObserver.disconnect()
})
</script>

<style scoped>
.home {
  background: #f5f7fa;
  overflow-x: hidden;
}

/* Hero区域 */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100px 0 0;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-particles::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  top: 10%;
  left: -5%;
  animation: float 20s ease-in-out infinite;
}

.hero-particles::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  bottom: 20%;
  right: 5%;
  animation: float 15s ease-in-out infinite reverse;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
  flex: 1;
}

.hero-text {
  flex: 1;
  color: #fff;
  max-width: 600px;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
}

.title-line {
  display: block;
  animation: slideUp 0.8s ease forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-subtitle {
  font-size: 20px;
  line-height: 1.6;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
  margin-bottom: 40px;
}

@keyframes fadeIn {
  to { opacity: 0.9; }
}

.hero-actions {
  display: flex;
  gap: 20px;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
}

.btn-animated {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.btn-animated .btn-icon {
  transition: transform 0.3s ease;
}

.btn-animated:hover .btn-icon {
  transform: translateX(5px);
}

.btn-primary {
  background: #fff;
  color: #667eea;
  padding: 16px 40px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: #fff;
  padding: 16px 40px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #fff;
  transform: translateY(-3px);
}

.hero-image {
  flex: 0 0 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-illustration {
  position: relative;
  width: 350px;
  height: 350px;
}

.illustration-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

.illustration-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.ring-1 {
  width: 100%;
  height: 100%;
  animation: rotateRing 20s linear infinite;
}

.ring-2 {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  animation: rotateRing 15s linear infinite reverse;
}

.ring-3 {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  animation: rotateRing 10s linear infinite;
}

@keyframes rotateRing {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.illustration-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2));
}

@keyframes float {
  0%, 100% { transform: translate(-50%, -50%); }
  50% { transform: translate(-50%, calc(-50% - 15px)); }
}

.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
}

.float-icon {
  position: absolute;
  font-size: 30px;
  animation: floatIcon 4s ease-in-out infinite;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.15));
}

.fi-1 { top: 10%; left: 20%; animation-delay: 0s; }
.fi-2 { top: 20%; right: 15%; animation-delay: 1s; }
.fi-3 { bottom: 25%; left: 10%; animation-delay: 2s; }
.fi-4 { bottom: 15%; right: 20%; animation-delay: 3s; }

@keyframes floatIcon {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

.hero-wave {
  position: relative;
  z-index: 1;
  margin-top: auto;
}

.hero-wave svg {
  width: 100%;
  height: auto;
  display: block;
}

/* 特性展示区 */
.features {
  padding: 100px 0;
}

.section-title {
  font-size: 36px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 60px;
  color: #303133;
  position: relative;
}

.title-decoration {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.feature-card {
  background: #fff;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
}

.feature-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.15);
}

.feature-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
}

.feature-icon {
  font-size: 50px;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.feature-card:hover .icon-bg {
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #303133;
  transition: color 0.3s;
}

.feature-card:hover h3 {
  color: #667eea;
}

.feature-card p {
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 60%
  );
  transform: rotate(45deg);
  transition: transform 0.6s;
  pointer-events: none;
}

.feature-card:hover .card-shine {
  transform: rotate(45deg) translate(50%, 50%);
}

/* 数据统计区 */
.stats-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.stats-section::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  top: -200px;
  right: -100px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.stat-card {
  text-align: center;
  color: #fff;
  padding: 30px 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
}

.stat-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 16px;
  opacity: 0.9;
}

/* 用户评价区 */
.testimonials {
  padding: 100px 0;
  background: #fff;
}

.testimonials-wrapper {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 60px;
}

.testimonials-slider {
  position: relative;
  height: 300px;
}

.testimonial-card {
  position: absolute;
  width: 100%;
  opacity: 0;
  transform: translateX(100px);
  transition: all 0.5s ease;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 40px;
}

.testimonial-card.active {
  opacity: 1;
  transform: translateX(0);
}

.quote-icon {
  font-size: 80px;
  line-height: 1;
  color: #667eea;
  opacity: 0.2;
  position: absolute;
  top: 20px;
  left: 30px;
  font-family: Georgia, serif;
}

.testimonial-content {
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.testimonial-content p {
  color: #606266;
  font-size: 18px;
  line-height: 1.8;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 20px;
}

.author-info {
  flex: 1;
}

.author-info h4 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 5px;
}

.author-info p {
  font-size: 14px;
  color: #909399;
  font-style: normal;
}

.rating {
  display: flex;
  gap: 2px;
}

.rating span {
  font-size: 14px;
}

.testimonial-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
}

.testimonial-dots button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #ddd;
  cursor: pointer;
  transition: all 0.3s;
}

.testimonial-dots button.active {
  width: 30px;
  border-radius: 5px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.slider-btn.prev { left: 0; }
.slider-btn.next { right: 0; }

/* CTA区域 */
.cta {
  padding: 120px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: gradientPulse 8s ease-in-out infinite;
}

@keyframes gradientPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.cta-content {
  position: relative;
  z-index: 2;
}

.cta-title {
  font-size: 42px;
  margin-bottom: 20px;
  animation: slideUp 0.8s ease;
}

.cta-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 50px;
  animation: slideUp 0.8s ease 0.2s backwards;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 60px;
  animation: slideUp 0.8s ease 0.4s backwards;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}

.btn-cta:hover .btn-arrow {
  transform: translateX(5px);
}

.btn-outline {
  background: transparent;
  color: #fff;
  padding: 16px 40px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
}

.btn-outline:hover {
  background: #fff;
  color: #667eea;
  border-color: #fff;
}

.cta-stats {
  display: flex;
  justify-content: center;
  gap: 100px;
  animation: slideUp 0.8s ease 0.6s backwards;
}

.cta-stat {
  text-align: center;
}

.cta-stat-number {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 10px;
}

.cta-stat-label {
  font-size: 16px;
  opacity: 0.9;
}

/* 响应式 */
@media (max-width: 1200px) {
  .hero-title {
    font-size: 46px;
  }
}

@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-text {
    margin-bottom: 60px;
    max-width: 100%;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-image {
    flex: 0 0 auto;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 60px 0 0;
    min-height: auto;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-subtitle {
    font-size: 16px;
    br { display: none; }
  }
  
  .hero-image {
    display: none;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feature-card {
    padding: 30px 25px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .stat-number {
    font-size: 32px;
  }
  
  .testimonials {
    padding: 60px 0;
  }
  
  .testimonials-wrapper {
    padding: 0 20px;
  }
  
  .testimonial-card {
    padding: 30px 20px;
  }
  
  .slider-btn {
    display: none;
  }
  
  .cta {
    padding: 80px 0;
  }
  
  .cta-title {
    font-size: 28px;
  }
  
  .cta-subtitle {
    font-size: 16px;
    br { display: none; }
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-stats {
    flex-direction: column;
    gap: 30px;
  }
  
  .cta-stat-number {
    font-size: 36px;
  }
}
</style>
