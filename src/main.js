import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import compression from 'compression';
import config from './config';

const app = express();

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

app.use(bodyParser.urlencoded(config.bodyParser));
app.use(bodyParser.json());
app.use(compression());

app.listen(config.server.port, () => {
  console.log(`Running at ${config.server.port}`);
});

export default app;
