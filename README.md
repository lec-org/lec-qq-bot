## 乐程QQ机器人

### 项目依赖

原项目为node-onebot:
>[https://github.com/takayama-lily/node-onebot](https://github.com/takayama-lily/node-onebot)

而node-onebot又基于oicq:
>https://github.com/takayama-lily/oicq](https://github.com/takayama-lily/oicq)

二次扩展请结合oicq文档:
>[https://github.com/takayama-lily/oicq/blob/372d1db11cbb64d856f7cf1bce373be2d3a70053/index.d.ts](https://github.com/takayama-lily/oicq/blob/372d1db11cbb64d856f7cf1bce373be2d3a70053/index.d.ts)

### 使用说明
确保已经安装了NodeJS以及其包管理工具（npm）
此后执行下列命令安装依赖

```shell
 npm i  
```

核心代码在./lib/core.js中，是以事件注册（on(xxx,()=>{})）的形式来处理各种情况，语义化很强应该很容易理解，然后这里为了处理对话的逻辑，我专门写了一个message.js，具体内容自行查阅代码及相关注释

之后，如果要启动机器人的话，执行下面这条语句

```shell
node main 1770874035
# 后面那个是机器人的号，当然你可以通过阅读原项目文档自行配置其他机器人
```



如果你觉得每次都需要手动重启机器人来更新内容比较麻烦，那么可以考虑使用nodemon：

```shell
npm i nodemon -g
# 全局安装nodemon
nodemon main 1770874035
# nodemon运行的话会有热更新，每次ctrl+s都会自动更新内容不用手动重启
```

