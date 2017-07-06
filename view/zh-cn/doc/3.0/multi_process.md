## 多进程

node 中提供了 `cluster` 模块来创建多进程应用，这样可以避免单一进程挂了导致服务异常的情况。框架是通过 [think-cluster](https://github.com/thinkjs/think-cluster) 模块来运行多进程模型的。

### 多进程配置

可以配置 `workers` 指定子进程的数量，默认为 `0`（当前 cpu 的个数）

```js
//src/config/config.js
module.exports = {
  workers: 0 // 可以根据实际情况修改，0 为 cpu 的个数
}
``` 