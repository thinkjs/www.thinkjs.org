## Rest Controller

`think.controller.rest` 继承自 [think.controller.base](./api_controller.html)，用来处理 Rest 接口的。

### 属性

#### controller._isRest

标识此 controller 对应的是 Rest 接口。如果在 `init` 方法里将该属性设置为`false`，那么该 controller 不再是一个 Rest 接口。

#### controller._method

获取 method 方式。默认从 http method 中获取，但有些客户端不支持发送 delete, put 之类的请求，所以可以设置为从 GET 里的一个参数获取。

```js
export default class extends think.controller.rest {
  init(http){
    super.init(http);
    //设置 _method，表示从 GET 参数获取 _method 字段的值
    //如果没有取到，则从 http method 中获取
    this._method = '_method';
  }
}
```

#### controller.resource

当前 Rest 对应的 Resource 名称。

#### controller.id

资源 ID

#### controller.modelInstance

资源对应 model 的实例。


### 方法

#### controller.__before()

可以在魔术方法`__before`中进行字段过滤，分页，权限校验等功能。

```js
export default class extends think.controller.rest{
  __before(){
    //过滤 password 字段
    this.modelInstance.field('password', true);
  }
}
```

#### controller.getAction()

获取资源数据，如果有 id，拉取一条，否则拉取列表。

#### controller.postAction()

添加数据，请求类型需要是 `POST`

#### controller.deleteAction()

删除数据，请求类型需要是 `DELETE`

#### controller.putAction()

更新数据，请求类型需要是 `PUT`

#### controller.__call()

找不到方法时调用

