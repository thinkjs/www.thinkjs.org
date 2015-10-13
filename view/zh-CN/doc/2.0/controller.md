## 控制器

控制器是一类操作的集合，用来响应用户同一类的请求。

### 定义控制器

创建文件 `src/home/controller/article.js`，表示 `home` 模块下有名为 `article` 控制器，文件内容类似如下：

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }
}
```

如果不想使用 ES6 语法，那么文件内容类似如下：

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction: function(self){
    //auto render template file index_index.html
    return self.display();
  }
});
```

注：上面的 `Base` 表示定义一个基类，其他的类都继承该基类，这样就可以在基类里做一些通用的处理。

### 使用 Generator Function

控制器里可以很方便的使用 Generator Function 来处理异步嵌套的问题。

** ES6 方式 **

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  * indexAction(){
    let model = this.model('user');
    let data = yield model.select();
    return this.success(data);
  }
}
```

** 动态创建类的方式 **

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction: function *(){
    var model = this.model('user');
    var data = yield model.select();
    return this.success(data);
  }
});
```

### 使用 async 和 await

借助 Babel 编译，还是在控制器里使用 async 和 await。

** ES6 方式 **

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    let model = this.model('user');
    let data = await model.select();
    return this.success(data);
  }
}
```

** 动态创建类的方式 **

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction: async function(){
    var model = this.model('user');
    var data = await model.select();
    return this.success(data);
  }
});
```

### init 方法

ES6 里的 class 有 contructor 方法，但动态创建的类就没有改方法了，为了统一初始化执行的方法，将该方法统一定义为 `init`。

该方法在类实例化的时候自动调用，无需手工调用。

** ES6 方式**
　
```js
'use strict';

import Base from './base.js';

export default class extends Base {
  init(http){
    super.init(http); //调用父类的init方法  
    ...
  }
}
```

** 动态创建类方式 **

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  init: function(http){
    this.super('init', http); //调用父类的init方法
    ...
  }
});
```

`init` 方法里需要调用父类的 init 方法，并将参数 `http` 传递进去。


### 前置操作 __before

ThinkJS 支持前置操作，方法名为 `__before`，该方法会在具体的 Action 调用之前自动调用。如果前置操作里阻止了后续代码继续执行，则不会调用具体的 Action，这样可以提前结束请求。

** ES6 方式**
　
```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * 前置方法
   * @return {Promise} []
   */
  __before(){
    ...
  }
}
```

### 后置操作 __after

ThinkJS 支持后置操作，方法名为 `__after`，该方法会在具体的 Action 调用之后执行。如果具体的 Action 里阻止了后续的代码继续执行，则后置操作不会调用。

### 空操作 __call

当解析后的 url 对应的控制器存在，但 Action 不存在时，会试图调用控制器下的魔术方法 `__call`。这里可以对不存在的方法进行统一处理。

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * @return {Promise} []
   */
  __call(){
    ...
  }
}
```

### 错误处理

当 url 不存在或者当前用户没权限等一些异常请求时，这时候会调用错误处理。 ThinkJS 内置了一套详细的错误处理机制，具体请见 [这里](./error_handle.html)。

### 数据校验和权限判断

当在 Action 里处理用户的请求时，经常要先获取用户提交过来的数据，然后对其校验，如果校验没问题后才能进行后续的操作。当参数校验完成后，有时候还要进行权限判断，等这些都判断无误后才能进行真正的逻辑处理。

如果将这些代码都放在一个 Action 里，势必让 Action 的代码非常复杂且冗长。为了解决这个问题， ThinkJS 在控制器前面增加了一层 `Logic`，Logic 里的 Action 和控制器里的 Action 一一对应，在调用控制器里的 Action 之前会自动调用 Logic 里的 Action。

如果 Logic 里没有对应的 Action，则不调用，详细信息请见 [这里](./validation.html)。


### 变量赋值和模版渲染

控制器里可以通过 `assign` 和 `display` 方法进行变量赋值和模版渲染，具体信息请见 [这里](./view.html)。

### http 对象

控制器在实例化时，会将 `http` 传递进去。该 `http` 对象是 ThinkJS 对 `req` 和 `res` 重新包装的一个对象，而非 Node.js 内置的 http 对象。

Action 里如果想获取该对象，可以通过 `this.http` 来获取。

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  indexAction(){
    let http = this.http;
  }
}
```

关于 `http` 对象包含的属性和方法请见 [这里](./api_http.html)。

### Rest Api

有时候，项目里需要提供一些 Rest 接口给第三方使用，这些接口无外乎就是增删改查等操作。

如果手工去书写这些操作则比较麻烦，ThinkJS 提供了 Rest Controller，该控制器会自动含有通用的增删改查等操作。如果这些操作不满足需求，也可以进行定制。具体请见 [这里](./rest_api.html)。

### 常用方法

* `get(key)` 获取 get 参数值
* `post(key)` 获取 post 参数值
* `file(key)` 获取 file 参数值
* `isGet()` 当前是否是 get 请求
* `isPost()` 当前是否是 post 请求
* `isAjax()` 是否是 ajax 请求
* `ip()` 获取请求用户的 ip
* `redirect(url)` 跳转到一个 url，返回一个 pedding promise 阻止后面的逻辑继续执行
* `echo(data)` 输出数据，会自动调用 JSON.stringify
* `end(data)` 结束当前的 http 请求
* `json(data)` 输出 json 数据，自动发送 json 相关的 Content-Type
* `jsonp(data)` 输出 jsonp 数据，请求参数名默认为 `callback`
* `success(data)` 输出一个正常的 json 数据，数据格式为 `{errno: 0, errmsg: "", data: data}`，返回一个 pedding promise 阻止后续继续执行
* `fail(errno, errmsg, data)` 输出一个错误的 json 数据，数据格式为 `{errno: errno_value, errmsg: string, data: data}`，返回一个 pedding promise 阻止后续继续执行
* `download(file)` 下载文件
* `assign(name, value)` 设置模版变量
* `display()` 输出一个模版，返回一个 promise
* `fetch()` 渲染模版并获取内容，返回一个 prmose，内容需要在 promise then 里获取
* `cookie(name, value)` 获取或者设置 cookie
* `session(name, value)` 获取或者设置 session
* `header(name, value)` 获取或者设置 header
* `action(name, data)` 调用其他 Controller 的方法，可以跨分组
* `model(name, options)` 获取模型实例

详细说明请见 [这里](./api_controller.html)。


