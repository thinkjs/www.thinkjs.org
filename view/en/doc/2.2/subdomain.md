## Subdomains Deploy

When your projects become complicated, you may want to deploy different modules to different domains, but their code is still placed in one project folder. For example, the URL `admin.example.com` is deployed with admin dashboard function, and that's mappped to the `admin` module. ThinkJS provides subdomain middleware to handle this demand.

### Configuration

You can start this middleware by chaning `src/common/config/hook.js`:

```js
export default {
  route_parse: ['prepend', 'subdomain']
}
```

Then add the configuration about subdomains deploy in `config/config.js`:

```js
export default {
  subdomain: {
    admin: 'admin', //It will map `admin.example.com` to admin module.
    ...
  }
}
```

If original pathname is `group/detail`, if your domain host is `admin.example.com`, the pathname received in ThinkJS will change to `admin/group/detail`。
