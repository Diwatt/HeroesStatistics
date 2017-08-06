import Dexie from 'dexie';
import Config from "./Config";

class DatabaseConnector
{
    constructor(dbname = 'HeroesStatistics', version = 1) {
        this.idb = new Dexie(dbname);
        this.defineTables(version);
    }

    defineTables(version = 1) {
        this.idb.version(version).stores({
            users: '++id,hotlogsUserId,battleTag',
            games: '++id,userId,hotlogsReplayId,heroRole,mapName,duration,heroName,heroLevel,isWon,mmr,mmrDelta,date'
        });
    }
}

let connector = new DatabaseConnector(Config.db.name, Config.db.version);

export default connector.idb;

