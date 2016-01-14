## Service

Some projects need to call some third-party services like Github related interfaces. If codes in the controller directly call these interfaces, on the one hand it will lead to code complexity, on the other hand it could not do more code reuse.

For these cases, you can encapsulate some services for controllers to call.

### Create Services

Use the command `thinkjs service [name]` to create service. See [Extend functions -> ThinkJS Command -> Add Service](./thinkjs_command.html#add-service) for more detailed usage.

The default generated service is a class. But some services only need to provide some static methods, at that time you could just change class to object.

### Load Services

Use `think.service` to load services. eg.

```js
export default class extends think.controller.base {
  indexAction(){
    let GithubService = think.service('github');
    let instance = new GithubService();
  }
}
```

If you want to load service across-modules, use the following approaches.

```js
export default class extends think.controller.base {
  indexAction(){
    let GithubService = think.service('github', 'admin'); //load github service in admin
    let instance = new GithubService();
  }
}
```

`Node`: If the project is not very complex, it's suggested that put service in the module `common`. Thus, they are both convenient to load.
