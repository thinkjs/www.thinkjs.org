## Service / 服务

项目中，有时候除了查询数据库等操作外，也需要调用远程的一些接口，如：调用 GitHub 的接口、调用发送短信的接口等等。

这种功能放在 Model 下是不太合适的，为此，框架提供了 Service 来解决此类问题。

### 创建 Service 文件

Service 文件存放在 `src/service/` （多模块在 `src/common/service/`）目录下，文件内容格式如下：

```js
module.exports = class extends think.Service {
  constructor() {

  }
  xxx() {

  }
}
```
Service 都继承 `think.Service` 基类，但该基类不提供任何方法，可以通过 Extend 进行扩展。

可以在项目根目录下通过 `thinkjs service xxx` 命令创建 service 文件，支持多级目录。

### 实例化 Service 类

可以通过 `think.service` 方法实例化 Service 类，在控制器、ctx 也有对应的 `service` 方法，如：`ctx.service`、`controller.service`，这些方法都是 think.service 的快捷方式。

项目启动时，会扫描项目下所有的 services 文件，并存放到 `think.app.services` 对象下，实例化时会从该对象上查找对应的类文件，如果找不到则报错。

#### 无参数类的实例化

```js
// src/service/sms.js
module.exports = class extends think.Service {
  xxx() {

  }
}

// 实例化，没有任何参数
const sms = think.service('sms');
sms.xxx();
```

#### 有参数类的实例化 

```js
// src/service/sms.js
module.exports = class extends think.Service {
  constructor(key, secret) {
    super();
    this.key = key;
    this.secret = secret;
  }
  xxx() {

  }
}

// 带参数的实例化
const sms = think.service('sms', key, secret);
sms.xxx();
```

#### 多模块项目的实例化

```js
// src/home/service/sms.js
module.exports = class extends think.Service {
  constructor(key, secret) {
    super();
    this.key = key;
    this.secret = secret;
  }
  xxx() {

  }
}

// 指定从 home 下查找 service 类
const sms = think.service('sms', 'home', key, secret);
```

#### 多级目录的实例化

```js
// src/service/aaa/sms.js
module.exports = class extends think.Service {
  xxx() {

  }
}

const sms = think.servie('aaa/sms');
```

### 扩展 Service 类的方法

基类 think.Service 没有提供任何的方法，但实际中需要用到很多常用的方法，如：从远程接口获取数据的模块，处理完数据后将数据更新导数据库的操作。这个时候可以通过对应的扩展来加强 think.Service 类的功能，如：

* [think-fetch](https://github.com/thinkjs/think-fetch) 模块让 think.Service 类有了 `fetch` 方法，这样很方便获取远程的数据
* [think-model](https://github.com/thinkjs/think-model) 模块让 think.Service 类有了 `model` 方法，这样可以快速的操作数据库

这些模块都是 Extend/扩展，可以增强 think.Service 类的能力。

当然项目中也可以根据需要扩展 think.Service 类，如：

```js
// src/extend/service.js
module.exports = {
  getDataFromApi() {

  }
}
```

通过在扩展文件 `src/extend/service.js`（多模块项目为 `src/common/extend/service.js`）添加对应的方法，增强 `think.Service` 类的能力，这样在 `src/service/xxx.js` 中就可以直接使用这些方法了。

```js
// src/service/sms.js
module.exports = class extends think.Service {
  async xxx() {
    const data = await this.getDataFromApi(); // 这个访问为 extend/service.js 里扩展的方法
  }
}
```

如果这些扩展的方法比较通用，那么就可以整理成一个 Extend 模块发布，其他项目引入这个模块就可以了，具体见 [Extend/扩展](/doc/3.0/extend.html)。
