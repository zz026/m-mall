import axios from 'axios'
// import Qs from 'qs'
import { Message } from 'element-ui'
// import router from '../router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5 * 60 * 1000, // 请求超时时间
  withCredentials: true,
  // // 用于get
  // paramsSerializer: function (params) {
  //   return Qs.stringify(params)
  // },
  // // 用于post, 使用则：form data,不使用则request payload
  // transformRequest: [function (data) {
  //   return Qs.stringify(data)
  // }]
})

// 添加请求拦截器
service.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  return config
}, error => {
  // 对请求错误做些什么
  console.log(error) // for debug
  Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(
  // 对响应数据做点什么
  response => {
    if (response.data.code !== 0) {
      if (response.data.code === 20) {
        // router.push({path: '/login'})
        // Message({
        //   message: '请先登录',
        //   type: 'warning'
        // })
      }
    }
    return response.data
  },
  error => {
    // 对响应错误做点什么
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default service
