## 事务

模型中提供了对事务操作的支持，但前提需要数据库支持事务。

`Mysql` 中的 `InnoDB` 和 `BDB` 存储引擎支持事务，如果在 Mysql 下使用事务的话，需要将数据库的存储引擎设置为 InnoDB 或 BDB。

`SQLite` 直接支持事务。


### 使用事务

模型中提供了 `startTrans`，`commit` 和 `rollback` 3 种方法来操作事务。

* `startTrans` 开启事务
* `commit` 正常操作后，提交事务
* `rollback` 操作异常后进行回滚

##### ES6 方式

```js
export default class extends think.controller.base {
  * indexAction(){
    let model = this.model('user');
    try{
      yield model.startTrans();
      let userId = yield model.add({name: 'xxx'});
      let insertId = yield this.model('user_group').add({user_id: userId, group_id: 1000});
      yield model.commit();
    }catch(e){
      yield model.rollback();
    }
  }
}
```

##### 动态创建类的方式 ##### 

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

##### ES6 方式

```js
export default class extends think.controller.base {
  * indexAction(self){
    let model = this.model('user');
    let insertId = yield model.transaction( function * (){
      let userId = yield model.add({name: 'xxx'});
      return yield self.model('user_group').add({user_id: userId, group_id: 1000});
    })
  }
}
```

注：Arrows Function 无法和 Generator Function 一起写，所以上面为 `function *`。如果想使用 Arrows Function，可以使用 async，如： `async () => {}`。

##### 使用动态创建类的方式

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