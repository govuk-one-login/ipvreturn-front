import index from "../../Index";
import { mock } from "jest-mock-extended";
import { ReturnController } from "../../controller/ReturnController";

const request = require('supertest')

const mockReturnController = mock<ReturnController>();

describe("Routes", () => {
	it('gets 200 OK from /healthcheck endpoint', (done) => {
        request(index).get('/healthcheck').expect(200, "OK", done);
    });
    
    it('gets 302 redirect from /callback endpoint', async () => {
        const response = await request(index).get('/callback');
        expect(response.status).toEqual(302);
    });

    it('gets response from /resume endpoint', async () => {
        ReturnController.getInstance = jest.fn().mockReturnValue(mockReturnController);
        const response = await request(index).get('/resume')
        expect(response.status).toEqual(302);
    });

});
