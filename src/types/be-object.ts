import { JsonApiResourceFlat } from "./api.js";

/**
 * Interface of relationship meta object
 */
export interface RelationshipMeta {
  count?: number;
  [key: string]: unknown;
}

/**
 * Helper type to add relationship meta to a flattened JSON API resource object
 */
export type WithRelationshipMeta<T extends Record<string, unknown>> =
  T & Partial<Record<`${Extract<keyof T, string>}_meta`, RelationshipMeta>>;

/**
 * Empty relationships type
 */
type EmptyRelationships = Record<never, never>;

/**
 * Interface for BEdita base object
 */
interface BEditaObjectBase<OT extends string = string> extends JsonApiResourceFlat<OT> {
  status: string;
  uname: string;
  lang: string;
  title: string;
  description?: string;
  body?: string;
  extra: Record<string, unknown>;
  locked: boolean;
  created: string;
  modified: string;
  published: string;
  created_by: number;
  modified_by: number;
}

/**
 * Type for BEdita object with relationships.
 * Usage:
 *
 * ```
 * type DocRelationships = {
 *   document_of: Array<AnotherObjectType>,
 * }
 * interface Document extends BEditaObject<'documents', DocRelationships> {
 *   other_attribute_here: string,
 * }
 * ```
 */
export type BEditaObject<
  OT extends string = string,
  R extends Record<string, Array<JsonApiResourceFlat>> = EmptyRelationships
> = BEditaObjectBase<OT> & WithRelationshipMeta<R>;
