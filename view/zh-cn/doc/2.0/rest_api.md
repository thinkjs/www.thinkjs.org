## REST API

项目中，经常要提供一个 API 供第三方使用，一个通用的 API 设计规范就是使用 REST API。REST API 是使用 HTTP 中的请求类型来标识对资源的操作。如：

* `GET` `/ticket` #获取ticket列表
* `GET` `/ticket/12` #查看某个具体的ticket
* `POST` `/ticket`  #新建一个ticket
* `PUT` `/ticket/12` #更新ticket 12
* `DELETE` `/ticket/12` #删除ticekt 12

ThinkJS 中提供了很便捷的方式来创建 REST API，创建后无需额外的代码即可响应 REST API 的处理，同时也可以通过定制响应额外的需求。

### 创建 REST API

通过 `thinkjs controller [name] --rest` 即可创建一个 REST API。如：

```js
thinkjs controller home/ticket --rest
```

上面的命令表示在 `home` 模块下创建了一个 `ticket` 的 Rest Controller，该 Controller 用来处理资源 `ticket` 的请求。

### 处理 REST API 请求

Rest Controller 创建完成后，无需写任何的代码，即可完成对 REST API 的处理。资源名称和数据表名称是一一对应的，如：资源名为 `ticket`，那么对应的数据表为 `数据表前缀` + `ticket`。

### 请求类型

REST API 默认是从 HTTP METHOD 里获取当前的请求类型的，如：当前请求类型是 `DELETE`，表示对资源进行删除操作。

如果有些客户端不支持发送 `DELETE` 请求类型，那么可以通过属性 `_method` 指定一个参数用来接收请求类型。如：

```js
export default class extends think.controller.rest {
  init(http){
    super.init(http);
    this._method = '_method'; //指定请求类型从 GET 参数 _method 里获取
  }
}
```

### 字段过滤

默认情况下，获取资源信息时，会将资源的所有字段都返回。有时候需要隐藏部分字段，可以通过在 `__before` 魔术方法里完成此类操作。

```js
export default class extends think.controller.rest {
  __before(){
    this.modelInstance.fieldReverse('password,score'); //隐藏 password 和 score 字段
  }
}
```

### 权限管理

有些 REST API 需要进行权限验证，验证完成后才能获取对应的信息，可以通过在 `__before` 魔术方法里进行验证。

```js
export default class extends think.controller.rest {
  async __before(){
    let auth = await this.checkAuth();
    if(!auth){
      return this.fail('no permissions'); //没权限时直接返回
    }
  }
}
```

### 更多定制

更多定制方式请参见 [API -> controller.rest](./api_controller_rest.html)。
