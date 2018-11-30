var express = require('express');
var router = express.Router();
const utils = require('../utils/index');
const userModel = require('../model/user')

/*
  -------------------- 用户模块 -------------------------------------------------------------
*/
// 登录
router.post('/login', function(req, res, next) {
  const userName = req.body.userName;
  const userPwd = req.body.userPwd;
  const params = {
    userName,
    userPwd,
  }
  userModel.findOne(params, function(err, doc) {
    const findUser = utils.result(res, err)
    if (findUser === 'success') {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        utils.success(res, {
          userName: doc.userName,
        }, '登录成功')
      } else {
        utils.fail(res, { message: '账号或密码错误!!' }, '')
      }
    }
  })
});
// 退出登录
router.post('/logout', function(req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  })
  utils.success(res, '', '退出成功！')
})
// 检查登录
router.get('/checkLogin', function(req, res, next) {
  if (req.cookies.userId) {
    utils.success(res, {
      userName: req.cookies.userName
    })
  } else {
    res.json({
      code: 20,
      msg: '请先登录',
      data: ''
    })
  }
})

module.exports = router;
