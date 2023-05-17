//import {expect} from "jest"
import {returnController} from "../../controller/returnController";
import { mock } from "jest-mock-extended";
import {returnService} from "../../services/returnService";
import { createDynamoDbClient } from "../../utils/dynamoDBFactory";
import {EnvironmentVariables} from "../../utils/environmentVariables";

let returnCtrl: returnController;
//process.env.SESSION_TABLE = 'MYTABLE'

const mockDynamoDbClient = jest.mocked(createDynamoDbClient());
const mockedreturnService = mock<returnService>();

// jest.mock("../../services/returnService", () => {
//     return {
//         returnService: jest.fn(() => mockedreturnService),
//     };
// });

describe('returnController test', () => {

    beforeAll(() => {
        returnCtrl = new returnController(EnvironmentVariables.getSessionTableName(),mockDynamoDbClient);
        // @ts-ignore
        returnController.iprService = mockedreturnService;

    });

        it('health should be okay', async () => {
            //returnService.getInstance = jest.fn().mockReturnValue(mockedreturnService);
            mockedreturnService.saveEventData.mockResolvedValue("123456");
            const actualResult = await returnCtrl.handleResumeReturnAuthUrl();
            const nonce = (actualResult as string).split("nonce=",actualResult.length)
            expect(actualResult).toEqual(`https://discovery/authorize?response_type=code&scope=openid&client_id=clientid&state=123456&redirect_uri=https%3A%2F%2Fredirect&nonce=${nonce[1]}`);
        });
});
