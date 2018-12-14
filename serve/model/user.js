const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  'userId': String,
  'userName': String,
  'realName': String,
  'password': String,
  'gender': Number,
  'headImg': String,
  'createtime': Number,
  'cartList': [{
    'id': String,
    'name': String,
    'image': String,
    'price': Number,
    'num': Number
  }],
  'addressList': Array,
  'orderList': [{
    'id': String,
    'totalprice': Number,
    'createtime': Number,
    'status': Number,
    'addressInfo': {
      'name': String,
      'phone': String,
      'province': String,
      'city': String,
      'area': String,
      'address': String
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