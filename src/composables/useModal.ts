import { reactive } from 'vue'

let _resolve: (confirmed: boolean) => void

const callback = (confirmed: boolean) => {
  data.isShown = false
  _resolve(confirmed)
}

const show = (title: string, text = '') => {
  data.title = title
  data.text = text
  data.isShown = true
  return new Promise((resolve) => {
    _resolve = resolve
  })
}

const data = reactive({
  isShown: false,
  show,
  title: '',
  text: '',
  confirmText: 'Ja',
  confirm: () => callback(true),
  cancelText: 'Nein',
  cancel: () => callback(false),
})

export const useModal = () => {
  return data
}
