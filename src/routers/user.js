import { Router } from 'express';
import bcrypt from 'bcrypt';
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

    /* Valida as entradas */
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
            res.json({
                success: true,
                data: {
                    login: doc.login,
                    _id: doc.id,
                    isActive: doc.isActive,
                    createdAt: doc.createdAt,
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
