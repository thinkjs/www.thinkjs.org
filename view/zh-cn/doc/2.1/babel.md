## Babel

ThinkJS 2.1 中，将依赖的 Babel 版本从 5 升级到 6。由于 Babel 6 是个彻底重构的版本，完全插件化了，所以很多模块在不同的插件都会有依赖，这样会导致一些问题，如：

* 安装后的目录很大，并且首次运行很慢
* 目录层级过深，windows 可能会报错

推荐的解决方案为将 npm 升级到 3，可以通过下面的命令升级：

```sh
npm install -g npm@3
```

### 修改编译参数

Babel 6 默认的编译参数为：

```js
{
  presets: ['es2015-loose', 'stage-1'],
  plugins: ['transform-runtime']
}
```

如果编译参数不能满足你的需求的话，可以在入口文件 `www/development.js` 里进行修改：

```js
instance.compile({
  retainLines: true, 
  log: true,
  presets: [], //追加的 presets 列表
  plugins: [] //追加的 plugins 列表
});
```

后续上线前编译执行 `npm run compile` 实际上是调用 `package.json` 里对应的 `compile` 命令，所以若果有 `presets` 或者 `plugins` 修改的话，`compile` 命令也要对应改下。