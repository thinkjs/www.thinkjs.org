## Breakpoint Debugging

It takes to you high speed by using ES2015+ in Node.js project. Because of some feature's lack, we need use Babel to compile our codes and run compiled code. It's terrible that debug will return code position in compiled file while I really want to know code position in source file.

The good news is that ThinkJS has been support breakpoint debug source code after 2.2.0 version. That means ThinkJS will tell you the exactly code position in source file when you have error.

### Breakpoint debugging with `node-inspector`

#### Install node-inspector

You can global install node-inspector by typing command `npm install -g node-inspector`. Sometimes you should use `sudo` in *unix system.

#### Start node-inspector service

Start node-inspector service by using `node-inspector &`.

#### Start Node.js service

Start Node.js service by using `node --debug www/production.js`.

What difference is `--debug` parameter than before. `npm start` command has no this parameter so we can't use it.

#### Debug

Visit `http://127.0.0.1:8080/debug?port=5858`, it will display debugging page.

Then find compiled file in `app` folder, insert breakpoint in position you want. It's important that insert in `app` folder not in `src` source folder.

![alt](https://p.ssl.qhimg.com/t019ee960e6a633a04b.jpg)

Open new tab and visit url you want debug. At this time page will be blocked, and come back to node-inspector page, you will see debug position has skiped to source file.

![alt](https://p.ssl.qhimg.com/t015af76cc11b961734.png)

Then you can use this tools to debug.

![alt](https://p.ssl.qhimg.com/t015067fdaf2d60cc7f.jpg)

### Breakpoint debugging in VS Code

#### Open Project
 
click menu `File - Open` to open ThinkJS project, like:

![alt](https://p.ssl.qhimg.com/t017fd8ef05b70d922a.png)

#### Setting debug

Click debug menu on the left and debug button on menu. It will make you choose environment, and we choose Node.js.

![alt](https://p.ssl.qhimg.com/t01b533ee06c25af9b1.jpg)

After that, `launch.json` will be created in project. Modify all `sourceMaps` value to `true` in this file.

![alt](https://p.ssl.qhimg.com/t01b68e5ed5191fea16.png)

#### Start service

Click debug button to start service. If you have boot Node.js service, you need close it to avoid error of port using.

![alt](https://p.ssl.qhimg.com/t01e177d7042059bc7b.png)

#### Start debug

Back to code view and insert breakpoint in `app` folder. It's important that insert in `app` folder not in `src` source folder.

![alt](https://p.ssl.qhimg.com/t01b4570fc8fa392118.png)

Visit url you want debug, and we can use debug button to debug on the top.

![alt](https://p.ssl.qhimg.com/t010995e8e9cbf24905.png)

That's all for debuging ES2015+ in VS Code.

### Breakpoint debuging in WebStorm

#### Cofigure WebStorm

Import ThinkJS project into WebStorm and modify JavaScript version to ECMASCRIPT 6 in preference. 

![alt](https://p.ssl.qhimg.com/t010eeba6c72bdffcf6.png)

Click `Edit Configurations` and then create a new project and set project type to Node.js.

![alt](https://p.ssl.qhimg.com/t0133dd6b9d143b0d68.png)

Insert `www/development.js` into `JavaScript File` on the right, or choose right file by using button.

![alt](https://p.ssl.qhimg.com/t017a1399e0d1601d69.png)

#### Debug

Click debug button will open Node.js service. 

![alt](https://p.ssl.qhimg.com/t01bb28b27d8b2d9982.png)

![alt](https://p.ssl.qhimg.com/t01c2cec13f9cbf077f.png)

If you have boot Node.js service, you need close it to avoid error of port using.

Insert breakpoint in `app` folder. It's important that insert in `app` folder not in `src` source folder.

![alt](https://p.ssl.qhimg.com/t019734342202f8b0bc.png)

Open browser and visit url you want debug. Back to WebStorm and click debug button to start debug in source code.

![alt](https://p.ssl.qhimg.com/t019dcbd7ce2c7c15a4.png)
