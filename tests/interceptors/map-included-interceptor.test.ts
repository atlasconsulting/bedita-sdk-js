import { type AxiosResponse, AxiosHeaders } from 'axios';
import { expect } from 'chai';
import { describe, it } from "mocha";
import { MapIncludedInterceptor } from '../../src/interceptors/map-included-interceptor.js';

describe('MapIncludedInterceptor', function() {
  it('missing data from response', async function() {
    const interceptor = new MapIncludedInterceptor();
    const initialResponse: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: {},
      config: {
        headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
      },
      data: {
        test: 'value'
      },
    };

    const response = await interceptor.responseHandler(initialResponse);
    expect(response.formattedData).to.not.exist;
    expect(response.data).to.deep.equal(initialResponse.data);
  });

  it('no included', async function() {
    const interceptor = new MapIncludedInterceptor();
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
            id: '1',
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
    expect(response.formattedData.data).to.not.equal(response.data.data);
    response.formattedData.data[0].attributes.title = 'Changed';
    expect(response.data.data[0].attributes.title).to.equal('User number one');
  });

  it('included', async function() {
    const data = {
      data: [
        {
          id: '1',
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
                  id: '12',
                  type: 'images',
                },
              ],
            },
          },
        },
      ],
      included: [
        {
          id: '12',
          type: 'images',
          attributes: {
            title: 'Profile image',
          },
          meta: {},
        },
      ],
    };

    const initialResponse: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: {},
      config: {
        headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
      },
      data,
    };

    const interceptor = new MapIncludedInterceptor();
    const response = await interceptor.responseHandler(initialResponse);

    expect(response.formattedData).to.not.deep.equal(response.data);
    expect(response.formattedData.data[0].relationships.attach.data).to.deep.equal(data.included);
  });

  it('keeps original data and included resources independent when mapping translations', async function() {
    const data = {
      data: {
        id: '1',
        type: 'users',
        attributes: { title: 'Original' },
        relationships: {
          translations: { data: [{ id: '2', type: 'translations' }] },
        },
      },
      included: [{
        id: '2',
        type: 'translations',
        attributes: {
          lang: 'it',
          translated_fields: { title: 'Tradotto' },
        },
      }],
    };
    const originalData = structuredClone(data);
    const initialResponse: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data,
    };

    const interceptor = new MapIncludedInterceptor({ replaceWithTranslation: 'it' });
    const response = await interceptor.responseHandler(initialResponse);

    expect(response.data).to.deep.equal(originalData);
    expect(response.formattedData.data.attributes.title).to.equal('Tradotto');
    response.formattedData.data.relationships.translations.data[0].attributes.translated_fields.title = 'Changed';
    expect(response.data).to.deep.equal(originalData);
  });

  it('included with meta', async function() {
    const data = {
      data: [
        {
          id: '1',
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
                  id: '12',
                  type: 'images',
                  meta: {
                    relation: {
                      priority: 1,
                      inv_priority: 2,
                      params: {
                        document_type: 'ci',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      ],
      included: [
        {
          id: '12',
          type: 'images',
          attributes: {
            title: 'Profile image',
          },
          meta: {
            created: '2026-11-13T12:00:00Z',
          }
        },
      ],
    };

    const initialResponse: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: {},
      config: {
        headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
      },
      data,
    };

    const interceptor = new MapIncludedInterceptor();
    const response = await interceptor.responseHandler(initialResponse);

    // prepare expected included meta by merging with relationship meta
    const expectedIncluded = structuredClone(data.included[0]);
    expectedIncluded.meta = {
      ...expectedIncluded.meta,
      ...data.data[0].relationships.attach.data[0].meta
    };

    expect(response.formattedData).to.not.deep.equal(response.data);
    expect(response.formattedData.data[0].relationships.attach.data[0]).to.deep.equal(expectedIncluded);
  });

  it('included with replace translations', async function() {
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
            id: '1',
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
                    id: '5',
                    type: 'translations',
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            id: '5',
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
        id: '1',
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
                id: '5',
                type: 'translations',
                attributes: {
                  lang: 'it',
                  translated_fields: {
                    title: 'Utente numero uno',
                    description: '',
                  },
                },
                meta: {},
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

  it('flattened config included', async function() {
    const data = {
      data: [
        {
          id: '1',
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
                  id: '12',
                  type: 'images',
                },
              ],
            },
          },
        },
      ],
      included: [
        {
          id: '12',
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
      config: {
        headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
      },
      data,
    };

    const expectedData = [
      {
        id: '1',
        type: 'users',
        title: 'User number one',
        attach: [
          {
            id: '12',
            type: 'images',
            title: 'Profile image',
            _attributes: ['title'],
            _relationships: [],
            _meta: [],
          },
        ],
        _attributes: ['title'],
        _relationships: ['attach'],
        _meta: [],
      },
    ];

    const interceptor = new MapIncludedInterceptor({ flatten: true });
    const response = await interceptor.responseHandler(initialResponse);

    expect(response.formattedData).to.not.equal(response.data);
    expect(response.formattedData.data).to.deep.equal(expectedData);
  });

  it('flattened config single object', async function() {
    const data = {
      data: {
        id: '1',
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
                id: '12',
                type: 'images',
              },
            ],
          },
        },
      },
      included: [
        {
          id: '12',
          type: 'images',
          attributes: {
            title: 'Profile image',
          },
        },
      ],
    };

    const originalData = structuredClone(data);
    const initialResponse: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: {},
      config: {
        headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
      },
      data,
    };

    const expectedData = {
      id: '1',
      type: 'users',
      title: 'User number one',
      attach: [
        {
          id: '12',
          type: 'images',
          title: 'Profile image',
          _attributes: ['title'],
          _relationships: [],
          _meta: [],
        },
      ],
      _attributes: ['title'],
      _relationships: ['attach'],
      _meta: [],
    };

    const interceptor = new MapIncludedInterceptor({ flatten: true });
    const response = await interceptor.responseHandler(initialResponse);

    expect(response.formattedData).to.not.equal(response.data);
    expect(response.formattedData.data).to.deep.equal(expectedData);
    expect(response.data).to.deep.equal(originalData);
    response.formattedData.data.attach[0].title = 'Changed';
    expect(response.data).to.deep.equal(originalData);
  });

  it('flattened passed in interceptorOptions', async function() {
    const data = {
      data: [
        {
          id: '1',
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
                  id: '12',
                  type: 'images',
                },
              ],
            },
          },
        },
      ],
      included: [
        {
          id: '12',
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
      config: {
        headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
        interceptorOptions: {
          MapIncludedInterceptor: {
            flatten: true,
          },
        }
      },
      data,
    };

    const expectedData = [
      {
        id: '1',
        type: 'users',
        title: 'User number one',
        attach: [
          {
            id: '12',
            type: 'images',
            title: 'Profile image',
            _attributes: ['title'],
            _relationships: [],
            _meta: [],
          },
        ],
        _attributes: ['title'],
        _relationships: ['attach'],
        _meta: [],
      },
    ];

    const interceptor = new MapIncludedInterceptor();
    const response = await interceptor.responseHandler(initialResponse);

    expect(response.formattedData).to.not.equal(response.data);
    expect(response.formattedData.data).to.deep.equal(expectedData);
  });

  it('when missing data do not try to flatten', async function() {
    const data = {
      meta: { test: 'value' },
      links: { self: 'https://api.example.com/users' }
    };

    const initialResponse: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: {},
      config: {
        headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
      },
      data,
    };

    const expectedData = {
      meta: { test: 'value' },
      links: { self: 'https://api.example.com/users' }
    };

    const interceptor = new MapIncludedInterceptor({ flatten: true });
    const response = await interceptor.responseHandler(initialResponse);

    expect(response.formattedData).to.not.exist;
    expect(response.data).to.deep.equal(expectedData);
  });

  it('when not a JSON API resource do not flatten', async function() {
    const data = {
      data: { test: 'value' },
      meta: { test: 'value' },
      links: { self: 'https://api.example.com/test' }
    };

    const initialResponse: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: {},
      config: {
        headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
      },
      data,
    };

    const expectedData = {
      data: { test: 'value' },
      meta: { test: 'value' },
      links: { self: 'https://api.example.com/test' }
    };

    const interceptor = new MapIncludedInterceptor({ flatten: true });
    const response = await interceptor.responseHandler(initialResponse);

    expect(response.formattedData.data).to.not.equal(response.data.data);
    expect(response.formattedData.data).to.deep.equal(response.data.data);
    expect(response.data).to.deep.equal(expectedData);
  });
});
