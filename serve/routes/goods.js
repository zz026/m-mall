const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Goods = require('../model/goods');
const utils = require('../utils/index');

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

// 查询列表
router.get('/list', function (req, res, next) {
  const sort = req.param('sort')
  const pageIndex = parseInt(req.param('pageIndex'))
  const pageSize = parseInt(req.param('pageSize'))
  const skip = (pageIndex - 1) * pageSize
  const minPrice = parseInt(req.param('minPrice'))
  const maxPrice = parseInt(req.param('maxPrice'))
  const productName = (req.param('productName'))

  const params = {}
  params.salePrice = {
    '$gte': minPrice || 0,
    '$lte': maxPrice || 10000,
  }
  params.productName = {
    $regex: productName || ''
  }

  const goodsModel = Goods.find(params)
  let total = 0;
  // 保存总条数
  Goods.find(params, function (err, doc) {
    if (!err) total = doc.length
  })
  // 排序，跳过,生成
  goodsModel.sort({ 'salePrice': sort }).skip(skip).limit(pageSize)

  goodsModel.exec(function (err, doc) {
    const findUser = utils.result(res, err)
    if (findUser === 'success') {
      utils.sussess(res, {
        pageConfig: {
            total,
            pageSize,
            pageIndex
          },
        list: doc
      })
    }
  })
});

// 添加购物车
router.post('/addCart', function (req, res, next) {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  const UserModel = require('../model/user');
  UserModel.findOne({ userId }, function (err, userInfoDoc) {
    const findUser = utils.result(res, err)
    if (findUser === 'success') {
      Goods.findOne({ productId }, function(err2, goodInfoDoc) {
        const findGood = utils.result(res, err2)
        if (findGood === 'success') {
          if (userInfoDoc.cartList.length) {
            const goodIndex = userInfoDoc.cartList.findIndex(val => {
              return val.productId === productId
            })
            console.log('goodIndex', goodIndex)
            if (goodIndex !== -1) {
              userInfoDoc.cartList[goodIndex].productNum++
            } else {
              console.log('goodInfoDoc', goodInfoDoc)
              userInfoDoc.cartList.push({
                productId: goodInfoDoc.productId,
                productName: goodInfoDoc.productName,
                productImage: goodInfoDoc.productImage,
                salePrice: goodInfoDoc.salePrice,
                productNum: 1,
                isChecked: 1
              })
            }
          } else {
            userInfoDoc.cartList.push({
              productId: goodInfoDoc.productId,
              productName: goodInfoDoc.productName,
              productImage: goodInfoDoc.productImage,
              salePrice: goodInfoDoc.salePrice,
              productNum: 1,
              isChecked: 1
            })
          }
          userInfoDoc.save()
          utils.sussess(res)
        }
      })
    }
  })
})

module.exports = router;
