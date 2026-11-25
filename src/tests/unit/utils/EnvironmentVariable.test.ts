import { HttpCodesEnum } from "../../../utils/HttpCodesEnum";
import { EnvironmentVariables } from "../../../utils/EnvironmentVariables";

async function getDynamicImports() {
  return {
    EnvironmentVariables: (await import("../../../utils/EnvironmentVariables"))
      .EnvironmentVariables,
    loggingHelper: (await import("../../../utils/LoggingHelper")).loggingHelper,
  };
}

describe("EnvironmentVariables", () => {
  let cachedEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env = { ...cachedEnv };
  });

  it("should return the value of REDIRECT_URL", () => {
    const value = EnvironmentVariables.getRedirectUrl();
    expect(value).toBe("https://redirect");
  });

  it("should throw an error if REDIRECT_URL is not provided", async () => {
    delete process.env.REDIRECT_URL;
    const { EnvironmentVariables, loggingHelper } = await getDynamicImports();
    const testLoggingHelperError = jest.spyOn(loggingHelper, "error");
    expect(() => EnvironmentVariables.getRedirectUrl()).toThrow(
      expect.objectContaining({
        statusCode: HttpCodesEnum.SERVER_ERROR,
        message: "ENV Variables are undefined",
      })
    );
    expect(testLoggingHelperError).toHaveBeenCalledWith(
      "Misconfigured RedirectUrl EnvironmentVariables"
    );
  });

  it("should return the value of CLIENT_ID_SSM_PATH", () => {
    const value = EnvironmentVariables.getClientIdSsmPath();
    expect(value).toBe("/dev/ipvreturn/CLIENT_ID");
  });

  it("should throw an error if CLIENT_ID_SSM_PATH is not provided", async () => {
    delete process.env.CLIENT_ID_SSM_PATH;
    const { EnvironmentVariables, loggingHelper } = await getDynamicImports();
    const testLoggingHelperError = jest.spyOn(loggingHelper, "error");
    expect(() => EnvironmentVariables.getClientIdSsmPath()).toThrow(
      expect.objectContaining({
        statusCode: HttpCodesEnum.SERVER_ERROR,
        message: "ENV Variables are undefined",
      })
    );
    expect(testLoggingHelperError).toHaveBeenCalledWith(
      "Misconfigured ClientId SSM Path EnvironmentVariables"
    );
  });

  it("should return the value of DISCOVERY_ENDPOINT", () => {
    const value = EnvironmentVariables.getDiscoveryEndpoint();
    expect(value).toBe("https://discovery");
  });

  it("should throw an error if DISCOVERY_ENDPOINT is not provided", async () => {
    delete process.env.DISCOVERY_ENDPOINT;
    const { EnvironmentVariables, loggingHelper } = await getDynamicImports();
    const testLoggingHelperError = jest.spyOn(loggingHelper, "error");
    expect(() => EnvironmentVariables.getDiscoveryEndpoint()).toThrow(
      expect.objectContaining({
        statusCode: HttpCodesEnum.SERVER_ERROR,
        message: "ENV Variables are undefined",
      })
    );
    expect(testLoggingHelperError).toHaveBeenCalledWith(
      "Misconfigured Discovery endpoint EnvironmentVariables"
    );
  });

  it("should return the value of SESSION_TABLE_NAME", () => {
    const value = EnvironmentVariables.getSessionTableName();
    expect(value).toBe("MYTABLE");
  });

  it("should throw an error if SESSION_TABLE_NAME is not provided", async () => {
    delete process.env.SESSION_TABLE_NAME;
    const { EnvironmentVariables, loggingHelper } = await getDynamicImports();
    const testLoggingHelperError = jest.spyOn(loggingHelper, "error");
    expect(() => EnvironmentVariables.getSessionTableName()).toThrow(
      expect.objectContaining({
        statusCode: HttpCodesEnum.SERVER_ERROR,
        message: "ENV Variables are undefined",
      })
    );
    expect(testLoggingHelperError).toHaveBeenCalledWith(
      "Misconfigured Session table name EnvironmentVariables"
    );
  });

  it("should return the value of SESSION_TTL_IN_SECS", () => {
    const value = EnvironmentVariables.getSessionTtlInSecs();
    expect(value).toBe(400);
  });

  it("should assign default SESSION_TTL_IN_SECS if it does not have a value", async () => {
    delete process.env.SESSION_TTL_IN_SECS;
    const { EnvironmentVariables, loggingHelper } = await getDynamicImports();
    const testLoggingHelperWarn = jest.spyOn(loggingHelper, "warn");
    const value = EnvironmentVariables.getSessionTtlInSecs();
    expect(value).toBe(300);
    expect(testLoggingHelperWarn).toHaveBeenCalledWith(
      "SESSION_TTL_IN_SECS env var is not set. Setting to default - 5 mins."
    );
  });

  it("should return the value of FRONT_CUSTOM_DOMAIN", () => {
    const value = EnvironmentVariables.getFrontEndDomain();
    expect(value).toBe("test-localhost");
  });

  it("should assign default FRONT_END_CUSTOM_DOMAIN if it does not have a value", async () => {
    delete process.env.FRONT_END_CUSTOM_DOMAIN;
    const { EnvironmentVariables, loggingHelper } = await getDynamicImports();
    const testLoggingHelperWarn = jest.spyOn(loggingHelper, "warn");
    const value = EnvironmentVariables.getFrontEndDomain();
    expect(value).toBe("localhost");
    expect(testLoggingHelperWarn).toHaveBeenCalledWith(
      "FRONT_END_CUSTOM_DOMAIN env var is not set. Setting to default - localhost."
    );
  });

  it("should return the value of PORT", () => {
    const value = EnvironmentVariables.getPort();
    expect(value).toBe(9100);
  });

  it("should assign default PORT if it does not have a value", async () => {
    delete process.env.PORT;
    const { EnvironmentVariables, loggingHelper } = await getDynamicImports();
    const testLoggingHelperWarn = jest.spyOn(loggingHelper, "warn");
    const value = EnvironmentVariables.getPort();
    expect(value).toBe(8080);
    expect(testLoggingHelperWarn).toHaveBeenCalledWith(
      "PORT env var is not set. Setting to default - 8080."
    );
  });

  it("should return the value of API_BASE_URL", () => {
    const value = EnvironmentVariables.getApiBaseUrl();
    expect(value).toBe("https://localhost");
  });

  it("should throw an error if API_BASE_URL is not provided", async () => {
    delete process.env.API_BASE_URL;
    const { EnvironmentVariables, loggingHelper } = await getDynamicImports();
    const testLoggingHelperError = jest.spyOn(loggingHelper, "error");
    expect(() => EnvironmentVariables.getApiBaseUrl()).toThrow(
      expect.objectContaining({
        statusCode: HttpCodesEnum.SERVER_ERROR,
        message: "ENV Variables are undefined",
      })
    );
    expect(testLoggingHelperError).toHaveBeenCalledWith(
      "Misconfigured Api Base url EnvironmentVariables"
    );
  });

  it("should return the value of ACCOUNTS_DASHBOARD", () => {
    const value = EnvironmentVariables.getAccountsDashboardUrl();
    expect(value).toBe("https://accounts_dashboard_url");
  });

  it("should throw an error if ACCOUNTS_DASHBOARD is not provided", async () => {
    delete process.env.ACCOUNTS_DASHBOARD;
    const { EnvironmentVariables, loggingHelper } = await getDynamicImports();
    const testLoggingHelperError = jest.spyOn(loggingHelper, "error");
    expect(() => EnvironmentVariables.getAccountsDashboardUrl()).toThrow(
      expect.objectContaining({
        statusCode: HttpCodesEnum.SERVER_ERROR,
        message: "ENV Variables are undefined",
      })
    );
    expect(testLoggingHelperError).toHaveBeenCalledWith(
      "Misconfigured Accounts dashboard url EnvironmentVariables"
    );
  });
});
