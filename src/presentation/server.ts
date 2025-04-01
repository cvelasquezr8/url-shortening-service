import express, { Router } from 'express';

interface Options {
	port: number;
	routes: Router;
}

export class Server {
	private app = express();
	private readonly port: number;
	private readonly routes: Router;

	constructor(options: Options) {
		const { port } = options;
		this.port = port;
		this.routes = options.routes;
	}

	async start() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));

		//* Routes
		this.app.use(this.routes);

		this.app.listen(this.port, () => {
			console.log(`Server is running on port ${this.port}`);
		});
	}
}
