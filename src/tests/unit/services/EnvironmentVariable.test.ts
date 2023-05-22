import {HttpCodesEnum} from "../../../utils/HttpCodesEnum";
import {EnvironmentVariables} from "../../../utils/EnvironmentVariables";

describe("EnvironmentVariables", () => {
	beforeEach(() => {
		jest.resetModules();
		process.env = {};
		delete process.env.NODE_ENV;
	});


	it("should return the value of PORT", () => {
		const { EnvironmentVariables } = require("../../../utils/EnvironmentVariables");
		const value = EnvironmentVariables.getPort();
		expect(value).toEqual("8080");
	});

	it("should throw an error if API_BASE_URL is not provided", () => {
		const { EnvironmentVariables } = require("../../../utils/EnvironmentVariables");

			expect(() => EnvironmentVariables.getApiBaseUrl()).toThrow(
				expect.objectContaining({
					statusCode: HttpCodesEnum.SERVER_ERROR,
					message: "ENV Variables are undefined"
				}),
			);
	});

	it("should return the value of FRONT_CUSTOM_DOMAIN", () => {
		const { EnvironmentVariables } = require("../../../utils/EnvironmentVariables");

		const value = EnvironmentVariables.getFrontEndDomain();
		expect(value).toEqual("localhost");
	});

	it("should throw an error if ACCOUNTS_DASHBOARD is not provided", () => {
		const { EnvironmentVariables } = require("../../../utils/EnvironmentVariables");

		expect(() => EnvironmentVariables.getAccountsDashboardUrl()).toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined"
			}),
		);
	});

	it("should return the value of SESSION_TTL", () => {
		const { EnvironmentVariables } = require("../../../utils/EnvironmentVariables");
		const value = EnvironmentVariables.getSessionTtl();
		expect(value).toEqual("300");
	});

	it("should throw an error if DISCOVERY_ENDPOINT is not provided", () => {
		const { EnvironmentVariables } = require("../../../utils/EnvironmentVariables");

		expect(() => EnvironmentVariables.getDiscoveryEndpoint()).toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined"
			}),
		);
	});

	it("should throw an error if SESSION_TABLE_NAME is not provided", () => {
		const { EnvironmentVariables } = require("../../../utils/EnvironmentVariables");

		expect(() => EnvironmentVariables.getSessionTableName()).toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined"
			}),
		);
	});

	it("should throw an error if CLIENT_ID_SSM_PATH is not provided", () => {
		const { EnvironmentVariables } = require("../../../utils/EnvironmentVariables");

		expect(() => EnvironmentVariables.getClientIdSsmPath().toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined"
			}),
		));
	});

	it("should throw an error if REDIRECT_URL is not provided", () => {
		const { EnvironmentVariables } = require("../../../utils/EnvironmentVariables");

		expect(() => EnvironmentVariables.getRedirectUrl()).toThrow(
			expect.objectContaining({
				statusCode: HttpCodesEnum.SERVER_ERROR,
				message: "ENV Variables are undefined"
			}),
		);
	});

});
