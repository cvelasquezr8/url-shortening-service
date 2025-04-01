import { Router } from 'express';
import { ShortenRoutes } from './shorten/routes';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();
		router.use('/shorten', ShortenRoutes.routes);
		return router;
	}
}
