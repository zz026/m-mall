const md5 =  require('js-md5');
module.exports = {
  result: function(res, err, data = '') {
    if (err) {
      this.fail(res, err)
      return 'error'
    } else {
      return 'success'
    }
  },
  success: function(res, data = '', msg = '请求成功！') {
    return res.json({
      code: 0,
      msg,
      data
    })
  },
  fail: function(res, err, data = '') {
    return res.json({
      code: 1,
      msg: err.message,
      data
    })
  },
  createId: function(orderTitle = '0923') {
    let id = Date.now() + Math.floor(Math.random() * 1000)
    // id = md5(id.toString())
    return orderTitle + id
  }
}