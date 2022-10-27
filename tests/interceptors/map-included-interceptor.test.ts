import { AxiosResponse } from 'axios';
import { expect } from 'chai';
import { MapIncludedInterceptor } from '../../src/interceptors/map-included-interceptor';

describe('MapIncludedInterceptor', function() {

    it('no included', async function() {
        const interceptor = new MapIncludedInterceptor();
        const initialResponse: AxiosResponse = {
            status: 200,
            statusText: 'ok',
            headers: {},
            config: {},
            data: {
                data: [
                    {
                        id: 1,
                        type: 'users',
                        attributes: {
                            title: 'User number one',
                        },
                        relationships: {
                            attach: {
                                links: {
                                    related: 'https://api.example.com/users/1/attach',
                                    self: 'https://api.example.com/users/1/relationships/attach',
                                },
                            },
                        },
                    },
                ],
            },
        };

        const response = await interceptor.responseHandler(initialResponse);
        expect(response.formattedData).to.deep.equal(response.data);
    });

    it('included', async function() {
        const data = {
            data: [
                {
                    id: 1,
                    type: 'users',
                    attributes: {
                        title: 'User number one',
                    },
                    relationships: {
                        attach: {
                            links: {
                                related: 'https://api.example.com/users/1/attach',
                                self: 'https://api.example.com/users/1/relationships/attach',
                            },
                            data: [
                                {
                                    id: 12,
                                    type: 'images',
                                },
                            ],
                        },
                    },
                },
            ],
            included: [
                {
                    id: 12,
                    type: 'images',
                    attributes: {
                        title: 'Profile image',
                    },
                },

            ],
        };

        const initialResponse: AxiosResponse = {
            status: 200,
            statusText: 'ok',
            headers: {},
            config: {},
            data,
        };

        const interceptor = new MapIncludedInterceptor();
        const response = await interceptor.responseHandler(initialResponse);

        expect(response.formattedData).to.not.equal(response.data);
        expect(response.formattedData.data[0].relationships.attach.data).to.deep.equal(data.included);
    });

    it('included with replace translations', async function() {
        const initialResponse: AxiosResponse = {
            status: 200,
            statusText: 'ok',
            headers: {},
            config: {},
            data: {
                data: [
                    {
                        id: 1,
                        type: 'users',
                        attributes: {
                            title: 'User number one',
                            description: 'the description',
                            lang: 'en',
                        },
                        relationships: {
                            translations: {
                                links: {
                                    related: 'https://api.example.com/users/1/translations',
                                    self: 'https://api.example.com/users/1/relationships/translations',
                                },
                                data: [
                                    {
                                        id: 5,
                                        type: 'translations',
                                    },
                                ],
                            },
                        },
                    },
                ],
                included: [
                    {
                        id: 5,
                        type: 'translations',
                        attributes: {
                            lang: 'it',
                            translated_fields: {
                                title: 'Utente numero uno',
                                description: '',
                            },
                        },
                    },

                ],
            },
        };

        const expectedData = [
            {
                id: 1,
                type: 'users',
                attributes: {
                    title: 'Utente numero uno',
                    description: 'the description',
                    lang: 'en',
                },
                relationships: {
                    translations: {
                        links: {
                            related: 'https://api.example.com/users/1/translations',
                            self: 'https://api.example.com/users/1/relationships/translations',
                        },
                        data: [
                            {
                                id: 5,
                                type: 'translations',
                                attributes: {
                                    lang: 'it',
                                    translated_fields: {
                                        title: 'Utente numero uno',
                                        description: '',
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        ];

        const interceptor = new MapIncludedInterceptor({replaceWithTranslation: 'it'});
        const response = await interceptor.responseHandler(initialResponse);

        expect(response.formattedData).to.not.equal(response.data);
        expect(response.formattedData.data).to.deep.equal(expectedData);
    });

});
