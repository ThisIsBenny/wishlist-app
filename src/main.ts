import { createApp } from 'vue'
import Toast from 'vue-toastification'
import './assets/tailwind.css'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import Modal from '@/components/Modal.vue'
import { i18n } from '@/config'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(Toast, {})
app.component('modalOverlay', Modal)

app.mount('#app')
