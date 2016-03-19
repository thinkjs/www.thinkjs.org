## Crontab

Online projects often need to be timed to execute certain function. By this time, you can use crontab. ThinkJS supports command line calls, combined with the system's crontab function, let you perfectly achieve this type of task.


### Command Line Execution

Besides supporting URL access, ThinkJS also supports command line calls. The usage is as follows.

```sh
node www/production.js home/index/index
```

The above command means to execute indexAction of `index` Controller in `home` module.

##### Carry Params

If you need to add some params, just put the corresponding params at the end of the line:

```sh
node www/production.js home/index/index?name=thinkjs
```

In Action, you can use method `this.get` to get param `name`.

##### Modify Request Method

In command line executation, the default request type is GET. If you wand to modify it to use other type, you can do it this way:

```sh
node www/production.js url=home/index/index&method=post
```

Thus, the request type is changed to post. But in this way, the value of params in url can not includ "&" anymore (but you can use "/" to specify params, such as `node www/production.js url=home/index/index/foo/bar&method=post`).

Besides modifying request type, you can also modify the following params.

* `host` modify the request host, default is 127.0.0.1
* `ip` modify request ip, default is 127.0.0.1

##### Modify Header

Sometimes, if you want to modify more headers, you can pass a complete json. eg.

```sh
node www/production.js {"url":"/index/index","ip":"127.0.0.1","method":"POST","headers":{"xxx":"yyyy"}}
```

##### Forbid URL Access

By default, you can access Action that is executed in command line by URL. If forbid URL to access to the Action, you can use `think.cli` to judge. eg.

```js
export default class extends think.controller.base {
  indexAction(){
    // forbid URL access to the Action
    if(!think.cli){
      this.fail('only invoked in cli mode');
    }
    ...
  }
}
```

### Executable Script

You can create a simple executable script to call command line to execute. eg.

```sh
cd project_path; 
node www/production.js home/index/index;
```

This would create the directory `crontab` in the project, and put the above executable script as a file in this directory.

### Timed Execution

Using system crontab can do timed executaion. Use command `crontab -e` to edit crontab. eg.

```sh
0 */1 * * * /bin/sh project_path/crontab/a.sh # execute once per 1 hour
```

### Use node-crontab Module to Execute Crontab

Besides combining crontab with command line, you can also use `node-crontab` module to execute crontab. eg.

```js
import crontab from 'node-crontab';
// execute once per 1 hour
let jobId = crontab.scheduleJob('0 */1 * * *', () => {
  think.http('/home/image/spider', true); //visit /home/image/spier
});
```

Put the above code file in direcotry `src/common/bootstrap`, so it can be executed automatically when server startup.
