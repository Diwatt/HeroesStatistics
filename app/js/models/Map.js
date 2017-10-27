import Dexie from 'dexie';
import db from '../Database';

export default class Map {
    /**
     * @param {Array} maps
     * @return {Promise}
     */
    static async importFromHotlogs(maps) {
        return await db.transaction('rw', db.maps, async () => {
            let gameMaps = [];
            for (let i = 0; i < maps.length; i++) {
                let isInDb = await db.maps.where('name').equals(maps[i].PrimaryName).count();
                if (0 === isInDb) {
                    gameMaps.push({
                        name: maps[i].PrimaryName,
                    });
                }
            }

            await db.maps.bulkAdd(gameMaps);
        });
    }

    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            name: String
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,name'
    }
}
