// 群发配置
const axios = require("axios");
const request = require("request");
const fs = require("fs");
const String = require('sprintf-js')
const mlyai = require('./chat/mlyai2.js')
const map = new Map()

const messageGroupConfig = [
    {
        keywords: ['乐程是什么', '乐程是'],
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
                    text:
                        '欢迎加入乐程软件工作室!我们是一个软件工程类团队!\n' +
                        '团队有众多成员进入百度阿里腾讯字节等一线互联网公司就业，\n' +
                        '更有保研至川大、电子科大等学校进一步深造!\n' +
                        '加入我们,和优秀的人一起,用最初的初心做最长久的事!' 
                }
            }
        ]
    },
    {
        keywords: ['在哪里', '位置', '地方', '哪里', '在哪', '地点'],
        reply: [{
            type: 'location',
            data: {
                address: '西南石油大学明理楼C1010,乐程在等着你哦',
                lat: 30.827711,
                lng: 104.186822,
            }
        }
        ]
    },
    {
        keywords: ['丢骰子', '骰子', '色子'],
        reply: [{
            type: "dice",
            data: {
                id: () => 1 + (Math.floor(Math.random() * 10) % 6)
            }
        }
        ]
    },
    {
        keywords: ['签到'],
        callback: (data) => {
            return new Promise((resolve, reject) => {
                // let replyMsg = `${data.sender.nickname}, 签到成功!!!`
                // resolve(replyMsg)
                let playLoad = {
                    "content": "签到",
                    "type": 2,
                    "from": data.sender.user_id,
                    "fromName": data.sender.card,
                    // 没有to, 好友和群会混淆
                    "to": data.group_id,
                    "toName": data.group_name,
                }
                // console.log(playLoad)
                mlyai.chat(playLoad).then(reply => {
                    resolve(reply)
                })
            })
        }
    },
    {
        keywords: ['列表', '菜单', '功能', '你能干啥'],
        reply: [
            {
                type: "text",
                data: {
                    text:
                        '@ 并回复以下关键字：\n' +
                        '1. 乐程是什么\n' +
                        '2. 在哪里\n' +
                        '3. 丢骰子\n' +
                        '4. 签到\n' +
                        '5. 成都天气\n' +
                        '6. 微博热搜\n' +
                        '7. 力扣每日一题\n' +
                        '8. 舔狗日记\n' +
                        '9. 二次元\n' +
                        '10. 力扣随机一题\n' +
                        '11. 听首歌\n' +
                        '12. 网易云热评\n' +
                        '13. 高情商聊天: 开启后有更多功能. 发送 "开启聊天" 开始, 发送 "关闭聊天" 结束\n\n' +
                        '即将支持更多功能'
                },
            },
        ],

    },
    {
        keywords: ['你是谁', 'who are you', "你是"],
        reply: [
            {
                type: "text",
                data: {
                    text:
                        '我是乐程机器人二号LEC v2.0 \n' +
                        '由乐程软件工作室20级成员开发~'
                }
            }
        ]
    },
    {
        keywords: ['天气', '气温'],
        reply: [],
        callback: (data, bot) => {
            return new Promise(resolve => {
                axios.get("http://aider.meizu.com/app/weather/listWeather?cityIds=101270101").then(res => {
                    let s = []
                    if (res.data.code !== '200') {
                        console.warn(res.data)
                        resolve("休息一下吧")
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
                    resolve('休息一下吧')
                    console.error("天气接口调用出错了 {}".replace("{}", e.message))
                })

            })
        }
    },
    {
        keywords: ['微博热搜', '热搜', '微博'],
        reply: [],
        callback: (data, bot) => {

            return new Promise(resolve => {

                axios.get("https://v2.alapi.cn/api/new/wbtop?num=15&token=aCPgupefjrIOitsa").then(res => {
                    let s = []
                    if (res.data.code !== 200) {
                        console.warn(res.data)
                        resolve("休息一下吧")
                        return
                    }
                    res.data.data.forEach(e => {
                        s.push(e.hot_word + '\n热度: ' + e.hot_word_num)
                    })
                    // console.log(s.join("\n\n"))
                    resolve(s.join('\n\n'))

                }).catch(e => {
                    // console.log(e)
                    resolve("微博热搜接口调用出错了 {}".replace("{}", e.message))
                })

            })
        }
    },
    {
        keywords: ['每日一题'],
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
                    if (error) {
                        reject(error)
                    } else {
                        let json = JSON.parse(body);
                        let info = json.data.todayRecord[0]
                        let replyMsg = [{
                            type: "text",
                            data: {
                                text: `每日一题 ${info.date}\n名称: ${info.question.title}\n通过率: ${(info.question.acRate * 100).toFixed(2)}% \n难度: ${info.question.difficulty}\n链接: https://leetcode.cn/problems/${info.question.titleSlug}`
                            }
                        },
                        ]
                        // console.log(replyMsg)
                        resolve(replyMsg)
                    }
                })
            })
        }
    },
    {
        keywords: ['舔狗日记'],
        callback: (data, bot) => {

            return new Promise(resolve => {

                axios.get("https://v2.alapi.cn/api/dog?token=aCPgupefjrIOitsa&format=json").then(res => {
                    let s = []
                    if (res.data.code !== 200) {
                        console.warn('舔狗日记接口 ' + res.data.msg)
                        resolve("休息一下吧")
                        return
                    }
                    // console.log(res.data.data.content)
                    resolve(res.data.data.content)

                }).catch(e => {
                    console.log('舔狗日记接口调用出错了')
                    console.error(e)
                    resolve('休息一下吧')
                })

            })
        }
    },
    {
        keywords: ['二次元'],
        callback: (data, bot) => {
            return new Promise(resolve => {

                let prefix = './img/'
                fs.exists(prefix, (res) => {
                    if (!res) {
                        fs.mkdir(prefix, (e) => {
                        })
                    }
                })
                let path = prefix + Date.now() + '_' + Math.floor((Math.random() * 10000)) + '.jpg'
                let msg = {
                    type: "image",
                    data: {
                        'file': path
                    }
                }
                axios({
                    method: 'get',
                    url: 'https://api.oick.cn/random/api.php?type=pe',
                    responseType: 'stream'
                }).then((response) => {
                    // 这里就先别保存了，节约空间
                    // 不浪费, 将图片保存到本地./img中
                    let stream = fs.createWriteStream(path)
                    response.data.pipe(stream)

                    // pipe是异步的, 需要用回调函数确认是否完成
                    stream.on('close', () => {
                        // console.log(msg)
                        resolve(msg)
                    })
                }).catch((e) => {
                    console.log('二次元接口出错了, 休息一下吧')
                    console.error(e)
                    resolve('二次元接口出错了, 休息一下吧')
                })

            })
        }
    },
    {
        keywords: ['随机一题', '来道题'],
        callback: (data, bot) => {
            return new Promise(resolve => {
                let para = {
                    "query": "\n    query problemsetRandomFilteredQuestion($categorySlug: String!, $filters: QuestionListFilterInput) {\n  problemsetRandomFilteredQuestion(categorySlug: $categorySlug, filters: $filters)\n}\n    ",
                    "variables": {"categorySlug": "", "filters": {}}
                }
                axios({
                    url: 'https://leetcode.cn/graphql/',
                    data: JSON.stringify(para),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {

                    // console.log(res.data)
                    try {
                        let problemName = res.data.data.problemsetRandomFilteredQuestion;
                        let msg = 'https://leetcode.cn/problems/' + problemName
                        resolve("随机一题\n链接: " + msg)
                    } catch (e) {
                        console.log('LeetCode接口调用错误')
                        console.error(e);
                        resolve('休息一下吧')
                    }

                }).catch(e => {
                    console.log('LeetCode接口调用错误')
                    console.error(e);
                    resolve("休息一下吧")
                })
            })
        }
    },
    {
        keywords: ['歌', '网易云', '网抑云'],
        callback: (data, bot) => {
            return new Promise(resolve => {
                axios.get(encodeURI("https://api.uomg.com/api/rand.music?sort=热歌榜&format=json")).then(res => {
                        if (res.data.code !== 1) {
                            console.warn('网易云接口调用出错')
                            console.log(res.data)
                            resolve("休息一下吧")
                            return
                        }
                        let music = {
                            type: "music",
                            data: {
                                type: '163',
                                id: res.data.data.url.split('=')[1],
                            }
                        }
                        // console.log(music)
                        resolve(music)
                    }
                ).catch(e => {
                    console.log('网易云接口调用出错了')
                    console.error(e)
                    resolve('休息一下吧')
                })
            })
        }
    },
    {
        keywords: ['网易云热评', '热评'],
        callback: (data, bot) => {
            return new Promise(resolve => {
                axios.get('https://v2.alapi.cn/api/comment?token=aCPgupefjrIOitsa').then(res => {
                        if (res.data.code !== 200) {
                            console.warn('网易云热评接口调用出错')
                            console.log(res.data)
                            resolve("休息一下吧")
                            return
                        }
                        let msg = String.sprintf("%s\n\n——网易云音乐热评《%s》", res.data.data.comment_content, res.data.data.title)
                        resolve(msg)
                    }
                ).catch(e => {
                    console.log('网易云热评接口调用出错了')
                    console.error(e)
                    resolve('休息一下吧')
                })
            })
        }
    },
    {
        keywords: ['开启聊天', '聊天'],
        callback: (data, bot) => {
            return new Promise(resolve => {
                let userId = data.sender.user_id
                if (map.get(userId) === 1) {
                    resolve("已经在聊天模式中了哦, \n支持:\n1. 签到 | 签到榜\n2. 猜拳xx(例如石头)\n3. 个人中心\n4. 一言\n5. 智能回复")
                } else {
                    map.set(userId, 1)
                    resolve("开启聊天模式成功~, \n支持:\n1. 签到\n2. 猜拳xx(例如石头)\n3. 个人中心\n4. 一言\n5. 智能回复")
                }
            })
        }
    },
    {
        keywords: ['关闭聊天', '关闭'],
        callback: (data, bot) => {
            return new Promise(resolve => {
                let userId = data.sender.user_id
                if (map.get(userId) === undefined || map.get(userId) === 0) {
                    resolve("已经关闭了哦")
                } else {
                    map.delete(userId)
                    resolve("关闭聊天模式成功~")
                }
            })
        }
    },
    {   // 这个一定要放在最后面，之前所有关键字均为命中则进入本项
        handle_type: 'default',
        callback: function (data, bot) {
            let userId = data.sender.user_id

            // 没有开启聊天模式
            if (map.get(userId) === undefined || map.get(userId) === 0) {
                return new Promise((resolve, reject) => {
                    let replyMsg = ['(oωo)喵?', '干嘛?', '怎么了?', '在的', '嗯哼?', '@我干嘛?', '[CQ:face,id=307,text=/喵喵]', '2333~', '咕-咕-咕-',
                        '[CQ:image,file=812dea6ecfaa3b293ee1a3028209354741519-417-114.gif,url=https://c2cpicdw.qpic.cn/offpic_new/2779066456//2779066456-1883383011-812DEA6ECFAA3B293EE1A30282093547/0?term=2]',
                        '[CQ:image,file=53f96a7a6539652caf0486c065b5069c280114-240-240.gif,url=https://gchat.qpic.cn/gchatpic_new/2779066456/742958634-2353126009-53F96A7A6539652CAF0486C065B5069C/0?term=2]',
                        '有时候和我聊天的人太多了,我只能选择回复一部分', '虽然还不知道你想要说什么,但我还是得提醒一下有个东西叫百度', '嗨嗨害', '哪里又需要我了？', '怎么,是打算V我50了吗？',
                        '有时候,有的话题我建议找我私聊比较好', '(。w。)', '如果有什么建议，可以反馈给乐程的开发者们', '[CQ:image,file=bf6d885be9997e67e783c71e9af9c9e99796-240-240.jpg,url=https://gchat.qpic.cn/gchatpic_new/2779066456/742958634-2355345593-BF6D885BE9997E67E783C71E9AF9C9E9/0?term=2]',
                        '[CQ:image,file=67ad61b9c39ee80d2ce868144ddad15f86909-1080-1080.jpg,url=https://gchat.qpic.cn/gchatpic_new/2779066456/742958634-2401112147-67AD61B9C39EE80D2CE868144DDAD15F/0?term=2]',
                        '[CQ:image,file=c78d9d5c7582d8784d0eef74ae1c8b9619967-240-240.jpg,url=https://gchat.qpic.cn/gchatpic_new/2779066456/742958634-2607997725-C78D9D5C7582D8784D0EEF74AE1C8B96/0?term=2]',
                        '[CQ:image,file=4963658e6bad33e4feee8c2bd7296fa2499244-240-148.gif,url=https://gchat.qpic.cn/gchatpic_new/2779066456/742958634-3029959254-4963658E6BAD33E4FEEE8C2BD7296FA2/0?term=2]',
                        '[CQ:image,file=a51555ea7b750eb4d8064ffebbe17e1d82099-1080-1128.jpg,url=https://gchat.qpic.cn/gchatpic_new/2779066456/742958634-2519447466-A51555EA7B750EB4D8064FFEBBE17E1D/0?term=2]',
                        '不懂，我是人工智障'
                    ].randomOne()
                    resolve(replyMsg)
                })
            }

            // 开启聊天模式
            return new Promise(resolve => {
                let msgArray = data.message
                for (let msg of msgArray) {
                    if (msg.type === 'text') {
                        let playLoad = {
                            "content": msg.data.text,
                            "type": 2,
                            "from": data.sender.user_id,
                            "fromName": data.sender.card,
                            "to": data.group_id,
                            "toName": data.group_name,
                        }
                        // console.log(playLoad)
                        mlyai.chat(playLoad).then(reply => {
                            resolve(reply)
                        })
                        return
                    }
                }
            })
        }
    }

]

module.exports = messageGroupConfig

