## Transaction

Model supports transaction operation provided the database you are using supports transaction too. 

`InnoDB` and `BDB` engine of `Mysql` support transaction, if you need to use transaction in Mysql, must set the engine to InnoDB or BDB.

`SQLite` supports transaction.

### Use Transaction

Model provides `startTrans`, `commit` and `rollback` to operate transaction.

- `startTrans` start a transaction
- `commit` is used for commit transaction after your operations
- `rollback` is used for roll back if operation has exception

#### ES6 Way

```js
export default class extends think.controller.base {
  async indexAction(){
    let model = this.model("user");
    try{
      await model.startTrans();
      let userId = await model.add({name: "xxx"});
      let insertId = await this.model("user_group").add({user_id: userId, group_id: 1000});
      await model.commit();
    }catch(e){
      await model.rollback();
    }
  }
}
```

#### Dynamic Class Creation Way

```js
module.exports = think.controller({
  indexAction: function(self){
    var model = this.model("user");
    return model.startTrans().then(function(){
      return model.add({name: "xxx"});
    }).then(function(userId){
      return self.model("user_group").add({user_id: userId, group_id: 1000})
    }).then(function(){
      return self.commit();
    }).catch(function(err){
      return self.rollback();
    });
  }
})
```

### Transaction method

`startTrans`, `commit` and `rollback` need to be used when you use transaction. In order to simple this operation, model provides `transaction` method.

#### ES6 Way

```js
export default class extends think.controller.base {
  async indexAction(self){
    let model = this.model("user");
    let insertId = await model.transaction( function * (){
      let userId = await model.add({name: "xxx"});
      return await self.model("user_group").add({user_id: userId, group_id: 1000});
    })
  }
}
```

Note: Arrow function cannot used with `*/yield`, so we use `function *`. If you want to use arrow function, you can use async, like `async () => {}`.

#### Dynamic Class Creation Way

```js
module.exports = think.controller({
  indexAction: function(self){
    var model = this.model("user");
    return model.transaction(function(){
      return model.add({name: "xxx"}).then(function(userId){
        return self.model("user_group").add({user_id: userId, group_id: 1000});
      });
    }).then(function(insertId){

    }).catch(function(err){

    })
  }
})
```

Transaction accepts a callback function which contains real operation logic and need to return.

This doc stays at [https://github.com/75team/www.thinkjs.org/tree/master/view/zh-cn/doc/2.0/model_transaction.md](https://github.com/75team/www.thinkjs.org/tree/master/view/zh-cn/doc/2.0/model_transaction.md).