## 子域名部署

当项目比较复杂时，可能希望将不同的功能部署在不同的域名下，但代码还是在一个项目下。如：域名 `admin.example.com` 部署后台管理的功能，希望映射到 `admin` 模块下。ThinkJS 提供子域名的 middleware 来处理这个需求。

### 配置

可以修改 `src/common/config/hook.js` 来开启：

```js
export default {
  route_parse: ['prepend', 'subdomain']
}
```

然后设定子域名部署的相关配置，该配置可以在 `config/config.js` 里设置：

```js
export default {
  subdomain: {
    admin: 'admin', //表示将 admin.example.com 映射到 admin 模块下
    ...
  }
}
```

假如原来的 pathname 为 `group/detail`，命中了 admin.example.com 这个子域名后，pathname 变为 `admin/group/detail`，后续路由解析就会根据新的 pathname 进行。