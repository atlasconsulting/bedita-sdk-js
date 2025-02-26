import { AxiosResponse, AxiosHeaders } from 'axios';
import { expect } from 'chai';
import { RemoveLinksInterceptor } from '../../src/interceptors/remove-links-interceptor';
import { BEditaApiClient, JsonApiResourceObject } from '../../src/bedita-api-client';

describe('RemoveLinksInterceptor', function() {

    it('test that links are removed from response', async function() {
        const client = new BEditaApiClient({ baseUrl: 'https://example.com'});
        const interceptor = new RemoveLinksInterceptor(client);
        const initialResponse: AxiosResponse = {
            status: 200,
            statusText: 'ok',
            headers: {},
            config: {
                headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
            },
            data: {
                data: [
                    {
                        id: 1,
                        type: 'users',
                        attributes: {
                            title: 'User number one',
                        },
                        links: {
                            self: 'https://api.example.com/users/1',
                        },
                        relationships: {
                            attach: {
                                links: {
                                    related: 'https://api.example.com/users/1/attach',
                                    self: 'https://api.example.com/users/1/relationships/attach',
                                },
                            },
                            poster: {
                                links: {
                                    related: 'https://api.example.com/users/1/poster',
                                    self: 'https://api.example.com/users/1/relationships/poster',
                                },
                            },
                        },
                    },
                ],
                links: {
                    self: 'https://api.example.com/users',
                    home: 'https://api.example.com/home',
                    first: 'https://api.example.com/users',
                    last: 'https://api.example.com/users?page=32',
                    prev: null,
                    next: 'https://api.example.com/users?page=2',
                },
                meta: {
                    schema: {
                        users: {
                            $id: 'https://api.example.com/model/schema/users',
                            revision: '123456789',
                        },
                    },
                }
            },
        };

        const response = await interceptor.responseHandler(initialResponse);
        expect(response.data).to.not.have.property('links');
        expect(response.data.meta).to.not.have.property('schema');

        response.data.data.forEach((d: JsonApiResourceObject) => {
            expect(d).to.not.have.property('links');
            expect(d?.relationships?.attach).to.not.have.property('links');
            expect(d?.relationships?.poster).to.not.have.property('links');
        });
    });
});
