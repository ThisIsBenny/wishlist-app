import { createApp } from 'vue'
import './assets/tailwind.css'

import App from './App.vue'
import router from './router'
import Modal from '@/components/Modal.vue'
import { i18n } from '@/config'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.component('modalOverlay', Modal)

app.mount('#app')
