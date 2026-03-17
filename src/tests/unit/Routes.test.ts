import { EnvironmentVariables } from "../../utils/EnvironmentVariables";
import express, { Router } from "express";

import * as Routes from "../../Routes";
import { register } from "../../Routes";
import index from "../../Index";
import { loggingHelper } from "../../utils/LoggingHelper"; 
const request = require('supertest')

describe("Routes", () => {
	it('gets 200 OK from /healthcheck endpoint', (done) => {
        request(index)
            .get('/healthcheck')
            .expect(200, "OK", done);
    });

    it('gets 302 redirect from /callback endpoint', async () => {
        const response = await request(index)
            .get('/callback')
        expect(response.status).toEqual(302);
    });  
})
