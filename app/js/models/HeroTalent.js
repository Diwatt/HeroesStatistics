export default class HeroTalent {
    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            name: String,
            description: String,
            image: Blob
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,name,description,image,[name+description]'
    }
}
