import {returnService} from "../services/returnService";
import {createDynamoDbClient} from "../utils/dynamoDBFactory";
import {randomUUID} from "crypto";
import {EnvironmentVariables} from "../utils/environmentVariables";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";

export class returnController{

    private static instance: returnController;
    private readonly iprService: returnService;

    constructor(tableName: string, dynamoDbClient: DynamoDBDocument) {
        this.iprService = returnService.getInstance(tableName, dynamoDbClient);
    }

    static getInstance(): returnController {
        if (!returnController.instance) {
            returnController.instance = new returnController(EnvironmentVariables.getSessionTableName(),  createDynamoDbClient());
        }
        return returnController.instance;
    }
    async handleResumeReturnAuthUrl(): Promise<string> {

        const state = await this.iprService.saveEventData();
        console.log("State ",state);
        const redirectUri = encodeURIComponent(EnvironmentVariables.getRedirectUrl());
    //...'https://return.dev.account.gov.uk/callback')
        console.log("redirectUri ",redirectUri)
        const nonce = randomUUID();
        const discoveryEndpoint = EnvironmentVariables.getDiscoveryEndpoint();
        const clientId = EnvironmentVariables.getClientId();
        const authorizeUrl = `${discoveryEndpoint}/authorize?response_type=code&scope=openid&client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}&nonce=${nonce}`
        // '         &vtr=["Cl.Cm"]\n' +
        // '         &ui_locales=en'

        return authorizeUrl;
    }

    async handleRedirect(state: string) {

        await this.iprService.deleteSession(state);

    }
}
