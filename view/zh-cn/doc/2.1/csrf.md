## CSRF

ThinkJS 提供了 CSRF 处理的 middleware，但默认并没有开启。

### 开启 CSRF

配置 hook 文件 `src/common/config/hook.js`，添加如下的配置：

```js
export default {
  logic_before: ['prepend', 'csrf']
}
```

### 配置

CSRF 默认的配置如下，可以在配置文件 `src/common/config/csrf.js` 中修改：

```js
export default {
  session_name: '__CSRF__', // Token 值存在 session 的名字
  form_name: '__CSRF__', // CSRF 字段名字，从该字段获取值校验
  errno: 400, //错误号
  errmsg: 'token error' // 错误信息
};
```