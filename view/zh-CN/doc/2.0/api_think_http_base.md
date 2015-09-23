## think.http.base

`think.http.base`继承自 [think.base](./api_think_base.html) 类，该类为含有 http 对象处理时的基类。middleware, controller, view 类都继承自该类。

### config(name, value)

* `name` {String} 配置名称
* `value` {Mixed} 配置值

读取或者设置配置，value 为 `undefined` 时为读取配置，否则为设置配置。

`注`：不可将当前请求的用户信息作为配置来设置，会被其他用户给冲掉。

```js

```

### action(controller, action)

### cache(name, value, options)

### hook(event, data)

### model(name, options, module)

### controller(name, module)

### service(name, module)

