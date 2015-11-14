## Adapter

Adapters are sorts of implementations which implements a same kind of function. In ThinkJS , the framework provides these adapters by default. Such as Cache, Session, WebSocket, Db, Store, Template, Socket and so on.

### Create An Adapter 

You can create an adapter with console conmmand like this:

```sh
thinkjs adapter template/dot
```

It creates a Template Adapter named `dot` in `src/common/adapter/template/dot.js`. The code probably likes the following:

```js
export default class extends think.adapter.template {
  /**
   * init
   * @return {[]}         []
   */
  init(...args){
    super.init(...args);
  }
}
```    

The framework creates a `Base` class if the type you created doesn't exist,  then other classes inherit from the `Base` class.

### Introduce an Adaper 

You can introduce an Adapter by using `think.adapter`. For example:

```js
let Template = think.adapter("template", "dot"); // introduce Template Adapter named dot
let instance = new Template(...args); // introduce an Adapter and instantiate it.
```  

### Use third part Adapter 

The framework searches Adapters from `src/common/adapter` and system path automatically, when it loads Adapters. You should regist third part Adapters if you need, otherwise the framework can't find them.

You can regist third part Adapters by using `think.adapter`， For example：

```js
let DotTemplate = require('think-template-dot');
think.adapter('template', 'dot', DotTemplate);
```

Then, the Adaptor files in `src/common/bootstrap/` can be loaded automatically when the service started.
