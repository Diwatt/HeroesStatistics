import {expect} from 'chai';
import HeroProtocol from '../../app/js/ReplayParser/HeroProtocol';

describe('HeroProtocol', function() {
    const hp = new HeroProtocol();
    it('should find python', function () {
        expect(hp.pythonBin).to.not.be.null;
        expect(HeroProtocol.pythonBin).to.not.be.null;
    });

    it('should find heroprotocol', function () {
        expect(hp.commandLine).to.not.be.null;
        expect(HeroProtocol.commandLine).to.not.be.null;
    });
});
