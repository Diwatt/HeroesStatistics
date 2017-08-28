import Dexie from 'dexie';
import db from '../Database';

export default class User {
    /**
     * @return {Promise}
     */
    static getActive() {
        return Dexie.spawn(function* () {
            let Collection = yield db.users.where('isActive').equals(1);
            let CollectionCount = yield Collection.count();
            let user = null;
            if (CollectionCount > 0) {
                user = yield Collection.first();
            }

            return user;
        });
    }

    /**
     * @return {Array}
     */
    getGames() {
        return db.games.where('user.id').equals(this.id);
    }

    /**
     * @param {Number} id
     * @param {String} battleTag
     * @return {Promise}
     */
    static create(id, battleTag = null) {
        return Dexie.spawn(function* () {
            return yield db.transaction('rw', db.users, function* () {
                let Collection = yield db.users.where('hotslogsUserId').equals(id);
                let CollectionCount = yield Collection.count();

                let user = null;
                if (CollectionCount > 0) {
                    user = yield Collection.first();
                    yield db.users.where('id').notEqual(user.id).modify({'isActive': 0})
                    yield Collection.modify({'isActive': 1});
                    user = yield Collection.first();

                    console.log('User modified', user);
                } else {
                    user = yield db.users.add({
                        hotslogsUserId: id,
                        battleTag: battleTag,
                        isActive: 1
                    });
                    console.log('User created', user);
                }

                return user;
            });
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
