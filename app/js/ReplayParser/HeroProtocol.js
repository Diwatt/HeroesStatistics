import {exec} from 'child_process';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export default class HeroProtocol {
    /** @type {string|null} path to heroprotocol bin */
    binPath = null;
    /** @type {Object} where to store cache */
    cachedOutputs = {};
    /** @type {boolean} get cache */
    stats = false;

    /**
     * @param {string} replayFilename path to a replay file
     * @param {boolean} stats
     */
    constructor(replayFilename, stats = false) {
        this.replayFile = replayFilename;
        this.binPath = this._buildBinPath();
        this.stats = stats;
    }

    /**
     * @return {Promise}
     */
    getGameEvents() {
        return this._getJsonInLines('gameevents');
    }

    /**
     * @return {Promise}
     */
    getMessageEvents() {
        return this._getJsonInLines('messageevents');
    }

    /**
     * @return {Promise}
     */
    getTrackerEvents() {
        return this._getJsonInLines('trackerevents');
    }

    /**
     * @return {Promise}
     */
    getAttributesEvents() {
        return this._getJsonInLines('attributeevents');
    }

    /**
     * @return {Promise}
     */
    getHeader() {
        return this._getValidJson('header');
    }

    /**
     * @return {Promise}
     */
    getDetails() {
        return this._getValidJson('details');
    }

    /**
     * @return {Promise}
     */
    getInitData() {
        let type = 'initdata';
        let cmd = this._getCommand(type);
        let key = this._getCacheKey(cmd);
        if (key in this.cachedOutputs) {
            return this._getCacheResult(key);
        }

        return this._exec(this._getCommand(type)).then(raw => {
            return this._setCache(type, raw.key, JSON.parse(raw.data.split("\n")[1]), raw.stats);
        });
    }

    /**
     * @return {string}
     * @private
     */
    _buildBinPath() {
        return path.normalize([__dirname, '..', '..', '..', 'bin', os.platform() === 'win32' ? 'heroprotocol.exe' : 'heroprotocol'].join(path.sep));
    }

    /**
     * @return {Promise}
     * @private
     */
    _exec(script, options = {maxBuffer: Infinity}) {
        return new Promise((resolve, reject) => {
            exec(script, options, (error, stdout, stderr) => {
                if (error) {
                    reject(stderr);
                } else {
                    resolve({data: stdout, key: this._getCacheKey(script), stats: stderr});
                }
            });
        });
    }

    /**
     * @param {string} type
     * @return {string}
     * @private
     */
    _getCommand(type) {
        return [this.binPath, '--'+type, '--json', (this.stats ? '--stats' : ''), this.replayFile].join(' ');
    }

    /**
     *
     * @param {string} str
     * @return {string}
     * @private
     */
    _getCacheKey(str) {
        return crypto.createHash('md5').update(str).digest('hex');
    }

    /**
     * @param key
     * @return {Promise}
     * @private
     */
    _getCacheResult(key) {
        return new Promise((resolve, reject) => {
            if (!(key in this.cachedOutputs)) {
                reject();
            }

            resolve(this.cachedOutputs[key]);
        })
    }

    /**
     * Common call for json sent in lines
     *
     * @param {string} type
     * @return {Promise}
     * @private
     */
    _getJsonInLines(type) {
        let cmd = this._getCommand(type);
        let key = this._getCacheKey(cmd);
        if (key in this.cachedOutputs) {
            return this._getCacheResult(key);
        }

        return this._exec(cmd).then(raw => {
            let data = [];
            raw.data.split("\n").forEach((line) => {
                if (line && line.length > 0) {
                    data.push(JSON.parse(line));
                }
            });

            return this._setCache(type, raw.key, data, raw.stats);
        });
    }

    /**
     *
     * @param {string} type
     * @return {Promise}
     * @private
     */
    _getValidJson(type) {
        let cmd = this._getCommand(type);
        let key = this._getCacheKey(cmd);
        if (key in this.cachedOutputs) {
            return this._getCacheResult(key);
        }

        return this._exec(this._getCommand(type)).then(raw => {
            return this._setCache(type, raw.key, JSON.parse(raw.data), raw.stats);
        });
    }

    /**
     * Parse stats
     *
     * @param {string} rawData
     * @return {Array}
     * @private
     */
    _parseStats(rawData) {
        let data = [];
        rawData.split("\n").forEach(line => {
            if (line && line.length > 0) {
                let row = line.split(',').map(column => {
                    return column.trim().replace(/"/g, '');
                }).filter(column => {
                    return column && column.length > 0;
                });

                data.push({'event': row[0], 'eventsCount': parseInt(row[1], 10), 'bitsCount': parseInt(row[2], 10)});
            }
        });

        return data;
    }

    /**
     * @param {string} rawKey
     * @param {*} parsedData
     * @param {*} rawStats
     * @return {*}
     * @private
     */
    _setCache(optionType, rawKey, parsedData, rawStats) {
        let type = -1 !== optionType.indexOf('event') ? 'events' : optionType;
        let stats = this.stats ? this._parseStats(rawStats) : null;
        this.cachedOutputs[rawKey] = {stats: stats};
        this.cachedOutputs[rawKey][type] = parsedData;

        return this.cachedOutputs[rawKey];
    }
}
