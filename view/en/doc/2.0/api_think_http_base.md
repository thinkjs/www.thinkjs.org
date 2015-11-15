## think.http.base

`think.http.base` instance of [think.base](./api_think_base.html), this class contains http object handler base class.some class such like middleware class, controller class, view class all instance of this class.

##### Using ES6 to instnace of this class

```js
export default class extends think.http.base {
  /**
   * initial function, will automatically invoked while instacing, didn't need constructor.
   * @return {} 
   */
  init(){

  }
}
```

##### Using normal way to instance this class

```js
module.exports = think.Class(think.http.base, {
  init: function(){

  }
});
```

### Method

#### http

Packaged http object, contained methods and function to be seen in [API -> http](./api_http.html).

### Function

#### config(name, value)

* `name` {String} config file
* `value` {Mixed} config value

Read or setup config, it is read config when value assigned to `undefined`, otherwise it is setup config.

This function can not only read system default config, but also read project config.

`Notice`: Don't setup with request user's information, it will be covered by other user.

```js
export default class extends think.controller.base {
  indexAction(){
    // get config value
    let value = this.config('name');
  }
}
```

#### action(controller, action)

* `controller` {Object | String} controller instance
* `action` {String} action name
* `return` {Promise} 

Invoke action in controller, return a Promise, invoke `__before` and `__after` automcatically.

If controller is a string, it will automactically to find this controller.

```js
// invoke action of current module's controller
export default class extends think.controller.base {
  * indexAction(){
    // invoke defail function in user controller
        let value = yield this.action('user', 'detail');
  }
}
```

```js
// invoke action in cross module's controller
export default class extends think.controller.base {
  * indexAction(){
    // invoke detail function of user controller in admin module
    let value = yield this.action('admin/user', 'detail');
  }
}
```

#### cache(name, value, options)

* `name` {String} cache name
* `value` {Mixed | Function} cache value
* `options` {Object} cache options, more informtion in cache config.

Read or set cache, it is read cache when assign `value` to `undefined`, otherwise, it is setup cache. default type is `file`.

```js
export default class extends think.controller.base {
  * indexAction(){
    // get cache
    let value = yield this.cache('name');
  }
}
```

When `value` is function, it means read cache, if cache's value didn't exist, it will invoke this function, and assign the returning value to cache and return the value.It is very useful to avoid a trouble which judge the cache is exist when developing project and then to read cache and set cache in other place.

```js
export default class extends think.controller.base {
  * indexAction(){
    // setup cache, when cache didn't exist, it invoke function automatically, and set cache at the same time
    let value = yield this.cache('name', () => {
      return this.model('user').select();
    });
  }
}
```

Setup cache and modify the type:

```js
export default class extends think.controller.base {
  * indexAction(){
    // setup cache, cache type is redis
    yield this.cache('name', 'value', {
      type: 'redis'
    });
  }
}
```


#### hook(event, data)

* `event` {String} event name
* `data` {Mixed} argument
* `return` {Promise}

Execute hook event, a hook has some middleware, it will execute those middleware orderly.

Hook event can be assigned in `src/common/config/hook.js`, also it can be registered with think.hook.

```js
export default class extends think.controller.base {
  * indexAction(){
    let result = yield this.hook('parse_data');
  }
}
```

#### model(name, options)

* `name` {String} model name
* `options` {Object} options, more detail seen in database config
* `return` {Object} model instance

Get the instance of model, which is instance of current module by default, it also can get instance of other module.

```js
export default class extends think.controller.base {
  indexAction(){
    // get instance of user model in current module
    let model = this.model('user');
    // get instance of article model in admin module
    let model1 = this.model('admin/article');
    // get instance of test model in current module, and it is sqlite database
    let model2 = this.model('test', {
      type: 'sqlite' // setup type of database to sqlite, more detail to see in database config
    })
  }
}

```

#### controller(name)

* `name` {String} controller name
* `return` {Object} controller instance

Get the instance of Controller, if cannot find Controller, it will report errors.

```js
export default class extends think.controller.base {
  indexAction(){
    // get instance of user controller in current module
    let controller = this.controller('user');
    // get instance of user controller in admin module
    let controller1 = this.controller('admin/user');
  }
}
```


#### service(name)

* `name` {String} service name
* `return` {Class} 

Get the service, it maybe return a class, or an object, so it will not instance automatically.

```js
export default class extends think.controller.base {
  indexAction(){
    // get the service
    let service = this.service('user');
    // get instance of service
    let instance = new service(...args);
    // get user service in admin module
    let service1 = this.service('admin/user');
  }
}
```

