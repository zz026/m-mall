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
        utils.sussess(res, {
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
  utils.sussess(res, '', '退出成功！')
})
// 检查登录
router.get('/checkLogin', function(req, res, next) {
  if (req.cookies.userId) {
    utils.sussess(res, {
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
/*
  -------------------- 用户模块 -------------------------------------------------------------
*/

/*
  -------------------- 购物车模块 -------------------------------------------------------------
*/
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
router.post('/cart/del', function(req, res, next) {
  const userId = req.cookies.userId;
  const id = req.body.id
  if (!id) {
    utils.fail(res, { message: '商品id为空' })
    return;
  }
  userModel.update({
    userId
  }, {
    '$pull': {
      'cartList': {
        'id': id
      }
    }
  }, function(err) {
    const flag = utils.result(res, err);
    if (flag === 'success') {
      utils.sussess(res, '', '删除成功')
    }
  })
})

// 购物车编辑
router.post('/cart/edit', function(req, res, next) {
  const userId = req.cookies.userId;
  const id = req.body.id;
  const num = req.body.num;
  if (!id) {
    utils.fail(res, { message: '商品id为空' })
    return;
  }
  if (!num) {
    utils.fail(res, { message: '商品数量为空' })
    return;
  }
  userModel.update(
    {
      'userId': userId,
      'cartList.id': id
    },
    {
      'cartList.$.num': num
    },
    function(err, doc) {
      const flag = utils.result(res, err)
      if (flag === 'success') {
        utils.sussess(res, doc, '更新成功')
      }
    }
  )
})

/*
  -------------------- 购物车模块 -------------------------------------------------------------
*/


/*
  -------------------- 订单模块 -------------------------------------------------------------
*/
// 提交订单
router.post('/order/submit', function(req, res, next) {
  const userId = req.cookies.userId;
  const orderList = req.body.orderList
  // 找到商品id
  const ids = orderList.map((val) => val.id)
  const GoodsModel = require('../model/goods');
  userModel.findOne({ userId }, function(err1, doc1) {
    const flag1 = utils.result(res, err1)
    if (flag1 === 'success') {
      // 找到用户后，找商品
      GoodsModel.find({
        id: {
          '$in': ids
        }
      }, function(err2, doc2) {
        const flag = utils.result(res, err2)
        if (flag === 'success') {
          // 如果存在商品 计算总价
          if (doc2.length) {
            let totalPrice = 0
            doc2.forEach(val1 => {
              orderList.forEach((val2) => {
                if (val1.id === val2.id) {
                  totalPrice += val1.price * val2.num
                  val1.num = val2.num
                }
              })
            })
            const order = {
              orderId: utils.createId('order'), 
              totalprice: totalPrice.toFixed(2),
              createtime: Date.now(),
              addressInfo: {
                name: '我我',
                phone: 13800138000
              },
              goodsList: doc2
            }
            doc1.orderList.push(order)
            // 删除购物车
            doc1.cartList.forEach((val, index) => {
              if (ids.includes(val.id)) {
                doc1.cartList.splice(val, 1)
              }
            })
            doc1.save();
            utils.sussess(res, { orderId: order.orderId }, '订单创建成功!')
          } else {
            utils.fail(res, { message: '商品不存在' })
          }
        }
      })
    }
  })
})

module.exports = router;
