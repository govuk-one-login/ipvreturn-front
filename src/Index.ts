import { EnvironmentVariables } from "./utils/EnvironmentVariables";
import express from "express";

import * as Routes from "./Routes";
import { loggingHelper } from "./utils/LoggingHelper";

const index = express();

index.get("/healthcheck", (req, res) => {
	loggingHelper.info(`Healthcheck returning 200 OK.`);
	return res.status(200).send("OK");
});

Routes.register(index);

index.listen(EnvironmentVariables.getPort(), () => {
	return loggingHelper.info(`IPV Return app listening at http://${EnvironmentVariables.getFrontEndDomain()}:${EnvironmentVariables.getPort()}`);
});

export default index;
