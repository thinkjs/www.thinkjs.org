## Static Resource Access

We generally need to reference static resources in a template when developing project.

When using the command `thinkjs` to create a project, it will automatically create the directory `www/static`, where specially stores JS, CSS, images and other static resources.


### Access Static Resource

After putting the static resources in the directory `www/static`, you can reference them in a template by the following approaches.

#### Reference JS file in template

```html
<script src="/static/js/foo.js"></script>
```

#### Reference CSS file in template

```html
<link href="/static/css/foo.css" rel="stylesheet" />
```

#### Reference Image file in template

```html
<img src="/static/img/foo.png" alt="" >
```

### Static Resource Access Configuration

Judging whether the request is a static resource request, we use regular expression. The default configuration is as follows.

```js
export default {
  resource_on: true, //enable static resource resolution function
  resource_reg: /^(static\/|[^\/]+\.(?!js|html)\w+$)/, //regular for judging static resource request
}
```

You can modify the configuration file `src/common/config/config.js` according to your project requirements.


### Close Online Static Resource Access 

After the project online, it generally uses nginx or other WEB server as a angent. At this time, you can let nginx to directly handle the static resource request. Thus, you could close the static resource resconfigolution access to improve performance.

Set the option `resource_on` in the configuration file `src/common/config/env/prodution.js` to close it. eg.

```js
export default {
  resource_on: false
}
```
