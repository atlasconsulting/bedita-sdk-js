import { expect } from 'chai';
import MemoryStorageAdapter from '../../../src/services/adapters/memory-storage-adapter';

describe('MemoryStorageAdapter', function() {

    beforeEach(function() {
        this.adapter = new MemoryStorageAdapter();
    });

    it('test get(), set(), remove()', async function() {
        await this.adapter.set('keyOne', 'hello');

        expect(await this.adapter.get('keyOne')).equals('hello');
        expect(await this.adapter.get('InvalidKey')).is.undefined;

        await this.adapter.remove('keyOne');
        expect(await this.adapter.get('keyOne')).is.undefined;
    });

    it ('test clear()', async function() {
        await this.adapter.set('one', 'hello');
        await this.adapter.set('two', 'world');

        expect(await this.adapter.get('one')).equals('hello');
        expect(await this.adapter.get('two')).equals('world');

        await this.adapter.empty();
        expect(await this.adapter.get('one')).is.undefined;
        expect(await this.adapter.get('two')).is.undefined;
    });

});
