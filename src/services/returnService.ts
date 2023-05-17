/* eslint-disable no-console */
//import { AppError } from "../utils/AppError";
import {
    DeleteCommandInput,
    DynamoDBDocument,
    PutCommand,

} from "@aws-sdk/lib-dynamodb";

import { randomUUID } from "crypto";
import {Session} from "../models/session";
import {AppError} from "../utils/appError";
import {HttpCodesEnum} from "../utils/httpCodesEnum";

export class returnService {
    readonly tableName: string;

    private readonly dynamo: DynamoDBDocument;

    private static instance: returnService;

    private constructor(tableName: any, dynamoDbClient: DynamoDBDocument) {
        this.tableName = tableName;
        this.dynamo = dynamoDbClient;
    }

    static getInstance(tableName: string, dynamoDbClient: DynamoDBDocument): returnService {
        if (!returnService.instance) {
            returnService.instance = new returnService(tableName, dynamoDbClient);
        }
        return returnService.instance;
    }

    async deleteSession(state: string): Promise<void> {
        const params: DeleteCommandInput = {
            TableName: this.tableName,
            Key: { state }
        };

        console.log(params)
        try {
            await this.dynamo.delete(params);
            console.log({ message: "deleted session record in dynamodb" });
        } catch (error) {
            //this.logger.error({ message: "got error saving Access token details", error });
            throw new AppError(HttpCodesEnum.SERVER_ERROR, "deleteItem - failed: got error deleting session record");
        }


        // if (!sessionItem?.Items || sessionItem?.Items?.length !== 1) {
        //     throw new AppError(HttpCodesEnum.SERVER_ERROR, "Error retrieving Session by authorization code");
        // }
        //
        // return sessionItem.Items[0] as Session;

        // const updateSessionInUse = new UpdateCommand({
        //     TableName: this.tableName,
        //     Key: { state },
        //     UpdateExpression: "SET inUse = :inUse",
        //     ExpressionAttributeValues: {
        //         ":inUse": true
        //     },
        // });
        //
        // console.log({ message: "updating Access token details in dynamodb", updateSessionInUse });
        // try {
        //     await this.dynamo.send(updateSessionInUse);
        //     console.log({ message: "updated Access token details in dynamodb" });
        // } catch (error) {
        //     //this.logger.error({ message: "got error saving Access token details", error });
        //     throw new AppError(HttpCodesEnum.SERVER_ERROR, "updateItem - failed: got error saving Access token details");
        // }
    }

    async saveEventData(): Promise<string> {

        console.log({ message: "Saving session data to dynamodb"});
        const state = randomUUID();

        const putSessionCommand = new PutCommand({
            TableName: this.tableName,
            Item: new Session(state),
        });

        console.log("PutSessionInfoCommand: ", JSON.stringify( putSessionCommand ));
        console.log("Creating session record" );

        try {
            await this.dynamo.send(putSessionCommand);
            return state;
        } catch (e: any) {
            console.log({ message: "Failed to create session record in dynamo", e });
            throw e;
            //throw new AppError(HttpCodesEnum.SERVER_ERROR, "Error updating session record");
        }
    }

}
