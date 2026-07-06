import { mock } from "jest-mock-extended";
import { ReturnController } from "../../src/controller/ReturnController";

const request = require('supertest')

describe("Routes", () => {

    beforeEach(() => {
        process.env.STUBBED_ENVIRONMENT = "false"
        process.env.USE_MOCKED = "false";
        jest.resetModules(); 
    });

	it('gets 200 OK from /healthcheck endpoint', async () => {
        let app = (await import("../../src/App")).default;

        const response = await request(app).get('/healthcheck');
        expect(response.status).toEqual(200);
    });
    
    it('gets 302 redirect from /callback endpoint', async () => {
        const { ReturnController: ReturnControllerClass } = await import("../../src/controller/ReturnController");
        const mockReturnController = mock<ReturnController>();

        const expectedRedirectUrl = "https://mocked-auth-url.com/redirect";
        mockReturnController.handleRedirect.mockImplementation(async (req, res) => {
            // You must actually call a response method here
            res.redirect(expectedRedirectUrl); 
            return expectedRedirectUrl; // Return the string if your controller usually does
        });
        ReturnControllerClass.getInstance = jest.fn().mockReturnValue(mockReturnController);        
        
        let app = (await import("../../src/App")).default;
        
        await request(app).get('/callback')

        expect(ReturnControllerClass.getInstance).toHaveBeenCalledTimes(1);
        expect(mockReturnController.handleRedirect).toHaveBeenCalledTimes(1);
    });

    it('redirects to the dashboard on error from return controller on /callback', async () => {
        const { ReturnController: ReturnControllerClass } = await import("../../src/controller/ReturnController");
        const mockReturnController = mock<ReturnController>();

        const expectedRedirectUrl = "https://accounts_dashboard_url";
        mockReturnController.handleRedirect.mockRejectedValue("error");
        ReturnControllerClass.getInstance = jest.fn().mockReturnValue(mockReturnController);
        
        let app = (await import("../../src/App")).default;


        const response = await request(app).get('/callback')

        expect(response.status).toEqual(302);
        expect(response.headers.location).toEqual(expectedRedirectUrl);
        expect(ReturnControllerClass.getInstance).toHaveBeenCalledTimes(1);
        expect(mockReturnController.handleRedirect).toHaveBeenCalledTimes(1);
    });

    it('gets response from /resume endpoint', async () => {
        const { ReturnController: ReturnControllerClass } = await import("../../src/controller/ReturnController");
        const mockReturnController = mock<ReturnController>();

        const expectedRedirectUrl = "https://mocked-auth-url.com/redirect";
        mockReturnController.handleResumeReturnAuthUrl.mockResolvedValue(expectedRedirectUrl);
        ReturnControllerClass.getInstance = jest.fn().mockReturnValue(mockReturnController);        
        
        let app = (await import("../../src/App")).default;
        
        const response = await request(app).get('/resume')

        expect(response.status).toEqual(302);
        expect(response.headers.location).toEqual(expectedRedirectUrl);
        expect(ReturnControllerClass.getInstance).toHaveBeenCalledTimes(1);
        expect(mockReturnController.handleResumeReturnAuthUrl).toHaveBeenCalledTimes(1);
    });

    it('gets response from /authorize endpoint', async () => {
        process.env.STUBBED_ENVIRONMENT = "true";
        const { ReturnController: ReturnControllerClass } = await import("../../src/controller/ReturnController");
        const mockReturnController = mock<ReturnController>();

        const expectedRedirectUrl = "/callback?code=H8ejrfFxcfg3Bq-WAK-3kMDpWsTQBB2zmEUpE7NumZ2&state=098a402d-1b8d-421e-88f5-f5db0d6728d8";
        mockReturnController.handleResumeReturnAuthUrl.mockResolvedValue(expectedRedirectUrl);
        ReturnControllerClass.getInstance = jest.fn().mockReturnValue(mockReturnController);
        
        let app = (await import("../../src/App")).default;
        
        const response = await request(app).get('/authorize')

        expect(response.status).toEqual(302);
        expect(response.headers.location).toEqual(expectedRedirectUrl);
    });

    it('gets response from /rp endpoint', async () => {
        process.env.STUBBED_ENVIRONMENT = "true";

        const { ReturnController: ReturnControllerClass } = await import("../../src/controller/ReturnController");
        const mockReturnController = mock<ReturnController>();

        const expectedRedirectUrl = "/callback?code=H8ejrfFxcfg3Bq-WAK-3kMDpWsTQBB2zmEUpE7NumZ2&state=098a402d-1b8d-421e-88f5-f5db0d6728d8";
        mockReturnController.handleResumeReturnAuthUrl.mockResolvedValue(expectedRedirectUrl);
        ReturnControllerClass.getInstance = jest.fn().mockReturnValue(mockReturnController);

        let app = (await import("../../src/App")).default;
        
        const response = await request(app).get('/rp')

        expect(response.status).toEqual(200);
        expect(response.text).toContain("Stubbed RP");
    });

    it('redirects to resume for unknown endpoint', async () => {
        let app = (await import("../../src/App")).default;
        const expectedRedirectUrl = "http://test-localhost:9100/resume";
        
        const response = await request(app).get('/abc')

        expect(response.status).toEqual(302);
        expect(response.headers.location).toEqual(expectedRedirectUrl);
    });

});
