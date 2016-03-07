## Create project

### Install Node.js

ThinkJS is a Node.js MVC framework, it requires Node.js before you run it. You can install Node.js by go to https://nodejs.org to download the lastest installation.

After installation, type `node -v` in your terminal. If it outputs version number, it installs success.

ThinkJS requires the version of Node.js `>=0.12.0`, if your version lower than it, you need update your Node.js, or you can't start the service. we recommend use Node.js `4.2.1`.

### Install ThinkJS

Install ThinkJS by following command:

```sh
npm install thinkjs@2 -g --verbose
```

After installation, run `thinkjs --version` or `thinkjs -V` to check version number.

Tips: If you have installed ThinkJS 1.x before, you need remove it by `npm uninstall -g thinkjs-cmd` first of all.

### Update ThinkJS

Update ThinkJS globally by run the following command:

```sh
npm install -g thinkjs@2
```

Update ThinkJS in you current project by run the following command:

```sh
npm install thinkjs@2
```

### User thinkjs command to create Project

After installation, you can create a new ThinkJS project by run the following command:

```sh
thinkjs new project_path; #project_path is the path you want store your project
```

If you want to use ES6 features in the development, you may want to create the ES6 mode project by use following command:

```sh
thinkjs new project_path --es; #project_path is the path you want store your project
```

If the output is like the following, that means you have created the project successfully:

```text
  create : demo/
  create : demo/package.json
  create : demo/.thinkjsrc
  create : demo/nginx.conf
  create : demo/README.md
  create : demo/www/
  create : demo/www/index.js
  create : demo/app
  create : demo/app/common/runtime
  create : demo/app/common/config
  create : demo/app/common/config/config.js
  create : demo/app/common/config/view.js
  create : demo/app/common/config/db.js
  ...
  create : demo/app/home/logic
  create : demo/app/home/logic/index.js
  create : demo/app/home/view
  create : demo/app/home/view/index_index.html

  enter path:
  $ cd demo/

  install dependencies:
  $ npm install

  run the app:
  $ npm start
```

For more details about creating project, go to [extension function -> ThinkJS command](./thinkjs_command.html).

### Install dependencies

After project creation, go to the project directory and run `npm install` to install dependencies.

```sh
npm install
```

### Compile Project

Since v2.0.6, ThinkJS has built-in the automatical compiling feature, so you don't need run `npm run watch-compile` for real time compile anymore. What you only need to do, is just start your service by run `npm start`.

### Start Project

Run `npm start`, if terminal returns output like following, it means the service run success.

```text
[2015-09-21 20:21:09] [THINK] Server running at http://127.0.0.1:8360/
[2015-09-21 20:21:09] [THINK] ThinkJS Version: 2.0.0
[2015-09-21 20:21:09] [THINK] Cluster Status: closed
[2015-09-21 20:21:09] [THINK] WebSocket Status: closed
[2015-09-21 20:21:09] [THINK] File Auto Reload: true
[2015-09-21 20:21:09] [THINK] App Enviroment: development
```

### Access Project

Open your browser and go to `http://127.0.0.1:8360`. If you are in a remote machine, you must replace `127.0.0.1` with your remote machine's IP.
