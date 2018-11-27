const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  'userId': String,
  'userName': String,
  'userPwd': String,
  'orderList': Array,
  'cartList': [{
    'name': String,
    'image': String,
    'price': Number,
    'num': Number
  }],
  'addressList': Array
})

module.exports = mongoose.model('User', UserSchema, 'User')