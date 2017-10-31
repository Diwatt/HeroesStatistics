export default class AbstractTableParserConfigurator {
    /**
     * @param {Function} $
     * @param {String} selectorName
     * @param {String} keysName
     * @param {String} verifyName
     * @return {Array}
     */
    parseTable($, selectorName = 'selector', keysName = 'keys', verifyName = 'verify') {
        let tableValues = [];
        let lines = $(this[selectorName]);
        lines.each((i, el1) => {
            let lineValues = {};
            $(el1).children().each((j, el2) => {
                if (null !== this[keysName][j]) {
                    lineValues[this[keysName][j].key] = this.sanitize($(el2), this[keysName][j]);
                }
            });

            if (true === this[verifyName](lineValues)) {
                tableValues.push(lineValues);
            }
        });

        return tableValues;
    }


    /**
     * @param {jQuery} element
     * @param {Object} definition
     * @return {*}
     */
    sanitize(element, definition = {}) {
        let textValue = element.text();
        let sanitizedValue = textValue.trim();

        if ('' === sanitizedValue) {
            sanitizedValue = null;
        }
        if (definition.format != undefined) {
            let value = definition.selector == undefined || definition.selector === false ? sanitizedValue : element;
            sanitizedValue = this[definition.format](value);
        }

        return sanitizedValue;
    }

    /**
     * @param value
     * @return {boolean}
     */
    verify(value) {
        return true;
    }

    /**
     * @param value
     * @returns {boolean}
     * @private
     */
    _parseInt(value) {
        if (null === value) {
            return 0;
        }
        return parseInt(value.replace(' ', ''), 10);
    }

    /**
     * @param value
     * @returns {boolean}
     * @private
     */
    _parsePercent(value) {
        if (null === value || '' === value.trim()) {
            return 0;
        }

        let v = value.replace('%', '').replace(',', '.').trim();

        return parseFloat(v);
    }

    /**
     * @param value
     * @returns {boolean}
     * @private
     */
    _parseBool(value) {
        return value === '1';
    }

    /**
     * @param value
     * @returns {number}
     * @private
     */
    _parseDuration(value) {
        let hours = 0, minutes = 0, seconds = 0;
        if (null !== value) {
            [hours, minutes, seconds] = value.split(':');
        }

        return parseInt(hours, 10)*60*60 + parseInt(minutes, 10)*60 + parseInt(seconds, 10);
    }
}
