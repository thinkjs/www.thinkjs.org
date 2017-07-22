## View / 视图

由于某些项目下并不需要 View 的功能，所以 3.0 里并没有直接内置 View 的功能，而是通过 Extend 和 Adapter 来实现的。

### Extend 来支持 View

配置 `src/config/extend.js`，添加如下的配置，如果已经存在则不需要再添加：

```js
const view = require('think-view');
module.exports = [
  view
]
```

通过添加 [view](https://github.com/thinkjs/think-view) 的扩展，让项目有渲染模板文件的能力。

### 配置 View Adapter

在 `src/config/adapter.js` 中添加如下的配置，如果已经存在则不需要再添加：

```js
const nunjucks = require('think-view-nunjucks');
const path = require('path');

// 视图的 adapter 名称为 view
exports.view = {
  type: 'nunjucks', // 这里指定默认的模板引擎是 nunjucks
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'), //模板文件的根目录
    sep: '_', //Controller 与 Action 之间的连接符
    extname: '.html' //模板文件扩展名
  },
  nunjucks: {
    handle: nunjucks,
    beforeRender: () => {}, // 模板渲染预处理
    options: { // 模板引擎额外的配置参数

    }
  }
}
```

这里用的模板引擎是 `nunjucks`，项目中可以根据需要修改。

### 具体使用

配置了 Extend 和 Adapter 后，就可以在 Controller 里使用了。如：

```js
module.exports = class extends think.Controller {
  indexAction(){
    this.assign('title', 'thinkjs'); //给模板赋值
    return this.display(); //渲染模板
  }
}
```

#### assign

给模板赋值。

```js
//单条赋值
this.assign('title', 'thinkjs'); 

//多条赋值
this.assign({
  title: 'thinkjs', 
  name: 'test'
}); 

//获取之前赋过的值，如果不存在则为 undefined
const title = this.assign('title'); 

//获取所有赋的值
const assignData = this.assign(); 
```

#### render

获取渲染后的内容，该方法为异步方法，需要通过 async/await 处理。

```js
//根据当前请求解析的 controller 和 action 自动匹配模板文件
const content1 = await this.render(); 

//指定文件名
const content2 = await this.render('doc'); 
const content3 = await this.render('doc/detail'); 
const content4 = await this.render('doc_detail');

//不指定文件名但切换模板类型
const content5 = await this.render(undefined, 'ejs');

//指定文件名且切换模板类型
const content6 = await this.render('doc', 'ejs'); 

//切换模板类型，并配置额外的参数
//切换模板类型时，需要在 adapter 配置里配置对应的类型
const content7 = await this.render('doc', {
  type: 'ejs', 
  xxx: 'yyy'
});
```

#### display

渲染并输出内容，该方法实际上是调用了 `render` 方法，然后将渲染后的内容赋值到 `ctx.body` 属性上。该方法为异步方法，需要通过 async/await 处理。

```js
//根据当前请求解析的 controller 和 action 自动匹配模板文件
await this.display(); 

//指定文件名
await this.display('doc'); 
await this.display('doc/detail'); 
await this.display('doc_detail');

//不指定文件名切换模板类型
await this.display(undefined, 'ejs');

//指定文件名且切换模板类型
await this.display('doc', 'ejs'); 

//切换模板类型，并配置额外的参数
await this.display('doc', {
  type: 'ejs', 
  xxx: 'yyy'
});
```


### 模板预处理

有时候需要对模板进行预处理，比较常见的操作是给 `nunjucks` 引擎增加 `Filter`。这时候你就可以使用 `beforeRender` 方法。

```js
const nunjucks = require('think-view-nunjucks');
const path = require('path');

exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'), //模板文件的根目录
    sep: '_', //Controller 与 Action 之间的连接符
    extname: '.html' //文件扩展名
  },
  nunjucks: {
    handle: nunjucks,
    beforeRender(env, nunjucks, config) {
      env.addFilter('utc', time => (new Date(time)).toUTCString());
    }
  }
}
```

其中不同模板引擎 `beforeRender()` 方法传入的参数可能不同，可在 https://github.com/thinkjs/think-awesome#view 项目中找到对应的模板引擎查看。

### 修改模板引擎默认参数

有时候想修改模板引擎的一些参数，如：修改左右定界符，这时候可以通过 `options` 完成：

```js
const nunjucks = require('think-view-nunjucks');
const path = require('path');

exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'), //模板文件的根目录
    sep: '_', //Controller 与 Action 之间的连接符
    extname: '.html' //文件扩展名
  },
  nunjucks: {
    handle: nunjucks,
    options: {
      tags: { // 修改定界符相关的参数
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '<#',
        commentEnd: '#>'
      }
    }
  }
}
```

### 默认注入的参数

除了手工通过 `assign` 方法注册一些变量到模板外，系统在渲染模板的时候，自动注入 `controller`、`config`、`ctx` 变量，以便于在模板里直接使用。

#### controller

当前控制器实例，在模板里可以直接调用控制器上的属性和方法。

```
{{ if controller.type === 'xx' }}
  <p>当前 type 为 xx</p>
{{ endif }}
```

这里以 `nunjucks` 模板引擎举例，如果是调用控制器里的方法，那么方法必须为一个同步方法。

#### config

所有的配置，在模板里可以直接通过 `config.xxx` 来获取配置，如果属性不存在，那么值为 `undefined`。


#### ctx

当前请求的 Context 对象，在模板里可以通过直接通过 `ctx.xxx` 调用其属性或者 `ctx.yyy()` 调用其方法。

如果是调用其方法，那么方法必须为一个同步方法。

### 支持的模板引擎

目前官方支持的模板引擎有: [pug](https://github.com/thinkjs/think-view-pug)、[nunjucks](https://github.com/thinkjs/think-view-nunjucks)、[handlebars](https://github.com/thinkjs/think-view-handlebars)、[ejs](https://github.com/thinkjs/think-view-ejs)。

如果你实现了新的模板引擎支持，欢迎提交到 <https://github.com/thinkjs/think-awesome#view>。
