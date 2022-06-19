const messageGroupConfig = require('../service/group')
const messagePrivateConfig = require('../service/user')
// 消息收发功能，分为群发和私聊

// 给所有数组写一个randomOne方法，这样就可以实现快速的随机抽取啦~~~
// 可以考虑优化成伪随机，避免高频重复
Array.prototype.randomOne = function () {
    let power = 1
    while (parseInt(this.length / power)) {
        power *= 10
    }

    let randomIndex = (parseInt(Math.random() * power) % this.length)

    return this[randomIndex]
}


// 允许的群组(白名单)
const groups = [
    '828192817',  // 2022乐程招新群
    '742958634', // master-测试群
    '575626767', // dev
    // '891678779'  // 外界公开测试群
]


// 功能: 处理群发消息
// 参数 data: 收到的消息数据
// 参数 bot: 机器人对象
function messageGroupHandler(data, bot) {
    // console.log(data)
    // console.log(bot)
    if (data.message[0].type === 'at' && data.atme === true) { // 先要@自己才能触发
        if (groups.includes(data.group_id.toString())) { // 如果在白名单群组里面
            for (let one of messageGroupConfig.messageGroupConfig) { // 遍历每个配置，观察里面是否有匹配的关键字
                if (data.raw_message.trim().indexOf(one.keywords) !== -1) { // 匹配成功
                    if (one.callback) { // callback回调处理数据后回复，使用回调生成随机项能够避免缓存
                        one.callback(data, bot).then((res) => {
                            data.reply(res)
                        }).catch(error => {
                            throw error
                        })
                    } else {
                        data.reply(one.reply) // 直接回复
                    }
                    break
                }
            }
        } else {
            console.log('群消息不在白名单之内', data.group_id)
        }
    }
}


// 功能: 处理私发消息, 可以用于更新内容的扩展的测试，和之后计划的公众号、小程序消息的自动化转发等等
// 参数 data: 收到的消息数据
// 参数 boy: 机器人对象
function messagePrivateHandler(data, bot) {

    data.reply(data.message)

    // data.sendGroupMsg(742958634, data.message) // 转发到测试群

}


module.exports = {
    messageGroupHandler,
    messagePrivateHandler
}

