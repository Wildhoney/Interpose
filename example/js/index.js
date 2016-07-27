import React, { Component } from 'react';
import { render } from 'react-dom';
import StyleProperties from '../../src/interpose';
import { SwatchesPicker } from 'react-color';

class Theme extends Component {

    /**
     * @constructor
     */
    constructor() {
        super();
        this.state = { colour: '#f44336' };
    }

    /**
     * @method render
     * @return {XML}
     */
    render() {

        return (
            <StyleProperties map={{ theme: this.state.colour }}>

                <section className="theme">

                    <h1>Hello Interpose!</h1>
                    <h2>Try changing the theme colour, and then inspecting the CSS variable&hellip;</h2>

                    <SwatchesPicker
                        color={this.state.colour}
                        onChangeComplete={model => this.setState({ colour: model.hex })}
                        />

                </section>

            </StyleProperties>
        );

    }

}

document.addEventListener('DOMContentLoaded', () => {
    render(<Theme />, document.querySelector('section.app'));
});
