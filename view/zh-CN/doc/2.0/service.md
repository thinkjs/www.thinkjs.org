## Service

有时候项目里需要调用一些第三方的服务，如：调用 Github 相关接口。如果直接在 controller 里直接调用这些接口，一方面导致 controller 代码比较复杂，另一方面也不能更多进行代码复用。

对于这些情况，可以包装成 service 供 controller 里调用。

### 创建 service

可以通过命令 `thinkjs service [name]` 来创建命令，具体使用请见 [扩展功能 -> ThinkJS 命令 -> 添加 service](./thinkjs_command.html#添加-service)。

默认生成的 service 是一个 class，但有些 service 直接提供一些静态方法即可，这时候可以把 class 改为对象即可。

### 加载 service

可以通过 `think.service` 加载一个 service，如：

```js
export default class extends think.controller.base {
  indexAction(){
    let GithubService = think.service('github');
    let instance = new GithubService();
  }
}
```

如果想跨模块加载 service，可以通过下面的方式：

```js
export default class extends think.controller.base {
  indexAction(){
    let GithubService = think.service('github', 'admin'); //加载 admin 模块下的 github service
    let instance = new GithubService();
  }
}
```

`注`：如果项目不是特别复杂，建议把 service 放在 `common` 模块下，可以就都可以方便的加载了。