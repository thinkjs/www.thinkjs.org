## 线上部署

你可以使用自己的工具将代码发布到线上服务器。

### 关闭 APP_DEBUG

ThinkJS 通过设置 `APP_DEBUG=true` 的方式达到修改文件立即生效的目的，这种方式是通过定时清除文件缓存的方式来达到的，所以长期开启后会有一定的内存泄漏。

服务在线上运行时，切记要将 `www/index.js` 里的 `APP_DEBUG` 设置为 `false`。

### 启动服务

线上服务建议使用 `pm2` 模块来管理。如：

```js
// 通过 pm2 来启动服务
pm2 start /home/welefen/www/www.welefen.com/www/index.js -n www.welefen.com
```

然后通过 `pm2 ls` 命令可以看到启动的服务：

```
┌────────────────────┬────┬──────┬───────┬────────┬───────────┬────────┬─────────────┬─────────────┐
│ App name           │ id │ mode │ PID   │ status │ restarted │ uptime │      memory │    watching │
├────────────────────┼────┼──────┼───────┼────────┼───────────┼────────┼─────────────┼─────────────┤
│ www.welefen.com    │ 6  │ fork │ 3319  │ online │         0 │ 2D     │  8.715 MB   │ unactivated │
│ www.ThinkJS.org    │ 7  │ fork │ 3332  │ online │         0 │ 2D     │ 43.773 MB   │ unactivated │
└────────────────────┴────┴──────┴───────┴────────┴───────────┴────────┴─────────────┴─────────────┘
 Use `pm2 desc[ribe] <id>` to get more details
```