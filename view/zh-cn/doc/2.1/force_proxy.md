## 禁止端口访问


### 介绍

代码上线后一般会用 nginx 做一层反向代理，这时用户的请求会落到 nginx 上，然后通过 nginx 转发到 Node.js 服务上，这样可以很方便的做负载均衡。

通过 nginx 代理后就不希望用户直接访问到 Node.js 服务了，一种方案时让 Node.js 启动的端口只允许内部访问，外部无法直接访问到。另一种方案是在应用层判断。

ThinkJS 提供禁止端口访问的 Middleware，这样如果不方便直接在机器上配置禁止端口访问的话，就可以使用该 Middleware 来禁止。

### middleware 配置

修改 hook 配置文件 `src/common/config/hook.js`，添加如下的配置：

```js
export default {
  request_begin: ['prepend', 'force_proxy']
}
```

然后在配置文件 `src/common/config/env/producition.js` 里配置：

```js
export default {
  proxy_on: true
}
```

这样只在线上环境开启了禁止端口访问的功能，开发环境不受影响。

### 只监听内网 host

Node.js 启动服务时默认监听的端口是 `0.0.0.0`，这样服务既可以内网访问，也可以外网访问。可以将 host 设置为 `127.0.0.1` 限制为内网访问。

可以通过修改配置为 `src/common/config/config.js` 来完成，如：

```js
export default {
  host: '127.0.0.1'
}
```