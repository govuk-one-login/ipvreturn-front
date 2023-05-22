import { ReturnController } from "../../../controller/ReturnController";
import { mock } from "jest-mock-extended";
import { ReturnService } from "../../../services/ReturnService";
import { createDynamoDbClient } from "../../../utils/DynamoDBFactory";
import { EnvironmentVariables } from "../../../utils/EnvironmentVariables";
import {loggingHelper} from "../../../utils/LoggingHelper"

let returnCtrl: ReturnController;

const mockDynamoDbClient = jest.mocked(createDynamoDbClient());
const mockedreturnService = mock<ReturnService>();
const mockRequest = {};
let redirectToDashboardSpy: any;

const mockResponse: any = {
	json: jest.fn(),
	status: jest.fn(),
	redirect: jest.fn()
};


describe("returnController test", () => {

	beforeAll(() => {
		returnCtrl = new ReturnController(EnvironmentVariables.getSessionTableName(), mockDynamoDbClient);
		redirectToDashboardSpy = jest.spyOn(returnCtrl, 'redirectToDashboard');
		mockedreturnService.createSession.mockResolvedValue("123456");
		mockedreturnService.getParameter.mockResolvedValue("mockClientId");
		// @ts-ignore
		returnCtrl.iprService = mockedreturnService;

	});

	it("return a redirectUrl", async () => {

		const actualResult = await returnCtrl.handleResumeReturnAuthUrl();
		const nonce = (actualResult ).split("nonce=", actualResult.length);
		expect(actualResult).toBe(`https://discovery/authorize?response_type=code&scope=openid&client_id=mockClientId&state=123456&redirect_uri=https%3A%2F%2Fredirect&nonce=${nonce[1]}`);
	});

	it("handle Redirect when query params are missing", async () => {

		await returnCtrl.handleRedirect(mockRequest, mockResponse);
		expect(redirectToDashboardSpy).nthCalledWith(1,mockResponse, "Missing query parameters in request")
		expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
		expect(mockResponse.redirect).toHaveBeenCalledWith("https://home.staging.account.gov.uk/");
	});

	it("handle Redirect when query error received", async () => {

		const mockRequest = {
			query:{
				"error":"invalid_request",
				"error_description":"Unsupported%20response"
			}
		};
		await returnCtrl.handleRedirect(mockRequest, mockResponse);
		expect(redirectToDashboardSpy).nthCalledWith(1,mockResponse, "Received error response from /authorize")
		expect(mockResponse.redirect).toHaveBeenCalledTimes(2);
		expect(mockResponse.redirect).toHaveBeenCalledWith("https://home.staging.account.gov.uk/");
	});
});
