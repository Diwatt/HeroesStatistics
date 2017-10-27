import {expect} from 'chai';
import HeroProtocol from '../../app/js/ReplayParser/HeroProtocol';
import fs from 'fs';
import path from 'path';

describe('HeroProtocol', function() {
    const hp = new HeroProtocol(__dirname+path.sep+'Sample.StormReplay', true);
    const debugData = (filename, data) => {
        /*fs.writeFile(__dirname+path.sep+filename+'.json', JSON.stringify(data), (err) => {
            if (err) throw err;
        });*/
    };

    xit('should find heroprotocol', function () {
        expect(hp.binPath).to.not.be.null;
        expect(fs.existsSync(hp.binPath)).to.be.true;
    });

    xit('should return game events', function (done) {
        let start = Date.now(),
            elapsedTime = 0;

        hp.getGameEvents().then(data => {
            elapsedTime = Date.now() - start;
            expect(data).to.not.be.null;
            expect(data.events).to.not.be.null;
            expect(data.events).to.be.a('array');
            expect(data.stats).to.not.be.null;
            expect(data.stats).to.be.a('array');
            debugData('game_events', data);


            return data;
        }).then(data => {
            start = Date.now();
            hp.getGameEvents().then(newdata => {
                let newElapsedTime = Date.now() - start;
                expect(newdata).to.not.be.null;
                expect(data.events).to.be.a('array');
                expect(newdata.events.length).to.be.equals(data.events.length);
                expect(newElapsedTime).to.not.be.above(elapsedTime);

                done();
            }).catch(err => {
                done(err);
            })
        }).catch(err => {
            done(err);
        });
    });

    xit('should return message events', function (done) {
        hp.getMessageEvents().then(data => {
            expect(data).to.not.be.null;
            expect(data.events).to.be.a('array');
            expect(data.stats).to.not.be.null;
            expect(data.stats).to.be.a('array');
            debugData('message_events', data);
            done();
        }).catch(err => {
            done(err);
        });
    });

    xit('should return attributes event', function (done) {
        hp.getAttributesEvents().then(data => {
            expect(data).to.not.be.null;
            expect(data.events).to.be.a('array');
            expect(data.stats).to.not.be.null;
            expect(data.stats).to.be.a('array');
            debugData('attributes_events', data);
            done();
        }).catch(err => {
            done(err);
        });
    });

    xit('should return tracker events', function (done) {
        hp.getTrackerEvents().then(data => {
            expect(data).to.not.be.null;
            expect(data.events).to.be.a('array');
            expect(data.stats).to.not.be.null;
            expect(data.stats).to.be.a('array');
            debugData('tracker_events', data);
            done();
        }).catch(err => {
            done(err);
        });
    });

    xit('should return header', function (done) {
        hp.getHeader().then(data => {
            expect(data).to.not.be.null;
            expect(data.header).to.be.a('object');
            debugData('header', data);
            done();
        }).catch(err => {
            done(err);
        });
    });

    xit('should return details', function (done) {
        hp.getDetails().then(data => {
            expect(data).to.not.be.null;
            expect(data.details).to.be.a('object');
            debugData('details', data);
            done();
        }).catch(err => {
            done(err);
        });
    });

    xit('should return init data', function (done) {
        hp.getInitData().then(data => {
            expect(data).to.not.be.null;
            expect(data.initdata).to.be.a('object');
            debugData('initdata', data);
            done();
        }).catch(err => {
            done(err);
        });
    });
});
