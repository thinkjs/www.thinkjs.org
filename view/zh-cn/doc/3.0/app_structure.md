## 项目结构

默认创建的项目结构如下：

```text
|--- development.js 
|--- nginx.conf
|--- package.json
|--- pm2.json
|--- production.js
|--- README.md
|--- src
| |--- bootstrap
| | |--- master.js
| | |--- worker.js
| |--- config
| | |--- adapter.js
| | |--- config.js
| | |--- config.production.js
| | |--- extend.js
| | |--- middleware.js
| | |--- router.js
| |--- controller
| | |--- base.js
| | |--- index.js
| |--- logic
| | |--- index.js
| |--- model
| | |--- index.js
|--- view
| |--- index_index.html
|--- www
| |--- static
| | |--- css
| | |--- img
| | |--- js
```

* `development.js` 和 `production.js` 分别为开发环境和生产环境的入口文件
* `nginx.conf` nginx 的配置文件，需要修改对应的配置项使用
* `pm2.json` pm2 的配置文件，需要修改对应的配置项使用
* `src/bootstrap/*.js` 项目启动自执行文件，根据对应的环境执行的对应的文件
* `src/config/adapter.js` adapter 的配置文件
* `src/config/config.js` 一些通用的配置文件
* `src/config/extend.js` Extend 的配置文件
* `src/config/middleware.js` Middleware 的配置文件
* `src/config/router.js` 自定义路由的配置文件
* `src/controller/*.js` controller 文件
* `src/logic/*.js` logic 文件
* `src/model/*.js` model 文件
* `view/*.html` 模板文件
* `www/static` 一些静态资源文件