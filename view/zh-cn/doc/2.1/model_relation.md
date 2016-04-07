## 关联模型

数据库中表经常会跟其他数据表有关联，数据操作时需要连同关联的表一起操作。如：一个博客文章会有分类、标签、评论，以及属于哪个用户。

ThinkJS 中支持关联模型，让处理这类操作非常简单。

### 支持的类型

关联模型中支持常见的 4 类关联关系。如：

* `think.model.HAS_ONE` 一对一模型
* `think.model.BELONG_TO` 一对一属于
* `think.model.HAS_MANY` 一对多
* `think.model.MANY_TO_MANY` 多对多

### 创建关联模型

可以通过命令 `thinkjs model [name] --relation` 来创建关联模型。如：

```sh
thinkjs model home/post --relation
```

会创建模型文件 `src/home/model/post.js`。

### 指定关联关系

可以通过 `relation` 属性来指定关联关系。如：

```js
export default class extends think.model.relation {
  init(...args){
    super.init(...args);
    //通过 relation 属性指定关联关系，可以指定多个关联关系
    this.relation = {
      cate: {},
      comment: {} 
    };
  }
}
```

也可以直接使用 ES7 里的语法直接定义 `relation` 属性。如：

```js
export default class extends think.model.relation {

  //直接定义 relation 属性
  relation = {
    cate: {},
    comment: {} 
  };

  init(...args){
    super.init(...args);
  }
}
```

#### 单个关系模型的数据格式

```js
export default class extends think.model.relation {
  init(...args){
    super.init(...args);
    this.relation = {
      cate: {
        type: think.model.MANY_TO_MANY, //relation type
        model: '', //model name
        name: 'profile', //data name
        key: 'id', 
        fKey: 'user_id', //forign key
        field: 'id,name',
        where: 'name=xx',
        order: '',
        limit: '',
        rModel: '',
        rfKey: ''
      },
    };
  }
}
```

各个字段含义如下：

* `type` 关联关系类型
* `model` 关联表的模型名，默认为配置的 key，这里为 `cate`
* `name` 对应的数据字段名，默认为配置的 key，这里为 `cate`
* `key` 当前模型的关联 key
* `fKey` 关联表与只对应的 key
* `field` 关联表查询时设置的 field，如果需要设置，必须包含 `fKey` 对应的值
* `where` 关联表查询时设置的 where 条件
* `order` 关联表查询时设置的 order
* `limit` 关联表查询时设置的 limit
* `page` 关联表查询时设置的 page
* `rModel` 多对多下，对应的关联关系模型名
* `rfKey` 多对多下，对应里的关系关系表对应的 key

如果只用设置关联类型，不用设置其他字段信息，可以通过下面简单的方式：

```js
export default class extends think.model.relation {
  init(...args){
    super.init(...args);
    this.relation = {
      cate: think.model.MANY_TO_MANY
    };
  }
}
```

#### HAS_ONE

一对一关联，表示当前表含有一个附属表。

假设当前表的模型名为 `user`，关联表的模型名为 `info`，那么配置中字段 `key` 的默认值为 `id`，字段 `fKey` 的默认值为 `user_id`。

```js
export default class extends think.model.relation {
  init(..args){
    super.init(...args);
    this.relation = {
      info: think.model.HAS_ONE
    };
  }
}
```

执行查询操作时，可以得到类似如下的数据：

```js
[
  {
    id: 1,
    name: '111',
    info: { //关联表里的数据信息
      user_id: 1,
      desc: 'info'
    }
  }, ...]
```

#### BELONG_TO

一对一关联，属于某个关联表，和 HAS_ONE 是相反的关系。

假设当前模型名为 `info`，关联表的模型名为 `user`，那么配置字段 `key` 的默认值为 `user_id`，配置字段 `fKey` 的默认值为 `id`。

```js
export default class extends think.model.relation {
  init(..args){
    super.init(...args);
    this.relation = {
      user: think.model.BELONG_TO
    };
  }
}
```

执行查询操作时，可以得到类似下面的数据：

```js
[
  {
    id: 1,
    user_id: 1,
    desc: 'info',
    user: {
      name: 'thinkjs'
    }
  }, ...
]
```

#### HAS_MANY

一对多的关系。

加入当前模型名为 `post`，关联表的模型名为 `comment`，那么配置字段 `key` 默认值为 `id`，配置字段 `fKey` 默认值为 `post_id`。

```js
'use strict';
/**
 * relation model
 */
export default class extends think.model.relation {
  init(...args){
    super.init(...args);

    this.relation = {
      comment: {
        type: think.model.HAS_MANY
      }
    };
  }
}
```

执行查询数据时，可以得到类似下面的数据：

```js
[{
  id: 1,
  title: 'first post',
  content: 'content',
  comment: [{
    id: 1,
    post_id: 1,
    name: 'welefen',
    content: 'first comment'
  }, ...]
}, ...]
```

如果关联表的数据需要分页查询，可以通过 `page` 参数进行，如：

```js
'use strict';
/**
 * relation model
 */
export default class extends think.model.relation {
  init(...args){
    super.init(...args);

    this.relation = {
      comment: {
        type: think.model.HAS_MANY
      }
    };
  }
  getList(page){
    return this.setRelation('comment', {page: page}).select();
  }
}
```

除了用 `setRelation` 来合并参数外，可以将参数设置为函数，合并参数时会自动执行该函数。

#### MANY_TO_MANY

多对多关系。

假设当前模型名为 `post`，关联模型名为 `cate`，那么需要一个对应的关联关系表。配置字段 `rModel` 默认值为 `post_cate`，配置字段 `rfKey` 默认值为 `cate_id`。

```js
'use strict';
/**
 * relation model
 */
export default class extends think.model.relation {
  init(...args){
    super.init(...args);

    this.relation = {
      cate: {
        type: think.model.MANY_TO_MANY,
        rModel: 'post_cate',
        rfKey: 'cate_id'
      }
    };
  }
}
```

查询出来的数据结构为：

```js
[{
  id: 1,
  title: 'first post',
  cate: [{
    id: 1,
    name: 'cate1',
    post_id: 1
  }, ...]
}, ...]
```

#### 关联死循环

如果 2 个关联表，一个设置对方为 HAS_ONE，另一个设置对方为 BELONG_TO，这样在查询关联表的数据时会将当前表又查询了一遍，并且会再次查询关联表，最终导致死循环。

可以在配置里设置 `relation` 字段关闭关联表的关联查询功能，从而避免死循环。如：

```js
export default class extends think.model.relation {
  init(..args){
    super.init(...args);
    this.relation = {
      user: {
        type: think.model.BELONG_TO,
        relation: false //关联表 user 查询时关闭关联查询
      }
    };
  }
}
```

也可以设置只关闭当前模型的关联关系，如：

```js
export default class extends think.model.relation {
  init(..args){
    super.init(...args);
    this.relation = {
      user: {
        type: think.model.BELONG_TO,
        relation: 'info' //关联表 user 查询时关闭对 info 模型的关联关系
      }
    };
  }
}
```

### 临时关闭关联关系

设置关联关系后，查询等操作都会自动查询关联表的数据。如果某些情况下不需要查询关联表的数据，可以通过 `setRelation` 方法临时关闭关联关系查询。

#### 全部关闭

通过 `setRelation(false)` 关闭所有的关联关系查询。

```js
export default class extends think.model.relation {
  init(...args){
    super.init(...args);
    this.relation = {
      comment: think.model.HAS_MANY,
      cate: think.model.MANY_TO_MANY
    };
  }
  getList(){
    return this.setRelation(false).select();
  }
}
```

#### 部分启用

通过 `setRelation('comment')` 只查询 `comment` 的关联数据，不查询其他的关联关系数据。

```js
export default class extends think.model.relation {
  init(...args){
    super.init(...args);
    this.relation = {
      comment: think.model.HAS_MANY,
      cate: think.model.MANY_TO_MANY
    };
  }
  getList2(){
    return this.setRelation('comment').select();
  }
}
```

#### 部分关闭

通过 `setRelation('comment', false)` 关闭 `comment` 的关联关系数据查询。

```js
export default class extends think.model.relation {
  init(...args){
    super.init(...args);
    this.relation = {
      comment: think.model.HAS_MANY,
      cate: think.model.MANY_TO_MANY
    };
  }
  getList2(){
    return this.setRelation('comment', false).select();
  }
}
```

#### 重新全部启用

通过 `setRelation(true)` 重新启用所有的关联关系数据查询。

```js
export default class extends think.model.relation {
  init(...args){
    super.init(...args);
    this.relation = {
      comment: think.model.HAS_MANY,
      cate: think.model.MANY_TO_MANY
    };
  }
  getList2(){
    return this.setRelation(true).select();
  }
}
```

### mongo 关联模型

该关联模型的操作不适合 mongo 模型，mongo 的关联模型请见 <https://docs.mongodb.org/manual/tutorial/model-embedded-one-to-one-relationships-between-documents/>。
