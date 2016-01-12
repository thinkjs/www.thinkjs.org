## Template

Template Adapter 用来实现支持多种类型的模版引擎，如：`ejs`，`swig` 等。

### 支持模版引擎类型

* `base`
* `ejs` ejs 模版引擎
* `jade` jade 模板引擎
* `swig` 一种支持模版继承的模版引擎
* `nunjucks` 一种类似 jinja2 的模版引擎，功能非常强大

### 模版引擎配置

模版引擎配置如下，可以在 `src/common/config/view.js` 中修改：

```js
export default {
  type: 'ejs',
  options: { //具体模版引擎额外的配置

  }
};
```

### 使用模版引擎

模版引擎会在视图里自动调用，默认情况不需要手工调用使用。如果在有些场景非要使用的话，可以通过下面的方式加载对应的模版引擎：

```js
let EjsTemplate = think.adapter('template', 'ejs');
let instance = new EjsTemplate(...args);
```

### 扩展模版引擎类型

可以通过下面的命令创建一个名为 `foo` Template 类：

```js
thinkjs adapter template/foo
```

执行完成后，会创建文件 `src/common/adapter/template/foo.js`。扩展缓存类需要实现如下的方法：

```js
export default class extends think.adapter.base {
  /**
   * get compiled content
   * @params {String} templateFile 模版文件目录
   * @params {Object} tVar 模版变量
   * @params {Object} config 模版引擎配置
   * @return {Promise} []
   */
  run(templateFile, tVar, config){
    
  }
}
```

框架里的 Template 实现请见 <https://github.com/75team/thinkjs/tree/master/src/adapter/template>。

### 使用第三方模版 Adapter

如何使用第三方的模版 Adapter 请参见 [Adapter -> 介绍](./adapter_intro.html#toc-e7c)。
