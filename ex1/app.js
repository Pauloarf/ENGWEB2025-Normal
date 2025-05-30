var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morganLogger = require('morgan');
var mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var edicoesRouter = require('./routes/edicoes');
var paisesRouter = require('./routes/paises');
var interpretesRouter = require('./routes/interpretes');
let logger = require('./common/logger')

// Mongoose Initializer
var mongoDB = 'mongodb://localhost:27017/eurovisao'
mongoose.connect(mongoDB)
var connection = mongoose.connection
connection.on('error', console.error.bind(console, 'Erro na conexão ao MongoDB'))
connection.once('open', () =>  logger.success('Conexão ao MongoDB realizada com sucesso'))


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morganLogger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/edicoes', edicoesRouter);
app.use('/interpretes', interpretesRouter);
app.use('/paises', paisesRouter);

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
