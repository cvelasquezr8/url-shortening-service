export class CreateShortenDto {
	private constructor(
		public readonly url: string,
		public readonly shortCode: string,
	) {}

	static create(
		props: { [key: string]: any },
		shortCode: string,
	): [string?, CreateShortenDto?] {
		const { url } = props;

		if (!url) {
			return ['URL is required', undefined];
		}

		if (typeof url !== 'string') {
			return ['URL must be a string', undefined];
		}

		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			return ['URL must start with http:// or https://', undefined];
		}

		if (!this.isValidUrl(url)) {
			return ['Invalid URL format', undefined];
		}

		return [undefined, new CreateShortenDto(url, shortCode)];
	}

	private static isValidUrl(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}
}
