import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const awsRegion = process.env.AWS_REGION;
export const createDynamoDbClient = () => {
	const marshallOptions = {
		convertEmptyValues: false,
		removeUndefinedValues: true,
		convertClassInstanceToMap: true,
	};
	const unmarshallOptions = {
		wrapNumbers: false,
	};
	const translateConfig = { marshallOptions, unmarshallOptions };
	const useMocks = process.env.USE_MOCKED === "true";
	const endpoint = useMocks ? "http://localhost:8000" : undefined;
	const dbClient = new DynamoDBClient({ region: awsRegion, endpoint });
	const dbClientRaw = DynamoDBDocument.from(dbClient, translateConfig);
	return dbClientRaw;
};
