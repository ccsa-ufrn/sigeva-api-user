import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import compression from 'compression';
import config from './config';
import UserRouter from './routers/user';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(config.bodyParser));
app.use(compression());

mongoose.Promise = Promise;
mongoose.connect(config.mongodb.uri, { reconnecTries: 2 }).then(
  () => {
    console.log(`Connection established ${config.mongodb.uri}`);
  },
  (err) => {
    console.error(err.message);
    process.exit(1); // Finaliza com erro
  },
);

app.use('/', UserRouter);

export default app;
