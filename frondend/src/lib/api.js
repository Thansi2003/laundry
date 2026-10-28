import axios from 'axios'
import { getSavedToken } from './session'

const baseURL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
	const token = getSavedToken()
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

export default api
