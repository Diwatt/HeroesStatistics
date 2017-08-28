import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Reset from '../../app/js/components/Reset';

describe('<Reset />', () => {
    let wrapper = shallow(<Reset />);
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
