## Deploy in subdomain

When your project become complicated, you may want to take different module to different domain in one project. For example, url `admin.example.com` is admin dashboard by `admin` module. ThinkJS provide subdomain middleware to handle this demand.

### Configuration

You can start this middleware by chaning `src/common/config/hook.js`:

```js
export default {
  route_parse: ['prepend', 'subdomain']
}
```

Then add configuration about deploying in subdomain in `config/config.js`:

```js
export default {
  subdomain: {
    admin: 'admin', //It will map `admin.example.com` to admin module.
    ...
  }
}
```

Assume original pathname is `group/detail`, if your domain host is `admin.example.com`, the pathname received in ThinkJS will change to `admin/group/detail`。
