import express from "express";
import * as Routes from "./Routes";
import { loggingHelper } from "./utils/LoggingHelper";

const app = express();

app.get("/healthcheck", (req, res) => {
	loggingHelper.info(`Healthcheck returning 200 OK.`);
	return res.status(200).send("OK");
});

Routes.register(app);

export default app;
