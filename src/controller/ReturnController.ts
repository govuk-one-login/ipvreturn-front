import {ReturnService} from "../services/ReturnService";
import {createDynamoDbClient} from "../utils/DynamoDBFactory";
import {randomUUID} from "crypto";
import {EnvironmentVariables} from "../utils/EnvironmentVariables";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {loggingHelper} from "../utils/LoggingHelper";
import axios from "axios";

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
        loggingHelper.info("RedirectUri",{"redirectUri":redirectUri})
        const nonce = randomUUID();
        const discoveryEndpoint = EnvironmentVariables.getDiscoveryEndpoint();
        const clientId = EnvironmentVariables.getClientId();
        const authorizeUrl = `${discoveryEndpoint}/authorize?response_type=code&scope=openid&client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}&nonce=${nonce}`
        loggingHelper.info("Authorize url",{"authorizeUrl":authorizeUrl})
        return authorizeUrl;
    }

    async handleRedirect( req: any, res: any) {

        try {
            if (req.query.error) {
                loggingHelper.error("Received error response from /authorize", {
                    "error": req.query.error,
                    "error_description": req.query.error_description
                });
                loggingHelper.info("Redirecting to accounts dashboard");
                res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
            }
            if (req.query.state && req.query.code) {
                try {
                    loggingHelper.info("Received success response", {"code": req.query.code, "state": req.query.state})
                    //await ReturnController.getInstance().handleRedirect(req.query.state as string)
                    await this.iprService.deleteSession(req.query.state);
                } catch {
                    loggingHelper.error("Got error deleting record from DB");
                    loggingHelper.info("Redirecting to accounts dashboard");
                    res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
                }

                try {
                    const resp = await axios.get(`${EnvironmentVariables.getApiBaseUrl()}/session?code=${req.query.code}`);
                    console.log("Redirecting to ", resp.data?.redirect_uri)
                    res.redirect(resp.data?.redirect_uri);
                } catch (e) {
                    loggingHelper.error("Received error calling /session and redirecting to RP", {"error": e});
                    loggingHelper.info("Redirecting to accounts dashboard");
                    res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
                }
            } else {
                loggingHelper.error("Missing mandatory fields");
                loggingHelper.info("Redirecting to accounts dashboard");
                res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
            }
        } catch(ex){
            loggingHelper.error("Received unexpected error",{"error":ex});
            loggingHelper.info("Redirecting to accounts dashboard");
            res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
        }
    }
}
