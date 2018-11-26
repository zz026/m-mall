import { get, post } from '@/utils/request';

export function queryGoodsListRequest (data) {
  return get('/goods/list', data)
}

export function addCartRequest (data) {
  return post('/goods/addCart', data)
}

export function getCartRequest (data) {
  return get('/user/cart', data)
}

// 购物车删除
export function delCartRequest (data) {
  return post('/user/cart/del', data)
}

// 购物车编辑
export function editCartRequest (data) {
  return post('/user/cart/edit', data)
}
