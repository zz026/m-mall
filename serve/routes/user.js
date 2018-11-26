var express = require('express');
var router = express.Router();
const utils = require('../utils/index');
const userModel = require('../model/user')

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
        utils.sussess(res, {
          userName: doc.userName,
        }, '登录成功')
      } else {
        utils.fail(res, { message: '账号或密码错误!!' })
      }
    }
  })
});

router.post('/logout', function(req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    code: 0,
    msg: '退出成功！',
    data: ''
  })
})

router.get('/checkLogin', function(req, res, next) {
  if (req.cookies.userId) {
    res.json({
      code: 0,
      msg: '',
      data: {
        userName: req.cookies.userName
      }
    })
  } else {
    res.json({
      code: 20,
      msg: '请先登录',
      data: ''
    })
  }
})

// 查看购物车
router.get('/cart', function(req, res, next) {
  const userId = req.cookies.userId;
  userModel.findOne({ userId }, function(err, doc) {
    const findUser = utils.result(res, err);
    if (findUser === 'success') {
      utils.sussess(res, {
        list: doc.cartList
      })
    }
  })
})

// 购物车删除
router.post('/delcart', function(req, res, next) {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  userModel.update({
    userId
  }, {
    '$pull': {
      'cartList': {
        'productId': productId
      }
    }
  }, function (err, doc) {
    const flag = utils.result(res, err);
    if (flag === 'success') {
      utils.sussess(res, '', '删除成功！')
    }
  })
})
module.exports = router;
