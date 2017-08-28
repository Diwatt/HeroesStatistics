import Crawler from 'crawler';
import 'isomorphic-fetch';
import HistoryConfigurator from './HotsLogsHistoryConfigurator';
import SummaryConfigurator from './HotsLogSummaryConfigurator';

export default class HotsLogCrawler {
    heroesUrl = 'https://api.hotslogs.com/Public/Data/Heroes';
    mapsUrl = 'https://api.hotslogs.com/Public/Data/Maps';

    constructor(playerId = 1350838) {
        this.playerId = playerId;
    }

    /**
     * @return Promise
     */
    getHeroes() {
        return fetch(this.heroesUrl)
            .then((response) => {
                return response.json();
            })
        ;
    }

    /**
     * @return Promise
     */
    getMaps() {
        return fetch(this.mapsUrl)
            .then((response) => {
                return response.json();
            })
        ;
    }

    /**
     * @returns {Promise}
     */
    getGames() {
        return new Promise((resolve, reject) => {
            let config = new HistoryConfigurator();
            this._getCrawler().queue([{
                uri: config.url + this.playerId,
                headers: {},

                // The global callback won't be called
                callback: (error, res) => {
                    if (error) {
                        reject(error);
                    }

                    let games = config.parseTable(res.$);

                    if (0 === games.length) {
                        reject([]);
                    }

                    resolve(games);
                }
            }]);
        });
    }

    /**
     *
     * @param {Number} replayId
     * @return {Promise}
     */
    getGameSummary(replayId) {
        return new Promise((resolve, reject) => {
            let config = new SummaryConfigurator();
            this._getCrawler().queue([{
                uri: config.url + replayId,
                headers: {},

                // The global callback won't be called
                callback: (error, res) => {
                    if (error) {
                        reject(error);
                    }

                    let talentTrees = config.parseTable(res.$, 'talentSelector', 'talentKeys', 'verifyTalent');
                    let gameStatistics = config.parseTable(res.$, 'statisticsSelector', 'statisticsKeys');

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
                        summaryOfplayers[index].statistics = gs ;
                        delete summaryOfplayers[index].statistics.playerName;
                    });

                    resolve(summaryOfplayers);
                }
            }]);
        });
    }

    /**
     * @return {Crawler}
     * @private
     */
    _getCrawler() {
        return new Crawler({maxConnections : 1})
    }
}
