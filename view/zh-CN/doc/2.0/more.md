## 更多功能

### 如何将 callback 包装成 Promise

Node.js 本身提供的很多接口都是 callback 形式的，并且很多第三方库提供的接口也是 callback 形式的。但 ThinkJS 需要接口是 Promise 形式的，所以需要将 callback 形式的接口包装成 Promise。

ThinkJS 提供了 `think.promisify` 方法可以快速将接口包装为 Promise 方式，具体请见[这里](./api_think.html#toc-c09)。

### 任务队列

Node.js 一个很大的优点就是异步 I/O，这样就可以方便的做并行处理，如：并行去请求一些接口，并行去处理一些文件。但操作系统本身对文件句柄是有限制的，如果并行处理的数目不限制，可能就会导致报错。

这时候一般都是通过任务队列来处理，ThinkJS 里提供了 `think.parallelLimit` 方法来处理此类需求，具体见[这里](./api_think.html#toc-bb7)。