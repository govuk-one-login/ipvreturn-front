import { ReturnService } from "../services/ReturnService";
import { createDynamoDbClient } from "../utils/DynamoDBFactory";
import { randomUUID } from "crypto";
import { EnvironmentVariables } from "../utils/EnvironmentVariables";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { loggingHelper } from "../utils/LoggingHelper";
import axios, { AxiosResponse } from "axios";
import { Constants } from "../utils/Constants";
import { createPersonalDataHeaders } from "@govuk-one-login/frontend-passthrough-headers";
import { Request, Response } from "express";

export class ReturnController {
  private static instance: ReturnController;

  private static clientId: string;

  private readonly iprService: ReturnService;

  constructor(tableName: string, dynamoDbClient: DynamoDBDocument) {
    this.iprService = ReturnService.getInstance(tableName, dynamoDbClient);
  }

  static getInstance(): ReturnController {
    if (!ReturnController.instance) {
      ReturnController.instance = new ReturnController(
        EnvironmentVariables.getSessionTableName(),
        createDynamoDbClient()
      );
    }
    return ReturnController.instance;
  }

  async handleResumeReturnAuthUrl(): Promise<string> {
    const state = await this.iprService.createSession();
    loggingHelper.info("State ", { state });
    const redirectUri = EnvironmentVariables.getRedirectUrl();
    loggingHelper.info("RedirectUri", { redirectUri });
    const nonce = randomUUID();
    const discoveryEndpoint = EnvironmentVariables.getDiscoveryEndpoint();

    if (!ReturnController.clientId) {
      loggingHelper.info("Fetching CLIENT_ID from SSM");
      ReturnController.clientId = await this.iprService.getParameter(
        EnvironmentVariables.getClientIdSsmPath()
      );
    }

    const queryParams = new URLSearchParams({
      result: "sign-in",
      response_type: "code",
      scope: "openid",
      client_id: ReturnController.clientId,
      state,
      redirect_uri: redirectUri,
      nonce,
    });

    if (EnvironmentVariables.getFeatureFlagIdentityRp()) {
      queryParams.append("vtr", JSON.stringify(["Cl.Cm.P2"]));
      queryParams.append(
        "claims",
        JSON.stringify({
          userinfo: {
            "https://vocab.account.gov.uk/v1/coreIdentityJWT": null,
          },
        })
      );
    }
    const authorizeUrl = new URL("/authorize", discoveryEndpoint);
    authorizeUrl.search = queryParams.toString();
    loggingHelper.info("Authorize url", { authorizeUrl: authorizeUrl.href });
    return authorizeUrl.href;
  }

  async handleRedirect(req: Request, res: Response): Promise<void> {
    if (!req.query) {
      this.redirectToDashboard(res, "Missing query parameters in request");
      return;
    }

    loggingHelper.info("Query params received", { queryParams: req.query });

    if (req.query.error) {
      loggingHelper.error("Received error response from /authorize", {
        error: req.query.error,
        error_description: req.query.error_description,
      });
      this.redirectToDashboard(res, "Received error response from /authorize");
      return;
    }

    if (!req.query.state || !req.query.code) {
      this.redirectToDashboard(res, "Missing mandatory fields");
      return;
    }

    try {
      loggingHelper.info("Received success response", {
        code: req.query.code,
        state: req.query.state,
      });
      await this.iprService.deleteSession(req.query.state as string);
    } catch {
      this.redirectToDashboard(res, "Got error deleting record from DB");
      return;
    }
    const sessionUrl = `${EnvironmentVariables.getApiBaseUrl()}/session?code=${req.query.code}`;

    const headers = {
      ...createPersonalDataHeaders(sessionUrl, req),
    };

    let resp: AxiosResponse;

    try {
      resp = await axios.get(sessionUrl, { headers });
      loggingHelper.info("Received response", {
        response: resp?.data,
        statusCode: resp?.status,
      });
    } catch (e) {
      this.redirectToDashboard(
        res,
        "Received error calling /session and redirecting to RP",
        e as Error
      );
      return;
    }

    if (
      !resp.data ||
      resp.status !== 200 ||
      !resp.data.redirect_uri ||
      resp.data.status !== "completed"
    ) {
      this.redirectToDashboard(
        res,
        "Received no data, missing mandatory params in response or statusCode other than 200"
      );
      return;
    }

    loggingHelper.info("Redirecting to RelyingParty", {
      redirectUri: resp.data?.redirect_uri,
    });
    const rpUrl = new URL(resp.data.redirect_uri);

    //To handle audit events that were generated from these RPs before updated to registry was made
    //https://govukverify.atlassian.net/browse/F2F-958
    if (
      !rpUrl.hostname.startsWith("www") &&
      (rpUrl.hostname === Constants.DBS_BASE_URL ||
        rpUrl.hostname === Constants.DVLA_BASE_URL)
    ) {
      loggingHelper.info(
        "Found DBS or DVLA hostname without www in redirect url hence appending it"
      );
      rpUrl.hostname = "www" + "." + rpUrl.hostname;
    }
    res.redirect(rpUrl.toString());
    return;
  }

  redirectToDashboard(res: Response, reason: string, error?: Error): void {
    if (error) {
      loggingHelper.error("Redirecting to accounts dashboard", {
        reason,
        error,
      });
    } else {
      loggingHelper.error("Redirecting to accounts dashboard", { reason });
    }

    res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
  }
}
