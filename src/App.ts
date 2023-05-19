import express from 'express';
import {ReturnController} from "./controller/ReturnController";
import {loggingHelper} from "./utils/LoggingHelper";
import {EnvironmentVariables} from "./utils/EnvironmentVariables";

const app = express();

 app.get('/resume', async (req, res) => {
     const authorizeUrl = await ReturnController.getInstance().handleResumeReturnAuthUrl();
     res.redirect(authorizeUrl);

});

app.get('/callback', async (req, res) => {

    loggingHelper.debug("Processing /callback")

    await ReturnController.getInstance().handleRedirect(req,res);
    //res.send(`Hello World!`);
});

app.listen(EnvironmentVariables.getPort(), () => {
    return console.log(`IPV Return app listening at http://${EnvironmentVariables.getFrontEndDomain()}:${EnvironmentVariables.getPort()}`);
});
