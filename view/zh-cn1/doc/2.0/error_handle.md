## 错误处理

系统在处理用户请求时，会遇到各种各样的错误情况。如：系统内部错误，url 不存在，没有权限，服务不可用等，这些情况下需要给用户显示对应的错误页面。

### 错误页面

通过 `thinkjs` 命令创建项目时，会自动添加错误处理的逻辑文件以及相应的错误页面。

错误逻辑文件路径为 `src/common/controller/error.js`，该文件内容大致如下：

```js
'use strict';
/**
 * error controller
 */
export default class extends think.controller.base {
  /**
   * display error page
   * @param  {Number} status []
   * @return {Promise}        []
   */
  displayErrorPage(status){
    let module = 'common';
    if(think.mode !== think.mode_module){
      module = this.config('default_module');
    }
    let file = `${module}/error/${status}.html`;
    let options = this.config('tpl');
    options = think.extend({}, options, {type: 'ejs'});
    return this.display(file, options);
  }
  /**
   * Bad Request 
   * @return {Promise} []
   */
  _400Action(){
    return this.displayErrorPage(400);
  }
  /**
   * Forbidden 
   * @return {Promise} []
   */
  _403Action(){
    return this.displayErrorPage(403);
  }
  /**
   * Not Found 
   * @return {Promise}      []
   */
  _404Action(){
    return this.displayErrorPage(404);
  }
  /**
   * Internal Server Error
   * @return {Promise}      []
   */
  _500Action(){
    return this.displayErrorPage(500);
  }
  /**
   * Service Unavailable
   * @return {Promise}      []
   */
  _503Action(){
    return this.displayErrorPage(503);
  }
}
```

对应的模版文件路径为 `view/common/error_{Number}.html`。

### 错误类型

系统默认支持的错误类型有 `400`，`403`，`404`，`500` 和 `503`。

#### 400

错误的请求，如：恶意构造一些非法的数据访问、访问的 url 不合法等。

#### 403

当前访问没有权限。

#### 404

访问的 url 不存在。

#### 500

系统内部出现错误，导致当前请求不可用。

#### 503

服务不可用，需要等到恢复后才能访问。

### 扩展错误类型

项目里可以根据需要扩展错误类型，假如添加一个项目特有的错误 `600`，那么可以通过下面步骤进行：

##### 1、添加 _600Action

在 `src/common/controller/error.js` 文件中，合适的位置添加如下的代码：

```js
  _600Action(){
    return this.displayErrorPage(600);
  }
```

##### 2、添加错误页面

添加文件 `view/common/error_600.html`，并在文件里添加显示的错误内容。

##### 3、显示错误页面

添加完错误后，需要在对应地方调用显示错误才能让用户看到，可以通过 `think.statusAction` 方法实现。如：

```js
export default class extends think.controller.base {
  indexAction(){
    if(someError){
      return think.statusAction(600, this.http); //显示 600 错误，需要将 http 对象传递进去
    }
  }
}
```


### 修改错误页面样式

修改错误页面样式，只需要修改对应的模版文件即可，如：修改 `404` 错误则修改模版文件 `view/common/error_404.html`。

