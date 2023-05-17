import { AppError } from "./appError";
import { HttpCodesEnum } from "./httpCodesEnum";
import { Constants } from "./constants";

/**
 * Class to read, store, and return environment variables
 */
export class EnvironmentVariables {

	private static readonly REDIRECT_URL = process.env.REDIRECT_URL;

	private static readonly DISCOVERY_ENDPOINT = process.env.DISCOVERY_ENDPOINT;

	private static readonly SESSION_TABLE_NAME = process.env.SESSION_TABLE_NAME;

	private static readonly CLIENT_ID = process.env.CLIENT_ID;

	private static SESSION_TTL = process.env.SESSION_TTL!;

	/**
	 * Accessor methods for env variable values
	 */

	static getRedirectUrl(): any {
		if (!this.REDIRECT_URL || this.REDIRECT_URL.trim().length === 0) {
			console.error(`Misconfigured RedirectUrl ${EnvironmentVariables.name}`);
			throw new AppError(HttpCodesEnum.SERVER_ERROR, Constants.ENV_VAR_UNDEFINED);
		}
		return this.REDIRECT_URL;
	}

	static getClientId(): any {
		if (!this.CLIENT_ID || this.CLIENT_ID.trim().length === 0) {
			console.error(`Misconfigured ClientId ${EnvironmentVariables.name}`);
			throw new AppError(HttpCodesEnum.SERVER_ERROR, Constants.ENV_VAR_UNDEFINED);
		}
		return this.CLIENT_ID;
	}

	static getDiscoveryEndpoint(): any {
		if (!this.DISCOVERY_ENDPOINT || this.DISCOVERY_ENDPOINT.trim().length === 0) {
			console.error(`Misconfigured Discovery endpoint ${EnvironmentVariables.name}`);
			throw new AppError(HttpCodesEnum.SERVER_ERROR, Constants.ENV_VAR_UNDEFINED);
		}
		return this.DISCOVERY_ENDPOINT;
	}


	static getSessionTableName(): any {
		if (!this.SESSION_TABLE_NAME || this.SESSION_TABLE_NAME.trim().length === 0) {
			console.error(`Misconfigured Session table name ${EnvironmentVariables.name}`);
			throw new AppError(HttpCodesEnum.SERVER_ERROR, Constants.ENV_VAR_UNDEFINED);
		}
		return this.SESSION_TABLE_NAME;
	}

	static getSessionTtl(): any {
		if (!this.SESSION_TTL	|| this.SESSION_TTL.trim().length === 0) {
			this.SESSION_TTL = "300";
			console.warn("SESSION_TTL env var is not set. Setting to default - 5 mins.");
		}
		return this.SESSION_TTL;
	}

	// private static validateConfiguration(envVar: string, defaultValue?: any): boolean {
	// 	if (!process.env[envVar] || process.env[envVar] === "undefined" || process.env[envVar]!.length === 0) {
	// 		if (defaultValue && defaultValue !== Constants.OPTIONAL_VALUE) {
	// 			console.warn("Invalid configuration - switching to default", {
	// 				missing: envVar,
	// 				defaultValue,
	// 			});
	// 			return false;
	// 		} else if (defaultValue === Constants.OPTIONAL_VALUE) {
	// 			console.debug(`Optional ${ envVar } is not set up.`);
	// 			return false;
	// 		}
	// 		console.error("Invalid configuration",  {  missing: envVar });
	// 		throw new AppError(HttpCodesEnum.SERVER_ERROR, "Invalid configuration");
	// 	}
	// 	return true;
	// }

}
