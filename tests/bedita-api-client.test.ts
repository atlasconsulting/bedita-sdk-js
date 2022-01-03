import { expect } from 'chai';
import { BEditaApiClient } from '../src/bedita-api-client';

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

});
