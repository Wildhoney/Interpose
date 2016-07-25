<img src="media/logo.png" width="375" />

> Apply stylesheet variables to your React components for use in your stylesheets. Interpose reduces the clutter of React components by bridging the gap between JS and CSS without resorting to complicating your components with CSS logic.

![Travis](http://img.shields.io/travis/Wildhoney/Interpose.svg?style=flat-square)
&nbsp;
![npm](http://img.shields.io/npm/v/react-interpose.svg?style=flat-square)
&nbsp;
![License MIT](http://img.shields.io/badge/license-mit-lightgrey.svg?style=flat-square)

* **npm:** `npm install react-interpose --save`

---

```css
h1 { color: var(--colour); }
```

By using the `map` property of the `StyleProperties` component &mdash; wrapping your component inside &mdash; the `--colour` variable can be dynamically applied:

```javascript
import StyleProperties from 'react-interpose';

const Component = props => {

    return (
        <StyleProperties map={{ colour: props.colour }}>
            <h1 className="header">
                Hello, Interpose
            </h1>
        </StyleProperties>
    );

};
```
