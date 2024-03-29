import { expect } from 'chai';
import { BEditaApiClient } from '../src/bedita-api-client';
import { ContentTypeInterceptor, MapIncludedInterceptor } from '../src/index';
import Blob from 'fetch-blob';

describe('BEditaApiClient', function() {

    beforeEach(function () {
        // clear local storage
        localStorage.clear();
    });

    it('init default name', function() {
        const client = new BEditaApiClient({ baseUrl: 'https://example.com'});
        expect('bedita').to.equal(client.getConfig('name'));
        expect('https://example.com').to.equal(client.getConfig('baseUrl'));
    });

    it('init custom name', function() {
        const client = new BEditaApiClient({
            baseUrl: 'https://example.com',
            name: 'gustavo-api'
        });
        expect('gustavo-api').to.equal(client.getConfig('name'));
        expect('https://example.com').to.equal(client.getConfig('baseUrl'));
    });

    it('test getConfig()', function() {
        const expected = {
            baseUrl: 'https://example.com',
            name: 'gustavo-api',
            apiKey: '123abc',
        };
        const client = new BEditaApiClient(expected);
        const config = client.getConfig();
        expect(config).to.deep.equal(expected);
    });

    it('test status', async function() {
        const res = await this.client.get('status');
        expect(res.status).equals(200);
    });

    it('test getHttpClient()', async function() {
        const client = new BEditaApiClient({
            baseUrl: 'https://example.com',
            name: 'gustavo-api'
        });
        const actual = client.getHttpClient();
        expect(actual).to.be.an('function');
    });

    it('test addInterceptor()', function() {
        const client = new BEditaApiClient({
            baseUrl: 'https://example.com',
            name: 'gustavo-api'
        });
        const actual = client.addInterceptor(new MapIncludedInterceptor());
        expect(actual).equals(1);
        const again = client.addInterceptor(new MapIncludedInterceptor());
        expect(again).equals(1);
        const other = client.addInterceptor(new ContentTypeInterceptor(client));
        expect(other).equals(1);
    });

    it('test hasInterceptor()', async function() {
        const client = new BEditaApiClient({
            baseUrl: 'https://example.com',
            name: 'gustavo-api'
        });

        expect(client.hasInterceptor(new ContentTypeInterceptor(client))).to.be.true;
        expect(client.hasInterceptor(new MapIncludedInterceptor())).to.be.false;

        client.addInterceptor(new MapIncludedInterceptor());
        expect(client.hasInterceptor(new MapIncludedInterceptor())).to.be.true;
    });

    it('test that adding missing interceptor in request then it will be removed', async function() {
        const client = new BEditaApiClient({
            baseUrl: this.apiConfig.baseURL,
            apiKey: this.apiConfig.apiKey,
        });

        await client.get('/status', {responseInterceptors: [new MapIncludedInterceptor()]});
        expect(client.hasInterceptor(new MapIncludedInterceptor())).to.be.false;
    });

    it('test that adding already present interceptor in request then it is still present', async function() {
        const client = new BEditaApiClient({
            baseUrl: this.apiConfig.baseURL,
            apiKey: this.apiConfig.apiKey,
        });

        client.addInterceptor(new MapIncludedInterceptor());
        expect(client.hasInterceptor(new MapIncludedInterceptor())).to.be.true;

        await client.get('/status', {responseInterceptors: [new MapIncludedInterceptor()]});
        expect(client.hasInterceptor(new MapIncludedInterceptor())).to.be.true;
    });

    it('test getRequestInterceptorsMap()', function() {
        const client = new BEditaApiClient({
            baseUrl: 'https://example.com',
            name: 'gustavo-api'
        });
        expect(client.getRequestInterceptorsMap().has('MapIncludedInterceptor')).false;
        expect(client.getRequestInterceptorsMap().has('ContentTypeInterceptor')).true;
    });

    it('test getResponseInterceptorsMap()', function() {
        const client = new BEditaApiClient({
            baseUrl: 'https://example.com',
            name: 'gustavo-api'
        });
        expect(client.getResponseInterceptorsMap().has('MapIncludedInterceptor')).false;
        expect(client.getResponseInterceptorsMap().has('ContentTypeInterceptor')).false;
    });

    it('test removeInterceptor()', function() {
        const client = new BEditaApiClient({
            baseUrl: 'https://example.com',
            name: 'gustavo-api'
        });
        let index = client.addInterceptor(new MapIncludedInterceptor());
        client.removeInterceptor(index, 'response');
        expect(client.getRequestInterceptorsMap().has('MapIncludedInterceptor')).false;
        index = client.addInterceptor(new ContentTypeInterceptor(client));
        client.removeInterceptor(index, 'request');
        expect(client.getRequestInterceptorsMap().has('ContentTypeInterceptor')).false;
    });

    it('test save() error missing type', async function() {
        const client = new BEditaApiClient({
            baseUrl: 'https://example.com',
            name: 'gustavo-api'
        });
        try {
            await client.save('', {});
            expect(false).equals(true); // this line should not be executed
        } catch(e) {
            expect(e.message).equals('Missing required type');
        }
    });

    it('test save() error 401', async function() {
        try {
            const response = await this.client.save('documents', {
                title: 'The title',
                description: 'The description',
            });
            expect(false).equals(true); // this line should not be executed
        } catch(e) {
            expect(e.response.status).equals(401);
            expect(e.message).equals('Request failed with status code 401');
        }
    });

    it('test authenticate() error 401', async function() {
        try {
            await this.client.authenticate('what', 'ever');
            expect(false).equals(true); // this line should not be executed
        } catch(e) {
            expect(e.response.status).equals(401);
            expect(e.message).equals('Request failed with status code 401');
        }
    });

    it('test authenticate() ok 200', async function() {
        try {
            const response = await this.client.authenticate(this.apiConfig.adminUser, this.apiConfig.adminPwd);
            expect(response.status).equals(200);
        } catch(e) {
            expect(false).equals(true); // this line should not be executed
        }
    });

    it('test clientCredentials() ok', async function() {
        const client = new BEditaApiClient({
            baseUrl: this.apiConfig.baseURL,
            name: 'gustavo-api',
            clientId: this.apiConfig.apiKey,
        });
        const response = await client.get('/status');

        expect(response.status).equals(200);
        expect(response.data?.meta?.status?.environment).equals('ok');
    });

    it('test clientCredentials() ko', async function() {
        try {
            const client = new BEditaApiClient({
                baseUrl: this.apiConfig.baseURL,
                name: 'gustavo-api',
                clientId: 'not-valid'
            });
            await client.get('/status');
            expect(false).equals(true); // this line should not be executed
        } catch(e) {
            expect(e?.response?.status).equals(403);
        }
    });

    it('test getUserAuth()', async function() {
        try {
            await this.client.authenticate(this.apiConfig.adminUser, this.apiConfig.adminPwd);
            const response = await this.client.getUserAuth();
            expect(response.status).equals(200);
            expect(response.formattedData.data.attributes.username).equals(this.apiConfig.adminUser);
            expect(response.formattedData.roles?.[0]).equals('admin');
        } catch(e) {
            expect(false).equals(true); // this line should not be executed
        }
    });

    it('test getUserAuth() with wrong included', async function() {
        try {
            await this.client.authenticate(this.apiConfig.adminUser, this.apiConfig.adminPwd);
            await this.client.getUserAuth(['wrong', 'bad']);
            expect(false).equals(true); // this line should not be executed
        } catch(e) {
            expect(e.request.path).equals('/auth/user?include=wrong,bad');
            expect(e.response.status).equals(400);
        }
    });

    it('test renewTokens()', async function() {
        // 200 Ok
        await this.client.authenticate(this.apiConfig.adminUser, this.apiConfig.adminPwd);
        await this.client.getStorageService().setAccessToken(null);
        const prevRefreshToken = await this.client.getStorageService().getRefreshToken();
        const response = await this.client.renewTokens();
        expect(response.status).equals(200);
        expect(await this.client.getStorageService().getAccessToken()).is.not.empty;

        // Missing refresh token
        try {
            await this.client.getStorageService().setRefreshToken('');
            await this.client.renewTokens();
            expect(false).equals(true); // this line should not be executed
        } catch(message) {
            expect(message).equals('Missing refresh token.');
        }
        // 401 Unauthorized
        try {
            await this.client.getStorageService().setRefreshToken('123456');
            await this.client.renewTokens();
            expect(false).equals(true); // this line should not be executed
        } catch(resp) {
            expect(resp.response.status).equals(401);
            expect(resp.response.statusText).equals('Unauthorized');
        }
    });

    it('test save() (post, patch, get)', async function() {
        try {
            await this.client.authenticate(this.apiConfig.adminUser, this.apiConfig.adminPwd);
            let response = await this.client.save('documents', {
                title: 'The title',
                description: 'The description',
            });
            const id = response.data?.data?.id;
            await this.client.save('documents', {
                id,
                title: 'A new title',
                description: 'A new description',
            });
            response = await this.client.get(`/documents/${id}`);
            expect(response.data?.data?.attributes?.title).equals('A new title');
            expect(response.data?.data?.attributes?.description).equals('A new description');
        } catch(e) {
            expect(false).equals(true); // this line should not be executed
        }
    });

    it('test save() and delete()', async function() {
        try {
            await this.client.authenticate(this.apiConfig.adminUser, this.apiConfig.adminPwd);
            let response = await this.client.save('documents', {
                title: 'The title',
                description: 'The description',
            });
            const id = response.data?.data?.id;
            response = await this.client.delete(`/documents/${id}`);
            expect(response.status).equals(204);
        } catch(e) {
            expect(false).equals(true); // this line should not be executed
        }
    });

    it('test upload()', async function() {
        const file = new Blob(['this is for test'], { type: 'text/plain' });
        await this.client.authenticate(this.apiConfig.adminUser, this.apiConfig.adminPwd);
        const response = await this.client.upload(file, 'files', 'example.txt');

        const r = await this.client.get(`/files/${response.data?.data?.id}`);
        expect(r.data?.data?.meta?.media_url).to.be.exist;
        expect(r.data?.data?.attributes?.title).to.be.equal('example.txt');
        expect(r.data?.included?.[0]?.attributes?.file_name).to.be.equal('example.txt');
        expect(r.data?.included?.[0]?.attributes?.mime_type).to.be.equal('text/plain');
    });
});
