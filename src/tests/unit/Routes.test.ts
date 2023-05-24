import request from "supertest";
import index from "../../Index";

import { mockClient } from "aws-sdk-client-mock";
import { DeleteCommand, DynamoDBDocument, PutCommand } from "@aws-sdk/lib-dynamodb";
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import axios from "axios";
jest.mock("axios");

const ddbMock = mockClient(DynamoDBDocument);
const ssmMock = mockClient(SSMClient);
const mockedAxios = axios as jest.Mocked<typeof axios>;

ddbMock.on(PutCommand).resolves({});
ddbMock.on(DeleteCommand).resolves({});
ssmMock.on(GetParameterCommand).resolves(
	{
		Parameter: {
			Name: "/order/main/endpoint/base-url",
			Type: "String",
			Value: "1234",
			Version: 1,
			ARN: "arn:aws:ssm:us-west-1:123:/order/main/endpoint/base-url",
		},
	});


describe("Routes test", () => {
	beforeEach(() => {
		ddbMock.reset();
	});

	it("successfully call /resume", async () => {
		await request(index).get("/resume").send({}).expect(302);
	});

	it("successfully call /callback", async () => {
		mockedAxios.get.mockResolvedValue({ status:200, data: { "status":"completed", "redirect_uri":"dummy RP url" } });
		await request(index).get("/callback").query({
			"state":"471600cc-1af0-4254-8fbd-2b284b49c12c",
			"code":"q9t6SBUyUBZERuC3daBM6u3PKGeDspDgQoS8PC0H2o4" }).expect(302);
	});
});
