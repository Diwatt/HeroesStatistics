import {exec} from 'child_process';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export default class HeroProtocol {
    /** @type {string|null} path to heroprotocol bin */
    binPath = null;
    cachedOutputs = {};
    lastCommand = null;

    /**
     * @param {string} replayFilename path to a replay file
     */
    constructor(replayFilename) {
        this.replayFile = replayFilename;
        this.binPath = this._buildBinPath();
        this.jsonParse = this._jsonParse.bind(this);
    }

    /**
     * @return {Promise}
     */
    getGameEvents(stats = false) {
        return this._getJsonInlines('gameevents', stats);
    }

    /**
     * @return {Promise}
     */
    getMessageEvents(stats = false) {
        return this._getJsonInlines('messageevents', stats);
    }

    /**
     * @return {Promise}
     */
    getTrackerEvents(stats = false) {
        return this._getJsonInlines('trackerevents', stats);
    }

    /**
     * @return {Promise}
     */
    getAttributesEvents(stats = false) {
        return this._getJsonInlines('attributeevents', stats);
    }

    /**
     * @return {Promise}
     */
    getHeader(stats = false) {
        return this._getValidJson('header', stats);
    }

    /**
     * @return {Promise}
     */
    getDetails(stats = false) {
        return this._getValidJson('details', stats);
    }

    /**
     * @return {Promise}
     */
    getInitData(stats = false) {
        return this._getValidJson('initdata', stats);
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
                    resolve({data: stdout, key: this._getCacheKey(script)});
                }
            });
        });
    }

    /**
     * @param {string} type
     * @param {boolean} stats
     * @return {string}
     * @private
     */
    _getCommand(type, stats = false) {
        let cmdParts = [this.binPath, this.replayFile, '--'+type, '--json'];
        if (true === stats) {
            cmdParts.push('--stats');
        }

        this.lastCommand = cmdParts.join(' ');

        return this.lastCommand;
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
     * @param {boolean} stats
     * @return {Promise}
     * @private
     */
    _getJsonInlines(type, stats = false) {
        let cmd = this._getCommand(type, stats);
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

            this.cachedOutputs[raw.key] = data;

            return this.cachedOutputs[raw.key];
        });
    }

    /**
     *
     * @param {string} type
     * @param {boolean} stats
     * @return {Promise}
     * @private
     */
    _getValidJson(type, stats = false) {
        let cmd = this._getCommand(type, stats);
        let key = this._getCacheKey(cmd);
        if (key in this.cachedOutputs) {
            return this._getCacheResult(key);
        }

        return this._exec(this._getCommand('header', stats)).then(raw => {
            this.cachedOutputs[raw.key] = JSON.parse(raw.data);

            return this.cachedOutputs[raw.key];
        });
    }

    /**
     *
     * @param {*} raw
     * @return {*}
     * @private
     */
    _jsonParse(raw) {
        this.cachedOutputs[raw.key] = JSON.parse(raw.data);

        return this.cachedOutputs[raw.key];
    }
}
