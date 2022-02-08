import { expect } from 'chai';
import ApiProvider from '../src/api-provider';
import { BEditaApiClient } from '../src/bedita-api-client';

describe('ApiProvider', function() {

    it('get api client', function() {
        const client = ApiProvider.get('myapi', { baseUrl: 'https://example.com'});

        expect(client).to.be.an.instanceof(BEditaApiClient);
        expect('myapi').to.equal(client.getConfig('name'));
        expect('https://example.com').to.equal(client.getConfig('baseUrl'));

        const client2 = ApiProvider.get('myapi');
        expect(client).to.equal(client2);
    });

    it('remove api client', function() {
        ApiProvider.get('myapi', { baseUrl: 'https://example.com'});
        ApiProvider.remove('myapi');

        expect(() => ApiProvider.get('myapi')).to.throw('Missing required API configuration');
    });

});
