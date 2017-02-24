## View

View is template, its default root directory is `view/`.

### View Files

The default naming rule of view file is `module/controller_operation.html`.

For URL `home/article/detail`, after parsed, the module is `home`, the controller is `article`, the operation is `detail`, then the corresponding view file is `home/article_detail.html`.

### View Configuration

Default view configuration is as follows, you can modify it in the configuration file `src/common/config/view.js` :

```js
export default {
  type: 'ejs', // template engine
  content_type: 'text/html', // the Content-Type send with outputed template
  file_ext: '.html', // the extension name
  file_depr: '_', // the seperator between controller and action
  root_path: think.ROOT_PATH + '/view', // the root directory of view files
  prerender: undefined, // whether execution custom process logic before rendering template
  adapter: { // the configuration options needed by template engine
    ejs: {}, // the extra configuration options when using ejs as template engine
    nunjucks: {} // the extra configuration options when using nunjucks as template engine
  } 
};
```

`Note`: Since `2.0.6` version, `options` configuration item was removed, and `adapter` is the replacement.

The default root directory of view is `view/`. If you want each module to own a separate view directory, just reset `root_path` configuration to empty.

#### Modifing Seperator 

The seperator between the default controller and operation is `_`, so the file name is similar to `index_index.html`. If you want the controller to be as a layer directory, such as: `index/index.html`, you can modify the seperator to `/`.

```js
export default {
  file_depr: '/'
}
```

#### Modify The Template Engine

If you want to modify some configurations of the template engines, you can modify the corresponding field of configuration. Such as:

```js
export default {
  options: {    
    delimiter: '&' // modify  as  <& and &>
  }
}
```

### Template Engine 

ThinkJS support `ejs`, `jade`, `swig` and `nunjucks` as template engine, and the default template engine is `ejs`, you can modify the default template engine based on need.

#### ejs 

##### Delimiter

The default delimiters of ejs are `<%` and `%>`. If you want to change them, you can modify the `options` field of the configuration , such as:

```js
export default {
  options: {
    delimiter: '&' //将定界符修改为 <& 和 &>
  }
}
```

##### Variable Output 

* Escape output `<%= data.name%>`
* Not escape output `<%- data.name%>`
* Comment `<%# data.name%>`

##### Conditional

```text
<%if(data.name === '1'){%>
    <p>...</p>
<%}else if(data.name === '2'){%>
    <p>...</p>
<%}else{%>
    <p>...</p>
<%}%>
```

##### Loop

```text
<%list.forEach(function(item)){%>
    <li><%=item.name%></li>
<%}%>
```

##### Filter

The new version of `ejs` no longer support the filter function, and if you need some filter functions, you can define some global function in `src/common/bootstrap/`, then you can use these functions directly in the template.

##### Reference File

ejs does not support template inheritance. But it can make a public template as an independent file, and then introduce it using `include` directive, such as:

```text
<%include inc/header.html%>
```

`Note`: Variable that used by ejs template needs to be assigned in the controller, otherwise it will produce an error. 

More ejs document please see [here](https://www.npmjs.com/package/ejs). 

#### nunjucks

Nunjucks is a another template engine ThinkJS supported, it similar to the jinja2, whose functions is unusually powerful, if your project is complex, we suggest you use it.

##### Delimiter

Block-level delimiters are `{%` and `%}`, variable delimiters are `{{` and `}}`, comment delimiters are `<#` and `#>`. Such as:

```html
{{ username }}  

{% block header %} 
This is the default content
{% endblock %}
```

##### Variable Output

You can use `{{username}}` to output variables, the default output variables will automatically be escaped, if you don't want to escape variables, use `{{username | safe}}` instead.

##### Template Inheritance

The parent template:

```html
{% block header %}
This is the default content
{% endblock %}

<section class="left">
  {% block left %}{% endblock %}
</section>

<section class="right">
  {% block right %}
  This is more content
  {% endblock %}
</section>
```

The child template:

```html
{% extends "parent.html" %}

{% block left %}
This is the left side!
{% endblock %}

{% block right %}
This is the right side!
{% endblock %}
```

##### Conditional

```html
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

##### Loop

```html
<h1>Posts</h1>
<ul>
{% for item in items %}
  <li>{{ item.title }}</li>
{% else %}
  <li>This would display if the 'item' collection were empty</li>
{% endfor %}
</ul>
```

For complete documentation please see [here](http://mozilla.github.io/nunjucks/).

#### jade

The documentation of jade template can be found [here](https://github.com/jadejs/jade). 

#### swig

The documentation of swig template can be found [here](http://paularmstrong.github.io/swig/). 

#### Add Filters and Other Functions

`Swig`, `nunjucks` and many other template engines support adding filters, and other functions, it can be done by finding the corresponding adapter in the template configuration file `src/common/config/view.js` and adding `prerender` configuration. Such as:

```js
export default {
  prerender: function(nunjucks, env){
    // add a filter, then you can use it in the template
    env.addFilter('filter_foo', function(){
      
    })
  }
}
```

`Note`: This function is introduced since ThinkJS `2.0.5`.

#### Extend The Template Engine

Template engine is implemented by Adapter. If your project needs to use other template engines, it can be extended through Adapter, more details please see [here](./adapter_template.html).

### Variable Assignment

You can assigning value to template variable by using `assign` method in the controller.

##### Assignment of Single Variable

```js
export default class extends think.controller.base {
  indexAction(){
    this.assign('title', 'ThinkJS WebSite');
  }
}
```

##### Assignment of Multiple Variables

```js
export default class extends think.controller.base {
  indexAction(){
    this.assign({
      title: 'ThinkJS WebSite',
      author: 'thinkjs'
    });
  }
}
```

##### Get The Values

You can get assigned values by `assign` after variable assignment. Such as:

```js
export default class extends think.controller.base {
  indexAction(){
    this.assign('title', 'ThinkJS 官网');
    let title = this.assign('title');
  }
}
```

### Template Rendering

You can render the template by call the `display` method. If no specific template file path was passed, ThinkJS will search on for you automatically. Such as:

```js
export default class extends think.controller.base {
  indexAction(){
    this.display(); // render home/index_index.html
  }
}
```

You could also specify a specific template file for rendering, more about the `display` method's using please see [here](./api_controller.html#toc-6b2).

### Get Rendered Content

If you don't want to outputing template, and only want to get the rendered content, you can use the `fetch` method.

##### The ES6 Way

```js
export default class extends think.controller.base {
  async indexAction(){
    let content = await this.fetch();
    ...
  }
}
```

##### Dynamically Creation

```js
module.exports = think.controller({
  indexAction: function(){
    this.fetch().then(function(content){
      ...
    })
  }
})
```

More details about the `fetch` method please see [here](api_controller.html#controllerfetchtemplatefile).

### Internationalization

After starting the internationalization, the view path will has an extra layer of internationalization of directory. Such as specific view path becomes into the `view/zh-cn/home/index_index.html`, and `zh-cn` means language.

More about how to implementing internationalization, please see [extensions - > internationalization](./i18n.html).

### Multiple Themes

After setting the multiple theme, view path will be much more than a layer theme directory. Such as specific view path will becomes into the `view/default/home/index_index.html`, the `default` is the theme name. 

You can set the current theme by `http.theme` method, setting theme is usually done by middleware.

More information on middleware please see [extensions - middleware](./middleware.html).

### Default Template Variables

In order to get some common variables easily in the template, ThinkJS will automatically register `http`, `controller`, `config` and other variables in the template, and these variables can be read directly in the template.

The following code examples are based on `ejs`, if you are using other template engine, you need to modify it to use the correct syntax.

#### http

In the template, the properties and methods under `http` object can be used directly.

#### controller

In the template, the properties and methods under `controller` object can be used directly.

```js
export default class extends think.controller.base {
  indexAction(){
    this.navType = 'home';
  }
}
```

Add property `navType` to the current controller in the Action, then you can use `controller.navType` in template directly.

```text
<%if(controller.navType === 'home')%>
  <li className="action">home</li>
<%}else{%>
  <li>home</li>
<%}%>
```

#### config

You can get the configuration in the template through the `config` object, such as:

```text
<%if(config.name === 'text'){%>

<%}%>
```

#### Get Localization Using `_`

In templates, you can obtain the value of the corresponding localization by `_`, these values are defined in the `src/common/config/locales/[lang].js`.

```text
<%= _('title')%>
```
More information on internationalization please see [here](./i18n.html).
