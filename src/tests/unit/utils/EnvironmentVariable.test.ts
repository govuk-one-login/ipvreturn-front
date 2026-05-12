import { HttpCodesEnum } from "../../../utils/HttpCodesEnum";
const { EnvironmentVariables } = require("../../../utils/EnvironmentVariables");
import { loggingHelper } from "../../../utils/LoggingHelper";

describe("EnvironmentVariables", () => {
	beforeEach(() => {
		jest.resetModules();
	});

	const testLoggingHelperError = jest.spyOn(loggingHelper, 'error');
	const testLoggingHelperWarn = jest.spyOn(loggingHelper, 'warn');

	it("should return the value of REDIRECT_URL", () => {
		const value = EnvironmentVariables.getRedirectUrl();
		expect(value).toBe("https://redirect");
	});

	it("should throw an error if REDIRECT_URL is not provided", () => {
		EnvironmentVariables.REDIRECT_URL = undefined;
		expect(() => EnvironmentVariables.getRedirectUrl()).toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined",
			}),
		);
		expect(testLoggingHelperError).toHaveBeenCalledWith("Misconfigured RedirectUrl EnvironmentVariables");
	});

	it("should return the value of CLIENT_ID_SSM_PATH", () => {
		const value = EnvironmentVariables.getClientIdSsmPath();
		expect(value).toBe("/dev/ipvreturn/CLIENT_ID");
	});

	it("should throw an error if CLIENT_ID_SSM_PATH is not provided", () => {
		EnvironmentVariables.CLIENT_ID_SSM_PATH = undefined;
		expect(() => EnvironmentVariables.getClientIdSsmPath()).toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined",
			}),
		);
		expect(testLoggingHelperError).toHaveBeenCalledWith("Misconfigured ClientId SSM Path EnvironmentVariables");
	});

	it("should return the value of DISCOVERY_ENDPOINT", () => {
		const value = EnvironmentVariables.getDiscoveryEndpoint();
		expect(value).toBe("https://discovery");
	});

	it("should throw an error if DISCOVERY_ENDPOINT is not provided", () => {
		EnvironmentVariables.DISCOVERY_ENDPOINT = undefined;
		expect(() => EnvironmentVariables.getDiscoveryEndpoint()).toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined",
			}),
		);
		expect(testLoggingHelperError).toHaveBeenCalledWith("Misconfigured Discovery endpoint EnvironmentVariables");
	});

	it("should return the value of SESSION_TABLE_NAME", () => {
		const value = EnvironmentVariables.getSessionTableName();
		expect(value).toBe("MYTABLE");
	});

	it("should throw an error if SESSION_TABLE_NAME is not provided", () => {
		EnvironmentVariables.SESSION_TABLE_NAME = undefined;
		expect(() => EnvironmentVariables.getSessionTableName()).toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined",
			}),
		);
		expect(testLoggingHelperError).toHaveBeenCalledWith("Misconfigured Session table name EnvironmentVariables");
	});

	it("should return the value of SESSION_TTL_IN_SECS", () => {
		const value = EnvironmentVariables.getSessionTtlInSecs();
		expect(value).toBe(400);
	});

	it("should assign default SESSION_TTL_IN_SECS if it does not have a value", () => {
		EnvironmentVariables.SESSION_TTL_IN_SECS = undefined;
		const value = EnvironmentVariables.getSessionTtlInSecs();
		expect(value).toBe(300);
		expect(testLoggingHelperWarn).toHaveBeenCalledWith("SESSION_TTL_IN_SECS env var is not set. Setting to default - 5 mins.");
	});

	it("should return the value of FRONT_CUSTOM_DOMAIN", () => {
		const value = EnvironmentVariables.getFrontEndDomain();
		expect(value).toBe("test-localhost");
	});

	it("should assign default FRONT_END_CUSTOM_DOMAIN if it does not have a value", () => {
		EnvironmentVariables.FRONT_END_CUSTOM_DOMAIN = undefined;
		const value = EnvironmentVariables.getFrontEndDomain();
		expect(value).toBe("localhost");
		expect(testLoggingHelperWarn).toHaveBeenCalledWith("FRONT_END_CUSTOM_DOMAIN env var is not set. Setting to default - localhost.");
	});

	it("should return the value of PORT", () => {
		const value = EnvironmentVariables.getPort();
		expect(value).toBe(9100);
	});

	it("should assign default PORT if it does not have a value", () => {
		EnvironmentVariables.PORT = undefined;
		const value = EnvironmentVariables.getPort();
		expect(value).toBe(8080);
		expect(testLoggingHelperWarn).toHaveBeenCalledWith("PORT env var is not set. Setting to default - 8080.");
	});

	it("should return the value of API_BASE_URL", () => {
		const value = EnvironmentVariables.getApiBaseUrl();
		expect(value).toBe("https://localhost");
	});

	it("should throw an error if API_BASE_URL is not provided", () => {
		EnvironmentVariables.API_BASE_URL = undefined;
		expect(() => EnvironmentVariables.getApiBaseUrl()).toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined",
			}),
		);
		expect(testLoggingHelperError).toHaveBeenCalledWith("Misconfigured Api Base url EnvironmentVariables");
	});

	it("should return the value of ACCOUNTS_DASHBOARD", () => {
		const value = EnvironmentVariables.getAccountsDashboardUrl();
		expect(value).toBe("https://accounts_dashboard_url");
	});

	it("should throw an error if ACCOUNTS_DASHBOARD is not provided", () => {
		EnvironmentVariables.ACCOUNTS_DASHBOARD = undefined;
		expect(() => EnvironmentVariables.getAccountsDashboardUrl()).toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined",
			}),
		);
		expect(testLoggingHelperError).toHaveBeenCalledWith("Misconfigured Accounts dashboard url EnvironmentVariables");
	});
});
