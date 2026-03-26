import { ReturnService } from "../../../services/ReturnService";
import { createDynamoDbClient } from "../../../utils/DynamoDBFactory";
import { SSMClient } from "@aws-sdk/client-ssm";
import { EnvironmentVariables } from "../../../utils/EnvironmentVariables";
import { loggingHelper } from "../../../utils/LoggingHelper";

jest.mock('@aws-sdk/client-ssm', () => ({
	SSMClient: jest.fn(),
	GetParameterCommand: jest.fn()
}));

const MockedSSMClient = SSMClient as jest.Mock;
const mockSend = jest.fn();

MockedSSMClient.mockImplementation(() => ({
	send: mockSend
}));

const mockDynamoDbClient = jest.mocked(createDynamoDbClient());

let returnService: ReturnService;

describe("ReturnService test", () => {

	beforeAll(() => {
		// @ts-ignore
		returnService = new ReturnService(EnvironmentVariables.getSessionTableName(), mockDynamoDbClient);
	});

	describe("getParameter", () => {
		it("returns the SSM parameter value when found", async () => {
			const expectedValue = "some-secret-value";
			mockSend.mockResolvedValueOnce({
				Parameter: {
					Value: expectedValue
				}
			});
			const result = await returnService.getParameter('test');
			expect(result).toBe(expectedValue);
		});

		it("throws error when getParameter response contains no parameter", async () => {
			mockSend.mockResolvedValueOnce({
				Parameter: null
			});
			
			await expect(returnService.getParameter('test')).rejects.toThrow("Parameter not found");
		});

		it("throws error when getParameter response.Parameter is null", async () => {
			mockSend.mockResolvedValueOnce({
				Parameter: {
					Value: null
				}
			});

			await expect(returnService.getParameter('test')).rejects.toThrow("Parameter is null");
		});
	});

	describe("createSession", () => {	
		it("successfully saves session", async () => {
			mockDynamoDbClient.send = jest.fn().mockResolvedValue({});
			const actualResult = await returnService.createSession();

			expect(actualResult).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
		});

		it("throws error if saving session to dynamo fails", () => {
			mockDynamoDbClient.send = jest.fn().mockRejectedValueOnce({});

        	expect(returnService.createSession()).rejects.toThrow("Error updating session record");
		});
	});

	describe("deleteSession", () => {	
		it("successfully deletes session", async () => {
			const testLoggingHelper = jest.spyOn(loggingHelper, 'info');
			mockDynamoDbClient.send = jest.fn().mockResolvedValue({});
			const state = await returnService.createSession();
			const actualResult = await returnService.deleteSession(state);

			expect(actualResult).toEqual(undefined);
			expect(testLoggingHelper).toHaveBeenNthCalledWith(3, "Deleting session record in dynamodb");
			expect(testLoggingHelper).toHaveBeenNthCalledWith(4, "DeleteCommandInput: ",
				expect.objectContaining({
					deleteCommandInput: expect.objectContaining({
					Key: { state },
					TableName: "MYTABLE",
					}),
				})
			);		
			expect(testLoggingHelper).toHaveBeenNthCalledWith(5, "deleted session record in dynamodb");
		});
	
		it("throws error when delete session fails", async () => {
			const testLoggingHelperInfo = jest.spyOn(loggingHelper, 'info');
			const testLoggingHelperError = jest.spyOn(loggingHelper, 'error');
			mockDynamoDbClient.send = jest.fn().mockResolvedValueOnce({});
			const state = await returnService.createSession();
			mockDynamoDbClient.send = jest.fn().mockRejectedValueOnce({});

			await expect(returnService.deleteSession(state)).rejects.toThrow("deleteItem - failed: got error deleting session record");
			expect(testLoggingHelperInfo).toHaveBeenNthCalledWith(3, "Deleting session record in dynamodb");
			expect(testLoggingHelperError).toHaveBeenNthCalledWith(1, "got error saving Access token details", {"error": {}});
		});
	});
});
