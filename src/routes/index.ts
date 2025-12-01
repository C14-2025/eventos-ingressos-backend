import { Router } from 'express';
import { userRouter } from './userRouter';
import { systemRouter } from './systemRouter';
import { guardRouter } from './guardRouter';
import { eventRouter } from './eventRouter';
import { HealthController } from './controllers/HealthController';


const routes = Router();
// routes.use(guardRouter);
routes.use(userRouter);
routes.use(systemRouter);
routes.use(eventRouter);

const healthController = new HealthController();

routes.get('/health', healthController.handle);
export { routes };
