import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import Reset from '../../app/js/components/Reset';

Enzyme.configure({ adapter: new Adapter() });
describe('<Reset />', () => {
    let wrapper = Enzyme.shallow(<Reset />);
    it('initial state willDelete null', () => {
        expect(wrapper.state().willDelete).to.be.null;
    });

    it('state willDelete false', () => {
        wrapper.find('.button').not('.is-success').simulate('click');
        expect(wrapper.state().willDelete).to.be.false;
    });

    it('state willDelete true', () => {
        wrapper.setState({willDelete: null});
        wrapper.find('.button.is-success').simulate('click');
        expect(wrapper.state().willDelete).to.be.true;
    });
});
