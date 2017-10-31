import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

export default class Cache {
    cacheDir = null;
    validator = null;

    /**
     * @param {string} baseDir
     * @param {string} suffix
     */
    constructor(baseDir = os.homedir(), suffix = 'HeroesStatistics') {
        this.cacheDir = baseDir + path.sep + suffix;
        this._mkdirIfNotExists(this.cacheDir);
    }

    /**
     * @param {Function} validator
     * @return {Cache}
     */
    setValidator(validator) {
        this.validator = validator;

        return this;
    }

    /**
     * @param {string} url
     * @param {string} data
     */
    save(url, data) {
        let filename = this._getCacheFilename(url);
        console.info('saving '+url+' into '+path.basename(filename));

        fs.writeFileSync(filename, data);
    }

    /**
     * @param {string} url
     * @return {boolean | *}
     */
    has(url) {
        if (fs.existsSync(this._getCacheFilename(url))) {
            let data = this.fetch(url).trim();

            if (null !== this.validator) {
                let isValid = this.validator(data);
                if (!isValid) {
                    this.remove(url);
                }

                return isValid;
            }
        }

        return false;
    }

    /**
     * @param {string} url
     */
    remove(url) {
        fs.unlinkSync(this._getCacheFilename(url));
    }

    /**
     *
     * @param {string} url
     * @return {Buffer | string}
     */
    fetch(url) {
        let filename = this._getCacheFilename(url);
        console.info('reading '+filename);

        return fs.readFileSync(filename).toString();
    }

    /**
     *
     * @param {string} url
     * @return {string}
     * @private
     */
    _getCacheFilename(url) {
        let key = crypto.createHash('md5').update(url).digest('hex');

        return this.cacheDir + path.sep + key;
    }


    _mkdirIfNotExists(dir) {
        let directories = this._allDirectoriesToCreate(dir);
        directories.forEach(dir => {
            fs.mkdirSync(dir);
        });
    }

    /**
     *
     * @param {string} dir
     * @return {Array}
     * @private
     */
    _allDirectoriesToCreate(dir) {
        let directories = [];
        let data = path.parse(dir);
        let currentDir = dir;

        while (data.root !== currentDir) {
            if (!fs.existsSync(currentDir)) {
                directories.push(currentDir);
            }

            currentDir = path.dirname(currentDir);
        }

        return directories.reverse();
    }
}
