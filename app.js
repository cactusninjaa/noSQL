import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import indexRouter from './routes/index.js';
import pokemonRouter from './routes/pokemons.js';
import trainerRouter from './routes/trainer.js';
import booksRouter from './routes/books.js';
import bookStatsRouter from './routes/bookStats.js';
import usersRouter from './routes/users.js';
import loansRouter from './routes/loans.js';

dotenv.config();
connectDB();

const app = express();

app.use(logger('dev'));
app.use(express.json());

// Routes
app.use('/', indexRouter);
app.use('/pokemons', pokemonRouter);
app.use('/trainers', trainerRouter);
app.use('/books', booksRouter);
app.use('/book-stats', bookStatsRouter);
app.use('/users', usersRouter);
app.use('/loans', loansRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

export default app;
