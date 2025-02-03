const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../frontend/src/img')));
app.use(express.static(path.join(__dirname, "/node_modules/preline/dist")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", [
    path.join(__dirname, "../frontend/Views/Pimpinan"),
    path.join(__dirname, "../frontend/Views/user"),
    path.join(__dirname, "../frontend/Views"),
]);


const usersRouter = require('./routes/usersRoutes.js');
const authRouter = require("./routes/authRoutes.js");


app.use("/auth", authRouter);
app.use('/', usersRouter);

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
