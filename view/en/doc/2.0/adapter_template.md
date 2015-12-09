## Template

Adapter Template used to support a variety of types of template engines, such as: `ejs`, `swig`, etc.

### Supported Template Egines

* `base`
* `ejs` ejs template engine
* `jade` jade template engine 
* `swig` a template engine suports template inheritance
* `nunjucks` a powerful template engine like jinja2 

### Template Engine Configuration

To configuate template engine, you can edit `src/common/config/view.js`. Content may like following: 

```js
export default {
  type: 'ejs',
  options: { // Additional configuration of the specific template engine

  }
};
```

### Use Template Egines

The template egine can be loaded automatically, no need to load it manually. You can load your template using following code, when you want to load it by yourself indeed:

```js
let EjsTemplate = think.adapter('template', 'ejs');
let instance = new EjsTemplate(...args);
```

### Extend template engine type

You can create an Template class named `foo` using the following command:

```js
thinkjs adapter template/foo
```

The command creates file `src/common/adapter/template/foo.js`.Then, you should implement the following methods:

```js
export default class extends think.adapter.base {
  /**
   * get compiled content
   * @params {String} templateFile the template files directory
   * @params {Object} tVar variables in template 
   * @params {Object} config the configuration of template engine
   * @return {Promise} []
   */
  run(templateFile, tVar, config){
    
  }
}
```

To know the implement of Template in ThinkJS, please see also <https://github.com/75team/thinkjs/tree/master/src/adapter/template>。

### Use Third Part Template Adapter

To know how to use third part template adaptor, please see also[Adapter -> intro](./adapter_intro.html#toc-e7c).
