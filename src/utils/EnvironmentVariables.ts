import { AppError } from "./AppError";
import { HttpCodesEnum } from "./HttpCodesEnum";
import { Constants } from "./Constants";
import { loggingHelper } from "./LoggingHelper";

/**
 * Class to read, store, and return environment variables
 */
export class EnvironmentVariables {

	private static readonly REDIRECT_URL = process.env.REDIRECT_URL;

	private static readonly DISCOVERY_ENDPOINT = process.env.DISCOVERY_ENDPOINT;

	private static readonly SESSION_TABLE_NAME = process.env.SESSION_TABLE_NAME;

	private static readonly CLIENT_ID_SSM_PATH = process.env.CLIENT_ID_SSM_PATH;

	private static SESSION_TTL_IN_SECS = +process.env.SESSION_TTL_IN_SECS!;

	private static PORT = +process.env.PORT!;

	private static FRONT_END_CUSTOM_DOMAIN = process.env.FRONT_END_CUSTOM_DOMAIN;

	private static readonly API_BASE_URL = process.env.API_BASE_URL;

	private static readonly ACCOUNTS_DASHBOARD = process.env.ACCOUNTS_DASHBOARD;

	/**
	 * Accessor methods for env variable values
	 */

	static getRedirectUrl(): any {
		if (!this.REDIRECT_URL || this.REDIRECT_URL.trim().length === 0) {
			loggingHelper.error(`Misconfigured RedirectUrl ${EnvironmentVariables.name}`);
			throw new AppError(HttpCodesEnum.SERVER_ERROR, Constants.ENV_VAR_UNDEFINED);
		}
		return this.REDIRECT_URL;
	}

	static getClientIdSsmPath(): any {
		if (!this.CLIENT_ID_SSM_PATH || this.CLIENT_ID_SSM_PATH.trim().length === 0) {
			loggingHelper.error(`Misconfigured ClientId SSM Path ${EnvironmentVariables.name}`);
			throw new AppError(HttpCodesEnum.SERVER_ERROR, Constants.ENV_VAR_UNDEFINED);
		}
		return this.CLIENT_ID_SSM_PATH;
	}

	static getDiscoveryEndpoint(): any {
		if (!this.DISCOVERY_ENDPOINT || this.DISCOVERY_ENDPOINT.trim().length === 0) {
			loggingHelper.error(`Misconfigured Discovery endpoint ${EnvironmentVariables.name}`);
			throw new AppError(HttpCodesEnum.SERVER_ERROR, Constants.ENV_VAR_UNDEFINED);
		}
		return this.DISCOVERY_ENDPOINT;
	}


	static getSessionTableName(): any {
		if (!this.SESSION_TABLE_NAME || this.SESSION_TABLE_NAME.trim().length === 0) {
			loggingHelper.error(`Misconfigured Session table name ${EnvironmentVariables.name}`);
			throw new AppError(HttpCodesEnum.SERVER_ERROR, Constants.ENV_VAR_UNDEFINED);
		}
		return this.SESSION_TABLE_NAME;
	}

	static getSessionTtlInSecs(): any {
		if (!this.SESSION_TTL_IN_SECS) {
			this.SESSION_TTL_IN_SECS = 300;
			loggingHelper.warn("SESSION_TTL_IN_SECS env var is not set. Setting to default - 5 mins.");
		}
		return this.SESSION_TTL_IN_SECS;
	}

	static getFrontEndDomain(): any {
		if (!this.FRONT_END_CUSTOM_DOMAIN	|| this.FRONT_END_CUSTOM_DOMAIN.trim().length === 0) {
			this.FRONT_END_CUSTOM_DOMAIN = "localhost";
			loggingHelper.warn("FRONT_END_CUSTOM_DOMAIN env var is not set. Setting to default - localhost.");
		}
		return this.FRONT_END_CUSTOM_DOMAIN;
	}

	static getPort(): any {
		if (!this.PORT) {
			this.PORT = 8080;
			loggingHelper.warn("PORT env var is not set. Setting to default - 8080.");
		}
		return this.PORT;
	}

	static getApiBaseUrl(): any {
		if (!this.API_BASE_URL || this.API_BASE_URL.trim().length === 0) {
			loggingHelper.error(`Misconfigured Api Base url ${EnvironmentVariables.name}`);
			throw new AppError(HttpCodesEnum.SERVER_ERROR, Constants.ENV_VAR_UNDEFINED);
		}
		return this.API_BASE_URL;
	}

	static getAccountsDashboardUrl(): any {
		if (!this.ACCOUNTS_DASHBOARD	|| this.ACCOUNTS_DASHBOARD.trim().length === 0) {
			loggingHelper.error(`Misconfigured Accounts dashboard url ${EnvironmentVariables.name}`);
			throw new AppError(HttpCodesEnum.SERVER_ERROR, Constants.ENV_VAR_UNDEFINED);
		}
		return this.ACCOUNTS_DASHBOARD;
	}


}
