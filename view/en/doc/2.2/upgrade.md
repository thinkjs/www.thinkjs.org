## 升级指南

本文档为 2.1 到 2.2 的升级指南，2.0 到 2.1 升级指南请见[这里](/doc/2.1/upgrade.html)。 

2.2 版本兼容 2.1 版本，只是添加了很多功能和微调了一些东西，具体的修改列表请见 [ChangeLog](/changelog.html)。


### 升级依赖的 ThinkJS 版本

将 `package.json` 里依赖的 ThinkJS 版本修改为 `2.2.x`，然后重新安装。


### 添加新的依赖

在项目目录下执行 `npm install source-map-support --save` 安装依赖。

如果是 TypeScript 项目，还需要安装 `npm install source-map --save`。

### 修改编译脚本

如果是 ES2015+ 项目（不包括 TypeScript 项目），修改 `package.json` 里的 `compile` 命令，将值改为：

```
babel --presets es2015-loose,stage-1 --plugins transform-runtime src/ --out-dir app/ --source-maps
```

### 删除 app/ 目录

删除项目下的 `app/` 目录，然后执行 `npm start` 重新启动项目。

