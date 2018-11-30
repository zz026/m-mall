var express = require('express');
var mongoose = require('mongoose');

//申明一个mongoons对象
var GoodsSchema = new mongoose.Schema({
   'id': String,
   'name': String,
   'price': Number,
   'image': String,
   'num': { type: Number },
   'createtime': Number
})

module.exports = mongoose.model('Goods', GoodsSchema, 'Goods')