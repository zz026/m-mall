var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const utils = require('../utils/index');
const userModel = require('../model/user')

mongoose.connect('mongodb://127.0.0.1:27017/mall')

mongoose.connection.on('connected', function () {
  console.log('MongoDB connected success!')
})
mongoose.connection.on('error', function () {
  console.log('MongoDB connected fail!')
})
mongoose.connection.on('disconnected', function () {
  console.log('MongoDB connected disconnected!')
})

/*
  -------------------- 用户模块 -------------------------------------------------------------
*/
// 登录
router.post('/login', function(req, res, next) {
  const userName = req.body.userName;
  const password = req.body.password;
  const params = {
    userName,
    password,
  }
  userModel.findOne(params, function(err, doc) {
    const findUser = utils.result(res, err)
    if (findUser === 'success') {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('realName', doc.realName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        utils.success(res, {
          realName: doc.realName,
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
  res.cookie('realName', '', {
    path: '/',
    maxAge: -1
  })
  utils.success(res, '', '退出成功！')
})

// 检查登录
router.get('/checkLogin', function(req, res, next) {
  if (req.cookies.userId) {
    utils.success(res, {
      realName: req.cookies.realName
    })
  } else {
    res.json({
      code: 20,
      msg: '请先登录',
      data: ''
    })
  }
})

router.post('/register', function(req, res, next) {
  const { userName, realName, password, gender, headImg} = req.body;
  // 查找账户名
  userModel.findOne({ 
    userName
  }, function(err, doc) {
    const findUserName = utils.result(res, err)
    if (findUserName === 'success') {
      if (doc) {
        utils.fail(res, { message: '账号名已存在!!' }, '')
      } else {
        // 查找昵称
        userModel.findOne({ 
          realName
        }, function(err2, doc2) {
          const findRealName = utils.result(res, err2)
          if (findRealName === 'success') {
            if (doc2) {
              utils.fail(res, { message: '用户名已存在!!' }, '')
            } else {
              // 账户名且用户名不存在，可以注册
              const userId = utils.createId()
              userModel.create({
                'userId': utils.createId(),
                'userName': userName,
                'realName': realName,
                'password': password,
                'gender': gender,
                'headImg': headImg,
                'createtime': Date.now(),
              }, function(err3, newUserDoc) {
                const createUser = utils.result(res, err3)
                if (createUser === 'success') {
                  utils.success(res, {
                    userId: userId,
                    userName: userName,
                    realName: realName
                  }, '注册成功！')
                }
              })
            }
          }
        })
      }
    }
  })
})
module.exports = router;
