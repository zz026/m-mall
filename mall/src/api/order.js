import { post } from '@/utils/request';

export function orderSubmitRequest (data) {
  return post('/user/order/submit', data)
}
