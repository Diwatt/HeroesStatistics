let Crawler = require("crawler");
let moment = require('momentjs');

let playerId = 1350838;

let apiUrls = {
    heroes: 'https://api.hotslogs.com/Public/Data/Heroes',
    heroDetail: 'https://www.hotslogs.com/Sitewide/HeroDetails?Hero={Hero}',
    maps: 'https://api.hotslogs.com/Public/Data/Maps',
    profile: 'https://api.hotslogs.com/Public/Players/{PlayerID}',


};

let c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            console.log($("title").text());
        }

        done();
    }
});


const sanitize = function (value) {
    let sanitizedValue = value.trim();

    if (sanitizedValue == '') {
        sanitizedValue = null;
    }

    if (!isNaN(sanitizedValue) && null !== sanitizedValue) {
        sanitizedValue = parseInt(sanitizedValue, 10);
    }

    return sanitizedValue;
};

const parseBool = function(value) {
    return value === '1';
}

const parseDate = function(date) {
    return moment(date, "MM-DD-YYYY");
}

const keys = [
    {key: 'hero_role'},
    {key: 'replay_id', format: 'parseInt'},
    {key: 'map_name'},
    {key: 'game_duration'},
    {key: 'hero_name'},
    null,
    {key: 'level', format: 'parseInt'},
    {key: 'is_won', format: 'parseBool'},
    {key: 'mmr', format: 'parseInt'},
    {key: 'mmr_delta', format: 'parseInt'},
    {key: 'date'},
    null,
    null,
    null,
    null
];

c.queue([{
    uri: 'https://www.hotslogs.com/Player/MatchHistory?PlayerID='+playerId,

    // The global callback won't be called
    callback: function (error, res) {
        let replays = [];

        let isFirst = true;
        let $ = res.$;
        let lines = $('table.rgMasterTable tr');
        lines.each(function(i, e) {
            let replay = {};
            $(this).children().each(function (i) {
                if (!isFirst && null !== keys[i]) {
                    replay[keys[i]] = sanitize($(this).text());
                }
            });

            if (!isFirst) {

            console.log(replay);
            process.exit();
        }

            isFirst = false;
            replays.push(replay);


        });

        console.log(replays, replays.length);
    }
}]);


