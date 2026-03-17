import index from "../../Index";
import { loggingHelper } from "../../utils/LoggingHelper";
import { EnvironmentVariables } from "../../utils/EnvironmentVariables";
import express from "express";
// import supertest from "supertest"
const request = require('supertest')

describe("index test", () => {
    it('gets 200 OK from /healthcheck endpoint', function (done) {
    request(index)
      .get('/healthcheck')
      .expect(200, "OK", done);
  });
});
