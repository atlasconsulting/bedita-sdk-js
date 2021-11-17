import { expect } from 'chai';
import { BEditaApiClient } from '../src/bedita-api-client';
import MockAdapter from 'axios-mock-adapter';

describe('BEditaApiClient', function() {

    it('init default name', function() {
        const client = new BEditaApiClient({ baseUrl: 'https://example.com'});
        expect('bedita', client.getConfig('name'));
        expect('https://example.com', client.getConfig('baseUrl'));
    });

    it('init custom name', function() {
        const client = new BEditaApiClient({
            baseUrl: 'https://example.com',
            name: 'gustavo-api'
        });
        expect('gustavo-api', client.getConfig('name'));
        expect('https://example.com', client.getConfig('baseUrl'));
    });

    it('test mock', async function() {
        const host = 'https://example.com';
        const client = new BEditaApiClient({
            baseUrl: host,
        });

        // client.getHttpClient().interceptors.request.use((config) => {
        //     config.adapter = httpAdapter;
        //     return config;
        // });
        // client.getHttpClient().defaults.adapter = httpAdapter;
        // nock(host)
        //     .get('/documents')
        //     .reply(200, 'test');

        const mock = new MockAdapter(client.getHttpClient());
        mock.onGet('/documents').reply(200, 'test');

        const res = await client.get('/documents');
        expect(res.data).equal('test');
    });

});
