/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { ReturnService } from "../services/ReturnService";
import { createDynamoDbClient } from "../utils/DynamoDBFactory";
import { randomUUID } from "crypto";
import { EnvironmentVariables } from "../utils/EnvironmentVariables";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { loggingHelper } from "../utils/LoggingHelper";
import axios, { AxiosResponse } from "axios";
import { Constants } from "../utils/Constants";
import { createPersonalDataHeaders } from "@govuk-one-login/frontend-passthrough-headers";

export class ReturnController {

    private static instance: ReturnController;

    private static clientId: string;

    private readonly iprService: ReturnService;

    constructor(tableName: string, dynamoDbClient: DynamoDBDocument) {
    	this.iprService = ReturnService.getInstance(tableName, dynamoDbClient);
    }

    static getInstance(): ReturnController {
    	if (!ReturnController.instance) {
    		ReturnController.instance = new ReturnController(EnvironmentVariables.getSessionTableName(), createDynamoDbClient());
    	}
    	return ReturnController.instance;
    }

    async handleResumeReturnAuthUrl(): Promise<string> {
    	const state = await this.iprService.createSession();
    	loggingHelper.info("State ", { state });
    	const redirectUri = encodeURIComponent(EnvironmentVariables.getRedirectUrl());
    	loggingHelper.info("RedirectUri", { redirectUri });
    	const nonce = randomUUID();
    	const discoveryEndpoint = EnvironmentVariables.getDiscoveryEndpoint();

    	if (!ReturnController.clientId) {
    		loggingHelper.info("Fetching CLIENT_ID from SSM" );
    		ReturnController.clientId = await this.iprService.getParameter(EnvironmentVariables.getClientIdSsmPath());
    	}
    	const authorizeUrl = `${discoveryEndpoint}/authorize?result=sign-in&response_type=code&scope=openid&client_id=${ReturnController.clientId}&state=${state}&redirect_uri=${redirectUri}&nonce=${nonce}`;
    	loggingHelper.info("Authorize url", { authorizeUrl });
    	return authorizeUrl;
    }

    async handleRedirect(req: any, res: any): Promise<any> {

    	console.log("================================");
    	if (req.query) {
    		console.log("req.query", req.query);

    		loggingHelper.info("Query params received", { "queryParams":req.query });
    		if (req.query.error) {
    			loggingHelper.error("Received error response from /authorize", {
    				"error": req.query.error,
    				"error_description": req.query.error_description,
    			});
    			this.redirectToDashboard(res, "Received error response from /authorize");
    		}

    		console.log("state", req.query.state);
    		console.log("code", req.query.code);

    		if (req.query.state && req.query.code) {
    			try {
    				loggingHelper.info("Received success response", { "code": req.query.code, "state": req.query.state });
    				await this.iprService.deleteSession(req.query.state);

    				console.log("succcessfully deleted from db");

    			} catch {
    				this.redirectToDashboard(res, "Got error deleting record from DB");
    			}
    			const sessionUrl = `${EnvironmentVariables.getApiBaseUrl()}/session?code=${req.query.code}`;

    			const headers = {
    				...createPersonalDataHeaders(sessionUrl, req),
				  };

    			console.log("sessionUrl", sessionUrl);
    			console.log("headers", headers);
					

    			try {
    				const resp: AxiosResponse = await axios.get(sessionUrl, { headers });
    				loggingHelper.info("Received response", { "response":resp?.data, "statusCode":resp?.status });

    				if (resp.data && resp.status === 200 &&
						resp.data.redirect_uri && resp.data.status === "completed") {
    					loggingHelper.info("Redirecting to RelyingParty", { "redirectUri":resp.data?.redirect_uri });
    					const rpUrl = new URL(resp.data.redirect_uri);

    					//To handle audit events that were generated from these RPs before updated to registry was made
    					//https://govukverify.atlassian.net/browse/F2F-958
    					if (!rpUrl.hostname.startsWith("www") &&
							(rpUrl.hostname === Constants.DBS_BASE_URL || rpUrl.hostname === Constants.DVLA_BASE_URL) ) {
    						loggingHelper.info("Found DBS or DVLA hostname without www in redirect url hence appending it");
    						rpUrl.hostname = "www" + "." + rpUrl.hostname;
    					}
    					res.redirect(rpUrl.toString());
    				} else {
    					this.redirectToDashboard(res, "Received no data, missing mandatory params in response or statusCode other than 200" );
    				}

    			} catch (e) {
    				this.redirectToDashboard(res, "Received error calling /session and redirecting to RP", e );
    			}
    		} else {
    			this.redirectToDashboard(res, "Missing mandatory fields");
    		}
    	} else {
    		this.redirectToDashboard(res, "Missing query parameters in request");
    	}

    }

    redirectToDashboard(res: any, reason: string, error?: any): void {
    	if (error) {
    		loggingHelper.error("Redirecting to accounts dashboard", { reason, error });
    	} else {
    		loggingHelper.error("Redirecting to accounts dashboard", { reason });
    	}

    	res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
    }
}
