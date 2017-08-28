import AbstractTableParserConfigurator from './AbstractTableParserConfigurator';
import moment from 'moment';

export default class HotsLogsHistoryConfigurator extends AbstractTableParserConfigurator {
    url = 'https://www.hotslogs.com/Player/MatchHistory?PlayerID=';
    selector = 'table.rgMasterTable tr';
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

    /**
     * @param value
     * @return {boolean}
     */
    verify(value) {
        return value.replayId > 0;
    }

    /**
     * eq. 4/2/2015 11:36:45 PM
     *     4/2/2015 6:06:06 PM
     *     4/2/2015 4:29:03 PM
     *
     * @param date
     * @returns {Date}
     * @private
     */
    _parseDate(date) {
        let mDate = moment.utc(date, "M-D-YYYY h:mm:ss A");

        return new Date(Date.UTC(mDate.year(), mDate.month(), mDate.day(), mDate.hours(), mDate.minutes(), mDate.seconds()))
    }
}
