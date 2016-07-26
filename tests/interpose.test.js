import React, { Component } from 'react';
import test from 'ava';
import { mount } from 'enzyme';
import StyleProperties from '../src/interpose';

test.beforeEach(t => {

	t.context.styleMap = { width: '500px', colour: 'red', fontFamily: 'Arial' };
	
	t.context.Component = props => {
		return (
			<StyleProperties map={props.map}>
				<h1><span>Voila!</span></h1>
			</StyleProperties>
		);
	};
	
	t.context.RootComponent = props => {
		return (
			<StyleProperties map={props.map} isRoot={true}>
				<h1 className="header"><span>Voila!</span></h1>
			</StyleProperties>
		);
	};
	
	t.context.ClassComponent = props => {
		return (
			<StyleProperties map={props.map}>
				<h1 className="header"><span>Voila!</span></h1>
			</StyleProperties>
		);
	};
	
	t.context.IDComponent = props => {
		return (
			<StyleProperties map={props.map}>
				<h1 id="header"><span>Voila!</span></h1>
			</StyleProperties>
		);
	};
	
	t.context.ClassIDComponent = props => {
		return (
			<StyleProperties map={props.map}>
				<h1 className="my-header" id="header"><span>Voila!</span></h1>
			</StyleProperties>
		);
	};
	
});

test('It should be able to render the CSS map;', t => {

	const { Component, styleMap } = t.context;

    const wrapper = mount(<Component map={styleMap} />);
    const h1Element = wrapper.find('h1');

    const styleOne = h1Element.node.querySelector('style');
    t.is(styleOne.innerHTML, `h1 { --width: 500px; --colour: red; --font-family: Arial; }`);
    t.is(h1Element.find('span').text(), 'Voila!');

    wrapper.setProps({ map: { ...styleMap, colour: 'green' }});
    const styleTwo = h1Element.node.querySelector('style');
    t.is(styleTwo.innerHTML, `h1 { --width: 500px; --colour: green; --font-family: Arial; }`);

});

test('It should be able to render the CSS map for a root component;', t => {

	const { RootComponent, styleMap } = t.context;

    const wrapper = mount(<RootComponent map={styleMap} />);
    const h1Element = wrapper.find('h1');

    const styleOne = h1Element.node.querySelector('style');
    t.is(styleOne.innerHTML, `:root { --width: 500px; --colour: red; --font-family: Arial; }`);

});

test('It should be able to render the CSS map for a class component;', t => {

	const { ClassComponent, styleMap } = t.context;

    const wrapper = mount(<ClassComponent map={styleMap} />);
    const h1Element = wrapper.find('h1');

    const styleOne = h1Element.node.querySelector('style');
    t.is(styleOne.innerHTML, `h1.header { --width: 500px; --colour: red; --font-family: Arial; }`);

});

test('It should be able to render the CSS map for an ID component;', t => {

	const { IDComponent, styleMap } = t.context;

    const wrapper = mount(<IDComponent map={styleMap} />);
    const h1Element = wrapper.find('h1');

    const styleOne = h1Element.node.querySelector('style');
    t.is(styleOne.innerHTML, `h1#header { --width: 500px; --colour: red; --font-family: Arial; }`);

});

test('It should be able to render the CSS map for a class and ID component;', t => {

	const { ClassIDComponent, styleMap } = t.context;

    const wrapper = mount(<ClassIDComponent map={styleMap} />);
    const h1Element = wrapper.find('h1');

    const styleOne = h1Element.node.querySelector('style');
    t.is(styleOne.innerHTML, `h1#header.my-header { --width: 500px; --colour: red; --font-family: Arial; }`);

});

