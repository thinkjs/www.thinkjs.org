## 代码规范

### 文件路径必须小写

很多时候是在 `Windows` 或者 `Mac OSX` 系统下开发项目，但一般都部署 `Linux` 系统下。

在 `Windows` 和 `Mac` 系统下，文件路径是不区分大小写的，而 `Linux` 下是区分大小写的。这样很容易出现文件大小写的问题导致开发环境下是好的，但上线后却报错了。

为了避免这种情况的发生，文件路径尽量都使用小写字符。并且在服务启动时，ThinkJS 会检测项目下文件路径，如果有大写字母则会告警，如：

```text
[2015-10-13 10:36:59] [WARNING] filepath `admin/controller/apiBase.js` has uppercases.
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

`注`：ThinkJS 里所有的类都会继承 `think.base` 基类。

### 使用 Babel 编译

虽然现在的 Node.js 版本已经支持了很多 ES6 的特性，但这些特性现在还只是实现了，V8 里还没有对这些特性进行优化。如：`*/yield` 等功能。

所以建议使用 Babel 来编译，一方面可以使用 ES6 和 ES7 几乎所有的特性，另一方面编译后的性能也比默认支持的要高。

### 使用 async/await 替代 */yield

`*/yield` 是 ES6 里提出一种解决异步执行的方法，它只是一个过渡的方案，ES7 里便提出了 `async/await` 来代替它。

相对 `async/await`，`*/yield` 有以下的缺陷：

1、`*/yield` 调用后返回一个迭代器，需要借助第三方模块来执行。如：`co`

2、`*/yield` 无法和 Arrow Function 一起使用。

3、`*/yield` 调用另一个 `*/yield` 时，需要使用 `yield *`，带来不便。

4、目前 V8 对 `*/yield` 还没有做优化，最好也通过 Babel 来编译。

所以完全可以使用 ES7 里的 `async/await` 来代替 `*/yield`，然后使用 Babel 编译来运行。