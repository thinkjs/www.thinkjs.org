## Session

需要用户登录的网站基本上都离不开 Session，ThinkJS 里默认支持多种类型的 Session，如：`file`，`db`，`redis` 等。

### 支持的 Session 类型

* `memory` 内存方式
* `file` 文件类型
* `db` 数据库类型
* `redis` Redis 类型

##### db Session

使用 `db` 类型的 Session 需要创建对应的数据表（如果是 MongoDB 则无需创建），可以用下面的 SQL 语句创建：

```sql
  DROP TABLE IF EXISTS `think_session`;
  CREATE TABLE `think_session` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `cookie` varchar(255) NOT NULL DEFAULT '',
    `data` text,
    `expire` bigint(11) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `cookie` (`cookie`),
    KEY `expire` (`expire`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

需要将 `think_` 改为 db 配置中的数据表前缀。

##### redis Session

使用 `redis` 类型的 Session 需要配置 Redis，具体见 [配置](./config.html#redis)。

### Session 配置

Session 默认配置如下，可以在 `src/common/config/session.js` 中进行修改：

```js
export default {
  type: 'file',
  name: 'thinkjs', //对应 cookie 的名称
  secret: '', //Session 对应的 cookie 是否需要加密
  timeout: 24 * 3600, //过期时间，默认为一天
  cookie: { // cookie options
    length: 32
  },
  adapter: {
    file: {
      path: think.getPath('common', 'runtime') + '/session'
    }
  }
};
```

`注`：`2.0.6` 版本开始添加了 adapter 配置。

关于 Cookie 的配置请见 [配置](./config.html#cookie)。

### Session 读写

Controller 或 Logic 里可以通过下面的方式读写 Session：

##### 读取 Session

```js
export default class extends think.controller.base {
  async indexAction(){
    //获取session
    let value = await this.session('userInfo');
  }
}
```

##### 设置 Session

```js
export default class extends think.controller.base {
  async indexAction(){
    //设置 session
    await this.session('userInfo', data);
  }
}
```

##### 清除 Session

```js
export default class extends think.controller.base {
  async indexAction(){
    //清除当前用户的 session
    await this.session();
  }
}
```

--------

http 对象上可以通过 `http.session` 方法读写 Session，具体请见 [API -> http](./api_http.html#toc-b20)。

### 扩展 Session

可以通过下面的命令创建 Session Adapter：

```js
thinkjs adapter session/foo
```

会创建文件 `src/common/adapter/session/foo.js`，需要实现下面的方法：

```js
export default class extends think.adapter.session {
  /**
   * init
   * @param  {Object} options []
   * @return {}         []
   */
  init(options){

  }
  /**
   * 获取 Session 
   * @param  {String} name []
   * @return {Promise}      []
   */
  get(name){

  }
  /**
   * 设置 Session
   * @param {String} name  []
   * @param {Mixed} value []
   */
  set(name, value){

  }
  /**
   * 删除 Session
   * @param  {String} name []
   * @return {Promise}      []
   */
  delete(name){

  }
  /**
   * 更新 Session
   * @return {Promise} []
   */
  flush(){

  }
  /**
   * 清除过期的 Session
   * @return {Promise} []
   */
  gc(){

  }
}
```

框架里的 Session 实现请见 <https://github.com/75team/thinkjs/tree/master/src/adapter/session>。

### 使用第三方 Session Adapter

如何使用第三方的缓存 Adapter 请参见 [Adapter -> 介绍](./adapter_intro.html#toc-e7c)。