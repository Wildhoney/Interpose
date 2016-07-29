import React, { Component, PropTypes, cloneElement } from 'react';
import { decamelize } from 'humps';

/**
 * Maps an object to CSS variables by transforming the key according to the CSS specification.
 *
 * @method propsToStyles
 * @param {Object} props
 * @return {String}
 */
export function propsToStyles(props) {

    return `${Object.keys(props).map(key => {
        const name = decamelize(key, { separator: '-' });
        return `--${name}: ${props[key]}; `;
    }).join('').trim()}`;

}

/**
 * @author Adam Timberlake
 * @class Interpose
 * @extends Component
 */
export default class Interpose extends Component {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        map: PropTypes.object.isRequired,
        children: PropTypes.node.isRequired,
        isRoot: PropTypes.bool
    };

    /**
     * @constant defaultProps
     * @type {Object}
     */
    static defaultProps = {
        isRoot: false
    };

    /**
     * @constant attributes
     * @type {Array}
     */
    static attributes = [
        { attr: 'id', symbol: '#' },
        { attr: 'className', symbol: '.' }
    ];

    /**
     * @method componentWillMount
     * @return {void}
     */
    componentWillMount() {
        this.styleElement = document.createElement('style');
    }

    /**
     * Determine the selector name based on the node's attributes as defined in the `attributes` constant.
     *
     * @method propsToSelector
     * @param {Object} props
     * @return {String}
     */
    propsToSelector(props) {

        const { children } = this.props;

        const selector = this.props.isRoot ? ':root' : Interpose.attributes.reduce((accumulator, model) => {
            const hasAttr = children.props[model.attr];
            return hasAttr ? `${accumulator}${model.symbol}${children.props[model.attr]}` : accumulator;
        }, children.type);

        return `${selector} { ${propsToStyles(props)} }`.trim();

    }

    /**
     * @method render
     * @return {XML}
     */
    render() {

        const child = React.Children.only(this.props.children);

        return cloneElement(child, { ref: childElement => {

            if (childElement) {

                this.styleElement.setAttribute('type', 'text/css');
                this.styleElement.innerHTML = this.propsToSelector(this.props.map);
                childElement.insertBefore(this.styleElement, childElement.childNodes[0]);

            }

        } });

    }
}
