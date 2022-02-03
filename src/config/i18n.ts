import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US.json'
import deDE from './locales/de-DE.json'

export default createI18n({
  legacy: false,
  locale: navigator.language || 'en',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    en: enUS,
    'de-DE': deDE,
    de: deDE,
  },
})
