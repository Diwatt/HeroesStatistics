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
            expect(firstGame.date).to.be.a('object');
            expect(firstGame.heroRole).to.be.a('string');
            done();
        }).catch((e) => {
            done(e);
        });
    });
});
