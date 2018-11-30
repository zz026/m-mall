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
  const name = req.param('name')

  const params = {}
  params.price = {
    '$gte': minPrice || 0,
    '$lte': maxPrice || 10000,
  }
  params.name = {
    '$regex': name || ''
  }

  const goodsModel = Goods.find(params)
  let total = 0;
  // 保存总条数
  Goods.find(params, function (err, doc) {
    if (!err) total = doc.length
  })
  // 排序，跳过,生成
  goodsModel.sort({ 'price': sort }).skip(skip).limit(pageSize)

  goodsModel.exec(function (err, doc) {
    const findUser = utils.result(res, err)
    if (findUser === 'success') {
      utils.success(res, {
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

// 新增商品
router.post('/add', function(req, res, next) {
  const name = req.body.name
  const price = parseInt(req.body.price)
  const image = req.body.image
  if (!name) {
    return utils.fail(res, { message: '商品名称为空' })
  }
  if (!price) {
    return utils.fail(res, { message: '商品价格为空' })
  }
  if (!image) {
    return utils.fail(res, { message: '商品链接为空' })
  }
  Goods.findOne({name}, function(err, doc) {
    const findGoods = utils.result(res, err)
    if (findGoods === 'success') {
      if (doc) {
        utils.fail(res, { message: '该商品已存在！' })
      } else {
        Goods.create({
          'id': utils.createId(),
          'name': name,
          'price': price,
          'image': image,
          'createtime': Date.now()
        }, function(err2, doc2) {
          const createGood = utils.result(res, err2)
          if (createGood === 'success') {
            utils.success(res, doc2, '添加商品成功！')
          }
        })
      }
    }
  })
})

module.exports = router;
