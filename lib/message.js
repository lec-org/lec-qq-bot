const messageGroupConfig = require('../service/group')
const messagePrivateConfig = require('../service/user')
// 消息收发功能，分为群发和私聊

// 给所有数组写一个randomOne方法，这样就可以实现快速的随机抽取啦~~~
// 可以考虑优化成伪随机，避免高频重复
Array.prototype.randomOne = function () {
    // let power = 1
    // while (parseInt(this.length / power)) {
    //     power *= 10
    // }
    // let randomIndex = (parseInt(Math.random() * power) % this.length)

    // 实际测试两者基本无差异
    let randomIndex = Math.round(Math.random() * 1010) % this.length;
    return this[randomIndex]
}


String.prototype.containAny = function (keywords) {
    if (!keywords.length) {
        return true
    }
    for (let s of keywords) {
        if (this.indexOf(s) !== -1) {
            return true
        }
    }
    return false
}

// 节流处理:一段时间内只受理一定数目的任务,超出的抛弃掉
const MAX_NUM = 10   // 最大任务数目
const REFRESH_TIME = 4000 // 约每4s处理1个任务
let currentNum = 0
setInterval(() => {
    if (currentNum > 0) {
        currentNum--
    }
}, REFRESH_TIME)


// 允许的群组(白名单)
const groups = [
    '828192817',  // 2022乐程招新群
    '742958634', // master-测试群
    '575626767', // dev
    '897084848', // 外界公开测试群1
    // '891678779'  // 外界公开测试群2
    '640265015',
]


// 功能: 处理群发消息
// 参数 data: 收到的消息数据
// 参数 bot: 机器人对象
function messageGroupHandler(data, bot) {
    // console.log(data)
    // console.log(bot)
    if (currentNum > MAX_NUM) {
        return
    }
    currentNum++

    // 先要@自己才能触发
    if (data.message[0].type === 'at' && data.atme === true) {
        // 如果不再在白名单群组里面
        if (!groups.includes(data.group_id.toString())) {
            console.log('群id不在白名单之内', data.group_id)
            return
        }

        // 遍历每个配置，观察里面是否有匹配的关键字
        for (let one of messageGroupConfig) {
            let isContain = false
            for (let msg of data.message) {
                if (msg.type === 'text') {
                    isContain = msg.data.text.containAny(one.keywords)
                    break
                }
            }
            if (isContain) {
                if (one.callback) {
                    one.callback(data, bot).then((res) => {
                        data.reply(res)
                    }).catch(error => {
                        data.reply("休息一下吧")
                        console.log(error)
                    })
                } else {
                    data.reply(one.reply)
                }

                break
            }
        }
    }
}


// 功能: 处理私发消息, 可以用于更新内容的扩展的测试，和之后计划的公众号、小程序消息的自动化转发等等
// 参数 data: 收到的消息数据
// 参数 boy: 机器人对象
function messagePrivateHandler(data, bot) {
    if (currentNum > MAX_NUM) {
        return
    }
    currentNum++

    for (let one of messagePrivateConfig) {
        let isContain = false
        for (let msg of data.message) {
            if (msg.type === 'text') {
                isContain = msg.data.text.containAny(one.keywords)
                break
            }
        }
        if (isContain) {
            if (one.callback) {
                one.callback(data, bot).then((res) => {
                    data.reply(res)
                }).catch(error => {
                    data.reply("休息一下吧")
                    console.log(error)
                })
            } else {
                data.reply(one.reply)
            }
            break
        }
    }

    // data.sendGroupMsg(742958634, data.message) // 转发到测试群
}


module.exports = {
    messageGroupHandler,
    messagePrivateHandler
}

