import { Router } from 'express';
import { CreateUserController } from '@modules/users/services/createUser/CreateUserController';
import { AuthenticateUserController } from '@modules/users/services/authenticateUser/AuthenticateUserController';

import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';


const userRouter = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();

userRouter.post('/login', authenticateUserController.handle);

userRouter
  .route('/users')
  .post(createUserController.handle)


export { userRouter };
