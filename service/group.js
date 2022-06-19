// 群发配置
const axios = require("axios");
const request = require("request");
const fs = require("fs");
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
    {
        keywords: '在哪里',
        reply: [{
            type: 'location',
            data: {
                address: '西南石油大学明理楼C1010,等着你哦',
                lat: 30.827711,
                lng: 104.186822,
            }
        }
        ]
    },
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
                    text:
                        '@ 并回复以下关键字：\n' +
                        '1. 乐程是什么\n' +
                        '2. 在哪里\n' +
                        '3. 丢骰子\n' +
                        '4. 签到\n' +
                        '5. 天气\n' +
                        '6. 微博热搜\n' +
                        '7. 每日一题\n' +
                        '8. 舔狗日记\n' +
                        '9. 二次元\n' +
                        '10. 力扣随机一题\n'+
                        '11. 听首歌'
                },
            },
        ],

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
        keywords: '微博热搜',
        reply: [],
        callback: (data, bot) => {

            return new Promise((resolve, reject) => {

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
                    if (error) {
                        reject(error)
                    } else {
                        let json = JSON.parse(body);
                        let info = json.data.todayRecord[0]
                        let replyMsg = [{
                            type: "text",
                            data: {
                                text: `每日一题 ${info.date}\n名称: ${info.question.title}\n通过率: ${info.question.acRate.toFixed(2) * 100}% \n难度: ${info.question.difficulty}\n链接: https://leetcode.cn/problems/${info.question.titleSlug}`
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
        keywords: '舔狗日记',
        reply: [],
        callback: (data, bot) => {

            return new Promise((resolve, reject) => {

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
        keywords: '二次元',
        reply: [],
        callback: (data, bot) => {
            return new Promise((resolve, reject) => {

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
        keywords: '随机一题',
        reply: [],
        callback: (data, bot) => {
            return new Promise((resolve, reject) => {
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
        keywords: '听首歌',
        reply: [],
        callback: (data, bot) => {
            return new Promise((resolve, reject) => {
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
    { // 这个一定要放在最后面，之前所有关键字均为命中则进入本项
        keywords: '',
        reply: [],
        callback: function () {
            return new Promise((resolve, reject) => {
                let replyMsg = ['(oωo)喵?', '干嘛?', '怎么了?', '在的', '嗯哼?', '@我干嘛?', '[CQ:face,id=307,text=/喵喵]', '2333~', '咕-咕-咕-',
                    '[CQ:image,file=812dea6ecfaa3b293ee1a3028209354741519-417-114.gif,url=https://c2cpicdw.qpic.cn/offpic_new/2779066456//2779066456-1883383011-812DEA6ECFAA3B293EE1A30282093547/0?term=2]',
                    '[CQ:image,file=53f96a7a6539652caf0486c065b5069c280114-240-240.gif,url=https://gchat.qpic.cn/gchatpic_new/2779066456/742958634-2353126009-53F96A7A6539652CAF0486C065B5069C/0?term=2]'
                ].randomOne()
                resolve(replyMsg)
            })
        }
    }

]

module.exports = {
    messageGroupConfig
}
