import productionEnv from './config/config.production';
import developmentEnv from './config/config.development';

const { NODE_ENV } = process.env;

const enviroment = (NODE_ENV === 'production') ? productionEnv : developmentEnv;

export default enviroment;
