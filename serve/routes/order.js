var express = require('express');
var router = express.Router();
const utils = require('../utils/index');
const userModel = require('../model/user')

/* -------------------- 订单模块 ------------------------------------------------------------- */
// 提交订单
router.post('/submit', function(req, res, next) {
  const userId = req.cookies.userId;
  const { orderList, name, phone, province, city, area, address } = req.body
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
              id: utils.createId('order'), 
              totalprice: totalPrice.toFixed(2),
              createtime: Date.now(),
              status: 1, // 状态 1待支付 2 支付成功 3支付超时 4 取消订单
              addressInfo: {
                name, phone, province, city, area, address
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
            utils.success(res, { orderId: order.id }, '订单创建成功!')
          } else {
            utils.fail(res, { message: '商品不存在' })
          }
        }
      })
    }
  })
})

// 订单列表
router.get('/list', function(req, res, next) {
  const userId = req.cookies.userId;
  userModel.findOne({ userId }, function(err, doc) {
    const flag = utils.result(res, err);
    if (flag === 'success') {
      utils.success(res, {
        list: doc.orderList
      })
    }
  })
})

module.exports = router;
