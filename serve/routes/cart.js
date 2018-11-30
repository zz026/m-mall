var express = require('express');
var router = express.Router();
const utils = require('../utils/index');
const userModel = require('../model/user')
const GoodsModel = require('../model/goods');

/*
  -------------------- 购物车模块 -------------------------------------------------------------
*/

// 添加购物车
router.post('/add', function (req, res, next) {
  const userId = req.cookies.userId;
  const id = req.body.id;
  userModel.findOne({ userId }, function (err, userInfoDoc) {
    const findUser = utils.result(res, err)
    if (findUser === 'success') {
      GoodsModel.findOne({ id }, function(err2, goodInfoDoc) {
        const findGood = utils.result(res, err2)
        if (findGood === 'success') {
          if (userInfoDoc.cartList.length) {
            const goodIndex = userInfoDoc.cartList.findIndex(val => {
              return val.id === id
            })
            if (goodIndex !== -1) {
              userInfoDoc.cartList[goodIndex].num++
            } else {
              userInfoDoc.cartList.push({
                id: goodInfoDoc.id,
                name: goodInfoDoc.name,
                image: goodInfoDoc.image,
                price: goodInfoDoc.price,
                num: 1,
              })
            }
          } else {
            userInfoDoc.cartList.push({
              id: goodInfoDoc.id,
              name: goodInfoDoc.name,
              image: goodInfoDoc.image,
              price: goodInfoDoc.price,
              num: 1,
            })
          }
          userInfoDoc.save()
          utils.success(res)
        }
      })
    }
  })
})

// 查看购物车
router.get('/list', function(req, res, next) {
  const userId = req.cookies.userId;
  userModel.findOne({ userId }, function(err, doc) {
    const findUser = utils.result(res, err);
    if (findUser === 'success') {
      utils.success(res, {
        list: doc.cartList
      })
    }
  })
})

// 购物车删除
router.post('/del', function(req, res, next) {
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
      utils.success(res, '', '删除成功')
    }
  })
})

// 购物车编辑
router.post('/edit', function(req, res, next) {
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
        utils.success(res, doc, '更新成功')
      }
    }
  )
})

module.exports = router;
