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
            expect(games[0].replayId).to.be.a('number');
            expect(games[0].mapName).to.be.a('string');
            expect(games[0].duration).to.be.a('number');
            expect(games[0].heroName).to.be.a('string');
            expect(games[0].heroLevel).to.be.a('number');
            //expect(games[0].isWon).to.be.a('bool');
            expect(games[0].mmr).to.be.a('number');
            expect(games[0].mmrDelta).to.be.a('number');
            expect(games[0].date).to.be.a('object');
            expect(games[0].heroRole).to.be.a('string');
            done();
        }).catch((e) => {
            done(e);
        });
    });
});
