import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '融智助手 - 小微企业融资智能平台' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录 - 融智助手', guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册 - 融智助手', guest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '用户中心 - 融智助手', requiresAuth: true }
  },
  {
    path: '/ai-counselor',
    name: 'AICounselor',
    component: () => import('../views/AICounselor.vue'),
    meta: { title: 'AI顾问 - 融智助手' }
  },
  {
    path: '/loan-calculator',
    name: 'LoanCalculator',
    component: () => import('../views/LoanCalculator.vue'),
    meta: { title: '贷款计算器 - 融智助手' }
  },
  {
    path: '/membership',
    name: 'Membership',
    component: () => import('../views/Membership.vue'),
    meta: { title: '会员服务 - 融智助手' }
  },
  {
    path: '/articles',
    name: 'ArticleList',
    component: () => import('../views/ArticleList.vue'),
    meta: { title: '资讯中心 - 融智助手' }
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetail.vue'),
    meta: { title: '文章详情 - 融智助手' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin/index.vue'),
    meta: { title: '管理后台 - 融智助手', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '页面未找到 - 融智助手' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '融智助手'
  
  const userStore = useUserStore()
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // 已登录用户不能访问的页面
  if (to.meta.guest && userStore.isLoggedIn) {
    next('/dashboard')
    return
  }
  
  // 需要管理员权限的页面
  if (to.meta.requiresAdmin && !userStore.userInfo?.isAdmin) {
    next('/')
    return
  }
  
  next()
})

// 路由后置钩子 - 滚动到顶部
router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
