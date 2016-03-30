## think.base

`think.base` is the base class, all classes will inherit it, it supports some basic functions.

Inherit Base Class with ES6:

```js
export default class extends think.base {
  /**
   * init method
   * @return {} []
   */
  init(){

  }
}
```

`Notice`： while using ES6, don't write the `constructor`, instead puting some initial operations in the function `init`, this function will be called automatically when class instancing, the effect is equivalent to use `construtor`.

Inherit Base Class Use Normal Way:

```js
module.exports = think.Class(think.base, {
  /**
   * init method
   * @return {} []
   */
  init: function(){

  }
})
```

### init(...args)

* `args` {Array}

Initialization function, which can do some assign and other operations.

```js
class a extends think.base {
  init(name, value){
    this.name = name;
    this.value = value;
  }
}
```

`Notice`：Different from version `1.x`, the `init` function of `2.x` did not return a `Promise`, some common operations are in `__before` magic functions.

### __before()

Pre-magic function, you can put some common behavior here, such as check wheter user is login or not in controller.

```js
export default class think.controller.base {
  /**
   * pre-magic function
   * @return {Promise} []
   */
  * __before(){
    let userInfo = yield this.session('userInfo');
    // if not login yet, it will jump to login page.
    if(think.isEmpty(userInfo)){
      return this.redirect('/logic');
    }
    this.assign('userInfo', userInfo)
  }
}
```

### __after()

Post-magic function, it will execute after function executed.

### filename()

* `return` {String} return the current class file's name.

Get the current class file's name, not contains detail of file path or file's extension.

```js
// suppose current class file path is /home/xxx/project/app/controller/user.js
class a extends think.base {
  test(){
    var filename = this.filename();
    //returns 'user'
  }
}
```


### invoke(method, ...data)

* `method` {String} the function name to been invoked
* `data` {Array} arguments
* `return` {Promise}

To invoke a function, automatically invoke `__before` and `__after` no matter whether the function return `Pormise` or not, this function will return `Pormise`.

This function supports `*/yield` and `async/await`.

```js
//use async/await
class Cls extends think.base {
  async getValue(){
    let value = await this.getValue();
    return value;
  }
}
let instance = new Cls();
instance.invoke('getValue').then(data => {
    
});
```


```js
//use */yield
class Cls extends think.base {
  * getValue(){
    let value = yield this.getValue();
    return value;
  }
}
let instance = new Cls();
instance.invoke('getValue').then(data => {
    
});

```

