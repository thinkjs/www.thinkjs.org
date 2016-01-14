## 禁止端口访问

代码上线后一般会用 nginx 做一层反向代理，这时用户的请求会落到 nginx 上，然后通过 nginx 转发到 Node.js 服务上，这样可以很方便的做负载均衡。

通过 nginx 代理后就不希望用户直接访问到 Node.js 服务了，一种方案时让 Node.js 启动的端口只允许内部访问，外部无法直接访问到。另一种方案是在应用层判断。

ThinkJS 提供禁止端口访问的 Middleware，这样如果不方便直接在机器上配置禁止端口访问的话，就可以使用该 Middleware 来禁止。

### 配置

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