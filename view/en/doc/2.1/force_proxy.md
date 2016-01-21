## Ban port access


### Description

Your online program often has reverse proxy by using nginx. User's request will accroding nginx to Node.js. It will be easy to load balance by using reverse proxy.

After you has nginx reverse proxy to node.js service, you usually want to ban request directly from port. You can set all port request directly just be allowed in host. The other solution is taking a judge in application level.

ThinkJS provides middleware to ban port access. If it's trouble to ban port access in host directly, you can take replace of Middleware to do it.

### middleware configuration

Modify `src/common/config/hook.js` linke following:

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

This will only ban port access in production environment and there no effect in development environment.

### Listen local port only

Default host what Node.js listen when start service is `0.0.0.0`. It allows request both local and outgoing. You can change it to `127.0.0.1` to allow local request only.

You can modify `src/common/config/config.js` as following:

```js
export default {
  host: '127.0.0.1'
}
```
