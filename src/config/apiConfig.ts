interface apiConfig {
  baseURL: string
}

export default <apiConfig>{
  baseURL: import.meta.env.VITE_API_BASEURL || '/api',
}
