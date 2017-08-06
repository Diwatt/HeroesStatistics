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
    it('getGames should return player games', function(done) {
        crawler.getGames((games) => {
            console.log('4');
            expect(games).to.be.a('array');
            expect(games).to.not.be.empty;
            done();
        });
    });
});
