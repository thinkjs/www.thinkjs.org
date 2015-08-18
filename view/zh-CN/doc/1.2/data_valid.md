## 数据校验

数据校验是指对表单提交类的数据进行校验。如：用户注册、下订单等。 需要对这类提交的数据进行校验，如果不合法则不能通过。

数据校验和变量过滤器的区别为：变量过滤器一般给 `get` 请求使用的，数据校验一般给 `post` 请求使用的。

ThinkJS 里提供了数据校验的功能，在 Action 里通过 `this.valid` 方法使用。如：

```js
var email = this.post("email");
// 检测 email 是否合法
// 检测单个值时返回是否合法
var isValid = this.valid(email, "email");
```

除了检测单个值，也可以同时检测多个值，返回所有的错误信息。如：

```js
// 检测多个值，返回全部的错误信息
var errMsg = this.valid([{
    name: "email",
    value: email,
    valid: "email",
    msg: {email: "email 不合法"}
}, {
    name: "pwd",
    value: password,
    valid: ["length"],
    length_args: [6, 20], // 密码长度限制 6-20 位
    msg: {length: "密码长度不合法"}
}])
```

返回的错误信息为：

```js
// 检测的错误信息
var errMsg = {
    email: "email 不合法",
    pwd: "密码长度不合法"
}
```

### 检测类型

支持的检测类型有：

* `length` 限制长度，需要传入限制长度的数值。如：`length_args: [6]` 长度不能小于 6, `length_args: [6, 20]` 长度为 6-20。
* `required` 长度必须大于 0
* `regexp` 自定义正则检测。如：regexp_args: [/\w{5}/]
* `email` 邮箱
* `time` 时间戳
* `cnname` 中文
* `idnumber` 身份证号码
* `mobile` 手机号
* `zipcode` 邮编
* `confirm` 2 次值是否一致
* `url` url
* `int` 整数
* `float` 浮点数
* `range` 整数范围。如：`range_args: [100, 200]` 100-200 之间
* `ip4` ip4
* `ip6` ip6
* `ip` ip
* `date` 日期