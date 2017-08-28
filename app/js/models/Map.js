import Dexie from 'dexie';
import db from '../Database';

export default class Map {
    /**
     * @param {Array} maps
     * @return {Promise}
     */
    static importFromHotlogs(maps) {
        return Dexie.spawn(function* () {
            return yield db.transaction('rw', db.maps, function* () {
                let gameMaps = [];
                for (let i = 0; i < maps.length; i++) {
                    let isInDb = yield db.maps.where('name').equals(maps[i].PrimaryName).count();
                    if (0 === isInDb) {
                        gameMaps.push({
                            name: maps[i].PrimaryName,
                        });
                    }
                }

                yield db.maps.bulkAdd(gameMaps);
            });
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
