import React, { Component } from 'react';
import test from 'ava';
import { mount } from 'enzyme';
import StyleProperties from '../src/interpose';

test('It should be able to render the CSS variables passed as props;', t => {

    const styleMap = { width: '500px', colour: 'red', fontFamily: 'Arial' };

    const TestComponent = props => {

        return (
            <StyleProperties map={props.map}>
                <h1 className="header">Voila!</h1>
            </StyleProperties>
        );

    };

    const wrapper = mount(<TestComponent map={styleMap} />);
    const style = wrapper.find('style');

    t.is(style.text(), `h1.header { --width: '500px'; --colour: 'red'; --font-family: 'Arial'; }`);

    wrapper.setProps({ map: { ...styleMap, colour: 'green' }});
    t.is(style.text(), `h1.header { --width: '500px'; --colour: 'green'; --font-family: 'Arial'; }`);

});
