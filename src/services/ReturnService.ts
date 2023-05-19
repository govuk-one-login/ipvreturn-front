/* eslint-disable no-console */

import { DeleteCommandInput, DynamoDBDocument, PutCommand} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import {Session} from "../models/Session";
import {AppError} from "../utils/AppError";
import {HttpCodesEnum} from "../utils/HttpCodesEnum";
import {loggingHelper} from "../utils/LoggingHelper";

export class ReturnService {
    readonly tableName: string;

    private readonly dynamo: DynamoDBDocument;

    private static instance: ReturnService;

    private constructor(tableName: any, dynamoDbClient: DynamoDBDocument) {
        this.tableName = tableName;
        this.dynamo = dynamoDbClient;
    }

    static getInstance(tableName: string, dynamoDbClient: DynamoDBDocument): ReturnService {
        if (!ReturnService.instance) {
            ReturnService.instance = new ReturnService(tableName, dynamoDbClient);
        }
        return ReturnService.instance;
    }

    async deleteSession(state: string): Promise<void> {
        loggingHelper.info("Deleting session record in dynamodb");

        const params: DeleteCommandInput = {
            TableName: this.tableName,
            Key: { state }
        };

        loggingHelper.info("DeleteCommandInput: ", {"deleteCommandInput": params});
        try {
            await this.dynamo.delete(params);
            loggingHelper.info("deleted session record in dynamodb" );
        } catch (error) {
            loggingHelper.error("got error saving Access token details", {"error": error });
            throw new AppError(HttpCodesEnum.SERVER_ERROR, "deleteItem - failed: got error deleting session record");
        }
    }

    async createSession(): Promise<string> {

        loggingHelper.info("Creating session record in dynamodb");
        const state = randomUUID();

        const putSessionCommand = new PutCommand({
            TableName: this.tableName,
            Item: new Session(state),
        });

        loggingHelper.info("PutSessionInfoCommand: ", {"putSessionCommand": putSessionCommand});

        try {
            await this.dynamo.send(putSessionCommand);
            return state;
        } catch (e: any) {
            loggingHelper.error("Failed to create session record in dynamo", {"error":e });
            throw new AppError(HttpCodesEnum.SERVER_ERROR, "Error updating session record");
        }
    }
}
