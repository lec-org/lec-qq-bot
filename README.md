## 乐程QQ机器人

### 项目依赖
本项目基于node
原项目为node-onebot:<br>
>[https://github.com/takayama-lily/node-onebot](https://github.com/takayama-lily/node-onebot)
而node-onebot又基于oicq:<br>
> [https://github.com/takayama-lily/oicq](https://github.com/takayama-lily/oicq)
二次扩展请结合oicq接口文档:<br>
> [https://github.com/takayama-lily/oicq/blob/372d1db11cbb64d856f7cf1bce373be2d3a70053/index.d.ts](https://github.com/takayama-lily/oicq/blob/372d1db11cbb64d856f7cf1bce373be2d3a70053/index.d.ts)

### 使用说明
确保已经安装了NodeJS以及其包管理工具（npm）
此后执行下列命令安装依赖

```node
 npm i  
```

核心代码在./lib/core.js中，是以事件注册（on(xxx,()=>{})）的形式来处理各种情况，语义化很强应该很容易理解，然后这里为了处理对话的逻辑，我专门写了一个message.js，具体内容自行查阅代码及相关注释