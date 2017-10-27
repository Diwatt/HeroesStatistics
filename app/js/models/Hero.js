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
    static async importFromHotlogs(heroes) {
        return await db.transaction('rw', db.heroes, async () => {
            let gameHeroes = [];
            for (let i = 0; i < heroes.length; i++) {
                let isInDb = await db.heroes.where('name').equals(heroes[i].PrimaryName).count();
                if (0 === isInDb) {
                    gameHeroes.push({
                        name: heroes[i].PrimaryName,
                        role: heroes[i].Group,
                        subRole: heroes[i].SubGroup
                    })
                }
            }

            await db.heroes.bulkAdd(gameHeroes);
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
            talents4: Array,
            talents7: Array,
            talents10: Array,
            talents13: Array,
            talents16: Array,
            talents20: Array,
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,name,role,subRole,*talents1,*talents4,*talents7,*talents10,*talents13,*talents16,*talents20'
    }
}
