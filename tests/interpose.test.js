import React, { Component } from 'react';
import test from 'ava';
import { mount } from 'enzyme';
import StyleProperties, { propsToStyles } from '../src/interpose';

/**
 * @method mountFromProps
 * @param {Object} [nodeAttrs = {}]
 * @param {Boolean} [isRoot = false]
 * @return {Object}
 */
const mountFromProps = (nodeAttrs = {}, isRoot = false) => {

	/**
	 * @constant map
	 * @type {Object}
	 */
	const map = { width: `${Math.ceil(Math.random() * 100)}px`, colour: 'red', fontFamily: 'Arial' };

	const Component = props => (
		<StyleProperties map={props.map} isRoot={isRoot}>
			<h1 {...nodeAttrs}><span>{props.greeting}</span></h1>
		</StyleProperties>
	);

	const wrapper = mount(<Component map={map} greeting="Hello!" />);

	return {
		map,
		wrapper,
		header: wrapper.find('h1').find('span'),
		styles: { text: () => wrapper.find('h1').node.querySelector('style').innerHTML },
		propsToStyles
	};

};

test('It should be able to render the CSS map and modify the values;', t => {

	const { header, styles, map, wrapper, propsToStyles } = mountFromProps();

	t.is(styles.text(), `h1 { ${propsToStyles(map)} }`);
	t.is(header.text(), 'Hello!');

	const updatedMap = { ...map, colour: 'green' };
	wrapper.setProps({ map: updatedMap });
	t.is(styles.text(), `h1 { ${propsToStyles(updatedMap)} }`);

	wrapper.setProps({ greeting: 'Bonjour!' });
	t.is(header.text(), 'Bonjour!');

});

test('It should be able to render the CSS map for a root component;', t => {
	const { header, styles, map, propsToStyles } = mountFromProps({ className: 'test' }, true);
	t.is(styles.text(), `:root { ${propsToStyles(map)} }`);
	t.is(header.text(), 'Hello!');
});

test('It should be able to render the CSS map for a class component;', t => {
	const { header, styles, map, propsToStyles } = mountFromProps({ className: 'test' });
	t.is(styles.text(), `h1.test { ${propsToStyles(map)} }`);
	t.is(header.text(), 'Hello!');
});

test('It should be able to render the CSS map for an ID component;', t => {
	const { header, styles, map, propsToStyles } = mountFromProps({ id: 'test' });
	t.is(styles.text(), `h1#test { ${propsToStyles(map)} }`);
	t.is(header.text(), 'Hello!');
});

test('It should be able to render the CSS map for a class and ID component;', t => {
	const { header, styles, map, propsToStyles } = mountFromProps({ id: 'test-id', className: 'test-class' });
	t.is(styles.text(), `h1#test-id.test-class { ${propsToStyles(map)} }`);
	t.is(header.text(), 'Hello!');
});
