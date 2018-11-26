import { get, post } from '@/utils/request';

export function loginRequest (data) {
  return post('/user/login', data)
}

export function logoutRequest (data) {
  return post('/user/logout', data)
}

export function checkLoginRequest (data) {
  return get('/user/checkLogin', data)
}
