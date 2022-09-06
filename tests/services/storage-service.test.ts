import { expect } from 'chai';
import { LocalStorageAdapter } from '../../src';
import StorageService from '../../src/services/storage-service';

describe('StorageService', function() {

    beforeEach(function() {
        localStorage.clear();
    });

    it('test get(), set(), remove()', async function() {
        let service = new StorageService('bedita', new LocalStorageAdapter());
        await service.set('one', 'hello');
        expect(await service.get('one')).equals(localStorage.getItem('bedita.one'));

        await service.remove('one');
        expect(await service.get('one')).to.be.null;
    });

    it('test change namespace delimiter', async function() {
        let service = new StorageService('bedita', new LocalStorageAdapter());
        service.setNamespaceSeparator('_');
        await service.set('one', 'hello');
        expect(await service.get('one')).equals(localStorage.getItem('bedita_one'));
    });

    it('test set, get and clear tokens', async function() {
        let service = new StorageService('bedita', new LocalStorageAdapter());
        await service.setAccessToken('xyz');
        await service.setRefreshToken('abc');
        expect(await service.getAccessToken()).equals(localStorage.getItem('bedita.access_token'));
        expect(await service.getRefreshToken()).equals(localStorage.getItem('bedita.refresh_token'));

        await service.clearTokens();
        expect(await service.getAccessToken()).to.be.null;
        expect(await service.getRefreshToken()).to.be.null;
    });

});
