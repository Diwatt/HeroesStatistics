import AbstractTableParserConfigurator from './AbstractTableParserConfigurator';
import 'isomorphic-fetch';

export default class HotsLogsSummaryConfigurator extends AbstractTableParserConfigurator {
    url = 'https://www.hotslogs.com/Player/MatchSummaryAjax?ReplayID=';

    talentSelector = 'table#MatchSummary_RadGridMatchDetails_ctl00 > tbody > tr';
    talentKeys = [
        null,
        {key: 'award', format: '_parseAward', selector: true},
        {key: 'playerName'},
        null,
        {key: 'heroName'},
        {key: 'heroLevel', format: '_parseInt'},
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {key: 'talent1', format: '_parseTalent', selector: true},
        {key: 'talent4', format: '_parseTalent', selector: true},
        {key: 'talent7', format: '_parseTalent', selector: true},
        {key: 'talent10', format: '_parseTalent', selector: true},
        {key: 'talent13', format: '_parseTalent', selector: true},
        {key: 'talent16', format: '_parseTalent', selector: true},
        {key: 'talent20', format: '_parseTalent', selector: true},
        {key: 'hasWon', format: '_parseHasWon'},
        null,
        null,
        null,
        null
    ];

    statisticsSelector = 'table#MatchSummary_RadGridReplayCharacterScoreResults_ctl00 > tbody > tr';
    statisticsKeys = [
        {key: 'playerName'},
        null,
        null,
        {key: 'score', format: '_parseScore', selector: true},
        {key: 'takeDown', format: '_parseFloat'},
        {key: 'kill', format: '_parseFloat'},
        {key: 'assist', format: '_parseFloat'},
        {key: 'death', format: '_parseFloat'},
        {key: 'timeSpentAsDead', format: '_parseDuration'},
        {key: 'heroDamage', format: '_parseNumber'},
        {key: 'siegeDamage', format: '_parseNumber'},
        {key: 'healing', format: '_parseNumber'},
        {key: 'selfHeal', format: '_parseNumber'},
        {key: 'damageTaken', format: '_parseNumber'},
        {key: 'experience', format: '_parseNumber'},
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ];

    /**
     *
     * @param tree
     * @return {boolean}
     */
    verifyTalent(tree) {
        return tree.heroLevel > 4;
    }

    /**
     *
     * @param element
     * @return {*}
     * @private
     */
    _parseTalent(element) {
        const talentName = this.sanitize(element);
        if (null !== talentName) {
            const talent = {name: null, description: null, image: null};
            element.parent().find('img').each((i, el) => {
                if ((new RegExp(talentName)).test(el.attribs.src)) {
                    let t = el.attribs.title.split(': ');
                    talent.name = t[0];
                    talent.description = t[1];
                    talent.image = el.attribs.src;
                }
            });

            return talent;
        }

        return talentName;
    }

    /**
     * @param {jQuery} element
     * @return {boolean}
     */
    _parseAward(element) {
        let img = element.find('img');
        if (img.length > 0) {
            return img.attr('alt').replace('Award:', '').trim();
        }

        return null;
    }

    /**
     * @param {jQuery} element
     * @return {boolean}
     */
    _parseScore(element) {
        return parseFloat(element.find('span.titlePopupHover').text().split('%')[0].trim());
    }

    /**
     *
     * @param value
     * @return {int}
     * @private
     */
    _parseNumber(value) {
        if (value === null) return value;

        return parseInt(value.replace(',', ''), 10);
    }

    /**
     *
     * @param value
     * @return {Number}
     * @private
     */
    _parseFloat(value) {
        return parseFloat(value);
    }

    /**
     *
     * @param value
     * @return {Boolean}
     * @private
     */
    _parseHasWon(value) {
        return value === 'True';
    }
}
