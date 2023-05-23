import { EnvironmentVariables } from "./utils/EnvironmentVariables";
import express from "express";

import * as Routes from "./Routes";
import {loggingHelper} from "./utils/LoggingHelper";

const index = express();

Routes.register(index);

index.listen(EnvironmentVariables.getPort(), () => {
	return loggingHelper.info(`IPV Return app listening at http://${EnvironmentVariables.getFrontEndDomain()}:${EnvironmentVariables.getPort()}`);
});
