import 'babel-polyfill';
import {expect} from 'chai';
import Cache from '../../app/js/utils/Cache';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';


describe('Cache', function() {
    let dir = __dirname+path.sep+'cache';
    const cache = new Cache(__dirname, 'cache');
    let url = 'http://google.fr';
    let content = 'test123';
    let hash = crypto.createHash('md5').update(url).digest('hex');
    let filename = dir + path.sep + hash;

    it('should save a file', () => {
        cache.save(url, content);
        expect(fs.existsSync(filename)).to.be.true;
    });

    it('should know that the file exists', () => {
        expect(cache.has(url)).to.be.true;
    });

    it('should fetch content', () => {
        expect(cache.fetch(url)).to.be.equal(content);
    });

    it('should validate the file content with a validator then saying cache does not exists if invalid', () => {
        cache.setValidator(data => {
            return data != content;
        });

        expect(cache.has(url)).to.be.false;
        expect(fs.existsSync(filename)).to.be.false
    });

    it('should remove the file', () => {
        cache.save(url, content);
        expect(fs.existsSync(filename)).to.be.true;
        cache.remove(url);
        expect(fs.existsSync(filename)).to.be.false;

    });
});
