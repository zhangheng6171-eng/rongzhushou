import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import router from './router'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)

// 使用Pinia进行状态管理
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 使用Element Plus
app.use(ElementPlus, { locale: zhCn })

// 初始化应用设置
import { useAppStore } from './stores/app'
const appStore = useAppStore()
appStore.initAppSettings()

app.mount('#app')
