import express from "express";
import { ReturnController } from "./controller/ReturnController";
import { loggingHelper } from "./utils/LoggingHelper";
import { EnvironmentVariables } from "./utils/EnvironmentVariables";

export const register = ( router: express.Application ) => {
	router.get("/resume", async (req, res) => {
		try {
			loggingHelper.info("Processing /resume");
			const authorizeUrl = await ReturnController.getInstance().handleResumeReturnAuthUrl();
			res.redirect(authorizeUrl);
		} catch (e) {
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

