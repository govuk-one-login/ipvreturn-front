import express from "express";
import * as Routes from "./Routes";

const app = express();

Routes.register(app);

export default app;
