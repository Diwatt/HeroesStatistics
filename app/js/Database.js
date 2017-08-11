import Dexie from 'dexie';
import Config from "./Config";

class DatabaseConnector
{
    constructor(dbname = 'HeroesStatistics', version = 1) {
        this.db = new Dexie(dbname);
        this.defineTables(version);
        this.open();
    }

    defineTables(version = 1) {
        this.db.version(version).stores({
            users: '++id,hotlogsUserId,battleTag,isActive',
            games: '++id,userId,hotlogsReplayId,heroRole,mapName,duration,heroName,heroLevel,isWon,mmr,mmrDelta,date'
        });
    }

    open() {
        this.db.open().catch(() => {
            alert('no db...');
        })
    }
}

export default (new DatabaseConnector(Config.db.name, Config.db.version)).db;

