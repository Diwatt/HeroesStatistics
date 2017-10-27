import 'babel-polyfill';
import {expect} from 'chai';
import HotsLogCrawler from '../../app/js/utils/HotsLogCrawler';

const mochaAsync = (fn) => {
    return async (done) => {
        try {
            await fn();
            done();
        } catch (err) {
            done(err);
        }
    };
};

describe('HotsLogCrawler', function() {
    const crawler = new HotsLogCrawler(1350838);
    it('getGames should return player games', (done) => {
        crawler.getGames().then((games) => {
            expect(games).to.be.a('array');
            expect(games).to.not.be.empty;
            let firstGame = games[games.length-1];
            expect(firstGame.replayId).to.be.a('number');
            expect(firstGame.mapName).to.be.a('string');
            expect(firstGame.duration).to.be.a('number');
            expect(firstGame.heroName).to.be.a('string');
            expect(firstGame.heroLevel).to.be.a('number');
            expect(firstGame.isWon).to.be.true;
            expect(firstGame.mmr).to.be.a('number');
            expect(firstGame.mmrDelta).to.be.a('number');
            expect(firstGame.date).to.be.a('date');
            expect(firstGame.heroRole).to.be.a('string');

            expect(games[games.length-1].date.toUTCString()).to.be.equals('Sat, 04 Apr 2015 16:29:03 GMT');
            expect(games[games.length-2].date.toUTCString()).to.be.equals('Sat, 04 Apr 2015 18:06:06 GMT');
            expect(games[games.length-3].date.toUTCString()).to.be.equals('Sat, 04 Apr 2015 23:36:45 GMT');
            done();
        }).catch((e) => {
            done(e);
        });
    });

    it('getGameSummary should return player games', (done) => {
        crawler.getGameSummary(120859507).then((summaries) => {
            expect(summaries).to.be.a('array');
            expect(summaries).to.not.be.empty;
            let mySummary = summaries[0];
            expect(mySummary.playerName).to.be.a('string');
            expect(mySummary.heroName).to.be.a('string');
            expect(mySummary.heroLevel).to.be.a('number');
            expect(mySummary.hasWon).to.be.true;
            expect(mySummary.award).to.be.a('string');
            expect(mySummary.talentTree).to.be.a('object');
            expect(mySummary.talentTree.talent1).to.be.a('object');
            expect(mySummary.talentTree.talent1.name).to.be.a('string');
            expect(mySummary.talentTree.talent1.name).to.be.equals('Winter\'s Reach');
            expect(mySummary.talentTree.talent1.description).to.be.a('string');
            expect(mySummary.talentTree.talent1.description).to.be.equals('Increases range');
            expect(mySummary.talentTree.talent1.image).to.be.a('string');
            expect(mySummary.talentTree.talent4).to.be.a('object');
            expect(mySummary.talentTree.talent7).to.be.a('object');
            expect(mySummary.talentTree.talent10).to.be.a('object');
            expect(mySummary.talentTree.talent13).to.be.a('object');
            expect(mySummary.talentTree.talent16).to.be.a('object');
            expect(mySummary.talentTree.talent20).to.be.a('object');
            expect(mySummary.statistics).to.be.a('object');
            expect(mySummary.statistics.score).to.be.a('number');
            expect(mySummary.statistics.score).to.be.equals(60.7);
            expect(mySummary.statistics.takeDown).to.be.a('number');
            expect(mySummary.statistics.takeDown).to.be.equals(17);
            expect(mySummary.statistics.kill).to.be.a('number');
            expect(mySummary.statistics.kill).to.be.equals(4);
            expect(mySummary.statistics.assist).to.be.a('number');
            expect(mySummary.statistics.assist).to.be.equals(13);
            expect(mySummary.statistics.death).to.be.a('number');
            expect(mySummary.statistics.death).to.be.equals(2);
            expect(mySummary.statistics.timeSpentAsDead).to.be.a('number');
            expect(mySummary.statistics.timeSpentAsDead).to.be.equals(121);
            expect(mySummary.statistics.heroDamage).to.be.a('number');
            expect(mySummary.statistics.heroDamage).to.be.equals(23048);
            expect(mySummary.statistics.siegeDamage).to.be.a('number');
            expect(mySummary.statistics.healing).to.be.null;
            expect(mySummary.statistics.selfHeal).to.be.a('number');
            expect(mySummary.statistics.damageTaken).to.be.null;
            expect(mySummary.statistics.experience).to.be.a('number');

            done();
        }).catch((e) => {
            done(e);
        });
    });

    it('getHeroes should return heroes', (done) => {
        crawler.getHeroes().then((heroes) => {
            expect(heroes).to.be.a('array');
            expect(heroes).to.not.be.empty;
            //console.log(heroes[0]);
            done();
        }).catch((e) => {
            done(e);
        });
    });

    it('getMaps should return maps', (done) => {
        crawler.getMaps().then((maps) => {
            expect(maps).to.be.a('array');
            expect(maps).to.not.be.empty;
            //console.log(maps[0]);
            done();
        }).catch((e) => {
            done(e);
        });
    });
});
