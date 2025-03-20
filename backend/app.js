const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const cron = require('node-cron');
require('./scheduler/annualLeave');

app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../frontend/src/img')));
app.use(express.static(path.join(__dirname, '../frontend/src/img/icon')));
app.use(express.static(path.join(__dirname, '../frontend/src')));
app.use(express.static(path.join(__dirname, '../frontend/src/file')));
app.use(express.static(path.join(__dirname, "../frontend/node_modules/preline/dist")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", [
    path.join(__dirname, "../frontend/Views/Pimpinan"),
    path.join(__dirname, "../frontend/Views/Pegawai"),
    path.join(__dirname, "../frontend/Views/user"),
    path.join(__dirname, "../frontend/Views/ktu"),
    path.join(__dirname, "../frontend/Views"),
]);

app.get('/landing', (req, res) => {
  res.render('landing_page');
});

const authRouter = require("./routes/authRoutes.js");
const usersRouter = require('./routes/usersRoutes.js');
const ktuRouter = require('./routes/ktuRoutes.js');
const pimpinanRouter = require('./routes/pimpinanRoutes.js');


app.use("/auth", authRouter);
app.use('/', usersRouter);
app.use('/ktu', ktuRouter);
app.use('/pimpinan', pimpinanRouter);

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

app.get("*", (req, res) => {
  res.render("error");
});

module.exports = app;
