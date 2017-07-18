## RESTful API

项目中，经常要提供一个 API 供第三方使用，一个通用的 API 设计规范就是使用 RESTful API，RESTful API 是使用 HTTP 中的请求类型来标识对资源的操作。如：

* `GET /ticket`  获取 ticket 列表
* `GET /ticket/:id` 查看某个具体的 ticket
* `POST /ticket`  新建一个 ticket
* `PUT /ticket/:id` 更新 id 为 12 的 ticket
* `DELETE /ticket/:id` 删除 id 为 12 的 ticekt

### 创建 RESTful Controller

可以通过 `-r` 参数来创建 REST Controller。如：

```
thinkjs controller user -r
```
会创建下面几个文件：
```
create : src/controller/rest.js
create : src/controller/user.js
create : src/logic/user.js
```

其中 `src/controller/user.js` 会继承 `src/controller/rest.js` 类，`rest.js` 是 RESTful Controller 的基类，具体的逻辑可以根据项目情况进行修改。

### 添加自定义路由

RESTful Controller 创建后并不能立即对其访问，需要添加对应的[自定义路由](/doc/3.0/router.html)，修改路由配置文件 `src/config/router.js`，添加如下的配置：

```js
module.exports = [
  [/\/user(?:\/(\d+))?/, 'user?id=:1', 'rest'] 
]
```

上面自定义路由的含义为：

* `/\/user(?:\/(\d+))?/` URL 的正则
* `user?id=:1` 映射后要解析的路由，:1 表示取正则里的 (\d+) 的值
* `rest` 表示为 REST API

通过自定义路由，将 `/user/:id` 相关的请求指定为 REST Controller，然后就可以对其访问了。

* `GET /user` 获取用户列表，执行 `getAction`
* `GET /user/:id` 获取某个用户的详细信息，执行 `getAction`
* `POST /user` 添加一个用户，执行 `postAction`
* `PUT /user/:id` 更新一个用户，执行 `putAction`
* `DELETE /user/:id` 删除一个用户，执行 `deleteAction`

### 数据校验

Controller 里的方法执行时并不会对传递过来的数据进行校验，数据校验可以放在 Logic 里处理，文件为 `src/logic/user.js`，具体的 Action 与 Controller 里一一对应。具体的使用方式请见 [Logic](/doc/3.0/logic.html)。

### 子级 RESTful API

有时候有子级 RESTful API，如：某篇文章的评论接口，这时候可以通过下面的自定义路由完成：

```js
module.exports = [
  [/\/post\/(\d+)\/comments(?:\/(\d+))?/, 'comment?postId=:1&id=:2', 'rest']
]
```

这样在对应的 Action 里，可以通过 `this.get("postId")` 来获取文章的 id，然后放在过滤条件里处理即可。

```js
module.exports = class extends think.Controller {
  async getAction() {
    const postId = this.get('postId');
    const commentId = this.get('id');
    const comment = this.model('comment');
    if(commentId) { // 获取单条评论的详细信息 
      const data = await comment.where({post_id: postId, id: commentId}).find();
      return this.success(data);
    } else { // 获取单条文章下的评论列表
      const list = await comment.where({post_id: postId}).select();
      return this.success(list);
    }
  }
}
```

### 多版本 RESTful API

有些 REST API 有时候前后不能完全兼容，需要有多个版本，这时候也可以通过自定义路由管理，如：

```js
module.exports = [
  [/\/v1\/user(?:\/(\d+))?/, 'v1/user?id=:1', 'rest'], //v1 版本
  [/\/v2\/user(?:\/(\d+))?/, 'v2/user?id=:1', 'rest']  //v2 版本
]
```

这时候只要在 `src/controller/` 下建立子目录 `v1/` 和 `v2/` 即可，执行时会自动查找，具体见 [多级控制器](/doc/3.0/controller.html#toc-04e)。

### Mongo 的 RESTful API

由于 Mongo 的 id 并不是纯数字的，所以处理 Mongo 的 RESTful API 时只需要修改下对应的正则即可（将 \d 改为 \w）：

```js
module.exports = [
  [/\/user(?:\/(\w+))?/, 'user?id=:1', 'rest'] 
]
```

### 常见问题

#### 怎么查看 RESTful API 的自定义路由已经生效？

有时候添加 RESTful Controller 和自定义路由后，访问并没有生效，这时候可以通过 `DEBUG=think-router npm start` 启动服务查看解析后的 controller 和 action 看其是否生效，具体请见[怎么查看当前地址解析后的 controller 和 action 分别对应什么？](/doc/3.0/router.html#toc-54f)