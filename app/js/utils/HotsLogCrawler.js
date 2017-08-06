import Crawler from "crawler";
import moment from "moment";

export default class HotsLogCrawler {
    gamesUrl = 'https://www.hotslogs.com/Player/MatchHistory?PlayerID=';
    keys = [
        {key: 'hero_role'},
        {key: 'replay_id', format: '_parseInt'},
        {key: 'map_name'},
        {key: 'game_duration'},
        {key: 'hero_name'},
        null,
        {key: 'level', format: '_parseInt'},
        {key: 'is_won', format: '_parseBool'},
        {key: 'mmr', format: '_parseInt'},
        {key: 'mmr_delta', format: '_parseInt'},
        {key: 'date', format: '_parseDate'},
        null,
        null,
        null,
        null
    ];

    constructor(playerId = 1350838) {
        this.playerId = playerId;
        this.crawler = new Crawler({maxConnections : 1});
    }

    getGames(cb)
    {
        this.crawler.queue([{
            uri: this.gamesUrl+this.playerId,

            // The global callback won't be called
            callback: (error, res) => {
                let games = [];

                let isFirst = true;
                let $ = res.$;
                let lines = $('table.rgMasterTable tr');
                lines.each((i, el1) => {
                    let replay = {};
                    $(el1).children().each((i, el2) => {
                        if (!isFirst && null !== this.keys[i]) {
                            games[this.keys[i].key] = HotsLogCrawler._sanitize($(el2).text(), this.keys[i]);
                        }
                    });

                    isFirst = false;
                    games.push(replay);
                });

                cb(games);
            }
        }]);
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
     * @param date
     * @returns {*|moment.Moment}
     * @private
     */
    static _parseDate(date) {
        return moment(date, "MM-DD-YYYY");
    }
}
