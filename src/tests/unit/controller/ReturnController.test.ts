/* eslint-disable max-lines-per-function */
import { ReturnController } from "../../../controller/ReturnController";
import { mock } from "jest-mock-extended";
import { ReturnService } from "../../../services/ReturnService";
import { createDynamoDbClient } from "../../../utils/DynamoDBFactory";
import { EnvironmentVariables } from "../../../utils/EnvironmentVariables";
import axios from "axios";

let returnCtrl: ReturnController;

const mockDynamoDbClient = jest.mocked(createDynamoDbClient());
const mockedreturnService = mock<ReturnService>();
let mockRequest = {};
let redirectToDashboardSpy: any;
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockResponse: any = {
	json: jest.fn(),
	status: jest.fn(),
	redirect: jest.fn(),
};


describe("returnController test", () => {
	beforeAll(() => {
		returnCtrl = new ReturnController(EnvironmentVariables.getSessionTableName(), mockDynamoDbClient);
		redirectToDashboardSpy = jest.spyOn(returnCtrl, "redirectToDashboard");
		mockedreturnService.createSession.mockResolvedValue("123456");
		mockedreturnService.deleteSession.mockResolvedValue();
		mockedreturnService.getParameter.mockResolvedValue("mockClientId");
		// @ts-ignore
		returnCtrl.iprService = mockedreturnService;

	});

	it("returns a redirectUrl", async () => {
		const actualResult = await returnCtrl.handleResumeReturnAuthUrl();
		const nonce = (actualResult ).split("nonce=", actualResult.length);
		expect(actualResult).toBe(`https://discovery/authorize?result=sign-in&response_type=code&scope=openid&client_id=mockClientId&state=123456&redirect_uri=https%3A%2F%2Fredirect&nonce=${nonce[1]}`);
	});

	it("handles Redirect when query params are missing", async () => {
		await returnCtrl.handleRedirect(mockRequest, mockResponse);
		expect(redirectToDashboardSpy).toHaveBeenNthCalledWith(1, mockResponse, "Missing query parameters in request");
		expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
		expect(mockResponse.redirect).toHaveBeenCalledWith("https://accounts_dashboard_url");
	});

	it("handles Redirect when query error received", async () => {
		mockRequest = {
			query:{
				"error":"invalid_request",
				"error_description":"Unsupported%20response",
			},
		};
		await returnCtrl.handleRedirect(mockRequest, mockResponse);
		expect(redirectToDashboardSpy).toHaveBeenNthCalledWith(1, mockResponse, "Received error response from /authorize");
		expect(mockResponse.redirect).toHaveBeenCalledTimes(2);
		expect(mockResponse.redirect).toHaveBeenCalledWith("https://accounts_dashboard_url");
	});

	it("handles Redirect and redirect to RP successfully", async () => {
		mockRequest = {
			query:{
				"state":"471600",
				"code":"abcd123",
			},
		};
		mockedAxios.get.mockResolvedValue({ status:200, data: { "status":"completed", "redirect_uri":"https://apply-hm-armed-forces-veteran-card.service.mod.uk/offline-start" } });
		await returnCtrl.handleRedirect(mockRequest, mockResponse);
		expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
		expect(mockResponse.redirect).toHaveBeenCalledWith("https://apply-hm-armed-forces-veteran-card.service.mod.uk/offline-start");
	});

	it("handles Redirect and redirect to accounts dashboard as status 'pending'", async () => {
		mockRequest = {
			query:{
				"state":"471600",
				"code":"abcd123",
			},
		};
		mockedAxios.get.mockResolvedValue({ status:200, data: { "status":"pending" } });
		await returnCtrl.handleRedirect(mockRequest, mockResponse);
		expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
		expect(mockResponse.redirect).toHaveBeenCalledWith("https://accounts_dashboard_url");
	});

	it("handles redirect to DBS RP successfully when redirect url does not contain www", async () => {
		mockRequest = {
			query:{
				"state":"471600",
				"code":"abcd123",
			},
		};
		mockedAxios.get.mockResolvedValue({ status:200, data: { "status":"completed", "redirect_uri":"https://apply-basic-criminal-record-check.service.gov.uk/" } });
		await returnCtrl.handleRedirect(mockRequest, mockResponse);
		expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
		expect(mockResponse.redirect).toHaveBeenCalledWith("https://www.apply-basic-criminal-record-check.service.gov.uk/");
	});

	it("handles Redirect to DBS RP successfully when redirect url contains www", async () => {
		mockRequest = {
			query:{
				"state":"471600",
				"code":"abcd123",
			},
		};
		mockedAxios.get.mockResolvedValue({ status:200, data: { "status":"completed", "redirect_uri":"https://www.apply-basic-criminal-record-check.service.gov.uk/" } });
		await returnCtrl.handleRedirect(mockRequest, mockResponse);
		expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
		expect(mockResponse.redirect).toHaveBeenCalledWith("https://www.apply-basic-criminal-record-check.service.gov.uk/");
	});

	it("handles redirect to DVLA RP successfully when redirect url does not contain www", async () => {
		mockRequest = {
			query:{
				"state":"471600",
				"code":"abcd123",
			},
		};
		mockedAxios.get.mockResolvedValue({ status:200, data: { "status":"completed", "redirect_uri":"https://vehicle-operator-licensing.service.gov.uk/" } });
		await returnCtrl.handleRedirect(mockRequest, mockResponse);
		expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
		expect(mockResponse.redirect).toHaveBeenCalledWith("https://www.vehicle-operator-licensing.service.gov.uk/");
	});

	it("handles Redirect to DVLA RP successfully when redirect url contains www", async () => {
		mockRequest = {
			query:{
				"state":"471600",
				"code":"abcd123",
			},
		};
		mockedAxios.get.mockResolvedValue({ status:200, data: { "status":"completed", "redirect_uri":"https://www.vehicle-operator-licensing.service.gov.uk/" } });
		await returnCtrl.handleRedirect(mockRequest, mockResponse);
		expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
		expect(mockResponse.redirect).toHaveBeenCalledWith("https://www.vehicle-operator-licensing.service.gov.uk/");
	});
});
