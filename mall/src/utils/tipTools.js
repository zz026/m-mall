import { Message, MessageBox, Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

export function elMessage(message = '操作成功', type = 'success', duration = 2000) {
  Message({
    message,
    type,
    duration
  })
}

export function elConfirm(message = '操作成功', title = '提示', confirmButtonText = '确定') {
  return new Promise((resolve) => {
    MessageBox.confirm(message, title, {
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      confirmButtonText,
      type: 'warning'
    }).then(() => {
      resolve(true);
    }).catch(() => {})
  })
}

export function elAlert(message, title = '提示') {
  MessageBox.alert(message, title, {
    dangerouslyUseHTMLString: true
  }).then().catch(() => {});
}

// 封装loading
export function elLoading(text = '提交中，请稍候……') {
  return Loading.service({
    lock: true,
    text,
    spinner: 'el-icon-loading',
    background: 'rgba(256, 256, 256, 0.7)'
  });
}
