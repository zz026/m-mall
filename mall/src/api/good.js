import { get, post } from '@/utils/request';

export function queryGoodsListRequest (data) {
  return get('/goods/list', data)
}

export function addCartRequest (data) {
  return post('/goods/addCart', data)
}

export function getCartRequest (data) {
  return get('/user/cart')
}

export function delCartRequest (data) {
  return get('/user/delcart')
}
