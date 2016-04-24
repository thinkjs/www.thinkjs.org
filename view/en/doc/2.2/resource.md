## Static Resources Access

We generally need to reference static resources in a template when developing projects.

When using the command `thinkjs` to create a project, it will automatically create the directory `www/static`, where specially stores JS, CSS, images and other static resources.


### Access Static Resources

After putting the static resources in `www/static`, you can reference them in a template by the following approaches.

#### Reference JS files in template

```html
<script src="/static/js/foo.js"></script>
```

#### Reference CSS files in template

```html
<link href="/static/css/foo.css" rel="stylesheet" />
```

#### Reference Image files in template

```html
<img src="/static/img/foo.png" alt="" >
```

### Static Resources Access Configuration

Judging whether the request is a static resource request, we use regular expression. The default configuration is as follows.

```js
export default {
  resource_on: true, // enable static resources resolution function
  resource_reg: /^(static\/|[^\/]+\.(?!js|html)\w+$)/, // regular expression for judging static resource request
}
```

You can modify the configuration file `src/common/config/config.js` according to your project requirements.


### Close Online Static Resources Access 

After the project is online, it generally uses nginx or other WEB server as an agent. At this time, you can let nginx to directly handle the static resource requests. Thus, you could close the static resources access to improve performance.

Set the option `resource_on` to `false` in the configuration file `src/common/config/env/prodution.js` to close it. eg.

```js
export default {
  resource_on: false
}
```
