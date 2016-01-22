## Ban Port Access


### Description

Online applications usually have Nginx as the reverse proxy. Nginx will redirect user requests to Node.js. Have reverse proxy will be easy to do load balance.

Once you have the reverse proxy, you usually want to ban the requests that directly accessed to the Node.js's port. At this time, you can set the Node.js port could only be accessed internally, or you must taking a judge in application level.

ThinkJS provides middleware to ban port access. If it's trouble to ban port access in host directly, you can take replace of Middleware to do it.

### Middleware Configuration

Modify `src/common/config/hook.js` as following:

```js
export default {
  request_begin: ['prepend', 'force_proxy']
}
```

Then modify `src/common/config/env/production.js`:

```js
export default {
  proxy_on: true
}
```

This will only ban port access in production environment and there is no effect in development environment.

### Listen Local Port Only

The default host Node.js listening when it starts service is `0.0.0.0`. It allows requests both coming from interior and outside. You can change it to `127.0.0.1` to allow local requests only.

You can modify `src/common/config/config.js` as following:

```js
export default {
  host: '127.0.0.1'
}
```
