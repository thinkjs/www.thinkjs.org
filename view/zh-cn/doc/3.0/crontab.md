## Crontab / 定时任务

项目在线上运行时，经常要定时去执行某个功能（如：定时去远程拉取一些数据、定时计算数据库里的一些数据进行汇总），这时候就需要使用定时任务来处理了。

框架提供了二种方式执行定时任务，一种是在当前启动的子进程中执行，另一种是用一个新的进程执行（命令行执行）。

### 当前子进程中执行

有些定时任务是拉取一些数据放在内存中，供用户请求过程中使用，这种定时任务就希望在当前进程中调用（由于框架启动服务时是多进程架构，所以定时任务只会在子进程中执行，不会在主进程中执行），该功能是通过 [think-crontab](https://github.com/thinkjs/think-crontab) 模块来完成的。

#### 配置

定时任务的配置文件为 `src/config/crontab.js`（多模块项目下配置文件为 `src/common/config/crontab.js`，也支持在每个模块下配置定时任务文件 `src/[module]/config/crontab.js`），配置项为一个数组。如：

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

每个配置项支持的参数如下：

* `interval` {String | Number} 执行的时间间隔

  支持数字和字符串二种格式，单位是毫秒。如果是字符串，那么会用 [think.ms](/doc/3.0/think.html#toc-35a) 方法解析为数字。
* `cron` {String} crontab 的格式，如 `0 */1 * * *`

  crontab 格式，具体见 <http://crontab.org/>。如果配置了 `interval` 属性，那么会忽略该属性。
* `worker` {String} 任务执行方式, *one* 或者 *all*, 默认是 *one*

  任务会在哪些子进程中执行，默认只在一个子进程中执行，`all` 为在所有子进程中执行。即使配置了一个子进程中执行，也只能保证一个机器下在一个子进程中执行，多台机器下还是会执行多次。如果跨机房、跨机器只希望执行一次，那么可以通过 `enable` 参数控制或者命令行执行来完成。
* `handle` {Function | String} 执行任务,执行相应函数或者是路由地址，如：`crontab/test`
  
  定时任务的执行方法，可以是一个具体的执行函数，也可以是一个路由地址（会根据路由解析，然后执行对应的 Action）。
* `immediate` {Boolean} 是否立即执行，默认是 `false`

  定时任务是否立即执行一次。
* `enable` {Boolean} 是否开启，默认是 `true`

  定时任务是否开启，设置为 `false` 则关闭该条定时任务规则。比如：多机器下只希望在一台机器下执行，那么可以通过机器名来判断：

  ```js
  const hostname = require('os').hostname();
  module.exports = [{
    interval: '10s',
    enable: hostname === 'host name',
    handle: () => {
      //do something
    }
  }]
  ```

#### 调试

如果想看到定时任务是否在成功运行，可以通过 `DEBUG=think-crontab npm start` 启动项目查看打印的调试信息。

### 命令行执行

如果有些定时任务跨机房、跨机器只希望执行一次，或者定时任务比较耗时，那么可以通过命令行来执行。命令行执行需要结合系统的 crontab 任务来完成。

命令行执行直接通过自动脚本和路由地址即可，如：`node production.js crontab/test`，其中 `crontab/test` 为路由地址，这样结合系统的 crontab 就可以定时执行了。

通过命令 `crontab -e` 来编辑定时任务，如：

```sh
0 */1 * * * /bin/sh (cd projectpath; node production.js crontab/test) # 1 小时执行一次
```

### 常见问题

#### 如何限制 Action 只能定时任务调用？

默认情况下，Action 不会限制哪些情况下才允许访问，这样定时任务对应的 Action 也可以通过输入 URL 来访问。但有时候我们并不希望这样，这时候可以通过 `this.isCli` 判断来阻止。如：

```js
module.exports = class extends think.Controller {
  testAction() {
    // 如果不是定时任务调用，则拒绝
    if(!this.isCli) return this.fail(1000, 'deny');
    ...
  }
}
```
定时任务执行 Action 时并不是一个正常的用户请求，而是通过模拟一个请求来完成的，模拟时会将请求类型修改为 `CLI`，`isCli` 就是通过判断请求类型是否为 `CLI` 来完成的。