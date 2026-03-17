<template>
  <footer class="footer">
    <div class="footer-wave">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#2c3e50"/>
      </svg>
    </div>
    <div class="container">
      <div class="footer-content">
        <!-- 品牌区域 -->
        <div class="footer-brand">
          <div class="brand-logo">
            <span class="logo-icon">融</span>
            <span class="logo-text">融智助手</span>
          </div>
          <p class="brand-desc">
            专注小微企业融资服务，<br>用AI技术助力企业成长
          </p>
          <div class="social-links">
            <a href="#" class="social-btn" title="微信公众号">
              <span>💬</span>
            </a>
            <a href="#" class="social-btn" title="微博">
              <span>📱</span>
            </a>
            <a href="#" class="social-btn" title="联系我们">
              <span>📧</span>
            </a>
          </div>
        </div>
        
        <!-- 链接区域 -->
        <div class="footer-links">
          <div class="link-group">
            <h4>关于我们</h4>
            <ul>
              <li><a href="#">公司介绍</a></li>
              <li><a href="#">团队成员</a></li>
              <li><a href="#">加入我们</a></li>
              <li><a href="#">联系我们</a></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h4>核心服务</h4>
            <ul>
              <li><router-link to="/ai-counselor">AI智能顾问</router-link></li>
              <li><router-link to="/loan-calculator">贷款计算器</router-link></li>
              <li><router-link to="/membership">会员服务</router-link></li>
              <li><router-link to="/articles">政策资讯</router-link></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h4>帮助中心</h4>
            <ul>
              <li><a href="#">常见问题</a></li>
              <li><a href="#">使用指南</a></li>
              <li><a href="#">隐私政策</a></li>
              <li><a href="#">服务协议</a></li>
            </ul>
          </div>
          
          <div class="link-group contact-group">
            <h4>联系我们</h4>
            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <div>
                  <p class="contact-label">客服热线</p>
                  <p class="contact-value">400-888-8888</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">🕐</span>
                <div>
                  <p class="contact-label">工作时间</p>
                  <p class="contact-value">9:00 - 21:00</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <div>
                  <p class="contact-label">商务合作</p>
                  <p class="contact-value">business@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="bottom-content">
          <p class="copyright">
            &copy; 2025 融智助手. All rights reserved.
          </p>
          <div class="bottom-links">
            <a href="#">京ICP备XXXXXXXX号</a>
            <span class="divider">|</span>
            <a href="#">京公网安备XXXXXXXX号</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: #1a1a2e;
  color: #fff;
  padding-top: 80px;
  margin-top: auto;
  position: relative;
}

.footer-wave {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transform: translateY(-99%);
  line-height: 0;
}

.footer-wave svg {
  display: block;
  width: 100%;
  height: auto;
}

.container {
  position: relative;
  z-index: 1;
}

.footer-content {
  display: flex;
  gap: 60px;
  padding-bottom: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 品牌区域 */
.footer-brand {
  flex: 0 0 280px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: bold;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.brand-desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 25px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-btn {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 20px;
}

.social-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

/* 链接区域 */
.footer-links {
  flex: 1;
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.link-group {
  flex: 1;
  min-width: 140px;
}

.link-group h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
  position: relative;
}

.link-group h4::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 30px;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.link-group ul {
  list-style: none;
}

.link-group ul li {
  margin-bottom: 12px;
}

.link-group a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-block;
}

.link-group a:hover {
  color: #667eea;
  transform: translateX(5px);
}

.link-group a::before {
  content: '›';
  margin-right: 8px;
  opacity: 0;
  transition: all 0.3s ease;
}

.link-group a:hover::before {
  opacity: 1;
  margin-right: 5px;
}

/* 联系区域 */
.contact-group {
  flex: 0 0 240px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.contact-icon {
  font-size: 20px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  margin-bottom: 3px;
}

.contact-value {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
}

/* 底部 */
.footer-bottom {
  padding: 25px 0;
}

.bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

.bottom-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bottom-links a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.3s ease;
}

.bottom-links a:hover {
  color: #667eea;
}

.bottom-links .divider {
  color: rgba(255, 255, 255, 0.3);
}

/* 响应式 */
@media (max-width: 1024px) {
  .footer-content {
    flex-direction: column;
    gap: 40px;
  }
  
  .footer-brand {
    flex: none;
    text-align: center;
  }
  
  .brand-logo {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-links {
    flex-wrap: wrap;
  }
  
  .link-group {
    flex: 1 1 calc(50% - 20px);
    min-width: 150px;
  }
  
  .contact-group {
    flex: 1 1 100%;
  }
}

@media (max-width: 768px) {
  .footer {
    padding-top: 60px;
  }
  
  .footer-content {
    gap: 30px;
  }
  
  .link-group {
    flex: 1 1 100%;
    text-align: center;
  }
  
  .link-group h4::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .link-group a:hover {
    transform: none;
  }
  
  .link-group a::before {
    display: none;
  }
  
  .contact-group {
    text-align: center;
  }
  
  .contact-item {
    justify-content: center;
  }
  
  .bottom-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>
