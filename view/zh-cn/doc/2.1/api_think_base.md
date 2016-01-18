## think.base

`think.base`是基类，所有的类都会继承该类，该类提供了一些基本的方法。

使用 ES6 语法继承该类：

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

`注`： 使用 ES6 里的类时不要写 `constructor`，把初始化的一些操作放在 `init`方法里，该方法在类实例化时自动被调用，效果等同于 `constructor`。

使用普通的方式继承该类：

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

初始化方法，这里可以进行一些赋值等操作。

```js
class a extends think.base {
  init(name, value){
    this.name = name;
    this.value = value;
  }
}
```

`注`：与 `1.x` 版本不同的是，`2.x` 版本 `init` 方法不再支持返回一个 `Promise`，一些通用操作放在 `__before` 魔术方法里进行。

### __before()

前置魔术方法，可以将一些通用的行为放在这里进行，如：controller 里检测用户是否登录

```js
export default class think.controller.base {
  /**
   * 前置魔术方法
   * @return {Promise} []
   */
  * __before(){
    let userInfo = yield this.session('userInfo');
    //如果没有登录，则跳转到登录页面
    if(think.isEmpty(userInfo)){
      return this.redirect('/logic');
    }
    this.assign('userInfo', userInfo)
  }
}
```

### __after()

后置魔术方法，在方法执行完成后在执行。

### filename()

* `return` {String} 返回当前类文件的名称

获取当前类文件的名称，不包含文件具体路径和扩展名。

```js
//假设当前类文件具体路径为 /home/xxx/project/app/controller/user.js
class a extends think.base {
  test(){
    var filename = this.filename();
    //returns 'user'
  }
}
```


### parseModuleFromPath()

从当前类所在的 `filepath` 解析出所在对应的模块。

### invoke(method, ...data)

* `method` {String} 要调用的方法名称
* `data` {Array} 传递的参数
* `return` {Promise}

调用一个方法，自动调用 `__before` 和 `__after` 魔术方法。不管方法本身是否返回 `Promise`，该方法始终返回 `Promise`。

方法本身支持是 `*/yield` 和`async/await`。

```js
//使用 async/await
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
//使用 */yield
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

