import app from "../../App";
import { ReturnController } from "../../controller/ReturnController";
import supertest from "supertest";
import { mock } from 'vitest-mock-extended';

const mockReturnController = mock<ReturnController>();

describe("Routes", () => {
  it("gets 200 OK from /healthcheck endpoint", async () => {
    const response = await supertest(app).get("/healthcheck");
    expect(response.status).toEqual(200);
  });

  it("gets 302 redirect from /callback endpoint", async () => {
    const response = await supertest(app).get("/callback");
    expect(response.status).toEqual(302);
  });

  it("gets response from /resume endpoint", async () => {
    const expectedRedirectUrl = "https://mocked-auth-url.com/redirect";
    mockReturnController.handleResumeReturnAuthUrl.mockResolvedValue(
      expectedRedirectUrl
    );
    ReturnController.getInstance = vi.fn().mockReturnValue(mockReturnController);

    const response = await supertest(app).get("/resume");

    expect(response.status).toEqual(302);
    expect(response.headers.location).toEqual(expectedRedirectUrl);
    expect(ReturnController.getInstance).toHaveBeenCalledTimes(1);
    expect(
      mockReturnController.handleResumeReturnAuthUrl
    ).toHaveBeenCalledTimes(1);
  });
});
