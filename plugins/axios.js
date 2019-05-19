import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.baseUrl,
  timeout: 1000,
  headers: {}
})

export default instance
