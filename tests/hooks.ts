import { BEditaApiClient } from '../src/bedita-api-client';

export const mochaHooks = {
    beforeEach(done) {

        // docker run -p 8090:80 --env BEDITA_ADMIN_USR=admin --env BEDITA_ADMIN_PWD=admin --env BEDITA_API_KEY=1234567890 bedita/bedita:4.7.0

        this.apiConfig = {
            baseURL: process.env.BEDITA_API || 'http://localhost:8090',
            apiKey: process.env.BEDITA_API_KEY || '1234567890',
            adminUser: process.env.BEDITA_ADMIN_USR || 'admin',
            adminPwd: process.env.BEDITA_ADMIN_PWD || 'admin',
        };

        this.client = new BEditaApiClient({
            baseUrl: this.apiConfig.baseURL,
            apiKey: this.apiConfig.apiKey,
        });

        done();
    }
};
