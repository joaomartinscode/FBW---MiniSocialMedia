require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/authRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const friendRoutes = require('./routes/friendsRoutes');
const likesRoutes = require('./routes/likesRoutes');
const postRoutes = require('./routes/postsRoutes');
const userRoutes = require('./routes/usersRoutes');

app.use(logger('dev'));

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  res.json({
    message: err.message,
    error: res.locals.error
  });
});

module.exports = app;