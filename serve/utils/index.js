module.exports = {
  result: function(res, err, data = '') {
    if (err) {
      this.fail(res, err)
      return 'error'
    } else {
      return 'success'
    }
  },
  sussess: function(res, data = '') {
    return res.json({
      code: 0,
      msg: '请求成功！',
      data
    })
  },
  fail: function(res, err, data = '') {
    return res.json({
      code: 1,
      msg: err.message,
      data
    })
  }
}