import { Request, Response, Router } from 'express';
import { AuthController } from './controllers/auth/AuthController';

const router = Router();

const authController = new AuthController();

router.get('/', (req: Request, res: Response) => res.json({ 'home': 'Hello World!' }));

router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/checkToken', authController.checkToken);

export { router };

