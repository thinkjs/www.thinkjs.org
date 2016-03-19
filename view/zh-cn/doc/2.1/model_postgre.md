## PostgreSQL

ThinkJS 支持 `PostgreSQL`，底层使用 [pg](https://www.npmjs.com/package/pg) 模块。

### 配置

使用 PostgreSQL，需要将模型中的配置 `type` 改为 `postgresql`，修改配置文件 `src/common/config/db.js`：

```js
export default {
  type: 'postgresql',
  adapter: {
    postgresql: {
        
    }
  }
}
```

### CRUD 操作

CRUD 操作和 Mysql 相同，具体请见 [模型 -> 介绍](./model_intro.html#toc-d84)。
