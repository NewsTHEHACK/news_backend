let {buildDB} =  require("./utils/MongoDB");
let bodyParser = require('body-parser');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let newsRouter = require('./routes/news');

const nameArray = ["lqy", "lwh", "zyf", "wds"];

var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


buildDB();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/news', newsRouter);

let users = [];

app.get("/chat", (req, res) => {
    res.sendFile(__dirname + '/chat.index')
});

io.on('connection', (socket) => {
    let username = nameArray[Math.ceil(Math.random()*4)];
    socket.on('join', (data) => {
        users.push({username:username});
        data.username = username;
        socket.emit('joinSuccess', data);

        io.sockets.emit('add', data)

    });

    socket.on('disconnect', () => {
        users.map((val, index) => {
            if (val.username === username) {
                users.splice(index, 1)
            }
        })
    });

    socket.on('sendMessage', (data) => {
        io.sockets.emit('receiveMessage', data)
    });


});

app.post('/test', (req, res) => {
  console.log(req.body)
});

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
