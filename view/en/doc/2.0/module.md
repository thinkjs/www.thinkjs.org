## Module

ThinkJS could support a variety of program models when creating a project, the project which is created by default is divided by module, and add the `common` and `home` 2 modules automatically. Each module has a separate configuration, controller, view, model and other document.

Dividing project using modularized program makes project structure much clearer. Such as: a blog system can be divided into front and back modules in general .

### Module list

Go into `src/` directory, you can see a list of modules:

```text
drwxr-xr-x   5 welefen  staff  170 Aug 18 15:55 common/
drwxr-xr-x   6 welefen  staff  204 Sep  8 19:14 home/
```

### Common module

`Common` module is a common module, stored some common features in this module, such as: general configuration, runtime directory, startup files, error handling controllers.

`NOTE`: The controller under the module does not respond to the user's request.

### Default module

Default module is `home` module. It will automatically correspond to the `home` when parsing the user's request could not find the module. 

`Default_module` can be configured to modify the default module, modify the configuration file `src/common/config/config.js`：

```js
//The default module's name is changed to blog
export default {
    default_module: 'blog'
}
```

### Add module

Add module can be completed directly by `thinkjs` command.

In the current project directory, execute `thinkjs module xxx`, you can create a module named `xxx`.

If the module's name already exists, you can not create it.

### Disable module

ThinkJS will automatically find and identify module under the project and that all modules are available.

If you want to disable some module, you can modify the configuration file `src/common/config/config.js`, add the following configuration:

```js
export default {
    deny_module_list: ['xxx'] //Disable xxx module
}
```
