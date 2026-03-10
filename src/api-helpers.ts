import { JsonApiResourceFlat, JsonApiResourceObject } from "./types/api.js";

/**
 * Flatten a JSON API resource.
 *
 * Attributes, relationships and meta fields are merged into the top-level object
 * and their keys are listed in the special arrays:
 * - _attributes
 * - _relationships
 * - _meta
 *
 * @param resource The JSON API resource to flatten
 * @returns The flattened resource
 */
export function flattenJsonApiResource<T extends JsonApiResourceFlat>(resource: JsonApiResourceObject | null | undefined): T | null {
  if (!resource) {
    return null;
  }
  const flattened: JsonApiResourceFlat = {
    id: resource.id as string,
    type: resource.type,
    ...resource.attributes,
    ...resource.meta,
    _attributes: Object.keys(resource.attributes || {}),
    _relationships: Object.keys(resource.relationships || {}),
    _meta: Object.keys(resource.meta || {}),
  };

  if (!resource.relationships) {
    return flattened as T;
  }

  for (const relation in resource.relationships) {
    const relationObj = resource.relationships[relation];
    if (Array.isArray(relationObj.data)) {
      flattened[relation] = relationObj.data.map((rel: JsonApiResourceObject) => flattenJsonApiResource(rel));
    }
  }

  return flattened as T;
}

/**
 * Expand a JSON API resource previously flattened.
 *
 * Reconstructs the original JSON API resource from a flattened representation.
 *
 * @param flattened The flattened JSON API resource
 * @returns The expanded JSON API resource
 */
export function expandJsonApiResource(flattened: JsonApiResourceFlat): JsonApiResourceObject {
  const resource: JsonApiResourceObject = {
    id: flattened.id,
    type: flattened.type,
  };

  if (flattened._attributes.length > 0) {
    resource.attributes = {};
    for (const property of flattened._attributes) {
      resource.attributes[property] = flattened[property];
    }
  }

  if (flattened._meta.length > 0) {
    resource.meta = {};
    for (const metaProperty of flattened._meta) {
      resource.meta[metaProperty] = flattened[metaProperty];
    }
  }

  if (flattened._relationships.length > 0) {
    resource.relationships = {};
    for (const relation of flattened._relationships) {
      resource.relationships[relation] = {};
      if (Array.isArray(flattened[relation])) {
        resource.relationships[relation] = {
          data: flattened[relation].map((rel: JsonApiResourceFlat) => expandJsonApiResource(rel))
        };
      }
    }
  }

  return resource;
}
