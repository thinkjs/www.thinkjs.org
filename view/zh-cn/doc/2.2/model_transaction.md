## 事务

模型中提供了对事务操作的支持，但前提需要数据库支持事务。

`Mysql` 中的 `InnoDB` 和 `BDB` 存储引擎支持事务，如果在 Mysql 下使用事务的话，需要将数据库的存储引擎设置为 InnoDB 或 BDB。

`SQLite` 直接支持事务。


### 使用事务

模型中提供了 `startTrans`，`commit` 和 `rollback` 3 种方法来操作事务。

* `startTrans` 开启事务
* `commit` 正常操作后，提交事务
* `rollback` 操作异常后进行回滚

#### ES6 方式

```js
export default class extends think.controller.base {
  async indexAction(){
    let model = this.model('user');
    try{
      await model.startTrans();
      let userId = await model.add({name: 'xxx'});
      let insertId = await this.model('user_group').add({user_id: userId, group_id: 1000});
      await model.commit();
    }catch(e){
      await model.rollback();
    }
  }
}
```

#### 动态创建类的方式 ##### 

```js
module.exports = think.controller({
  indexAction: function(self){
    var model = this.model('user');
    return model.startTrans().then(function(){
      return model.add({name: 'xxx'});
    }).then(function(userId){
      return self.model('user_group').add({user_id: userId, group_id: 1000})
    }).then(function(){
      return self.commit();
    }).catch(function(err){
      return self.rollback();
    });
  }
})
```

### transaction 方法

使用事务时，要一直使用 `startTrans`，`commit` 和 `rollback` 这 3 个方法进行操作，使用起来有一些不便。为了简化这一操作，模型中提供了 `transaction` 方法来更加方便的处理事务。

#### ES6 方式

```js
export default class extends think.controller.base {
  async indexAction(self){
    let model = this.model('user');
    let insertId = await model.transaction( function * (){
      let userId = await model.add({name: 'xxx'});
      return await self.model('user_group').add({user_id: userId, group_id: 1000});
    })
  }
}
```

注：Arrow Function 无法和 `*/yield` 一起写，所以上面为 `function *`。如果想使用 Arrow Function，可以使用 async，如： `async () => {}`。

#### 使用动态创建类的方式

```js
module.exports = think.controller({
  indexAction: function(self){
    var model = this.model('user');
    return model.transaction(function(){
      return model.add({name: 'xxx'}).then(function(userId){
        return self.model('user_group').add({user_id: userId, group_id: 1000});
      });
    }).then(function(insertId){
      
    }).catch(function(err){
      
    })
  }
})
```

-------
transaction 接收一个回调函数，这个回调函数中处理真正的逻辑，并需要返回。

### 操作多个模型

如果同一个事务下要操作多个数据表数据，那么要复用同一个数据库连接（开启事务后，每次事务操作会开启一个独立的数据库连接）。可以通过 `db` 方法进行数据库连接复用。

```js
indexAction(){
  let model = this.model('user');
  await model.transaction(async () => {
    //通过 db 方法将 user 模型的数据库连接传递给 article 模型
    let model2 = this.model('article').db(model.db());
    // do something
  })
}
```
