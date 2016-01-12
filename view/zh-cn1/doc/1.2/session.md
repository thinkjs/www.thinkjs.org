## Session

Node.js 本身并没有提供 Session 的功能，但一般网站都有用户登录的功能，为了方便开发者使用，ThinkJS 提供一套 session 的机制。

<div class="alert alert-info">
    Session 都需要依赖浏览器端的一个 Cookie 来实现，然后把这个 Cookie 值作为 key 到对应的地方去查询，如果有相应的数值表示已经登录，否则表示没有登录。
</div>

### 配置

Session 有如下的配置：

```js
//Session 配置
session_name: "ThinkJS", //session 对应的 cookie 名称
session_type: "File", //session 存储类型, 空为内存，还可以为 Db
session_path: "", //File 类型下文件存储位置，默认为系统的 tmp 目录
session_options: {}, //session 对应的 cookie 选项
session_sign: "", //session 对应的 cookie 使用签名，如果使用签名，这里填对应的签名字符串
session_timeout: 24 * 3600, //session 失效时间，单位：秒
```

默认的 Session 的存储方式是 File 类型，可以修改为内存或者 Db 的方式，对应的值为 `""` 和 `Db`。

如果使用 `cluster` 模式，则不能使用内存的方式。

使用 Db（Mysql）来存储 Session 需要建如下的数据表：

```
DROP TABLE IF EXISTS `think_session`;
CREATE TABLE `think_session` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cookie` varchar(255) NOT NULL DEFAULT '',
  `data` text,
  `expire` bigint(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cookie` (`cookie`),
  KEY `expire` (`expire`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

将数据表名 `think_session` 改为项目里对应的前缀 +session。

### 使用 Session
在 Controller 里，可以通过下面的方式使用 Session：

```js
// 使用 Session
//
// 获取 session 里 userInfo 的值
this.session("userInfo").then(function(data){})
// 设置 Session
this.session("userInfo", {name: "welefen", "email": "welefen@gmail.com"}).then(function(){

})
// 删除 Session
this.session().then(function(){});
```

Session 的读、写、删除操作都是异步的。

### 过期 Session 清除策略

一个用户登录后如果长期不再登录，那么这个 Session 对应的缓存数据就可以删除了。如果不删除那么会导致数据量越来越大，影响性能。

ThinkJS 提供了一套定时删除过期 Session 的策略，由于 Session 类继承自 Cache，所以 Session 和 Cache 的清除策略是一样的。 可以通过如下的参数来清除：

```js
// 过期数据清除策略
cache_gc_hour: [4], // 缓存清除的时间点，数据为小时。
```

这里表示在凌晨 4 点的时候进行一次清除，你可以修改多个时间点进行清除。如：早上 3 点、早上 9 点、下午 5 点、晚上 10 点，那么配置值为 `[3, 9, 17, 22]`。

### 示例

判断用户是否登录：

```js
// 判断用户是否登录
var self = this;
return this.session("userInfo").then(function(data){
    if(isEmpty(data)){
        // 未登录情况跳转到登录页
        return self.redirect("/login")
    }else{
        self.userInfo = data;
        // 将用户信息赋值到模版变量里，供模版里使用
        self.assign("userInfo", data);
    }
})
```

用户登录成功写入 Session：
```js
// 用户登录成功写入 Session
var name = this.post("name"); // 获取 post 过来的用户名
var pwd = this.post("pwd"); // 获取 post 过来的密码
var self = this;
return D('User').where({ // 根据用户名和密码查询符合条件的数据
    name: name,
    pwd: md5(pwd)
}).find().then(function(data){
    if(isEmpty(data)){
        // 用户名或者密码不正确，返回错误信息
        return self.error(403, "用户名或者密码不正确");
    }else{return self.session("userInfo", data);
    }
}).then(function(){
    // 返回正确信息
    return self.success();
})
```

