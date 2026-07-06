import { JsonApiResourceFlat, JsonApiResourceObject } from "../src/types/api.js";
import { flattenJsonApiResource, expandJsonApiResource } from "../src/api-helpers.js";
import { expect } from "chai";
import { describe, it } from "mocha";

describe('ApiHelpers', function() {
  it('flatten JSON API resource', function() {
    const resource: JsonApiResourceObject = {
      id: '1',
      type: 'articles',
      attributes: {
        title: 'Flatten object works!',
        body: 'The shortest article. Ever.',
      },
      relationships: {
        written_by: {
          data: [
            {
              id: '2',
              type: 'users',
              attributes: {
                name: 'John Doe',
              },
            }
          ],
          meta: {
            count: 1,
          },
        },
      },
      meta: {
        created: '2026-01-01T00:00:00Z',
      },
    };

    const expectedFlattened = {
      id: '1',
      type: 'articles',
      title: 'Flatten object works!',
      body: 'The shortest article. Ever.',
      created: '2026-01-01T00:00:00Z',
      _attributes: ['title', 'body'],
      _relationships: ['written_by'],
      _meta: ['created'],
      written_by: [
        {
          id: '2',
          type: 'users',
          name: 'John Doe',
          _attributes: ['name'],
          _relationships: [],
          _meta: [],
        },
      ],
      written_by_meta: {
        count: 1,
      },
    };

    const flattened = flattenJsonApiResource<JsonApiResourceFlat<'articles'>>(resource);
    expect(flattened).to.deep.equal(expectedFlattened);

    const restored = expandJsonApiResource(flattened!);
    expect(restored).to.deep.equal(resource);
  });

  it('flatten resource with missing fields', function() {
    const resource: JsonApiResourceObject = {
      id: '1',
      type: 'articles',
    };

    const expectedFlattened = {
      id: '1',
      type: 'articles',
      _attributes: [],
      _relationships: [],
      _meta: [],
    };

    const flattened = flattenJsonApiResource<JsonApiResourceFlat<'articles'>>(resource);
    expect(flattened).to.deep.equal(expectedFlattened);

    const restored = expandJsonApiResource(flattened!);
    expect(restored).to.deep.equal(resource);
  });

  it('flatten resource with empty relationships', function() {
    const resource: JsonApiResourceObject = {
      id: '1',
      type: 'articles',
      relationships: {
        written_by: {
          data: [],
        },
      },
    };

    const expectedFlattened = {
      id: '1',
      type: 'articles',
      _attributes: [],
      _relationships: ['written_by'],
      _meta: [],
      written_by: [],
    };

    const flattened = flattenJsonApiResource<JsonApiResourceFlat<'articles'>>(resource);
    expect(flattened).to.deep.equal(expectedFlattened);

    const restored = expandJsonApiResource(flattened!);
    expect(restored).to.deep.equal(resource);
  });

  it('flatten resource with missing relationships data', function() {
    const resource: JsonApiResourceObject = {
      id: '1',
      type: 'articles',
      relationships: {
        written_by: {},
      },
    };

    const expectedFlattened = {
      id: '1',
      type: 'articles',
      _attributes: [],
      _relationships: ['written_by'],
      _meta: [],
    };

    const flattened = flattenJsonApiResource<JsonApiResourceFlat<'articles'>>(resource);
    expect(flattened).to.deep.equal(expectedFlattened);

    const restored = expandJsonApiResource(flattened!);
    expect(restored).to.deep.equal(resource);
  });
});
