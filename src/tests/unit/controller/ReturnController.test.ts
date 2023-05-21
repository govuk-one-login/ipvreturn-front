import { ReturnController } from "../../../controller/ReturnController";
import { mock } from "jest-mock-extended";
import { ReturnService } from "../../../services/ReturnService";
import { createDynamoDbClient } from "../../../utils/DynamoDBFactory";
import { EnvironmentVariables } from "../../../utils/EnvironmentVariables";

let returnCtrl: ReturnController;

const mockDynamoDbClient = jest.mocked(createDynamoDbClient());
const mockedreturnService = mock<ReturnService>();


describe("returnController test", () => {

	beforeAll(() => {
		returnCtrl = new ReturnController(EnvironmentVariables.getSessionTableName(), mockDynamoDbClient);
		mockedreturnService.createSession.mockResolvedValue("123456");
		// @ts-ignore
		returnCtrl.iprService = mockedreturnService;

	});

	it("return a redirectUrl", async () => {

		const actualResult = await returnCtrl.handleResumeReturnAuthUrl();
		const nonce = (actualResult ).split("nonce=", actualResult.length);
		expect(actualResult).toBe(`https://discovery/authorize?response_type=code&scope=openid&client_id=clientid&state=123456&redirect_uri=https%3A%2F%2Fredirect&nonce=${nonce[1]}`);
	});
});
