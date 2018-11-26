// 格式化时间
/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
export function parseTime (date, fmt) {
  date = date === undefined ? new Date() : date
  date = typeof date === 'number' ? new Date(date) : date
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
  const obj =
    {
      'y': date.getFullYear(), // 年份，注意必须用getFullYear
      'M': date.getMonth() + 1, // 月份，注意是从0-11
      'd': date.getDate(), // 日期
      'q': Math.floor((date.getMonth() + 3) / 3), // 季度
      'w': date.getDay(), // 星期，注意是0-6
      'H': date.getHours(), // 24小时制
      'h': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
      'm': date.getMinutes(), // 分钟
      's': date.getSeconds(), // 秒
      'S': date.getMilliseconds() // 毫秒
    }
  const week = ['天', '一', '二', '三', '四', '五', '六']
  for (const i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
      let val = obj[i] + ''
      if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val]
      for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
      return m.length === 1 ? val : val.substring(val.length - m.length)
    })
  }
  return fmt
}

export function formatTime (time) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
}

// 深拷贝
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

// 本地存储
export const localStore = {
  get: function (key) {
    let value = ''
    try {
      value = localStorage.getItem(key)
      return value
    } catch (ex) {
      if (process.env.NODE_ENV === 'development') {
        console.log('error:找不到' + key + '的值')
      }
    }
  },
  set: function (key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (ex) {
      if (process.env.NODE_ENV === 'development') {
        console.log('设置失败')
      }
    }
  }
}

// 获取url参数
export function getUrlParams () {
  const url = decodeURI(window.location.href)
  const obj = {}
  if (url.indexOf('?') !== -1) {
    const str = url.substr(url.indexOf('?') + 1)
    const arr = str.split('&')
    arr.forEach((value, index) => {
      obj[value.split('=')[0]] = unescape(value.split('=')[1])
    })
  }
  return obj
}

// 异步加载模块
export function asyncImport (file) {
  return () => import('@/views/' + file + '.vue')
}

export function isSame (a, b) {
  if (a.length !== b.length) return false
  let c = b.slice()
  // 在可以提前退出的情况下不要使用forEach
  for (let i = 0, len = a.length; i < len; i++) {
    let j = c.indexOf(a[i])
    if (j === -1) return false
    c.splice(j, 1) // 删除已经匹配的元素，可以缩短下次匹配的时间
  }
  return true
}
