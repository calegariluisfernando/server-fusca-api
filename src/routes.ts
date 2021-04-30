import { Request, Response, Router } from 'express';
import { AuthController } from './controllers/auth/AuthController';

const router = Router();

router.get('/', (req: Request, res: Response) => res.json({ 'home': 'Hello World!' }));

const authController = new AuthController();
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

export { router };

