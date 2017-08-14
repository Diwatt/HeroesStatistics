export default class WinRate {
    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            rate: Number,
            hero: {
                id: Number
            },
            map: {
                id: Number
            }
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,rate,hero.id,map.id'
    }
}
