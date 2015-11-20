## Online Deploy

### Use pm2 to Manage Service

pm2 is a module to professionally manage Node.js service, it is highly recommanded to use it online. It needs to be installed globally. eg. `sudo npm install -g pm2`. After installation is complete, there will be pm2 commands in command line.

When creating project, the config file `pm2.json` will be created in the project directory. And it's content is roughly as follows.

```js
{
  "apps": [{
    "name": "demo",
    "script": "www/production.js",
    "cwd": "/Users/welefen/Develop/git/thinkjs/demo",
    "max_memory_restart": "1G",
    "autorestart": true,
    "node_args": [],
    "args": [],
    "env": {
      
    }
  }]
}
```

Modify the `cwd` config value into the pratical project path, then use the following command to start/restart the service in the project directory.


```sh
pm2 startOrGracefulReload pm2.json
```

See <http://pm2.keymetrics.io/docs/usage/application-declaration/> for the detailed config of pm2.

### Use Nginx as a Reverse Proxy

It will create a nginx config file named `nginx.conf` in the project directory when creating project, which content is roughly as follows.

```nginx
server {
    listen 80;
    server_name localhost;
    root /Users/welefen/Develop/git/thinkjs/demo/www;
    set $node_port 8360;

    index index.js index.html index.htm;
    if ( -f $request_filename/index.html ){
        rewrite (.*) $1/index.html break;
    }
    if ( !-f $request_filename ){
        rewrite (.*) /index.js;
    }
    location = /index.js {
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://127.0.0.1:$node_port$request_uri;
        proxy_redirect off;
    }
    location = /production.js {
        deny all;
    }

    location = /testing.js {
        deny all;
    }
    location ~ /static/ {
        etag         on;
        expires      max;
    }
}   

```

Modify the localhost in `server_name localhost` into the corresponding domain name. Modify the 8360 in `set $node_port 8360` into as the same as the listening one in the project.

After the modification is complete, copy the cofing file to the config file directory of nginx, then reload the config by the command `nginx -s reload`. So you can access by the domain name.

It is recommended to open the config `proxy_on` online, so that you can forbid to access directly by IP + port. Modify the config file `src/common/config/env/production.js`, eg.

```js
export default {
  proxy_on: true
}
```

### The Config of Closing the Static Resource Process

In order to develop conveniently, ThinkJS supports to process the static resource request. But when code is deployed online, it uses nginx to process the static resource request. By this time, you can close the function of process static resource request to improve performance.

Add the following configuration in the config file `src/common/config/env/production.js`.

```js
export default {
  resource_on: false
}
```

### Use Cluster

Online enable cluster function to make the good use of advantage of multicore CPU to improve performance and concurrent processing capability. 

Add the following configuration in the config file `src/common/config/env/production.js`.

```js
export default {
  cluster_on: true
}
```
