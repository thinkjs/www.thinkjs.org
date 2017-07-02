## View

由于某些项目下并不需要 View 的功能，所以 3.0 里并没有直接内置 View 的功能，而是通过 Extend 和 Adapter 来实现的。

### Extend 来支持 View

配置 `src/config/extend.js`，添加如下的配置，如果已经存在则不需要再添加：

```js
const view = require('think-view');
module.exports = [
  view
]
```

通过添加 view 的扩展，让框架有渲染模板文件的能力。

### 配置 View Adapter

在 `src/config/adapter.js` 中添加如下的配置，如果已经存在则不需要再添加：

```
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
    handle: nunjucks
  }
}
```

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

```
this.assign('title', 'thinkjs'); //单条赋值
this.assign({title: 'thinkjs', name: 'test'}); //单条赋值
this.assign('title'); //获取之前赋过的值，如果不存在则为 undefined
this.assign(); //获取所有赋的值
```

#### render

获取渲染后的内容。

```
const content1 = await this.render(); //根据当前请求解析的 controller 和 action 自动匹配模板文件
const content2 = await this.render('doc'); //指定文件名

const content3 = await this.render('doc', 'ejs'); //切换模板类型
const content4 = await this.render('doc', {type: 'ejs', xxx: 'yyy'});//切换模板类型，并配置额外的参数
```

#### display

渲染并输出内容。

```
return this.display(); //根据当前请求解析的 controller 和 action 自动匹配模板文件

return this.display('doc'); //指定文件名

return this.display('doc', 'ejs'); //切换模板类型
return this.display('doc', {type: 'ejs', xxx: 'yyy'});//切换模板类型，并配置额外的参数
```

### 支持的 Adapter

View 支持的 Adapter 见 <https://github.com/thinkjs/think-awesome#view>。