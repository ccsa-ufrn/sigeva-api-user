import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import compression from 'compression';
import config from './config';
import UserRouter from './routers/user';

const app = express();

mongoose.Promise = Promise;

mongoose.connect(config.mongodb.uri, { reconnecTries: 2 }).then(
  () => {
    if (config.env === 'development') {
      console.log(`Connection established ${config.mongodb.uri}`);
    }
  },
  (err) => {
    console.error(err.message);
    process.exit(1); // Finaliza com erro
  },
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded(config.bodyParser));
app.use(compression());

app.use('/', UserRouter);

app.listen(config.server.port, () => {
  console.log(`Running at ${config.server.port}`);
});

export default app;
