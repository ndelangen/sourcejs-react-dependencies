# SourceJS Auto React Dependencies Builder Middleware

Uses : babylon: "~5.8.3", recast: "^0.10.41" &amp; node-source-walk: "^2.1.0" to renders React components dependencies into [SourceJS](http://sourcejs.com) Spec page.

Compatible with [SourceJS](http://sourcejs.com) 0.6.0+.

## Install

```
npm install sourcejs-react-dependencies --save
```

After restarting your app, middleware will be loaded automatically. To disable it, remove npm module and restart the app.

## Usage

After installing the middleware, during SourceJS Spec load plugin will try to find first `<specPath>/*.jsx` file, analyze it and expose raw and rendered into HTML data objects. Data will be then available within [EJS Spec pre-rendering](http://sourcejs.com/docs/spec-helpers/#native-templating).

Insert these code snippets anywhere you want in your Spec file:

```html
<h1>My Spec</h1>

<section class="source_section">
    <h2>Default Example</h2>

    <p><%- info.__dependenciesRAW.description[0].name %></p>

    <%- info.__dependenciesHTML %>

    <div class="source_example"></div>
</section>
```

    # My Spec

    ## Default Example

    <%- info.__dependenciesRAW.description[0].name %>

    <%- info.__dependenciesHTML %>

    ```example
    code
    ```

Check usage examples in [sourcejs-react-bundle-example](http://github.com/ndelangen/sourcejs-react-bundle-example)

### EJS exposed data

* **info.__dependenciesRAW** - raw JSON array with objects
* **info.__dependenciesGROUPED** - raw JSON object with arrays
* **info.__dependenciesHTML** - rendered list

## Configuration

Or overriding global plugin configuration:

```javascript
module.exports = {
	plugins: {
		dependencies: {
			componentPath: 'custom/path/index.jsx',
		}
	}
};
```

See other configuration options below.

### enabled

Default: true
Type: _boolean_


Set `false` to disable middleware.

### componentPath

Default: '*.jsx'
Type: _string_

Define custom path to component entry file. Accepts [glob](https://github.com/isaacs/node-glob) string, which will be resolved relatively to spec path (takes only first found file).

## TODO:

* Better styling
* Detecting if a dependency is a spec and thus has a page to link to
* Link to npm package

Pull request highly welcome!
