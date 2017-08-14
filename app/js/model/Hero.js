export default class Hero {
    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            name: String,
            role: String,
            subRole: String
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,name,role,subRole'
    }
}
