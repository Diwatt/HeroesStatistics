export default class Map {
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
