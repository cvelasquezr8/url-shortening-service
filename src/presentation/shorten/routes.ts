import { Router } from 'express';
import { ShortenController } from './controller';

export class ShortenRoutes {
	static get routes(): Router {
		const router = Router();
		const shortenController = new ShortenController();
		router.post('/', shortenController.createShortenUrl);
		router.get('/:code', shortenController.getShortenUrlByCode);
		router.get('/:code/stats', shortenController.getShortenUrlStats);
		router.put('/:code', shortenController.updateShortenUrl);
		router.delete('/:code', shortenController.deleteShortenUrl);
		return router;
	}
}
