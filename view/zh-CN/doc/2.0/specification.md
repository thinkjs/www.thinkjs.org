## 代码规范

### 文件路径必须小写

项目开发时，很多时候是在 `Windows` 或者 `Mac` 系统下，但项目上线时，一般是运行在 `Linux` 系统下。

但在 `Windows` 和 `Mac` 系统下，文件路径是不区分大小写的，而 `Linux` 下是区分大小写的。这样容易导致开发环境下运行是好的，但上线后却报错了。

为了避免这种情况的发生，文件路径尽量都使用小写字符。并且在服务启动时，ThinkJS 会检测项目下文件路径，如果有大写字母则会告警，如：

```
[2015-10-13 10:36:59] [WARNING] filepath `admin/controller/apiBase.js` has uppercase chars.
```

### 缩进使用 2 个空格

在 Node.js 环境下开发，有时候逻辑比较复杂，有各种条件判断，或者有一些异步操作，这些都会增加代码的缩进。

为了不至于让缩进占用了太多的列宽，建议使用 2 个空格作为缩进。

### 使用 ES6 语法开发

ES6 中有大量的语法糖可以简化我们的代码，让代码更加简洁高效。
Node.js 最新版本已经较好的支持了 ES6 的语法，即使有些语法不支持，也可以通过 Babel 编译来支持。 所以是时候使用 ES6 语法来开发项目了。

### 不要使用 constrcutor 方法

使用 ES6 里的 class 来创建类的时候，可以使用 `constrcutor` 方法达到类实例化的时候自动调用。如：

```js
export default class think.base {
  constructor(){
    ...
  }
}
```

但如果不使用 ES6 里的 class，就没有 constrcutor 方法了。

为了统一处理，ThinkJS 提供了 `init` 方法来代替 `constrcutor` 方法，该方法不管是在 class 下还是动态创建类的情况下都可以做到类实例化的时候自动被调用。

```js
export default class think.base {
  /**
   * 初始化方法，类实例化时自动被调用
   * @return {} []
   */
  init(){
    ...
  }
}
```

`注：` ThinkJS 里所有的类都会继承 `think.base` 基类。