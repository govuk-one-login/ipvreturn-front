import { Request, Response, NextFunction } from "express";
import axiosMiddleware from "../../../src/lib/axios";
import sinon from "sinon";

// Define a type for our stub to avoid 'any'
interface AxiosStub {
  create: sinon.SinonSpy;
}

let axiosStub: AxiosStub = {
  create: sinon.fake(),
};


describe("axios middleware", () => {
  let req: any; // Using any for mocks to simplify attaching custom props
  let res: Partial<Response>;
  let next: sinon.SinonStub;
  let axiosClient: any;

  beforeEach(() => {
    // Basic Express Mocks
    req = {
      app: {
        get: sinon.stub(),
      },
      headers: {},
      scenarioIDHeader: undefined,
    };
    
    res = {};
    next = sinon.stub();

    // Mock the API Base URL process/app logic
    process.env.API_BASE_URL = "http://example.net";

    axiosClient = {
      defaults: {
        headers: {
          common: {}
        }
      },
      interceptors: {
        request: { use: sinon.stub() },
        response: { use: sinon.stub() },
      },
    };

    axiosStub.create = sinon.fake.returns(axiosClient);
  });

  describe("with 'scenarioIdHeader'", () => {
    it("should add x-scenario-id to axios headers", () => {
      req.scenarioIDHeader = "test-scenario-success";
      axiosMiddleware(req as Request, res as Response, next as NextFunction);

      expect(req.axios.defaults.headers.common["x-scenario-id"]).toEqual(
        "test-scenario-success"
      );
    });
  });

  describe("without 'scenarioIdHeader'", () => {
    it("should not add x-scenario-id to axios headers", () => {
      delete req.scenarioIDHeader;
      axiosMiddleware(req as Request, res as Response, next as NextFunction);

      expect(req.axios?.defaults?.headers?.common?.["x-scenario-id"]).toBeUndefined();
    });
  });

  describe("with 'x-forwarded-for'", () => {
    it("should add x-forwarded-for to axios headers", () => {
      req.headers["forwarded"] = "for=192.0.2.0;host=subdomain.example.gov.uk;proto=http";

      axiosMiddleware(req as Request, res as Response, next as NextFunction);

      expect(req.axios.defaults.headers.common["x-forwarded-for"]).toEqual("192.0.2.0");
    });
  });

  describe("without 'x-forwarded-for'", () => {
    it("should not add x-forwarded-for to axios headers", () => {
      delete req.headers["forwarded"];
      axiosMiddleware(req as Request, res as Response, next as NextFunction);

      expect(req.axios?.defaults?.headers?.common?.["x-forwarded-for"]).toBeUndefined();
    });
  });
});
