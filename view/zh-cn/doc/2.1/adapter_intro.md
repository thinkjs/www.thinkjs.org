## Adapter

Adapter 是用来解决一类功能的多种实现，如：支持多种数据库，支持多种模版引擎等。系统默认支持的 Adapter 有：`Cache`，`Session`，`WebSocket`，`Db`，`Store`，`Template` 和 `Socket`。

### 创建 Adapter

可以通过命令 `thinkjs adapter [type]/[name]` 来创建 Adapter，如：

```sh
thinkjs adapter template/dot
```

创建一个名为 `dot` 的 Template Adapter，创建的文件路径为 `src/common/adapter/template/dot.js`。文件内容类似如下：

```js
export default class extends think.adapter.template {
  /**
   * init
   * @return {[]}         []
   */
  init(...args){
    super.init(...args);
  }
}
```

如果创建的类型之前不存在，会自动创建一个 Base 类，其他类会继承该类。


### 加载 Adapter

可以通过 `think.adapter` 方法加载对应的 Adapter，如：

```js
let Template = think.adapter('template', 'dot'); //加载名为 dot 的 Template Adapter
let instance = new Template(...args); //实例化 Adapter
```

### 使用第三方 Adapter

加载 Adapter 时，系统会自动从 `src/common/adapter` 目录和系统目录查找对应的 Adapter，如果引入第三方的 Adapter，需要将 Adapter 注册进去，否则系统无法找到该 Adapter。

可以通过 `think.adapter` 方法注册第三方的 Adapter，如：

```js
let DotTemplate = require('think-template-dot');
think.adapter('template', 'dot', DotTemplate);
```

将文件存放在 `src/common/bootstrap/` 目录下，这样服务启动时就会自动加载。