import express from "express";
import { ReturnController } from "./controller/ReturnController";
import { loggingHelper } from "./utils/LoggingHelper";
import { EnvironmentVariables } from "./utils/EnvironmentVariables";

import { axiosMiddleware } from "./lib"; 

export const register = ( router: express.Application ) => {
	router.use((req, res, next) => {
		if (process.env.NODE_ENV === "development") {
			req.scenarioIDHeader = req.headers["x-scenario-id"];
		}
		next();
	});

	router.use(axiosMiddleware)


	router.get("/healthcheck", (req, res) => {
		loggingHelper.info(`Healthcheck returning 200 OK.`);
		return res.status(200).send("OK");
	});

	router.get("/resume", async (req, res) => {
		try {
			loggingHelper.info("Processing /resume");
			const authorizeUrl = await ReturnController.getInstance().handleResumeReturnAuthUrl();
			loggingHelper.info("Successfully processed /resume");

			res.redirect(authorizeUrl);
		} catch (e) {
			//potential bug no redirect here
			loggingHelper.error("Received unexpected error handling /resume", { "error": e });
		}
	});

	router.get("/callback", async (req, res): Promise<void> => {
		try {
			loggingHelper.debug("Processing /callback");
			await ReturnController.getInstance().handleRedirect(req, res);
		} catch (ex) {
			loggingHelper.error("Received unexpected error", { "error": ex });
			loggingHelper.info("Redirecting to accounts dashboard");
			res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
		}
	});

	if (EnvironmentVariables.getStubbedEnvironmentFlag() === "true" ) {
		router.get("/authorize", async (req, res): Promise<void> => {
			loggingHelper.debug("Stubbed auth");
			res.redirect("/callback?code=H8ejrfFxcfg3Bq-WAK-3kMDpWsTQBB2zmEUpE7NumZ2&state=098a402d-1b8d-421e-88f5-f5db0d6728d8");
		});
		router.get("/rp", async (req, res): Promise<void> => {
			loggingHelper.debug("Stubbed RP");
			res.type("text/plain");
			res.send("Stubbed RP");
		});
	}

	//For any other paths, redirect to /resume
	router.use((req, res, next) => {
		try {
			loggingHelper.info("Processing custom path, redirecting to /resume", { "path": req.path });
			res.redirect(`http://${EnvironmentVariables.getFrontEndDomain()}:${EnvironmentVariables.getPort()}/resume`);
		} catch (ex) {
			loggingHelper.error("Received unexpected error", { "error": ex });
			loggingHelper.info("Redirecting to accounts dashboard");
			res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
		}
	});

};

