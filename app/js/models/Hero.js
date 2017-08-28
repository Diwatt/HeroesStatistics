import Dexie from 'dexie';
import db from '../Database';
import Talent from './HeroTalent';

export default class Hero {
    getWinrate(date) {

    }

    /**
     * @param {Array} heroes
     * @return {Promise}
     */
    static importFromHotlogs(heroes) {
        return Dexie.spawn(function* () {
            return yield db.transaction('rw', db.heroes, function* () {
                let gameHeroes = [];
                for (let i = 0; i < heroes.length; i++) {
                    let isInDb = yield db.heroes.where('name').equals(heroes[i].PrimaryName).count();
                    if (0 === isInDb) {
                        gameHeroes.push({
                            name: heroes[i].PrimaryName,
                            role: heroes[i].Group,
                            subRole: heroes[i].SubGroup
                        })
                    }
                }

                yield db.heroes.bulkAdd(gameHeroes);
            });
        });
    }

    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            name: String,
            role: String,
            subRole: String,
            talents1: Array,
            talents2: Array,
            talents3: Array,
            talents4: Array,
            talents5: Array,
            talents6: Array,
            talents7: Array,
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,name,role,subRole,*talents1,*talents2,*talents3,*talents4,*talents5,*talents6,*talents7'
    }
}
