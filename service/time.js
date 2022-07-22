// 允许的群组(注意自动处理事件白名单群，不要和聊天白名单群混淆)
const autoGroups = [
    '828192817', // 2022乐程招新群
    '640265015', // 计科院新生群
]

const autoConfig = {
    data: {
        intervalTime: 30 * 60 * 1000, // 轮询间隔时间
    },
    // time目前是取[0, 23]的整数, 表示每天触发的时间
    // 注意让events的时间升序排列
    events: [
        {
            time: 6,
            reply: [
                {
                    type: 'image',
                    data: {
                        file: 'c78d9d5c7582d8784d0eef74ae1c8b9619967-240-240.jpg'
                    }
                },
                {
                    type: 'text',
                    data: {
                        text: '早上好呀！今天有快乐地编程吗？'
                    }
                }
            ],
            callback: (bot, config) => {
                // 顺手点10个赞
                bot.sendLike(2779066456, 10);
                for(let oneGroup of autoGroups) {
                    bot.sendGroupMsg(oneGroup, reply)
                }
            }
        }
    ]
}
module.exports = autoConfig

