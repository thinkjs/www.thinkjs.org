## MongoDB

ThinkJS 支持使用 MongoDB 数据库，底层使用 [mongodb](https://www.npmjs.com/package/mongodb) 模块。

### 配置

使用 MongoDB 数据库，需要将模型中的配置 `type` 改为 `mongo`，修改配置文件 `src/common/config/db.js`：

```js
export default {
  type: 'mongo'
}
```

### 创建模型

可以通过命令 `thinkjs model [name] --mongo` 来创建模型，如：

```js
thinkjs model user --mongo
```

执行完成后，会创建文件 `src/common/model/user.js`。如果想创建在其他模块下，需要带上具体的模块名。如：

```js
thinkjs model home/user --mongo
```

会在 `home` 模块下创建模型文件，文件为 `src/home/model/user.js`。

### 模型继承

模型需要继承 `think.model.mongo` 类，如果当前类不是继承该类，需要手动修改。

#### ES6 语法

```js
export default class extends think.model.mongo {

}
```

#### 动态创建类的方式

```js
module.exports = think.model('mongo', {
  
})
```

### CURD 操作

CURD 操作和 Mysql 中接口相同，具体请见 [模型 -> 介绍](./model_intro.html#toc-d84)。

### 创建索引

### MapReduce