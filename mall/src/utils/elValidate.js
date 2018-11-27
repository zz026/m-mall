/**
  element form表单验证规则
 */

// 验证账号
export const checkUserName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入账户名'))
  }
  if (!(/^[a-zA-Z][0-9a-zA-Z_]+$/.test(value))) {
    callback(new Error('开头必须是英文且仅能含有英文、数字和下划线'))
  } else if (value.length < 2 || value.length > 16) {
    callback(new Error('长度在2~16之间'))
  } else {
    callback()
  }
}

// 验证手机号
export const checkMobile = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号'))
  }
  if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {
    callback(new Error('手机格式错误'))
  } else {
    callback()
  }
}

// 验证QQ号
export const checkQQ = (rule, value, callback) => {
  if (value) {
    if (!(/^[1-9][0-9]{4,14}$/.test(value))) {
      callback(new Error('请输入正确的QQ号'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 验证密码
export const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  }
  if (!(/^(?=.*[A-Za-z])(?=.*\d)[^]{6,12}$/.test(value))) {
    callback(new Error('密码必须含有数字与字母且长度为6~12'))
  } else {
    callback()
  }
}

// 验证身份证
export const checkIdcardNo = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入身份证号码'))
  }
  if (!(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(value))) {
    callback(new Error('身份证格式错误'))
  } else {
    callback()
  }
}

// 验证价格
export const validatePrice = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入商品价格'));
  }
  if (!(/^-?\d+\.?\d{0,2}$/).test(value)) {
    callback(new Error('价格格式不正确'));
  } else {
    if (value > 10000) {
      callback(new Error('价格在1~10000之间'));
    } else {
      callback();
    }
  }
};
