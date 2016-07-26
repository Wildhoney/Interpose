import React, { Component } from 'react';
import test from 'ava';
import { mount } from 'enzyme';
import StyleProperties from '../src/interpose';

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
	const map = { width: '500px', colour: 'red', fontFamily: 'Arial' };

	const Component = props => (
		<StyleProperties map={props.map} isRoot={isRoot}>
			<h1 {...nodeAttrs}><span>Voila!</span></h1>
		</StyleProperties>
	);

	const wrapper = mount(<Component map={map} />);

	return {
		map,
		wrapper,
		header: wrapper.find('h1').find('span'),
		styles: { text: () => wrapper.find('h1').node.querySelector('style').innerHTML },
		propsToStyles: StyleProperties.prototype.propsToStyles
	};

};

test('It should be able to render the CSS map and modify the values;', t => {

	const { header, styles, map, wrapper, propsToStyles } = mountFromProps();

    t.is(styles.text(), `h1 { ${propsToStyles(map)} }`);
    t.is(header.text(), 'Voila!');

	const updatedMap = { ...map, colour: 'green' };
    wrapper.setProps({ map: updatedMap });
	t.is(styles.text(), `h1 { ${propsToStyles(updatedMap)} }`);

});

test('It should be able to render the CSS map for a root component;', t => {
	const { styles, map, propsToStyles } = mountFromProps({ className: 'test' }, true);
	t.is(styles.text(), `:root { ${propsToStyles(map)} }`);
});

test('It should be able to render the CSS map for a class component;', t => {
	const { styles, map, propsToStyles } = mountFromProps({ className: 'test' });
	t.is(styles.text(), `h1.test { ${propsToStyles(map)} }`);
});

test('It should be able to render the CSS map for an ID component;', t => {
	const { styles, map, propsToStyles } = mountFromProps({ id: 'test' });
	t.is(styles.text(), `h1#test { ${propsToStyles(map)} }`);
});

test('It should be able to render the CSS map for a class and ID component;', t => {
	const { styles, map, propsToStyles } = mountFromProps({ id: 'test-id', className: 'test-class' });
	t.is(styles.text(), `h1#test-id.test-class { ${propsToStyles(map)} }`);
});
