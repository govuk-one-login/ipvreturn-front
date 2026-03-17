import index from "../../Index";
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
