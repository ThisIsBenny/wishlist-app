/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASEURL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
