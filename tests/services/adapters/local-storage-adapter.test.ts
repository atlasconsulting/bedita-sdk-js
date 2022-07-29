import { expect } from 'chai';
import LocalStorageAdapter from '../../../src/services/adapters/local-storage-adapter';

describe('LocalStorageAdapter', function() {

    beforeEach(function() {
        localStorage.clear();

        this.adapter = new LocalStorageAdapter();
    });

    it('test get(), set(), remove()', async function() {
        await this.adapter.set('keyOne', 'hello');

        expect(localStorage.getItem('keyOne')).equals('hello');
        expect(await this.adapter.get('keyOne')).equals('hello');
        expect(await this.adapter.get('InvalidKey')).is.null;

        await this.adapter.remove('keyOne');
        expect(localStorage.getItem('keyOne')).is.null;
        expect(await this.adapter.get('keyOne')).is.null;
    });

});
