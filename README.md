## 乐程QQ机器人

### 项目依赖

原项目为node-onebot:
>[https://github.com/takayama-lily/node-onebot](https://github.com/takayama-lily/node-onebot)

而node-onebot又基于oicq:
>[https://github.com/takayama-lily/oicq](https://github.com/takayama-lily/oicq)

二次扩展请结合oicq文档:
>[https://github.com/takayama-lily/oicq/blob/372d1db11cbb64d856f7cf1bce373be2d3a70053/index.d.ts](https://github.com/takayama-lily/oicq/blob/372d1db11cbb64d856f7cf1bce373be2d3a70053/index.d.ts)

### 使用说明
确保已经安装了NodeJS以及其包管理工具（npm）
此后执行下列命令安装依赖

```shell
 npm i  
```

核心代码在./lib/core.js中，是以事件注册（on(xxx,()=>{})）的形式来处理各种情况，语义化很强应该很容易理解，然后这里为了处理对话的逻辑，我专门写了一个message.js，具体内容自行查阅代码及相关注释

如果你已经清楚了相关配置，那么启动机器人只需要以下语句：

```shell
node main qq_number
# 后面是机器人的账号，当然你可以结合原项目文档自行配置
```



如果你觉得每次更新完都要手动重启太麻烦了，可以考虑使用nodemon：

```shell
npm i nodemon -g
# 全局安装nodemon；如果已经安装过了，就不用执行上述语句
nodemon main.js qq_number
# 使用nodemon main(非main.js) 命令可能会导致无限重启
# 热更新地启动机器人
```

