import AbstractTableParserConfigurator from './AbstractTableParserConfigurator';
import moment from 'moment';

export default class HotsLogsHomeConfigurator extends AbstractTableParserConfigurator {
    url = 'https://www.hotslogs.com/Default';
    selector = 'table.rgMasterTable > tbody > tr';
    keys = [
        null,
        {key: 'name'},
        {key: 'playedGames', 'format': '_parseInt'},
        {key: 'banned', 'format': '_parseInt'},
        {key: 'pickRate', 'format': '_parsePercent'},
        {key: 'averageWinRate', 'format': '_parsePercent'},
        {key: 'progressRate', 'format': '_parsePercent'},
        null,
        null,
        null,
    ];

    /**
     * @param value
     * @return {boolean}
     */
    verify(value) {
        return true;
    }
}
