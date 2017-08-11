import Crawler from "crawler";
import moment from "moment";

export default class HotsLogCrawler {
    gamesUrl = 'https://www.hotslogs.com/Player/MatchHistory?PlayerID=';
    keys = [
        null,
        {key: 'replayId', format: '_parseInt'},
        {key: 'mapName'},
        {key: 'duration', format: '_parseDuration'},
        {key: 'heroName'},
        null,
        {key: 'heroLevel', format: '_parseInt'},
        {key: 'isWon', format: '_parseBool'},
        {key: 'mmr', format: '_parseInt'},
        {key: 'mmrDelta', format: '_parseInt'},
        {key: 'date', format: '_parseDate'},
        null,
        null,
        null,
        {key: 'heroRole'}
    ];

    constructor(playerId = 1350838) {
        this.playerId = playerId;
        this.crawler = new Crawler({maxConnections : 1});
    }

    /**
     * @returns {Promise}
     */
    getGames()
    {
        return new Promise((resolve, reject) => {
            this.crawler.queue([{
                uri: this.gamesUrl + this.playerId,

                // The global callback won't be called
                callback: (error, res) => {
                    if (error) {
                        reject(error);
                    }

                    let games = [];
                    let $ = res.$;
                    let lines = $('table.rgMasterTable tr');
                    if (0 === lines.length) {
                        reject([]);
                    }
                    lines.each((i, el1) => {
                        let replay = {};
                        $(el1).children().each((i, el2) => {
                            if (null !== this.keys[i]) {
                                let value = $(el2).text();
                                replay[this.keys[i].key] = HotsLogCrawler._sanitize(value, this.keys[i]);
                            }
                        });

                        if (replay.replayId > 0) {
                            games.push(replay);
                        }
                    });

                    resolve(games);
                }
            }]);
        });
    }

    /**
     * @param {*} value
     * @param {Object} definition
     * @private
     */
    static _sanitize (value, definition) {
        let sanitizedValue = value.trim();

        if ('' === sanitizedValue) {
            sanitizedValue = null;
        }
        if (definition.format != undefined) {
            sanitizedValue = HotsLogCrawler[definition.format](sanitizedValue);
        }

        return sanitizedValue;
    }

    /**
     * @param value
     * @returns {boolean}
     * @private
     */
    static _parseInt(value) {
        return parseInt(value, 10);
    }

    /**
     * @param value
     * @returns {boolean}
     * @private
     */
    static _parseBool(value) {
        return value === '1';
    }

    /**
     * @param value
     * @returns {number}
     * @private
     */
    static _parseDuration(value) {
        let hours = 0, minutes = 0, seconds = 0;
        if (null !== value) {
            [hours, minutes, seconds] = value.split(':');
        }

        return parseInt(hours, 10)*60*60 + parseInt(minutes, 10)*60 + parseInt(seconds, 10);
    }

    /**
     * @param date
     * @returns {*|moment.Moment}
     * @private
     */
    static _parseDate(date) {
        return moment(date, "MM-DD-YYYY");
    }
}
