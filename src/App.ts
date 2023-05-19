import express from 'express';
import {ReturnController} from "./controller/ReturnController";
import axios from "axios";
import {loggingHelper} from "./utils/LoggingHelper";
import {EnvironmentVariables} from "./utils/EnvironmentVariables";

const app = express();

//const iprService = ReturnService.getInstance("IPR-front-sessions-dev-frontend-main-richa",  createDynamoDbClient());
// AWS.config.update({
//     region: "eu-west-2",
// });

// const DynamoDBStore = connect(expressSession);
// const dynamodb = new AWS.DynamoDB();

// const dynamoDBSessionStore = new DynamoDBStore({
//     client: dynamodb,
//     table: "IPR-front-sessions-dev-frontend-main-richa",
// });

// const sessionConfig = {
//     cookieName: "service_session",
//     secret: 'not secret',
//     cookieOptions: { maxAge: 100 },
//     ...("IPR-front-sessions-dev-frontend-main-richa" && { sessionStore: dynamoDBSessionStore }),
// };
//
// const session = expressSession({
//     store: dynamoDBSessionStore,
//     cookie: {
//         secure: 'auto',
//         ...{}
//     },
//     key: "iprcookie",
//     secret: "not secret",
//     resave: true,
//     saveUninitialized: true
// });
//
//
// app.use(session);

// await axios.post('/user', {
//     firstName: 'Fred',
//     lastName: 'Flintstone'
// })
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

 app.get('/resume', async (req, res) => {
     const authorizeUrl = await ReturnController.getInstance().handleResumeReturnAuthUrl();
     loggingHelper.info("Authorize url ",{"authorizeUrl":authorizeUrl});
     res.redirect(authorizeUrl);

});

app.get('/callback', async (req, res) => {

    loggingHelper.debug("Processing /callback")
    try {

        if (req.query.error) {
            loggingHelper.error("Received error response from /authorize", {
                "error": req.query.error,
                "error_description": req.query.error_description
            });
            loggingHelper.info("Redirecting to accounts dashboard");
            res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
        }
        if (req.query.state && req.query.code) {
            try {
                loggingHelper.info("Received success response", {"code": req.query.code, "state": req.query.state})
                await ReturnController.getInstance().handleRedirect(req.query.state as string)
            } catch {
                loggingHelper.error("Got error deleting record from DB");
                loggingHelper.info("Redirecting to accounts dashboard");
                res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
            }

            try {
                const resp = await axios.get(`${EnvironmentVariables.getApiBaseUrl()}/session?code=${req.query.code}`);
                console.log("Redirecting to ", resp.data?.redirect_uri)
                res.redirect(resp.data?.redirect_uri);
            } catch (e) {
                loggingHelper.error("Received error calling /session and redirecting to RP", {"error": e});
                loggingHelper.info("Redirecting to accounts dashboard");
                res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
            }
        } else {
            loggingHelper.error("Missing mandatory fields");
            loggingHelper.info("Redirecting to accounts dashboard");
            res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
        }
    } catch(ex){
        loggingHelper.error("Received unexpected error",{"error":ex});
        loggingHelper.info("Redirecting to accounts dashboard");
        res.redirect(EnvironmentVariables.getAccountsDashboardUrl());
    }
    //res.send(`Hello World!`);
});

app.listen(EnvironmentVariables.getPort(), () => {
    return console.log(`IPV Return app listening at http://${EnvironmentVariables.getFrontEndDomain()}:${EnvironmentVariables.getPort()}`);
});
