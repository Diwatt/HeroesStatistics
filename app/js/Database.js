import Dexie from 'dexie';
import Config from "./Config";
import User from "./models/User";
import Game from "./models/Game";
import Hero from "./models/Hero";
import HeroTalent from "./models/HeroTalent";
import Player from "./models/Player";
import Statistic from "./models/Statistic";
import Map from "./models/Map";
import WinRate from "./models/WinRate";

class DatabaseConnector
{
    /**
     *
     * @param dbname
     * @param version
     */
    constructor(dbname = 'HeroesStatistics', version = 1) {
        this.db = new Dexie(dbname);
        this.defineTables(version);
        this.mapToClasses();
        this.open();
    }

    /**
     * @param version
     * Define Schema Indexes
     */
    defineTables(version = 1) {
        this.db.version(version).stores({
            users: User.getSchema(),
            games: Game.getSchema(),
            heroes: Hero.getSchema(),
            heroTalents: HeroTalent.getSchema(),
            players: Player.getSchema(),
            statistics: Statistic.getSchema(),
            maps: Map.getSchema(),
            winRates: WinRate.getSchema(),
        });
    }

    /**
     * Set mapping and full schema
     */
    mapToClasses() {
        this.db.users.mapToClass(User, User.getProperties());
        this.db.games.mapToClass(Game, Game.getProperties());
        this.db.heroes.mapToClass(Hero, Hero.getProperties());
        this.db.maps.mapToClass(Map, Map.getProperties());
        this.db.winRates.mapToClass(WinRate, WinRate.getProperties());
    }

    open() {
        this.db
            .open()
            .then(this._debug.bind(this))
            .catch(() => {
                alert('no db...');
            })
    }

    /**
     *
     * @param {Dexie} db
     * @private
     */
    _debug(db) {
        console.info("Found database: " + db.name);
        console.info("Database version: " + db.verno);
        db.tables.forEach(function (table) {
            console.info("Found table: " + table.name);
            console.info("Table Schema: ",  table.schema);
        });
    }
}

export default (new DatabaseConnector(Config.db.name, Config.db.version)).db;

