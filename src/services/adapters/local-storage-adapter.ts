import StorageAdapterInterface from "./storage-adapter-interface";

/**
 * Local Storage adapter
 */
export default class LocalStorageAdapter implements StorageAdapterInterface {
    /**
     * {@inheritdoc}
     *
     * @todo JSON parse if value a re json stringified
     */
    get(key: string): Promise<any> {
        return Promise.resolve(localStorage.getItem(key));
    }

    /**
     * {@inheritdoc}
     *
     * @todo JSON stringify value that represents objects
     */
    set(key: string, value: any): Promise<any> {
        return Promise.resolve(localStorage.setItem(key, value));
    }

    /**
     * @inheritdoc
     */
    remove(key: string): Promise<any> {
        return Promise.resolve(localStorage.removeItem(key));
    }

    /**
     * @inheritdoc
     */
    empty(): Promise<any>  {
        return Promise.resolve(localStorage.clear());
    }
}
