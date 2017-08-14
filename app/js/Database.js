import Dexie from 'dexie';
import Config from "./Config";
import User from "./model/User";
import Game from "./model/Game";
import Hero from "./model/Hero";
import Map from "./model/Map";
import WinRate from "./model/WinRate";

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
        console.log ("Found database: " + db.name);
        console.log ("Database version: " + db.verno);
        db.tables.forEach(function (table) {
            console.log ("Found table: " + table.name);
            console.log ("Table Schema: " +
                JSON.stringify(table.schema, null, 4));
        });
    }
}

export default (new DatabaseConnector(Config.db.name, Config.db.version)).db;

