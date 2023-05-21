import {EnvironmentVariables} from "./utils/EnvironmentVariables";
import express from "express";

import * as Routes from "./Routes";

const index = express();

//app.use(Routes);
Routes.register(index);

index.listen(EnvironmentVariables.getPort(), () => {
    return console.log(`IPV Return app listening at http://${EnvironmentVariables.getFrontEndDomain()}:${EnvironmentVariables.getPort()}`);
});
