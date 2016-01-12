## 调试

开启调试，需要将 `www/index.js` 里的 `global.APP_DEBUG` 设置为 true。

创建项目时，该配置项默认开启。

### 特性

开启调试后，会有如下的特性：

* 修改项目下的任意文件，保存后立即生效，不需要重启 node 服务
* 每执行一条 sql 操作，控制台下都会将 sql 语句打印处理
* 如有报错，控制台下可以看到详细的错误信息


### 关闭配置

开启调试后，会关闭如下的配置：

```js
// 调试下关闭的配置
"db_fields_cache": false, //debug 模式下关闭数据表字段的缓存
"db_cache_on": false,
"use_cluster": false,
"html_cache_on": false,
"log_process_pid": false,
"clear_require_cache": true, // 清除 require 的缓存文件
```
