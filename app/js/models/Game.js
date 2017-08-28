import User from "./User";
import Map from "./Map";
import Hero from "./Hero";
import Dexie from 'dexie';
import db from './../Database';
import Crawler from './../utils/HotsLogCrawler';
import 'isomorphic-fetch';

export default class Game {
    /**
     * @param {Array} games
     * @return {Promise}
     */
    static  importFromHotsLogs(games, tickCallback) {
        return Dexie.spawn(function* () {
            return yield db.transaction('rw', db.games, db.heroes, db.maps, db.users, function* () {
                let user = yield User.getActive();
                let gameMaps = [];
                let cpt = 0;
                for (let i = 0; i < games.length; i++) {
                    let isInDb = yield db.games.where('hotslogsReplayId').equals(games[i].replayId).count();
                    if (0 === isInDb) {
                        let hero = yield db.heroes.where('name').equals(games[i].heroName).first();
                        let map = yield db.maps.where('name').equals(games[i].mapName).first();

                        gameMaps.push({
                            user: {
                                id: user.id,
                            },
                            hotslogsReplayId: games[i].replayId,
                            hero: {
                                id: hero.id,
                                name: hero.name,
                                role: hero.role,
                                subRole: hero.subRole
                            },
                            map: {
                                id: map.id,
                                name: map.name
                            },
                            duration: games[i].duration,
                            heroLevel: games[i].heroLevel,
                            isWon: games[i].isWon === true ? 1 : 0,
                            date: games[i].date
                        });

                        if (typeof tickCallback === 'function') {
                            tickCallback(cpt++);
                        }
                    }
                }

                if (typeof tickCallback === 'function') {
                    tickCallback('(inserting)');
                }
                yield db.games.bulkAdd(gameMaps);
            });
        });
    }

    /**
     *
     * @param {Crawler} crawler
     * @return {*}
     */
    static importSummaryFromHotsLogs(crawler) {
        return Dexie.spawn(function* () {
            return yield db.transaction('rw', db.games, db.heroes, db.users, function* () {
                let user = yield User.getActive();
                let games = yield user.getGames();
                games.each((game) => {
                    Dexie.spawn(function* () {
                        let summaries = yield crawler.getGameSummary(game.hotslogsReplayId);
                        let players = [],
                            talents = [],
                            statistics = []
                        ;
                        for (let i = 0; i < summaries.length; i++) {
                            let summary = summaries[i];
                            /*let talent1 = yield db.heroTalents.add(yield Game._addTalent(summary.talent1));
                            let talent2 = yield db.heroTalents.add(yield Game._addTalent(summary.talent2));
                            let talent3 = yield db.heroTalents.add(yield Game._addTalent(summary.talent3));
                            let talent4 = yield db.heroTalents.add(yield Game._addTalent(summary.talent4));
                            let talent5 = yield db.heroTalents.add(yield Game._addTalent(summary.talent5));
                            let talent6 = yield db.heroTalents.add(yield Game._addTalent(summary.talent6));
                            let talent7 = yield db.heroTalents.add(yield Game._addTalent(summary.talent7));

                            let hero = yield db.heroes.where('name').equals(summary.heroName).first();
                            //console.log(hero.talents1);*/
                        }
                    });
                });
            });
        });
    }

    /**
     * @return {*}
     */
    static getProperties() {
        return {
            id: Number,
            user: {
                id: Number
            },
            hotslogsReplayId: Number,
            hero: {
                id: Number
            },
            map: {
                id: Number
            },
            duration: Number,
            heroLevel: Number,
            isWon: Boolean,
            players: Array,
            date: Date,
        }
    }

    /**
     * @return {String}
     */
    static getSchema() {
        return '++id,user.id,hotslogsReplayId,hero.id,map.id,duration,heroLevel,isWon,date,players'
    }

    /**
     *
     * @param talent
     * @return {*}
     * @private
     */
    static _addTalent(talent) {
        return Dexie.spawn(function* () {
            let talentImage = yield fetch(talent.image);
            return {
                name: talent.name,
                description: talent.description,
                image: yield talentImage.blob(),
            };
        });

    }
}
