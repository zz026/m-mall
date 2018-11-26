var express = require('express');
var mongoose = require('mongoose');

//申明一个mongoons对象
var GoodsSchema = new mongoose.Schema({
   'productId': String,
   'productName': String,
   'salePrice': Number,
   'productImage': String
})

module.exports = mongoose.model('Good', GoodsSchema, 'Goods')