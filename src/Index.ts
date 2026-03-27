import { EnvironmentVariables } from "./utils/EnvironmentVariables";
import app from "./App"

import { loggingHelper } from "./utils/LoggingHelper";

app.listen(EnvironmentVariables.getPort(), () => {
	return loggingHelper.info(
		`IPV Return app listening at http://${EnvironmentVariables.getFrontEndDomain()}:${EnvironmentVariables.getPort()}`
	);
});