## think.http.base

`think.http.base` 继承自 [think.base](./api_think_base.html) 类，该类为含有 http 对象处理时的基类。middleware, controller, view 类都继承自该类。

##### 使用 ES6 语法继承该类

```js
export default class extends think.http.base {
  /**
   * 初始化方法，实例化时自动被调用，不要写 constructor
   * @return {} 
   */
  init(){

  }
}
```

##### 使用普通的方式继承该类

```js
module.exports = think.Class(think.http.base, {
  init: function(){

  }
});
```

### 属性

#### http

封装的 http 对象，包含的属性和方法请见 [API -> http](./api_http.html)。

### 方法

#### config(name, value)

* `name` {String} 配置名称
* `value` {Mixed} 配置值

读取或者设置配置，value 为 `undefined` 时为读取配置，否则为设置配置。

该方法不仅可以读取系统预设值的配置，也可以读取项目里定义的配置。

`注`：不可将当前请求的用户信息作为配置来设置，会被其他用户给冲掉。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取配置值
    let value = this.config('name');
  }
}
```

#### action(controller, action)

* `controller` {Object | String} controller实例
* `action` {String} action名称
* `return` {Promise} 

调用 controller 下的 action，返回一个 Promise。自动调用 `__before` 和 `__after` 魔术方法。

如果 controller 是字符串，则自动去寻找对应的 controller。

```js
//调用当前模块下controller里的action
export default class extends think.controller.base {
  async indexAction(){
    //调用user controller下的detail方法
    let value = await this.action('user', 'detail');
  }
}
```

```js
//跨模块调用controller里的action
export default class extends think.controller.base {
  async indexAction(){
    //调用admin模块user controller下的detail方法
    let value = await this.action('admin/user', 'detail');
  }
}
```

#### cache(name, value, options)

* `name` {String} 缓存名称
* `value` {Mixed | Function} 缓存值
* `options` {Object} 缓存配置，具体见缓存配置

读取或者设置缓存，`value` 为 `undefined` 时是读取缓存，否则为设置缓存。默认缓存类型为 `file`。

```js
export default class extends think.controller.base {
  async indexAction(){
    //获取缓存
    let value = await this.cache('name');
  }
}
```

当参数 `value` 为 function 时，表示获取缓存，如果缓存值不存在，则调用该 function，将返回值设置缓存并返回。这样避免在项目开发时要先判断缓存是否存在，然后再从相关地方读取值然后设置缓存的麻烦。

```js
export default class extends think.controller.base {
  async indexAction(){
    //获取缓存，缓存不存在时自动调用 function，并设置缓存
    let value = await this.cache('name', () => {
      return this.model('user').select();
    });
  }
}
```

设置缓存并修改缓存类型：

```js
export default class extends think.controller.base {
  async indexAction(){
    //设置缓存，缓存类型使用redis
    await this.cache('name', 'value', {
      type: 'redis'
    });
  }
}
```


#### hook(event, data)

* `event` {String} 事件名称
* `data` {Mixed} 参数
* `return` {Promise}

执行对应的事件，一个事件包含若干个 middleware，会按顺序执行这些 middleware。

事件可以在配置 `src/common/config/hook.js` 里定义，也可以通过 think.hook 来注册。

```js
export default class extends think.controller.base {
  async indexAction(){
    let result = await this.hook('parse_data');
  }
}
```

#### model(name, options)

* `name` {String} 模型名称
* `options` {Object} 配置，具体见数据库配置
* `return` {Object} model实例

获取模型实例，默认获取当前模块下对应模型的实例，也可以跨模块获取模型的实例。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取当前模块下的 user model 的实例
    let model = this.model('user');
    //获取admin模块下 article model 的实例
    let model1 = this.model('admin/article');
    //获取当前模块下的 test model 的实例，并且是 sqlite 的数据库
    let model2 = this.model('test', {
      type: 'sqlite' //设置数据库类型为sqlite，更多参数见数据库配置
    })
  }
}

```

#### controller(name)

* `name` {String} controller名称
* `return` {Object} controller实例

获取 Controller 的实例，如果 Controller 找不到，则报错。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取当前模块下 user controller 的实例
    let controller = this.controller('user');
    //获取admin模块下 user controller 的实例
    let controller1 = this.controller('admin/user');
  }
}
```


#### service(name)

* `name` {String} service 名称
* `return` {Class} 

获取对应的 service。service 返回的可能是 class ，也可能直接是个对象，所以不会直接实例化。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取对应的service
    let service = this.service('user');
    //获取service的实例
    let instance = new service(...args);
    //获取admin模块下的user service
    let service1 = this.service('admin/user');
  }
}
```

