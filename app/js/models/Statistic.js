import Dexie from 'dexie';
import db from '../Database';

export default class Statistic {
    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            name: String,
            value: Number
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,name,value'
    }
}
