import { ReturnService } from "../../../services/ReturnService";
import { createDynamoDbClient } from "../../../utils/DynamoDBFactory";
import { EnvironmentVariables } from "../../../utils/EnvironmentVariables";
import { loggingHelper } from "../../../utils/LoggingHelper";

let returnService: ReturnService;

const mockDynamoDbClient = jest.mocked(createDynamoDbClient());


describe("ReturnService test", () => {

	beforeAll(() => {

		// @ts-ignore
		returnService = new ReturnService(EnvironmentVariables.getSessionTableName(), mockDynamoDbClient);
	});

	it("successfully saves session", async () => {
		mockDynamoDbClient.send = jest.fn().mockResolvedValue({});
		const actualResult = await returnService.createSession();
		expect(actualResult).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
	});

	it("successfully deletes session", async () => {
		mockDynamoDbClient.send = jest.fn().mockResolvedValue({});
		await returnService.createSession();
		const actualResult = await returnService.deleteSession("test");
		expect(actualResult).toEqual(undefined);
		expect(loggingHelper.info).toHaveBeenCalled;
	});
});
