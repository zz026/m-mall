var express = require('express');
var mongoose = require('mongoose');

//申明一个mongoons对象
var GoodsSchema = new mongoose.Schema({
   'name': String,
   'price': Number,
   'image': String,
   'num': { type: Number }
})

module.exports = mongoose.model('Good', GoodsSchema, 'Goods')