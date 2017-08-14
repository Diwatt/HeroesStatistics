export default class User {
    /**
     * @return {Boolean}
     */
    getIsActive() {
        return this.isActive === 1;
    }

    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            hotslogsUserId: Number,
            battleTag: String,
            isActive: Number
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,hotslogsUserId,battleTag,isActive'
    }
}
