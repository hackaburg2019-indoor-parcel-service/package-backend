import { Router } from 'express';
import { AuthController } from '@home/controller/auth';

const router = Router();

router.post('/login', AuthController.postLogin);

export const AuthRouter = router;
