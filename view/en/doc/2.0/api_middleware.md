## middleware

`think.middleware.base` 类继承自 [think.http.base](./api_think_http_base.html)。

##### ES6 方式

```js
export default class extends think.middleware.base {
  run(){

  }
}
```

##### 动态创建类的方式

```js
module.exports = think.middleware({
  run: function(){

  }
})
```

### 方法

#### middleare.run()

* `return` {Promise}

middleware 对外的方法入口，调用 middleware 时会自动调用该方法。
