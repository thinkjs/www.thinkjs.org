## 错误信息

### EPERM

##### Operation Not Permitted

尝试执行某些需要特殊权限的操作。

### ENOENT

##### No Such File Or Directory

通常由文件系统操作引起，比如路径中某个组件指定的路径或文件并不存在。

### EACCES

#####  Permission Denied

拒绝访问。

### EEXIST

##### File Exists

要求目标不存在的操作遇到了目标存在的情况。

### ENOTDIR

#####  Not a Directory

给定的路径存在，但不是想要的文件夹。通常由`fs.readdir`引起。

### EISDIR

##### Is a Directory

操作的目标是文件，但给定的却是文件夹。

### EMFILE

##### Too Many Open Files In System

系统打开的文件数量已经达到上限，至少关闭一个才能打开请求的文件。

通常不允许过多文件同时打开的系统（如OS X）中出现，要提高限制，可以在运行Node.js进程的同一个sh中运行`ulimit -n 2048`。

### EPIPE

##### Broken Pipe

对管道、套按字或FIFO只有写而没有读。通常在`net`或`http`层出现，意味着正向其中写入数据的远程服务已关闭。

### EADDRINUSE

##### Address Already In Use

尝试把服务器绑定到一个本地地址，但该地址已经被占用。

### ECONNRESET

##### Connection Reset By Peer

连接被对端强制关闭。通常在远程套接字通信中由于对端超时或重启而丢失连接时导致。常见于`http`和`net`模块。

### ECONNREFUSED

##### Connection Refused

目标机器频繁拒绝导致无法建立连接。通常在尝试连接外部非活动主机时发生。

### ENOTEMPTY

##### Directory Not Empty

操作目标是空文件夹，但当前文件夹非空，常见于调用`fs.unlink`。


### ETIMEDOUT

##### Operation Timed Out

目标超过既定时间未响应造成连接或请求失败。通常在`http`或`net`中出现，一般表明连接的套接字没有适当`.end()`。










