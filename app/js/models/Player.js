import Dexie from 'dexie';
import db from '../Database';

export default class Player {

    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            name: String,
            user: {
                id: Number
            },
            hero: {
                id: Number
            },
            talents: Array,
            statistics: Array
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,name,user.id,hero.id,*talents,*statistics'
    }
}
