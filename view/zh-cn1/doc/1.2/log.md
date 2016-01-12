## 日志

ThinkJS 支持 console 和 memory 相关的日志，具体配置如下：

```js
log_console: false, // 是否记录日志，开启后会重写 console.error 等系列方法
log_console_path: LOG_PATH + '/console', // 日志文件存放路径
log_console_type: ['error'], // 默认只接管 console.error 日志
log_memory: false, // 记录内存使用和负载
log_memory_path: LOG_PATH + '/memory', // 日志文件存放路径
log_memory_interval: 60 * 1000, // 一分钟记录一次
```

开启了日志功能就可以在 App/Runtime/Log 下查看对应的日志了，如：`App/Runtime/Log/memory/2014-09-23.log`

```
[2014-09-23 15:01:35] rss:23.0MB heapTotal:9.8MB heapUsed:5.3MB freeMemory:677.6MB loadAvg:1.3,1.7,1.81
[2014-09-23 15:02:35] rss:23.0MB heapTotal:9.8MB heapUsed:5.3MB freeMemory:677.6MB loadAvg:1.3,1.7,1.81
[2014-09-23 15:03:35] rss:22.6MB heapTotal:9.8MB heapUsed:4.9MB freeMemory:677.6MB loadAvg:1.3,1.7,1.81
[2014-09-23 15:04:35] rss:22.9MB heapTotal:9.8MB heapUsed:5.2MB freeMemory:677.6MB loadAvg:1.3,1.7,1.81
```

* 日志按天分割文件
* `APP_DEBUG=true` 下不会记录日志
