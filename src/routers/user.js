import { Router } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/user';

const UserRouter = new Router();

/*
 * Retorna usuários
*/
const userFieldsParse = (fields) => {
  let fieldsStr = '';
  const fieldsArray = fields.split(',');
  fieldsArray.forEach((f) => {
    if (f !== 'password') {
      fieldsStr = fieldsStr.concat(f);
      fieldsStr = fieldsStr.concat(' ');
    }
  });
  return fieldsStr;
};

UserRouter.get('/', (req, res) => {
  const page = (req.query.p) ? parseInt(req.query.p, 10) : 1;
  const count = (req.query.c) ? parseInt(req.query.c, 10) : 10;
  const query = (req.query.q) ? req.query.q : '{}';
  const fields = (req.query.f) ? req.query.f : '__id'; /* retorna ID por padrão */
  const sort = (req.query.o) ? req.query.o : '{}';

  /* Converte entrada (field1,field2)->(field1 field2) */
  const fieldsStr = userFieldsParse(fields);

  let queryObj;
  try {
    queryObj = JSON.parse(query);
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
    return;
  }

  let sortObj;
  try {
    sortObj = JSON.parse(sort);
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
    return;
  }

  let skipNum = 0;
  if (page > 1) {
    skipNum = (page - 1) * count;
  }

  UserModel
    .find(queryObj, fieldsStr, { skip: skipNum })
    .sort(sortObj)
    .limit(count)
    .then((docs) => {
      res.json(docs);
    });
});

/*
 * Retorna um usuário com o ID
*/
UserRouter.get('/:id', (req, res) => {
  const fields = (req.query.f) ? req.query.f : '__id'; /* retorna ID por padrão */
  const fieldsStr = userFieldsParse(fields);
  UserModel
    .find({ _id: req.params.id }, fieldsStr)
    .then((docs) => {
      res.json(docs);
    });
});

/*
 * Atualiza informações de um usuário
*/
UserRouter.put('/:id', () => {

});

/*
 * Remove um usuário
*/
UserRouter.delete('/:id', () => {

});

/*
 * Autentica usuário com JWT
*/
UserRouter.post('/authenticate', () => {

});

/*
 * Cadastra novo usuário
*/
UserRouter.post('/', (req, res) => {
  const fields = ['login', 'password'];
  const newUser = new UserModel();

  function EmptyFieldsError(target) {
    this.message = 'campos obrigatórios vazios';
    this.target = target;
  }
  EmptyFieldsError.prototype = new Error();

  /* Valida as entradas */
  try {
    fields.forEach((field) => {
      if (req.body[field]) newUser[field] = req.body[field];
    });
    const target = [];
    fields.forEach((f) => {
      if (!newUser[f]) {
        target.push({
          field: f,
          error: 'não deve ser nulo',
        });
      }
    });
    if (target.length !== 0) throw new EmptyFieldsError(target);
  } catch (e) {
    res.status(400).json({
      error: e.message,
      target: e.target,
    });
    return;
  }

  /* Cadastra o usuário se não já existir um com o mesmo login */
  UserModel.findOne({ login: req.body.login })
      .exec()
      .then(existent =>
        new Promise((resolve, reject) => {
          if (existent) reject(new Error('User Already Exists'));
          resolve();
        }))
      .then(() =>
          new Promise((resolve, reject) => {
              /* Encripta a senha do usuário
               * Bcrypt: https://www.npmjs.com/package/bcrypt
               */
            bcrypt.genSalt(10 /* SaltRounds */, (errGenSalt, salt) => {
              if (errGenSalt) reject(errGenSalt);
              bcrypt.hash(newUser.password, salt, (errHash, hash) => {
                if (errHash) reject(errHash);
                newUser.password = hash;
                resolve(newUser.save());
              });
            });
          }))
      .then((doc) => {
        res.status(200).json({
          login: doc.login,
          _id: doc.id,
          isActive: doc.isActive,
          createdAt: doc.createdAt,
        });
      })
      .catch((e) => {
        res.status(400).json({
          error: `Error: ${e.message}`,
        });
      });
});

export default UserRouter;
