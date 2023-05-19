
import {ReturnService} from "../../../services/ReturnService";
import { createDynamoDbClient } from "../../../utils/DynamoDBFactory";
import {EnvironmentVariables} from "../../../utils/EnvironmentVariables";

let returnService: ReturnService;

const mockDynamoDbClient = jest.mocked(createDynamoDbClient());


describe('ReturnService test', () => {

    beforeAll(() => {

        // @ts-ignore
        returnService = new ReturnService(EnvironmentVariables.getSessionTableName(), mockDynamoDbClient);
    });

        it('successfully save session', async () => {

            mockDynamoDbClient.send = jest.fn().mockResolvedValue({});
            const actualResult = await returnService.createSession();
            expect(actualResult).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        });
});
