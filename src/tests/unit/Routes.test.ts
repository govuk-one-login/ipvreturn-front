import app from "../../App";
import { mock } from "jest-mock-extended";
import { ReturnController } from "../../controller/ReturnController";

const request = require('supertest')

const mockReturnController = mock<ReturnController>();

describe("Routes", () => {

	it('gets 200 OK from /healthcheck endpoint', async () => {
        const response = await request(app).get('/healthcheck');
        expect(response.status).toEqual(200);
    });
    
    it('gets 302 redirect from /callback endpoint', async () => {
        const response = await request(app).get('/callback');
        expect(response.status).toEqual(302);
    });

    it('gets response from /resume endpoint', async () => {
        const expectedRedirectUrl = "https://mocked-auth-url.com/redirect";
        mockReturnController.handleResumeReturnAuthUrl.mockResolvedValue(expectedRedirectUrl);
        ReturnController.getInstance = jest.fn().mockReturnValue(mockReturnController);
        
        const response = await request(app).get('/resume')

        expect(response.status).toEqual(302);
        expect(response.headers.location).toEqual(expectedRedirectUrl);
        expect(ReturnController.getInstance).toHaveBeenCalledTimes(1);
        expect(mockReturnController.handleResumeReturnAuthUrl).toHaveBeenCalledTimes(1);
    });

});
