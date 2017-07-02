## Controller

控制器是一类操作的集合，用来响应用户同一类的请求。比如：将用户相关的操作都放在 `user.js` 里，每一个操作就是里面一个 Action。

### 创建 Controller

创建的 controller 都需要继承自 `think.Controller` 类，这样就能使用一些内置的方法。当然项目一般会创建一些通用的基类，然后实际的 controller 都继承自这个基类。

项目创建时会自动创建了一个名为 `base.js` 的基类，其他 controller 继承该类即可。

```js
//src/controller/user.js

const Base = require('./base.js');
module.exports = class extends Base {
  indexAction(){
    this.body = 'hello word!';
  }
}
```

创建完成后，框架会监听变化然后重启服务。这时访问 `http://127.0.0.1:8360/user/index` 就可以看到输出的 `hello word!`

### 前置操作 __before

项目中，有时候需要在一个统一的地方做一些操作，如：判断是否已经登录，如果没有登录就不能继续后面行为。此种情况下，可以通过内置的 `__before` 来实现。

`__before` 是在调用具体的 Action 之前调用的，这样就可以在其中做一些处理。

```js
module.exports = class extends think.Controller {
  async __before(){
    const userInfo = await this.session('userInfo');
    //获取用户的 session 信息，如果为空，返回 false 阻止后续的行为继续执行
    if(think.isEmpty(userInfo)){
      return false;
    }
  }
  indexAction(){
    // __before 调用完成后才会调用 indexAction
  }
}
```

### 后置操作 __after

后置操作 `__after` 与 `__before` 对应，只是在具体的 Action 执行之后执行，如果具体的 Action 执行返回了 `false`，那么 `__after` 不再执行。

```js
module.exports = class extends think.Controller {
  indexAction(){

  }
  __after(){
    //indexAction 执行完成后执行，如果 indexAction 返回了 false 则不再执行
  }
}
```

### 空操作 __call



### ctx 对象

controller 实例化时会传入 `ctx` 对象，在 controller 里可以通过 `this.ctx` 来获取 ctx 对象。并且 controller 上很多方法也是通过调用 ctx 里的方法来实现的。

### API