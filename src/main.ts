import { createApp } from 'vue'
import './assets/tailwind.css'

import App from './App.vue'
import router from './router'
import Modal from '@/components/Modal.vue'

const app = createApp(App)

app.use(router)
app.component('modalOverlay', Modal)

app.mount('#app')
