import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import compression from 'compression';
import config from './config.js';

const app = express();

mongoose.connect(config.mongodb.uri);

app.use(bodyParser.urlencoded(config.bodyParser));
app.use(bodyParser.json());
app.use(compression());

app.listen(config.server.port, ()=>{
  console.log(`Running at ${config.server.port}`);
});

export default app;
