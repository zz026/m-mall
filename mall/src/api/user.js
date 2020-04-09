import { get, post } from '@/utils/request';

// 登录
export function loginRequest (data) {
  return post('/user/login', data)
}

// 登出
export function logoutRequest (data) {
  return post('/user/logout', data)
}

// 检查登录状态
export function checkLoginRequest (data) {
  return get('/user/checkLogin', data)
}

// 注册
export function registerRequest (data) {
  return post('/user/register', data)
}

// 发送sms
export function sendSmsRequest (data) {
  return post('/user/sms', data)
}
