import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')

const api = axios.create({ baseURL })

export default api
