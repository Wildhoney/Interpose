import React, { Component } from 'react';
import test from 'ava';
import { mount } from 'enzyme';
import StyleProperties from '../src/interpose';

test('It should be able to render the CSS variables passed as props;', t => {

    const styleMap = { width: '500px', colour: 'red', fontFamily: 'Arial' };

    const Component = props => {

        return (
            <StyleProperties map={props.map}>
                <h1 className="header"><span>Voila!</span></h1>
            </StyleProperties>
        );

    };

    const wrapper = mount(<Component map={styleMap} />);
    const h1Element = wrapper.find('h1');

    const styleOne = h1Element.node.querySelector('style');
    t.is(styleOne.innerHTML, `h1.header { --width: 500px; --colour: red; --font-family: Arial; }`);
    t.is(h1Element.find('span').text(), 'Voila!');

    wrapper.setProps({ map: { ...styleMap, colour: 'green' }});
    const styleTwo = h1Element.node.querySelector('style');
    t.is(styleTwo.innerHTML, `h1.header { --width: 500px; --colour: green; --font-family: Arial; }`);


});
