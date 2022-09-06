import StorageAdapterInterface from "./storage-adapter-interface";

/**
 * In memory storage adapter.
 */
export default class MemoryStorageAdapter implements StorageAdapterInterface {
    /**
     * The memory store
     */
    #store: { [s: string]: any } = {};

    /**
     * @inheritdoc
     */
    get(key: string): Promise<any> {
        return Promise.resolve(this.#store?.[key]);
    }

    /**
    * @inheritdoc
    */
    set(key: string, value: any): Promise<any> {
        this.#store[key] = value;

        return Promise.resolve();
    }

    /**
     * @inheritdoc
     */
    remove(key: string): Promise<any> {
        delete this.#store[key];

        return Promise.resolve();
    }

    /**
     * @inheritdoc
     */
    empty(): Promise<any> {
        this.#store = {};

        return Promise.resolve();
    }
}
