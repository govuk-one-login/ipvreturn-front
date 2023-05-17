export class appError extends Error {

	constructor(
		public statusCode: number,
		public message: string,
		public obj?: object,
	) {
		super(message);
	}
}
