## View

View is template, the default root directory is `view/`.

### View files

The default rule of view file is `module/controller_operation.html`.

If the module that URL `home/article/detail` parsed is `home`, the controller is `article`, the operation is `detail`, then the corresponding view file is `home/article_detail.html`.

### View configuration

View default configuration is as follows, you can modify it in the configuration file `src/common/config/view.js` :

```js
export default {
  type: 'ejs', //模版引擎
  content_type: 'text/html', //输出模版时发送的 Content-Type
  file_ext: '.html', //文件的扩展名
  file_depr: '_', //控制器和操作之间的连接符
  root_path: think.ROOT_PATH + '/view', //视图文件的根目录
  prerender: undefined, //模板渲染前自定义处理逻辑
  adapter: { //模版引擎需要的配置项
    ejs: {}, //使用 ejs 模板引擎时额外配置
    nunjucks: {} //使用 nunjucks 模板引擎时额外配置
  } 
};
```

`Note`: Since `2.0.6` version, it removes `options` configuration item, and uses `adapter` to replace.

The default root directory of view is `view/`. If you want each module to own a separate view directory, configuration `root_path` need to be modified to be empty.

#### Modify connector 

The connector between the default controller and operation is `_`, the file name is similar to `index_index.html`, if you want the controller to be as a layer directory, such as: `index/index.html`, you can modify the connector to be  `/`.

```js
export default {
  file_depr: '/'
}
```

#### Modify the template engine configuration 

If you want to modify some configuration of the template engine, you can modify the corresponding field of configuration. Such as:

```js
export default {
  options: {
    delimiter: '&' //将定界符修改为 <& 和 &>
  }
}
```

### Template engine 

The default template engines which ThinkJS support are `ejs`, `jade`, `swig` and `nunjucks`, the default template engine is `ejs`, you can modify it to be other template engines based on need.

#### ejs 

##### Delimiter

The default delimiters of ejs are `<%` and `%>`. If you want to change them, you can modify the `options` field of the configure , such as:

```js
export default {
  options: {
    delimiter: '&' //将定界符修改为 <& 和 &>
  }
}
```

##### Variable output 

* Escape output `<%= data.name%>`
* Not escape output `<%- data.name%>`
* Note `<%# data.name%>`

##### conditional

```text
<%if(data.name === '1'){%>
    <p>...</p>
<%}else if(data.name === '2'){%>
    <p>...</p>
<%}else{%>
    <p>...</p>
<%}%>
```

##### loop

```text
<%list.forEach(function(item)){%>
    <li><%=item.name%></li>
<%}%>
```

##### filter

The new version of `ejs` no longer support the filter function, and if you need some filter function, you can define some global function in `src/common/bootstrap/`, you can use these functions directly in the template.

##### Reference file

ejs does not support template inheritance. But it can make a public template be independent into an file and then be introduced by `include`.

```text
<%include inc/header.html%>
```

`Note`: Variable that used by ejs template needs to be assigned in the controller, otherwise it will produce an error. 

More ejs document please see [here](https://www.npmjs.com/package/ejs). 

#### nunjucks

Nunjucks is a template engine, similar to the jinja2, whose function is unusually powerful, it suggests you using the template engine in complex projects .

##### delimiter

Block-level delimiters are `{%` and `%}`, variable delimiters are `{{` and `}}`, comment delimiters are `<#` and `#>`. Such as:

```html
{{ username }}  

{% block header %} 
This is the default content
{% endblock %}
```

##### Variable output

You can use `{{username}}` to output variables, the default output variables will automatically be escaped, if don't want to be escaped, you can use `{{username | safe}}` to deal with.

##### Template inheritance

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

The child templates:

```html
{% extends "parent.html" %}

{% block left %}
This is the left side!
{% endblock %}

{% block right %}
This is the right side!
{% endblock %}
```

##### conditional

```html
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

##### loop

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

The specific use document please see [here](http://mozilla.github.io/nunjucks/).

#### jade

jade template using way please see [here](https://github.com/jadejs/jade). 

#### swig

swig template using way please see [here](http://paularmstrong.github.io/swig/). 

#### Add filters, and other functions

`Swig`, `nunjucks` and many other template engines support adding filters, and other functions, it can be completed by finding the corresponding adapter in the template configuration file `src/common/config/view.js` and adding `prerender `configuration. Such as:

```js
export default {
  prerender: function(nunjucks, env){
    //添加一个过滤器，这样可以在模板里使用了
    env.addFilter('filter_foo', function(){
      
    })
  }
}
```

`Note`: this function is new in version `2.0.5`.

#### Extend the template engine

Template engine is implemented by Adapter. If the project needs to use other template engines, it can be extended through Adapter, please see [here](./adapter_template.html).

### Variable assignment

The controller can do variable assignment by the `assign` method.

##### Assignment of single variable

```js
export default class extends think.controlle.base {
  indexAction(){
    this.assign('title', 'ThinkJS 官网');
  }
}
```

##### Assignment of multiple variables

```js
export default class extends think.controlle.base {
  indexAction(){
    this.assign({
      title: 'ThinkJS 官网',
      author: 'thinkjs'
    });
  }
}
```

##### Get the assignment

You can get assigned values by `assign` after variable assignment. Such as:

```js
export default class extends think.controlle.base {
  indexAction(){
    this.assign('title', 'ThinkJS 官网');
    let title = this.assign('title');
  }
}
```

### Template render

You can render the template by the `display` method. If you don't pass a specific template file path, it will automatically search. Such as:

```js
export default class extends think.controller.base {
  indexAction(){
    this.display();// render home/index_index.html
  }
}
```

You could also specify a specific template files for rendering, about the `display` method using in detail please see [here](./api_controller.html#toc-6b2).

### Get content rendered

If sometimes don't want to support the output template, but get content rendered, so it could be obtained by the `fetch` method.

##### The way of ES6

```js
export default class extends think.controller.base {
  * indexAction(){
    let content = yield this.fetch();
    ...
  }
}
```

##### The way of dynamic creation

```js
module.exports = think.controller({
  indexAction: function(){
    this.fetch().then(function(content){
      ...
    })
  }
})
```

More details about the `fetch` method using way please see [here](api_controller.html#controllerfetchtemplatefile).

### Internationalization

After starting the internationalization, the view path will has an extra layer of internationalization of directory. Such as: specific view path becomes into the `view/zh-CN/home/index_index.html`, and `zh-CN` is language.

About how to use internationalization, please see [extensions - > internationalization](./i18n.html).

### Multiple themes

After setting the multiple theme, view path will be much more than a layer theme directory. Such as: specific view path becomes into the `view/default/home/index_index.html`, the `default` is the theme name. 

You can set the current theme by `http.theme` method, setting the theme is usually done by middleware.

More information on middleware please see [extensions - middleware](./middleware.html).

### The default template variables

In order to get some common variables easily in the template, framework automatically registered `http`, `controller`, `config` and other variables in the template, and these variables can be used directly in the template.

The following code example is based on `ejs` template engine, you need to modify it according to the corresponding syntax under the other template engines.

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

Add property `navType` to the current controller in the Action, then the template can be used directly by the `controller.navType`.

```text
<%if(controller.navType === 'home')%>
  <li className="action">home</li>
<%}else{%>
  <li>home</li>
<%}%>
```

#### config

It can be directly corresponding configuration in the template through the `config` object, such as:

```text
<%if(config.name === 'text'){%>

<%}%>
```


#### The internationalization way _

In the template, you can obtain the value of the corresponding localization by `_` directly, these values are defined in the `src/common/config/locales/[lang].js`.

```text
<%= _('title')%>
```
More information on internationalization please see [here](./i18n.html).
