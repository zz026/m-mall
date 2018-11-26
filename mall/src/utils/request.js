import fetch from '@/utils/fetch';
import { elMessage } from './tipTools';

function request(method, url, params) {
  return new Promise((resolve, reject) => {
    const requestConfig = {
      url: `/api${url}`,
      method,
      ...params
    };
    fetch(requestConfig).then(res => {
      if (res.code === 0) {
        resolve(res.data ? res.data : res);
      } else {
        // 如果存在非0code，返回一个对象errCode
        resolve({ errCodeTip: res.code, data: res });
        if (res.code === 20) return // 检查登录，不需弹框
        elMessage(res.msg, 'error');
      }
    }).catch((err) => {
      reject(err);
    })
  })
};

export function get(url, params) {
  return request('GET', url, { params });
}
export function post(url, data) {
  return request('POST', url, { data });
}
