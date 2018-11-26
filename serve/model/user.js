const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  'userId': String,
  'userName': String,
  'userPwd': String,
  'orderList': Array,
  'cartList': [{
    'productId': String,
    'productName': String,
    'productImage': String,
    'salePrice': Number,
    'productNum': Number,
    'isChecked': Number
  }],
  'addressList': Array
})

module.exports = mongoose.model('User', UserSchema, 'User')