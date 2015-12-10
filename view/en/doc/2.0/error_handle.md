## Error Handling

The application will encounter all kinds of errors when handling user requests. Such as system internal error, url not exist, permission denied, service unavailable and so on. In these cases, it needs to show the corresponding error page for users.

### Error Page

When using the command `thinkjs` to create project, it will automatically add the error handle logic file and the corresponding error page.

The error logic file is located in `src/common/controller/error.js`, and its content is roughly as follows.

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

The path of the corresponding error template page is `view/common/error_{Number}.html`.

### Error Type

System default supported error types are  `400`, `403`, `404`, `500` and `503`.

#### 400

Error request, like maliciously construct some illegal data access, url accessed is illegal and so on.

#### 403

The current access has no permission.

#### 404

The requested url is not found.

#### 500

System internal happended error, which leads to the current request is unavailable.
 
#### 503

Service is unavailable until it is recovered.

### Extend Error Type

You can extend error type in your project depending on the practical requirement. such as adding the specific `600` error, and you can do as the following steps.

##### 1. add _600Action

Add the following codes into `src/common/controller/error.js` file in the appropriate place.


```js
  _600Action(){
    return this.displayErrorPage(600);
  }
```

##### 2. Add Error Page

Add the file `view/common/error_600.html`, and write the corresponding error information into it.

##### 3. Show Error Page

After added the error, you need to call it correspondingly in order to show it for users. It can be achieved by `think.statusAction` method. eg.

```js
export default class extends think.controller.base {
  indexAction(){
    if(someError){
      return think.statusAction(600, this.http); //show 600 error, need to pass http object
    }
  }
}
```


### Modify Error Page Style

In order to modify the error page style, you just need to modify the corresponding template file. Eg. edit the template file `view/common/error_404.html` to modify `404` error page style.
