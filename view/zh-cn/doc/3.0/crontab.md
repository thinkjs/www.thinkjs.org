## 定时任务

项目在线上运行时，经常要定时去执行某个功能，这时候就需要使用定时任务来处理了。ThinkJS 支持命令行方式调用，结合 `think-crontab` 模块可以很好的支持定时任务。


### 配置

没有默认配置。需要在 `src/config/crontab.js` 中添加相关配置，比如：

```javascript
module.exports = [{
  interval: '10s',
  immediate: true,
  handle: () => {
    //do something
  }
}, {
  cron: '0 */1 * * *',
  handle: 'crontab/test',
  worker: 'all'
}]
```

### 配置项参数

* `interval` {String|Number} 时间间隔
* `cron` {String} cron task
* `worker` {String} 任务执行方式, *one*或者*all*, 默认是*one*
* `handle` {Function|String} 执行任务,执行相应函数或者是路由地址,如 `crontab/test`
* `immediate` {Boolean} 是否立即执行,默认是 `false`
* `enable` {Boolean} 是否开启,默认 `true`