var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 白名单
var whiteList = require('./utils/whiteList')

// 路由
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var goodsRouter = require('./routes/goods');
var cartRouter = require('./routes/cart');
var orderRouter = require('./routes/order');
// var cors = require('cors');

var app = express();
// app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 全局路由拦截
app.use(function(req, res, next) {
  if (req.cookies.userId) {
    next()
  } else {
    if (whiteList.originalUrl.includes(req.originalUrl) || whiteList.path.includes(req.path)) {
      next()
    } else {
      res.json({
        code: 1001,
        msg: '请先登录',
        data: ''
      })
    }
  //   console.log(3123123)
  }
})

const baseUrl = '/api'
app.use('/', indexRouter);
app.use(baseUrl + '/user', userRouter);
app.use(baseUrl + '/goods', goodsRouter);
app.use(baseUrl + '/cart', cartRouter);
app.use(baseUrl + '/order', orderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
