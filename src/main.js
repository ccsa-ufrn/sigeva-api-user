import config from './config';
import app from './app';

app.listen(config.server.port, () => {
  console.log(`Running at ${config.server.port}`);
});
