import { get, post } from '@/utils/request';

// 获取商品列表
export function queryGoodsListRequest (data) {
  return get('/goods/list', data)
}

// 增加商品
export function addGoodRequest (data) {
  return post('/goods/add', data)
}

// 添加购物车
export function addCartRequest (data) {
  return post('/goods/addCart', data)
}

// 获取购物车列表
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
