import {expect} from 'chai';
import HeroProtocol from '../../app/js/ReplayParser/HeroProtocol';
import fs from 'fs';
import path from 'path';

describe('HeroProtocol', function() {
    const hp = new HeroProtocol(__dirname+path.sep+'Sample.StormReplay');

    it('should find heroprotocol', function () {
        expect(hp.binPath).to.not.be.null;
        expect(fs.existsSync(hp.binPath)).to.be.true;
    });

    it('should return game events', function (done) {
        let start = Date.now(),
            elapsedTime = 0;

        hp.getGameEvents().then(data => {
            elapsedTime = Date.now() - start;
            expect(data).to.not.be.null;
            expect(data).to.be.a('array');

            return data;
        }).then(data => {
            start = Date.now();
            hp.getGameEvents().then(newdata => {
                let newElapsedTime = Date.now() - start;
                expect(newdata).to.not.be.null;
                expect(data).to.be.a('array');
                expect(newdata.length).to.be.equals(data.length);
                expect(newElapsedTime).to.not.be.above(elapsedTime);

                done();
            }).catch(err => {
                done(err);
            })
        }).catch(err => {
            done(err);
        });
    });

    it('should return message events', function (done) {
        hp.getMessageEvents().then(data => {
            expect(data).to.not.be.null;
            expect(data).to.be.a('array');
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('should return attributes event', function (done) {
        hp.getAttributesEvents().then(data => {
            expect(data).to.not.be.null;
            expect(data).to.be.a('array');
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('should return tracker events', function (done) {
        hp.getTrackerEvents().then(data => {
            expect(data).to.not.be.null;
            expect(data).to.be.a('array');
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('should return header', function (done) {
        hp.getHeader().then(data => {
            expect(data).to.not.be.null;
            expect(data).to.be.a('object');
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('should return details', function (done) {
        hp.getDetails().then(data => {
            expect(data).to.not.be.null;
            expect(data).to.be.a('object');
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('should return init data', function (done) {
        hp.getInitData().then(data => {
            expect(data).to.not.be.null;
            expect(data).to.be.a('object');
            done();
        }).catch(err => {
            done(err);
        });
    });
});
