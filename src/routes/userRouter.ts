import { Router } from 'express';
import { CreateUserController } from '@modules/users/services/createUser/CreateUserController';
import { ShowUserController } from '@modules/users/services/showUser/ShowUserController';
import { ListUserController } from '@modules/users/services/listUser/ListUserController';
import { UpdateUserController } from '@modules/users/services/updateUser/UpdateUserController';
import { DeleteUserController } from '@modules/users/services/deleteUser/DeleteUserController';
import { AuthenticateUserController } from '@modules/users/services/authenticateUser/AuthenticateUserController';
import { ShowSelfUserController } from '@modules/users/services/showSelfUser/ShowSelfUserController';

// (opcional, mas recomendado se /me precisar de autenticação)
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';


const userRouter = Router();

// instâncias dos controllers
const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const showUserController = new ShowUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const showSelfUserController = new ShowSelfUserController();
const authenticateUserController = new AuthenticateUserController();

// rota de login
userRouter.post('/login', authenticateUserController.handle);

// rotas CRUD de usuários
userRouter
  .route('/users')
  .post(createUserController.handle)
  .get(listUserController.handle);

userRouter
  .route('/users/:id')
  .get(showUserController.handle)
  .put(updateUserController.handle)
  .delete(deleteUserController.handle);

// rota para exibir o próprio usuário logado (/me)
userRouter.get('/me', ensureAuthenticated, showSelfUserController.handle);

export { userRouter };
