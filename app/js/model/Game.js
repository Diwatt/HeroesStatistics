import User from "./User";
import Map from "./Map";
import Hero from "./Hero";

export default class Game {

    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            user: User.getProperties(),
            hotslogsReplayId: Number,
            hero: Hero.getProperties(),
            map: Map.getProperties(),
            duration: Number,
            heroLevel: Number,
            isWon: Boolean,
            mmr: Number,
            mmrDelta: Number,
            date: Date
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,user.id,hotlogsReplayId,hero.id,hero.name,hero.role,map.id, map.name,duration,heroLevel,isWon,mmr,mmrDelta,date'
    }
}
