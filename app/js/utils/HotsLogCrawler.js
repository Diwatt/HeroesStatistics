import Crawler from 'crawler';
import crypto from 'crypto';
import 'isomorphic-fetch';
import iconv from 'iconv-lite';
import Cache from './Cache';
import HomeConfigurator from './HotsLogsHomeConfigurator';
import HistoryConfigurator from './HotsLogsHistoryConfigurator';
import SummaryConfigurator from './HotsLogSummaryConfigurator';
import snooze from './../utils/Snooze';

export default class HotsLogCrawler {
    heroesUrl = 'https://api.hotslogs.com/Public/Data/Heroes';
    mapsUrl = 'https://api.hotslogs.com/Public/Data/Maps';

    constructor(playerId = 1350838) {
        iconv.skipDecodeWarning = true;
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
        return this._fetchJson(this.heroesUrl);
    }

    /**
     * @return Promise
     */
    getMaps() {
        return this._fetchJson(this.mapsUrl);
    }

    /**
     * @returns {Promise}
     */
    getHeroesBasics() {
        return new Promise((resolve, reject) => {
            let config = new HomeConfigurator();

            let url = config.url;
            let queueConfig = {
                // The global callback won't be called
                callback: (error, response) => {
                    if (error) {
                        reject(error);
                    }

                    let heroes = config.parseTable(response.$);
                    if (0 === heroes.length) {
                        reject([]);
                    }

                    this._save(url, response.body);
                    resolve(heroes);
                }
            };

            this._fetchHtml(url, queueConfig);
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

                    this._save(url, response.body);
                    resolve(games);
                }
            };

            this._fetchHtml(url, queueConfig, true);
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
                        this._save(url, response.body);
                        resolve(summaryOfplayers);
                    } catch (err) {
                        console.log(err);
                        reject(err);
                    }
                }
            };

            this._fetchHtml(url, queueConfig, false, waitUntil);
        });
    }

    /**
     *
     * @param {string} url
     * @param {Object} config
     * @param {Boolean} forceUpdate
     * @param {Number} waitUntil
     * @private
     */
    async _fetchHtml(url, config, forceUpdate = false, waitUntil = 1000) {
        if ((!this.cache.has(url) || forceUpdate) && this._isOnline()) {
            await snooze(waitUntil);
            console.info('fetching '+url+' from web');
            let response = await this._fetch(url);
            let html = await response.text();
            this.cache.save(url, html);

            config.html = this.cache.fetch(url);
            this._getCrawler().queue([config]);
        } else if (this.cache.has(url)) {
            config.html = this.cache.fetch(url);
            console.info('fetching '+url+' from cache');
            this._getCrawler().queue([config]);
        } else {
            console.error('no connection and no cache');
        }
    }

    /**
     * @param {string} url
     * @param {Number} waitUntil
     * @return Promise
     */
    async _fetchJson(url, waitUntil = 1000) {
        await snooze(waitUntil);
        if (this.cache.has(url)) {
            try {
                let data = JSON.parse(this.cache.fetch(url));
                console.info('fetching '+url+' from cache');

                return data;
            } catch (err) {}
        }

        if (this._isOnline()) {
            console.info('fetching ' + url + ' from cache');
            let response = await this._fetch(url);
            let data = await response.json();
            this.cache.save(url, JSON.stringify(data));
        } else {
            console.error('Cannot retrieve ' + url + ' from web');
        }

        return data;
    }



    /**
     *
     * @param {String} url
     * @param {String} content
     * @private
     */
    _save(url, content) {
        //save cache to avoid too many call
        if (!this.cache.has(url)) {
            this.cache.save(url, content);
        } else if (content !== this.cache.fetch(url)) {
            this.cache.save(url, content);
        }
    }

    /**
     * @return {Crawler}
     * @private
     */
    _getCrawler() {
        return new Crawler({rateLimit: 2000, maxConnections : 1})
    }

    /**
     * @param {string} url
     * @param {*} parameters
     * @param {*} body
     * @return {Promise}
     * @private
     */
    _fetch(url, parameters = {}, body = {}) {
        let headers = {'Accept-Language': 'en,en-US;q=0.9,ur;q=0.8,en;q=0.7'};
        parameters.headers = Object.assign(headers, parameters.headers || {});

        return fetch(url, parameters, body)
    }

    /**
     * @return {boolean}
     * @private
     */
    _isOnline() {
        return global.navigator === undefined || navigator.onLine
    }
}
