# di-ipvreturn-front

IPV Return front is the place users return to once their identity has been verified using the Face to Face journey.

It is a simple Express server that has two routes:
- `/resume` which is the path a user is dreicted to from their confirmation email. The controller for this route creates a DB session for the user and then directs them to the auth service
- `/callback`

See ADR [here](https://github.com/govuk-one-login/architecture/blob/main/adr/0077-f2f-micro-rp.md) for more technical details about the overall service.

### Documentation
- [Deploying a custom frontend](https://govukverify.atlassian.net/wiki/spaces/FTFCRI/pages/3737879141/How+to+deploy+a+custom+frontend)
- [Pre commit hooks](https://govukverify.atlassian.net/wiki/spaces/FTFCRI/pages/4180673019/Pre-Commit+Checking+Verification)