import Crawler from 'crawler';
import crypto from 'crypto';
import 'isomorphic-fetch';
import Cache from './Cache';
import HistoryConfigurator from './HotsLogsHistoryConfigurator';
import SummaryConfigurator from './HotsLogSummaryConfigurator';
import snooze from './../utils/Snooze';

export default class HotsLogCrawler {
    heroesUrl = 'https://api.hotslogs.com/Public/Data/Heroes';
    mapsUrl = 'https://api.hotslogs.com/Public/Data/Maps';

    constructor(playerId = 1350838) {
        this.playerId = playerId;
        this.cache = new Cache();
        this.cache.setValidator(data => {
            let errorHtml = 'The custom error module does not recognize this error.';

            return data.trim() !== errorHtml;
        })
    }

    /**
     * @return Promise
     */
    getHeroes() {
        return new Promise(resolve => {
            if (this.cache.has(this.heroesUrl)) {
                try {
                    resolve(JSON.parse(this.cache.fetch(this.heroesUrl)));
                } catch (err) {}
            }

            fetch(this.heroesUrl).then((response) => {
                return response.json();
            }).then((data) => {
                this.cache.save(this.heroesUrl, JSON.stringify(data));
                resolve(data);
            });
        });
    }

    /**
     * @return Promise
     */
    getMaps() {
        return new Promise(resolve => {
            if (this.cache.has(this.mapsUrl)) {
                try {
                    resolve(JSON.parse(this.cache.fetch(this.mapsUrl)));
                } catch (err) {}
            }

            fetch(this.mapsUrl).then((response) => {
                return response.json();
            }).then((data) => {
                this.cache.save(this.mapsUrl, JSON.stringify(data));
                resolve(data);
            });
        });
    }

    /**
     * @returns {Promise}
     */
    getGames() {
        return new Promise((resolve, reject) => {
            let config = new HistoryConfigurator();

            let url = config.url + this.playerId;
            let queueConfig = {
                // The global callback won't be called
                callback: (error, response) => {
                    if (error) {
                        reject(error);
                    }

                    let games = config.parseTable(response.$);

                    if (0 === games.length) {
                        reject([]);
                    }

                    this.cache.save(url, response.body);
                    resolve(games);
                }
            };

            this._fetch(url, queueConfig);
        });
    }

    /**
     *
     * @param {Number} replayId
     * @param {Number} waitUntil
     * @return {Promise}
     */
    getGameSummary(replayId, waitUntil = 1000) {
        return new Promise((resolve, reject) => {
            let config = new SummaryConfigurator();
            let url = config.url + replayId;
            let queueConfig = {
                // The global callback won't be called
                callback: (error, response) => {
                    if (error) {
                        reject(error);
                    }

                    try {
                        let talentTrees = config.parseTable(response.$, 'talentSelector', 'talentKeys', 'verifyTalent');
                        let gameStatistics = config.parseTable(response.$, 'statisticsSelector', 'statisticsKeys');

                        let summaryOfplayers = [];
                        let playerNames = [];
                        talentTrees.forEach((tt) => {
                            playerNames.push(tt.playerName);
                            let summary = {
                                playerName: tt.playerName,
                                heroName: tt.heroName,
                                heroLevel: tt.heroLevel,
                                hasWon: tt.hasWon,
                                award: tt.award,
                                talentTree: tt,
                            };

                            delete summary.talentTree.playerName;
                            delete summary.talentTree.award;
                            delete summary.talentTree.heroName;
                            delete summary.talentTree.heroLevel;
                            delete summary.talentTree.hasWon;

                            summaryOfplayers[playerNames.indexOf(summary.playerName)] = summary;
                        });

                        gameStatistics.forEach((gs) => {
                            let index = playerNames.indexOf(gs.playerName);
                            summaryOfplayers[index].statistics = gs;
                            delete summaryOfplayers[index].statistics.playerName;
                        });

                        //save cache to avoid too many call
                        if (!this.cache.has(url)) {
                            this.cache.save(url, response.body);
                        } else {
                            if (response.body !== this.cache.fetch(url)) {
                                this.cache.save(url, response.body);
                            }
                        }
                        resolve(summaryOfplayers);
                    } catch (err) {
                        console.log(err);
                        reject(err);
                    }
                }
            };

            this._fetch(url, queueConfig, waitUntil);
        });
    }

    /**
     *
     * @param {string} url
     * @param {Object} config
     * @param {Number} waitUntil
     * @private
     */
    async _fetch(url, config, waitUntil = 1000) {
        if (!this.cache.has(url)) {
            console.log('fetching '+url+' from web');
            await snooze(waitUntil);
            let response = await fetch(url);
            let html = await response.text();
            this.cache.save(url, html);

            config.html = this.cache.fetch(url);
            this._getCrawler().queue([config]);
        } else {
            config.html = this.cache.fetch(url);
            console.log('fetching '+url+' from cache');
            this._getCrawler().queue([config]);
        }
    }

    /**
     * @return {Crawler}
     * @private
     */
    _getCrawler() {
        return new Crawler({rateLimit: 2000, maxConnections : 1})
    }
}
