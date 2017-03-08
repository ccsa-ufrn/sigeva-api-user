export default {
  timezone: 'America/Fortaleza',
  env: 'test',
  server: {
    port: 3000,
    host: 'localhost',
  },
  bodyParser: {
    extended: true,
  },
  mongodb: {
    uri: 'mongodb://localhost:27017/sigeva-api-user_test',
  },
};
