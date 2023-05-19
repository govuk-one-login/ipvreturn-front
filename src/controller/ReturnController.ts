import {ReturnService} from "../services/ReturnService";
import {createDynamoDbClient} from "../utils/DynamoDBFactory";
import {randomUUID} from "crypto";
import {EnvironmentVariables} from "../utils/EnvironmentVariables";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {loggingHelper} from "../utils/LoggingHelper";

export class ReturnController{

    private static instance: ReturnController;
    private readonly iprService: ReturnService;

    constructor(tableName: string, dynamoDbClient: DynamoDBDocument) {
        this.iprService = ReturnService.getInstance(tableName, dynamoDbClient);
    }

    static getInstance(): ReturnController {
        if (!ReturnController.instance) {
            ReturnController.instance = new ReturnController(EnvironmentVariables.getSessionTableName(),  createDynamoDbClient());
        }
        return ReturnController.instance;
    }
    async handleResumeReturnAuthUrl(): Promise<string> {

        const state = await this.iprService.createSession();
        loggingHelper.info("State ",{"state":state});
        const redirectUri = encodeURIComponent(EnvironmentVariables.getRedirectUrl());
        loggingHelper.info({"redirectUri":redirectUri})
        const nonce = randomUUID();
        const discoveryEndpoint = EnvironmentVariables.getDiscoveryEndpoint();
        const clientId = EnvironmentVariables.getClientId();
        const authorizeUrl = `${discoveryEndpoint}/authorize?response_type=code&scope=openid&client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}&nonce=${nonce}`

        loggingHelper.debug("Authorize url",authorizeUrl)
        //&vtr=["Cl.Cm"]&ui_locales=en`

        return authorizeUrl;
    }

    async handleRedirect(state: string) {

        await this.iprService.deleteSession(state);
    }
}
