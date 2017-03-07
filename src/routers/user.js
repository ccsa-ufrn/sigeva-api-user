import { Router } from 'express';
import UserModel from '../models/user';

const UserRouter = new Router();

/*
 * Retorna usuários
*/
UserRouter.get('/', () => {

});

/*
 * Retorna um usuário com o ID
*/
UserRouter.get('/:id', () => {

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
  try {
    fields.forEach((field) => {
      if (!req.body[field]) throw new Error('Empty Fields');
      newUser[field] = req.body[field];
    });
  } catch (e) {
    res.json({
      success: false,
      message: `Error: ${e.message}`,
    });
  }

  UserModel.findOne({ login: req.body.login })
  .exec()
  .then(existent =>
    new Promise((resolve, reject) => {
      if (existent) reject(new Error('User Already Exists'));
      resolve();
    }))
  .then(() => newUser.save())
  .then((doc) => {
    res.json({
      success: true,
      data: {
        login: doc.login,
        _id: doc.id,
      },
    });
  })
  .catch((e) => {
    res.json({
      success: false,
      message: `Error: ${e.message}`,
    });
  });
});

export default UserRouter;
