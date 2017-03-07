import { Router } from 'express';

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
UserRouter.post('/', () => {

});
