## 定时任务

项目在线上运行时，经常要定时去执行某个功能，这时候就需要使用定时任务来处理了。ThinkJS 支持命令行方式调用，结合系统的 crontab 功能可以很好的支持定时任务。

### 命令行执行

ThinkJS 除了支持通过 URL 访问来执行外，还可以通过命令行的方式调用执行。使用方式如下：

```sh
node www/production.js home/index/index
```

上面的命令表示执行 `home` 模块下 `index` Controller 里的 indexAction。

##### 携带参数

如果需要加参数，只要在后面加上对应的参数即可：

```sh
node www/production.js home/index/index?name=thinkjs
```

Action 里就可以通过 `this.get` 方法来获取参数 `name` 了。

##### 修改请求方法

命令行执行默认的请求类型是 GET，如果想改为其他的类型，可以用下面的方法：

```sh
node www/production.js url=home/index/index&method=post
```

这样就把请求类型改为了 post。但这种方式下，参数 url 的值里就不能包含 & 字符了（可以通过 / 的方式指定参数，如`node www/production.js url=home/index/index/foo/bar&method=post`）。

除了修改请求类型，还可以修改下面的参数：

* `host` 修改请求的 host 默认为 127.0.0.1
* `ip` 修改请求的 ip 默认为 127.0.0.1

##### 修改 header

有时候如果想修改更多的 headers，可以传一个完整的 json 数据，如：

```sh
node www/production.js {"url":"/index/index","ip":"127.0.0.1","method":"POST","headers":{"xxx":"yyyy"}}
```

##### 禁止 URL 访问

默认情况下，命令行执行的 Action 通过 URL 也可以访问到。如果禁止 URL 访问到该 Action，可以通过 `this.isCli` 来判断。如：

```js
export default class extends think.controller.base {
  indexAction(){
    //禁止 URL 访问该 Action
    if(!this.isCli()){
      this.fail('only invoked in cli mode');
    }
    ...
  }
}
```

### 执行脚本

可以创建一个简单的执行脚本来调用命令行执行，如：

```sh
cd project_path; 
node www/production.js home/index/index;
```

在项目目录下创建目录 `crontab`，将上面执行脚本存为一个文件放在该目录下。

### 定时执行

借助系统里的 crontab 可以做到定时执行，通过命令 `crontab -e` 来编辑定时任务，如：

```sh
0 */1 * * * /bin/sh project_path/crontab/a.sh # 1 小时执行一次
```

### 使用 node-crontab 模块执行定时任务

除了使用 crontab 和命令行联合执行定时任务外，也可以使用 `node-crontab` 模块执行定时任务。如：

```js
import crontab from 'node-crontab';
// 1 小时执行一次
let jobId = crontab.scheduleJob('0 */1 * * *', () => {
  
});
```

将上面代码文件存放在 `src/common/bootstrap` 目录下，这样可以在服务启动时自动执行。

如果希望在开发环境下能立即看下执行的效果，可以用类似下面的方式：

```js
import crontab from 'node-crontab';

let fn = () => {
  //定时任务具体逻辑
  //调用一个 Action
  think.http('/home/image/spider', true); //模拟访问 /home/image/spier
}
// 1 小时执行一次
let jobId = crontab.scheduleJob('0 */1 * * *', fn);
//开发环境下立即执行一次看效果
if(think.env === 'development'){
  fn();
}
```
