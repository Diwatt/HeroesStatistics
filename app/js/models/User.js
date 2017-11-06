import Dexie from 'dexie';
import db from '../Database';

export default class User {
    /**
     * @return {Promise}
     */
    static async getActive() {
        return await db.transaction('rw', db.users, async () => {
            let Collection = await db.users.where('isActive').equals(1);
            let CollectionCount = await Collection.count();
            let user = null;
            if (CollectionCount > 0) {
                user = await Collection.first();
            }

            return user;
        });
    }

    /**
     * @return {Promise}
     */
    getGames() {
        return db.games.where('user.id').equals(this.id);
    }

    /**
     * @param {Number} id
     * @param {String} battleTag
     * @return {Promise}
     */
    static async create(id, battleTag = null) {
        return await db.transaction('rw', db.users, async () => {
            let Collection = await db.users.where('hotslogsUserId').equals(id);
            let CollectionCount = await Collection.count();

            let user = null;
            if (CollectionCount > 0) {
                user = await Collection.first();
                await db.users.where('id').notEqual(user.id).modify({'isActive': 0})
                await Collection.modify({'isActive': 1});
                user = await Collection.first();

                console.info('User modified', user);
            } else {
                user = await db.users.add({
                    hotslogsUserId: id,
                    battleTag: battleTag,
                    isActive: 1
                });
                console.info('User created', user);
            }

            return user;
        });
    }

    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            hotslogsUserId: Number,
            battleTag: String,
            nickname: String,
            isActive: Number
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,&hotslogsUserId,&nickname,&battleTag,isActive'
    }
}
