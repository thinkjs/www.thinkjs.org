## 断点调试

使用 ES2015+ 特性来开发 Node.js 项目可以带来巨大的便利，但同时由于有些特性现在还不支持，需要借助 Babel 编译，运行的代码实际上是编译后的代码，这样给调试带来很大的麻烦。

ThinkJS 从 2.2.0 版本开始支持断点调试源代码，同时如果运行时出现报错，错误也是定位到源代码下。

### 使用 node-inspector 断点调试

#### 安装 node-inspector 

可以通过 `npm install -g node-inspector` 来全局安装 node-inspector，如果是在 *unix 系统下，需要在命令前面添加 sudo 执行。

#### 启动 node-inspector 服务

通过命令 `node-inspector &` 来启动 node-inspector 服务。

#### 启动 Node.js 服务

使用 `node --debug www/production.js` 来启动 Node.js 服务。

这里跟之前启动服务有些区别，由于启动时需要添加 `--debug` 参数，所以不能用 `npm start` 来执行启动了。

#### 调试

访问 `http://127.0.0.1:8080/debug?port=5858`，会出现调试页面。

然后在 app 目录下找到对应的编译后的文件，在对应的地方加上断点（这里一定要是在 app/ 目录，不能是源代码 src/ 目录），如：

![alt](https://p.ssl.qhimg.com/t019ee960e6a633a04b.jpg)

然后新建标签页，访问对应的接口。这时候页面会一直卡在那里。这时候返回 node-inspector 的标签页，会看到内容已经跳到 ES2015+ 的代码，如：

![alt](https://p.ssl.qhimg.com/t015af76cc11b961734.png)

然后就可以利用后侧的断点工具进行调试了。

![alt](https://p.ssl.qhimg.com/t015067fdaf2d60cc7f.jpg)


### 在 VS Code（v1.7+） 下断点调试

#### 打开项目

通过 VS Code 菜单 File -> Open 来打开 ThinkJS 2015+ 项目，如：

![alt](https://p.ssl.qhimg.com/t017fd8ef05b70d922a.png)

#### 设置调试配置

点击左侧的调试菜单，点击上面的调试按钮，会调试选择的环境，选择 Node.js。如：

![alt](https://p.ssl.qhimg.com/t01b533ee06c25af9b1.jpg)

选择 Node.js 后，会生成一个 `launch.json` 文件。~~修改里面的配置，将 `sourceMaps` 值改为 `true`（注意：有 2 个 sourceMaps key，都修改）。~~
编辑配置为

```
{
	// Use IntelliSense to learn about possible Node.js debug attributes.
	// Hover to view descriptions of existing attributes.
	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
	"version": "0.2.0",
	"configurations": [
		{
			"type": "node",
			"request": "launch",
			"name": "启动程序",
			"program": "${workspaceRoot}\\www\\development.js",
			"cwd": "${workspaceRoot}",
			"sourceMaps": true,
			"outFiles": [
				"${workspaceRoot}/app/**"
			]
		},
		{
			"type": "node",
			"request": "attach",
			"name": "附加到进程",
			"port": 5858
		}
	]
}
```

即：修改program配置，添加sourceMaps和outFiles配置。

#### 启动服务

点击上面的调试按钮来启动服务。如果已经在命令行启动了 Node.js 服务，需要关掉，否则会因为端口被占用导致错误。

![alt](https://p.ssl.qhimg.com/t01e177d7042059bc7b.png)

#### 开始调试

回到代码模式，~~在 app/ 目录下的文件里加上断点（一定要是在 app/ 目录下的文件，不能是 src/ 下的文件）。~~
在源码中直接添加断点即可调试。

访问对应的页面，就可以看到代码显示的已经是源代码了，然后利用顶部的调试按钮就可以调试了。如：

![alt](https://p.ssl.qhimg.com/t010995e8e9cbf24905.png)

这样就可以很好的在 VS Code 下调试 ES2015+ 代码了。

### 在 WebStorm 下断点调试

#### 配置 WebStorm

将新建的 ThinkJS 2015+ 项目导入到 WebStorm 中，然后在首选项的 JavaScript 版本设置为 ECMASCRIPT 6。如：

![alt](https://p.ssl.qhimg.com/t010eeba6c72bdffcf6.png)

点击右上角的 `Edit Configurations`，然后新建个项目，项目类型选择 Node.js。如：

![alt](https://p.ssl.qhimg.com/t0133dd6b9d143b0d68.png)

在右侧配置项 `JavaScript File` 里填入 `www/development.js`，或者通过右侧的按钮选择也可以。如：

![alt](https://p.ssl.qhimg.com/t017a1399e0d1601d69.png)

#### 调试

点击右上角的调试按钮，会启动 Node.js 服务。如：

![alt](https://p.ssl.qhimg.com/t01bb28b27d8b2d9982.png)

![alt](https://p.ssl.qhimg.com/t01c2cec13f9cbf077f.png)

如果之前已经在命令行下启动了服务，需要关掉，否则会出现端口被占用导致报错的情况。

在 app/ 目录下的文件设置断点（一定要在 app/ 目录下，不能是 src/ 目录下），如：

![alt](https://p.ssl.qhimg.com/t019734342202f8b0bc.png)

打开浏览器，访问对应的接口。返回 WebStorm，点击调试按钮就可以进行调试了，并且看到的是源代码。

![alt](https://p.ssl.qhimg.com/t019dcbd7ce2c7c15a4.png)
