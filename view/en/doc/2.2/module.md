## Module

ThinkJS supports a variety of programming modes when creating a project. By default, the new project is consist of modules, and has added the `common` and `home` modules automatically. Each module has itself a separate configuration, controller, view, model and other documents.

Modularization programming makes project structure much clearer. Such as a typical blog system can be divided into front and back modules in general.

### Module List

Goes into `src/` directory, you can see a list of modules:

```text
drwxr-xr-x   5 welefen  staff  170 Aug 18 15:55 common/
drwxr-xr-x   6 welefen  staff  204 Sep  8 19:14 home/
```

### Common Module

`common` module is a universal module that will be commonly used by other modules of the project, it stored some common features, such as general configuration, runtime directory, startup files, error handling controllers.

`NOTE`: The controllers under the module does not respond to the user's request.

### Default Module

Default module is the `home` module. Any requests that could not found corresponding module to process will be handed over to this module to process, so it is a catch all module. 

If you want to modify the default module, open `src/common/config/config.js`, and modify the value of `default_module`：

```js
//The default module's name is changed to blog
export default {
    default_module: 'blog'
}
```

### Add Module

Add new module can be done by using `thinkjs` command.

In current project directory, execute `thinkjs module xxx`, you can create a module named `xxx`.

If the module's name already exists, you can not create it.

### Disable Module

ThinkJS will automatically find and identify modules under the project and assume that all modules are available.

If you want to disable some modules, you can modify the configuration file `src/common/config/config.js`, add the following configuration:

```js
export default {
    deny_module_list: ['xxx'] //Disable xxx module
}
```
