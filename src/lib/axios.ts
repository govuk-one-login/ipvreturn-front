import { Request, Response, NextFunction } from "express";
import axios, { AxiosInstance } from "axios";
import userIpAddress from "./user-ip-address";

export default function axiosMiddleware(req: Request, res: Response, next: NextFunction): void {
  const baseURL = process.env.API_BASE_URL;

  if (!baseURL) {
    return next(new Error("Missing API.BASE_URL value"));
  }

  const instance: AxiosInstance = axios.create({
    baseURL,
  });

  req.axios = instance;

  if (req.scenarioIDHeader && req.axios.defaults.headers.common) {
    req.axios.defaults.headers.common["x-scenario-id"] = req.scenarioIDHeader;
  }

  const forwardedHeader = req.headers["forwarded"];
  if (forwardedHeader && req.axios.defaults.headers.common) {
    const ipAddress = userIpAddress(forwardedHeader as string);
    if (ipAddress) {
      req.axios.defaults.headers.common["x-forwarded-for"] = ipAddress;
    }
  }

  next();
}
