<img src="media/logo.png" width="375" />

> Apply stylesheet variables to your React components for use in your stylesheets. Interpose reduces the clutter of React components by bridging the gap between JS and CSS without resorting to complicating your components with CSS logic.

![Travis](http://img.shields.io/travis/Wildhoney/Interpose.svg?style=flat-square)
&nbsp;
![npm](http://img.shields.io/npm/v/react-interpose.svg?style=flat-square)
&nbsp;
![License MIT](http://img.shields.io/badge/license-mit-lightgrey.svg?style=flat-square)

* **npm:** `npm install react-interpose --save`

```javascript
import StyleProperties from 'react-interpose';

const Component = props => {

    return (
        <StyleProperties map={{ colour: props.colour }}>
            <h1 className="header">Voila!</h1>
        </StyleProperties>
    );

};

```css
h1 {
    color: var(--colour);
}
```
