import { get, post } from '@/utils/request';

export function orderSubmitRequest (data) {
  return post('/order/submit', data)
}

export function getOrderListRequest (data) {
  return get('/order/list', data)
}

export function changeOrderStatusRequest (data) {
  return post('/order/status', data)
}

export function removeOrderRequest (data) {
  return post('/order/remove', data)
}
