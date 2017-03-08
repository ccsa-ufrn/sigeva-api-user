import productionEnv from './config/config.production';
import developmentEnv from './config/config.development';
import testEnv from './config/config.test';

const { NODE_ENV } = process.env;
let env = developmentEnv;

switch (NODE_ENV) {
  case 'production':
    env = productionEnv;
    break;
  case 'test':
    env = testEnv;
    break;
  default:
    env = developmentEnv;
}

const enviroment = env;

export default enviroment;
