const axios = require("axios");
const request = require('request')
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
    '891678779'  // 外界公开测试群
]


// 群发配置
const messageGroupConfig = [
    {
        keywords: '乐程是什么',
        reply: [
            {
                type: 'image',
                data: {
                    file: 'f4638e4a79c46498abf55d5598d9ab96142524-889-500.jpg'
                }
            },
            {
                type: 'text',
                data: {
                    text: '欢迎加入乐程软件工作室!'
                }
            }
        ]
    },
    /* 无法正确显示位置，可能要配合腾讯地图获取 经纬度对应的地址名称
    // {
    //     keywords: '在哪里',
    //     reply: [
    //         {
    //             type: 'location',
    //             data: {
    //                 address: '西南石油大学明理楼C1010',
    //                 lat: 104.18480777182769, //经纬度
    //                 lng: 30.829109041652448, //经纬度
    //             }
    //         }
    //     ]
    }*/
    {
        keywords: '丢骰子',
        reply: [
            {
                type: "dice",
                data: {
                    id: () => 1 + (Math.floor(Math.random() * 10) % 6)
                }
            }
        ]
    },
    {
        keywords: '签到',
        reply: [
            {
                type: 'text',
                data: {
                    text: ''
                }
            }
        ],
        callback: (data) => {
            return new Promise((resolve, reject) => {
                let replyMsg = `${data.sender.nickname}, 签到成功!!!`
                resolve(replyMsg)
            })
        }
    },
    {
        keywords: '列表',
        reply: [
            {
                type: "text",
                data: {
                    text: `@并回复以下关键字：\n1. 乐程是什么\n2. 丢骰子\n3. 签到\n4. 天气\n5. 微博热搜\n6. 每日一题`
                }
            }
        ]
    },
    {
        keywords: '转发',
        reply: [],
        callback: (data, bot) => {
            return new Promise((resolve, reject) => {
                // 这里还要处理一下数据，不然有点问题
                let replyMsg = ''
                bot.sendGroupMsg(828192817, d.message)
            })
        }
    },
    {
        keywords: '你是谁',
        reply: [
            {
                type: "text",
                data: {
                    text: `我是乐程机器人二号LEC v2.0`
                }
            }
        ]
    },
    {
        keywords: '天气',
        reply: [],
        callback: (data, bot) => {

            return new Promise((resolve, reject) => {

                axios.get("http://aider.meizu.com/app/weather/listWeather?cityIds=101270101").then(res => {
                    let s = []
                    if (res.data.code !== '200') {
                        resolve("接口出错了")
                        return
                    }

                    let value = res.data.value[0]

                    s.push(value.city + '气温  ' + value.realtime.temp + ' °C')
                    value.indexes.forEach(e => {
                        if (e.content !== '' && e.content !== undefined) {
                            s.push(e.content)
                        }
                    })
                    // console.log(s.join('\n\n'))
                    resolve(s.join('\n\n'))
                }).catch(e => {
                    resolve("接口调用出错了{}".replace("{}", e.message))
                })

            })
        }
    },
    {
        keywords: '微博热搜',
        reply: [],
        callback: (data, bot) => {

            return new Promise((resolve, reject) => {

                axios.get("https://v2.alapi.cn/api/new/wbtop?num=10&token=aCPgupefjrIOitsa").then(res => {
                    let s = []
                    if (res.data.code !== 200) {
                        console.warn(res.data.msg)
                        resolve("接口出错了, 休息一下吧")
                        return
                    }
                    res.data.data.forEach(e => {
                        s.push(e.hot_word + '\n热度 ' + e.hot_word_num)
                    })
                    // console.log(s.join("\n\n"))
                    resolve(s.join('\n\n'))

                }).catch(e => {
                    // console.log(e)
                    resolve("接口调用出错了{}".replace("{}", e.message))
                })

            })
        }
    },
    {
        keywords: '每日一题',
        reply: [],
        callback: function (data, bot) {
            return new Promise((resolve, reject) => {
                // 力扣的蜜汁参数
                const json = {
                    "variables": {}, 
                    "query": "\n    query questionOfToday {\n  todayRecord {\n    date\n    userStatus\n    question {\n      questionId\n      frontendQuestionId: questionFrontendId\n      difficulty\n      title\n      titleCn: translatedTitle\n      titleSlug\n      paidOnly: isPaidOnly\n      freqBar\n      isFavor\n      acRate\n      status\n      solutionNum\n      hasVideoSolution\n      topicTags {\n        name\n        nameTranslated: translatedName\n        id\n      }\n      extra {\n        topCompanyTags {\n          imgUrl\n          slug\n          numSubscribed\n        }\n      }\n    }\n    lastSubmission {\n      id\n    }\n  }\n}\n    "
                }
                request({
                        method: 'POST',
                        url: 'https://leetcode.cn/graphql',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(json)
                    }, (error, response, body) => {
                        if(error) {
                            reject(error)
                        } else {
                            let json = JSON.parse(body);
                            let info = json.data.todayRecord[0]
                            let replyMsg = [
                                {
                                    type: "text",
                                    data: {
                                        text: `${info.date}每日一题\n名称:${info.question.title}\n通过率:${info.question.acRate.toFixed(2)}\n链接:https://leetcode.cn/problems/${info.question.titleSlug}`
                                    }
                                },
                                
                            ]
                            resolve(replyMsg)
                        }
                })
            })
        }
    },
    { // 这个一定要放在最后面，之前所有关键字均为命中则进入本项
        keywords: '',
        reply: [],
        callback: function () {
            return new Promise ((resolve, reject) => {
                let replyMsg = ['(oωo)喵?', '干嘛?', '怎么了?', '在的', '嗯哼?', '@我干嘛?', '[CQ:face,id=307,text=/喵喵]', '2333~', '咕-咕-咕-', 
                                '[CQ:image,file=812dea6ecfaa3b293ee1a3028209354741519-417-114.gif,url=https://c2cpicdw.qpic.cn/offpic_new/2779066456//2779066456-1883383011-812DEA6ECFAA3B293EE1A30282093547/0?term=2]',
                                '[CQ:image,file=53f96a7a6539652caf0486c065b5069c280114-240-240.gif,url=https://gchat.qpic.cn/gchatpic_new/2779066456/742958634-2353126009-53F96A7A6539652CAF0486C065B5069C/0?term=2]'
                            ].randomOne()
                resolve(replyMsg)
            })
        }
    }

]


// 功能: 处理群发消息
// 参数 data: 收到的消息数据
// 参数 bot: 机器人对象
function messageGroupHandler(data, bot) {
    // console.log(data)
    // console.log(bot)
    if (data.message[0].type === 'at' && data.atme === true) { // 先要@自己才能触发
        if (groups.includes(data.group_id.toString())) { // 如果在白名单群组里面
            for (let one of messageGroupConfig) { // 遍历每个配置，观察里面是否有匹配的关键字
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





// 私聊配置
const messagePrivateConfig = []

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

