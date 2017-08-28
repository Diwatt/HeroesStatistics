import {execSync} from 'child_process';
import path from 'path';
import os from 'os';

export default class HeroProtocol {
    /**
     *
     */
    constructor() {

    }

    /**
     * @return {string}
     */
    static get pythonBin() {
        return execSync('which python').toString();
    }

    /**
     * @return {string}
     */
    get commandLine() {
        return this.pythonBin + ' ' + this.heroProtocolBin;
    }

    /**
     * @return {boolean}
     */
    static isWindows() {
        return os.platform() === 'win32';
    }

    /**
     * @return {string}
     */
    static get heroProtocolBin() {
        return __dirname + path.sep + 'node_modules' + path.sep + 'heroprotocol' + path.sep + 'heroprotocol.py';
    }
}
