## 视图

视图即模版，默认的根目录为 `view/`。

### 视图文件

视图文件默认的规则为 `模块/控制器_操作.html`。

假如 url `home/article/detail` 解析后的模块是 `home`，控制器是 `article`，操作是 `detail`，那么对应的视图文件为 `home/article_detail.html`。

### 视图配置

视图默认配置为：

```js
export default {
  content_type: 'text/html', //输出模版时发送的 Content-Type
  file_ext: '.html', //文件的扩展名
  file_depr: '_', //控制器和操作之间的连接符
  root_path: think.ROOT_PATH + '/view', //视图文件的根目录
  type: 'ejs', //模版引擎
  options: {} //模版引擎需要的配置项
};
```

`注：` 视图默认根目录在 `view/`。如果想每个模块有独立的视图目录，将配置 `root_path` 修改为空即可。



### 模版引擎

ThinkJS 默认支持的模版引擎有：`ejs`，`jade`，`swig` 和 `nunjucks`，默认模版引擎为 `ejs`，可以根据需要修改为其他的模版引擎。

#### ejs 

** 定界符 **

ejs 默认的定界符是 `<%` 和 `%>`。如果想修改定界符，可以通过配置里的 `options` 来修改，如：

```js
export default {
  options: {
    delimiter: '&' //将定界符修改为 <& 和 &>
  }
}
```

** 变量输出 **

* 转义输出 `<%= data.name%>`
* 不转义输出 `<%- data.name%>`
* 注释 `<%# data.name%>`

** 条件判断 **

```text
<%if(data.name === '1'){%>
    <p>...</p>
<%}else if(data.name === '2'){%>
    <p>...</p>
<%}else{%>
    <p>...</p>
<%}%>
```

** 循环 **

```text
<%list.forEach(function(item)){%>
    <li><%=item.name%></li>
<%}%>
```

** 引用文件 **

ejs 不支持模版继承。但可以将公用的模版独立成一个文件，然后通过 `include` 来引入。

```text
<%include inc/header.html%>
```

`注：` ejs 模版使用的变量需要在控制器中赋值，否则会报错。

更多 ejs 使用文档请见 [这里](https://www.npmjs.com/package/ejs)。

#### nunjucks

nunjucks 是一款类似于 jinja2 的模版引擎，功能异常强大，复杂项目建议使用该模版引擎。

** 定界符 **

块级定界符为 `{%` 和 `%}`，变量定界符为 `{{` 和 `}}`，注释定界符为 `<#` 和 `#>`。如：

```html
{{ username }}  

{% block header %} 
This is the default content
{% endblock %}
```

** 变量输出 **

可以通过 `{{ username }}` 来输出变量，默认输出的变量会自动转义，如果不想被转义，可以通过 `{{ username | safe }}` 来处理。

** 模版继承 **

父级模版：

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

子级模版：

```html
{% extends "parent.html" %}

{% block left %}
This is the left side!
{% endblock %}

{% block right %}
This is the right side!
{% endblock %}
```

** 条件判断 **

```html
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

** 循环 **

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

具体使用文档请见 [这里](http://jinja.pocoo.org/docs/dev/)。

#### jade

jade 模版使用方式请见 [这里](https://github.com/jadejs/jade)。

#### swig

swig 模版使用方式请见 [这里](http://paularmstrong.github.io/swig/)。


#### 扩展模版引擎

模版引擎使用 Adapter 实现。如果项目里需要使用其他模版引擎，可以通过 Adapter 进行扩展，具体请见 [这里](./adapter_template.html)。

### 变量赋值

控制器中可以通过 `assign` 方法进行变量赋值。

** 赋值单个变量 **

```js
export default class extends think.controlle.base {
  indexAction(){
    this.assign('title', 'ThinkJS 官网');
  }
}
```

** 赋值多个变量 **

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

** 获取赋值 **

变量赋值后也可以通过 `assign` 来获取赋过的值。如：

```js
export default class extends think.controlle.base {
  indexAction(){
    this.assign('title', 'ThinkJS 官网');
    let title = this.assign('title');
  }
}
```

### 模版渲染

可以通过 `display` 方法进行模版渲染。如果不传具体的模版文件路径，会自动查找。如：

```js
export default class extends think.controller.base {
  indexAction(){
    this.display();// render home/index_index.html
  }
}
```

也可以指定具体的模版文件进行渲染，关于 `display` 方法的详细使用请见 [这里](./api_controller.html#controllerdisplaytemplatefile)。

### 获取渲染后的内容

如果有时候不想支持输出模版，而是想获取渲染后的模版内容，那么可以通过 `fetch` 方法来获取。

** ES6 方式 **

```js
export default class extends think.controller.base {
  * indexAction(){
    let content = yield this.fetch();
    ...
  }
}
```

** 动态创建类的方式 **

```js
module.exports = think.controller({
  indexAction: function(){
    this.fetch().then(function(content){
      ...
    })
  }
})
```

关于 `fetch` 方法的详细使用方式请见 [这里](api_controller.html#controllerfetchtemplatefile)。

### 国际化

启动国际化后，视图路径会多一层国际化的目录。如：具体的视图路径变为 `view/zh-CN/home/index_index.html`，其中 `zh-CN` 为语言名。

关于如果使用国际化请见 [扩展功能 -> 国际化](./i18n.html)。 

### 多主题

设置多主题后，视图路径会多一层多主题的目录。如：具体的视图路径变为 `view/default/home/index_index.html`，其中 `default` 为主题名称。

可以通过 `http.theme` 方法来设置当前的主题，设置主题一般是通过 middleware 来实现。

关于 middleware 更多信息请见 [扩展功能 - Middleware](./middleware.html)。

### 默认模版变量

为了可以在模版里很方便的获取一些通用的变量，框架自动向模版里注册了 `http`, `controller`, `config` 等变量，这些变量可以在模版里直接使用。

下面的代码示例都是基于 `ejs` 模版引擎的，其他的模版引擎下需要根据相应的语法进行修改。

#### http

模版里可以直接使用 `http` 对象下的属性和方法。

#### controller

模版里可以直接使用 `controller` 对象下的属性和方法。

```js
export default class extends think.controller.base {
  indexAction(){
    this.navType = 'home';
  }
}
```

Action 里给当前控制器添加了属性 `navType`，那么模版里就可以直接通过 `controller.navType` 来使用。

```text
<%if(controller.navType === 'home')%>
  <li className="action">home</li>
<%}else{%>
  <li>home</li>
<%}%>
```

#### config

通过 `config` 对象可以在模版中直接对应的配置，如：

```text
<%if(config.name === 'text'){%>

<%}%>
```


#### 国际化方法 _

在模版中可以直接通过 `_` 方法获取对应本地化的值，这些值在 `src/common/config/locales/[lang].js` 中定义。

```text
<%= _('title')%>
```

更多国际化相关的信息请见 [这里](./i18n.html)。