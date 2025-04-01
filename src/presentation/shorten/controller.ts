import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateShortenDto, UpdateShortenDto } from '../../domain/dtos/';

export class ShortenController {
	constructor() {}

	private createShortUrl = (length: number = 6): string => {
		const charset =
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let shortCode = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length);
			shortCode += charset[randomIndex];
		}
		return shortCode;
	};

	private generateUniqueShortCode = async (): Promise<string> => {
		let shortCode: string;
		let exists = true;

		do {
			shortCode = this.createShortUrl();
			const existing = await prisma.shortenUrl.findUnique({
				where: { shortCode },
			});
			exists = !!existing;
		} while (exists);

		return shortCode;
	};

	private findAndTrackShortUrl = async (shortCode: string) => {
		const shorten = await prisma.shortenUrl.findFirst({
			where: {
				shortCode,
			},
		});

		if (shorten) {
			await prisma.shortenUrl.update({
				where: {
					id: shorten.id,
				},
				data: {
					accessCount: {
						increment: 1,
					},
				},
			});
		}

		return shorten;
	};

	public createShortenUrl = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		try {
			const shortCode = await this.generateUniqueShortCode();
			const [error, createShortenDto] = CreateShortenDto.create(
				req.body,
				shortCode,
			);

			if (error) {
				return res.status(400).json({ error });
			}

			const { accessCount: _, ...shorten } =
				await prisma.shortenUrl.create({
					data: createShortenDto!,
				});

			res.status(201).json(shorten);
		} catch (error) {
			next(error);
		}
	};

	public getShortenUrlByCode = async (
		req: Request,
		res: Response,
	): Promise<any> => {
		const { code = '' } = req.params;
		if (!code) {
			return res.status(400).json({ error: 'Code is required' });
		}

		const shorten = await this.findAndTrackShortUrl(code);
		if (!shorten) {
			return res
				.status(404)
				.json({ error: `Shorten with code ${code} not found` });
		}

		const { accessCount: _, ...shortenWithoutAccessCount } = shorten;
		res.json(shortenWithoutAccessCount);
	};

	public deleteShortenUrl = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		try {
			const { code = '' } = req.params;
			if (!code) {
				return res.status(400).json({ error: 'Code is required' });
			}

			const shorten = await this.findAndTrackShortUrl(code);
			if (!shorten) {
				return res
					.status(404)
					.json({ error: `Shorten with code ${code} not found` });
			}

			await prisma.shortenUrl.delete({
				where: {
					id: shorten.id,
				},
			});

			res.status(204).json({ message: 'URL deleted successfully' });
		} catch (error) {
			next(error);
		}
	};

	public updateShortenUrl = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		try {
			const { code = '' } = req.params;
			const [error, updateShortenDto] = UpdateShortenDto.create({
				shortCode: code,
				...req.body,
			});

			if (error) {
				return res.status(400).json({ error });
			}

			const url = updateShortenDto!.url;
			const shortCode = updateShortenDto!.shortCode;
			const shorten = await this.findAndTrackShortUrl(shortCode);
			if (!shorten) {
				return res.status(404).json({
					error: `Shorten with code ${shortCode} not found`,
				});
			}

			const { accessCount: _, ...updatedShorten } =
				await prisma.shortenUrl.update({
					where: {
						id: shorten.id,
					},
					data: {
						url,
					},
				});

			res.json(updatedShorten);
		} catch (error) {
			next(error);
		}
	};

	public getShortenUrlStats = async (
		req: Request,
		res: Response,
	): Promise<any> => {
		const { code = '' } = req.params;
		if (!code) {
			return res.status(400).json({ error: 'Code is required' });
		}

		const shorten = await this.findAndTrackShortUrl(code);
		if (!shorten) {
			return res
				.status(404)
				.json({ error: `Shorten with code ${code} not found` });
		}

		res.json(shorten);
	};
}
