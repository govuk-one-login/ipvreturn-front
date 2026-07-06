import { AxiosInstance } from "axios";

declare global {
  namespace Express {
    interface Request {
      axios: AxiosInstance;
      scenarioIDHeader?: string | string[];
    }
  }
}
