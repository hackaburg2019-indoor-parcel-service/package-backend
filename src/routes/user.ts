import { Router } from 'express';
import { UserController } from '@home/controller';
import { CheckAuth } from '@home/controller/auth/check-auth';

const router = Router();

router.get('/deliveries', CheckAuth.isAuth,  UserController.getOpenDeliveries);

export const UserRouter = router;
