## Online Deploy

### Use pm2 to Manage Services

pm2 is a Node.js module used for professionally manage Node.js services, it is highly recommanded to use it online. It needs to be installed globally. eg. `sudo npm install -g pm2`. After installation, the pm2 commands will be available in command line.

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

Modify the `cwd` config value into the real project path, then use the following command to start/restart the service in the project directory.


```sh
pm2 startOrGracefulReload pm2.json
```

See <http://pm2.keymetrics.io/docs/usage/application-declaration/> for the detailed config of pm2.

### Use Nginx As a Reverse Proxy

A nginx config file named `nginx.conf` in the project directory will be created when creating project, which content is roughly as follows.

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

Modify the localhost in `server_name localhost` into the corresponding domain name. Modify the 8360 in `set $node_port 8360` into the one your are using.

After the modification is complete, copy the config file to the config file directory of nginx, then reload the config by the command `nginx -s reload`. So you can access the application through the domain name.

It is recommended to open the config `proxy_on` online, so that you can forbid to access directly by IP + port. Modify the config file `src/common/config/env/production.js`, eg.

```js
export default {
  proxy_on: true
}
```

### The Config of Closing the Static Resource Process

To facilitate the development, ThinkJS supports to process the static resource request. But when code is deployed online, it uses nginx to process the static resource request. By this time, you can close the function of process static resource request to improve performance.

Add the following configuration in the config file `src/common/config/env/production.js`.

```js
export default {
  resource_on: false
}
```

### Use Cluster

Enable cluster function online could make the good use of multicore CPU to improve the performance and concurrent processing capability. 

You can add the following configuration in the config file `src/common/config/env/production.js`.

```js
export default {
  cluster_on: true
}
```
