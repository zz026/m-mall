const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  'userId': String,
  'userName': String,
  'userPwd': String,
  'cartList': [{
    'id': String,
    'name': String,
    'image': String,
    'price': Number,
    'num': Number
  }],
  'addressList': Array,
  'orderList': [{
    'totalprice': Number,
    'createtime': Number,
    'addressInfo': {
      'name': String,
      'phone': String,
      'sheng': String,
      'shi': String,
      'qu': String,
    },
    'goodsList': [
      {
        'id': String,
        'name': String,
        'image': String,
        'price': Number,
        'num': Number
      }
    ]
  }],
})

module.exports = mongoose.model('User', UserSchema, 'User')