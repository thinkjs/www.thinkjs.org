## Restful

ThinkJS 可以非常方便的支持 Restful 类的接口，假如现在有个名为 `article` 的 Resource 想提供 Restful 接口，可以通过下面的方式进行。

关于 Restful 的介绍可以见这里 <http://www.ruanyifeng.com/blog/2011/09/restful.html>

### 配置路由

Restful 类的接口需要借助自定义路由来使用，可以在路由配置文件中 `Conf/route.js` 配置如下的规则：

```
module.exports = [
  [/(article)(?:\/(\d*))?/, 'restful']
]
```

这个规则表示：

* 将 `/article` 和 `/article/10` 类的接口标记为 Restful 接口
* 需要对资源 `article` 和 `id` 使用正则分组功能，方便后续能够取到对应的值

### 建立对应的资源数据表

在数据库中添加对应的资源数据表 `think_article`，其中 `think_` 为数据表前缀，需要改为实际项目中的数据表前缀。

添加相关的字段和添加数据。

### 访问 Restful 接口

有对应的资源数据表后，无需添加任何的 Controller 文件，即可通过下面的地址访问：

* `GET /article` 获取所有的 article 列表
* `GET /article/10` 获取 id 为 10 的 article 详细信息
* `POST /article` 添加一个 article
* `PUT /article/10` 更新 id 为 10 的 article 数据
* `DELETE /article/10` 删除 id 为 10 的 article 数据

### 定制 Restful 接口

上面的方式虽然无需写任何 Controller 文件即可访问 `article` 资源，但有时候我们希望加一些限制，如：有些字段不输出，权限控制等功能，那么可以通过自定义 Controller 来进行。

#### Controller 文件

创建 `App/Lib/Controller/Restful/ArticleController.js` 文件，并使用如下的内容：

```
module.exports = Controller('RestController', {})
```

* Restful 默认的分组是 `Restful`，可以通过配置 `C('restful_group')` 来修改
* Restful 类的 Controller 需要继承自 `RestController`

#### 限制部分字段

如果有些字段不想输出，那么可以通过下面的方式来隐藏：

```
module.exports = Controller('RestController', {
  __before: function(){
    this.model.field('content', true);
  }
})
```

这里表示不输出 `content` 字段。

实际上这里的 `this.model` 即为 `D('article')`，这样不仅可以限制字段，也可以限制条数，还可以分页。

#### 权限控制

如果需要进行权限校验，那么也可以在 `__before` 里进行，如：

```
module.exports = Controller('RestController', {
  __before: function(){
      if(!this.hasPermission()){
        return this.error('no permission');
      }
    }
})
```

#### 接口对应

请求类型 `GET`, `POST`, `PUT`, `DELETE` 对应的 Action 为 `getAction`, `postAction`, `putAction`, `deleteAction`。如果还需要进行更强的定制，可以重写这几个方法。 

如 `getAction` 的实现为：

```js
getAction: function(){
  var self = this;
  if (this.id) {
    return getPromise(this.model.getPk()).then(function(pk){
      return self.model.where(getObject(pk, self.id)).find();
    }).then(function(data){
      return self.success(data);
    }).catch(function(err){
      return self.error(err.message);
    })
  }
  return this.model.select().then(function(data){
    return self.success(data);
  }).catch(function(err){
    return self.error(err.message);
  });
},
```