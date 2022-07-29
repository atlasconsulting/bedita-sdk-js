/**
 * Storage service interface.
 */
export default interface StorageAdapterInterface {
    /**
     * Get the storaged value.
     */
    get(key: string): Promise<any>;

    /**
     * Set a value in the storage.
     * Return this for chainability.
     *
     * @param key The starage key
     * @param value The value
     */
    set(key: string, value: any): Promise<any>;

    /**
     * Remove a key from the storage.
     *
     * @param key The key to remove
     */
    remove(key: string): Promise<any>;

    /**
     * Clear the storage.
     */
    empty(): Promise<boolean>;
}
