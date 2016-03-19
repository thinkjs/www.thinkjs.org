## 模块

ThinkJS 创建项目时支持多种项目模式，默认创建的项目是按模块来划分的，并且自动添加了 `common` 和 `home` 2 个模块。每个模块有独立的配置、控制器、视图、模型等文件。

使用模块的方式划分项目，可以让项目结构更加清晰。如：一般一个博客系统可分为前后台 2 个模块。

### 模块列表

进去 `src/` 目录就可以看到模块列表：

```text
drwxr-xr-x   5 welefen  staff  170 Aug 18 15:55 common/
drwxr-xr-x   6 welefen  staff  204 Sep  8 19:14 home/
```

### common 模块

common 模块是个通用模块，该模块下存放一些通用的功能，如： 通用的配置，runtime 目录，启动文件，错误处理控制器等。

`注`：该模块下的控制器不能响应用户的请求。

### 默认模块

默认模块为 `home` 模块。当解析用户的请求找不到模块时会自动对应到 `home` 下。

可以通过配置 `default_module` 来修改默认模块，修改配置文件 `src/common/config/config.js`：

```js
//将默认模块名改为 blog
export default {
    default_module: 'blog'
}
```

### 添加模块

添加模块直接通过 `thinkjs` 命令即可完成。

在当前项目目录下，执行 `thinkjs module xxx`，即可创建名为 `xxx` 的模块。

如果模块名已经存在，则无法创建。

### 禁用模块

ThinkJS 默认会自动查找和识别项目下的模块，并认为所有的模块都是可用的。

如果想禁用部分模块，可以修改配置文件 `src/common/config/config.js`，添加下面的配置：

```js
export default {
    deny_module_list: ['xxx'] //禁用 xxx 模块
}
```
