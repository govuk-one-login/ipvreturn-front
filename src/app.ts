import express from 'express';

// @ts-ignore


import {returnController} from "./controller/returnController";

//import axios from 'axios';

const app = express();
const port = process.env.PORT || 8080;
const host = process.env.FRONT_END_CUSTOM_DOMAIN || "localhost";
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
     const authorizeUrl = await returnController.getInstance().handleResumeReturnAuthUrl();
     res.redirect(authorizeUrl);

});

app.get('/callback', async (req, res) => {

    console.log("CAME HERE")
    console.log(req.path)

    console.log(req.query.code)

    console.log(req.query.state)

    console.log(req.query.error)
    if(req.query.state){
        console.log("calling handleRedirect")
        await returnController.getInstance().handleRedirect(req.query.state as string)
    }
    //call API_BASE_URL/session with the code in try catch
    // const iprService = ReturnService.getInstance("IPR-front-sessions-dev-frontend-main-richa",  createDynamoDbClient());
    //
    // console.log(JSON.stringify(iprService));
    // await iprService.updateSessionInUse(req.query.state as string)
    res.send(`Hello World!`);
});

app.listen(port, () => {
    return console.log(`Return app listening at http://${host}:${port}`);
});
