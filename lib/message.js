// 消息收发功能，分为群发和私聊

// 允许的群组(白名单)
const groups = [
    '828192817',  // 2022乐程招新群
    '742958634', // 测试群
]


// 群发配置
const messageGroupConfig = [
    {
        keywords: 'ping',
        reply: '启动成功'
    },
    {
        keywords: '是什么',
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
    // 无法正确显示位置，可能要配合腾讯地图获取 经纬度对应的地址名称
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
    // }
    {
        keywords: '骰子',
        reply: [
            {
                type: "dice",
                data: {
                    id: () => 1 + (Math.floor(Math.random() * 10) % 6)
                }
            }
        ]
    }
]


// 处理群发
function messageGroupHandler(data) {
    if(groups.includes(data.group_id.toString())) { // 如果在白名单群组里面
        for(let one of messageGroupConfig) { // 遍历每个配置，观察里面是否有匹配的关键字
            if(data.raw_message.indexOf(one.keywords) != -1) { // 匹配成功
                data.reply(one.reply) // 做出相应的回复
                break
            }
        }
    } else {
        console.log('群消息不在白名单之内', data.group_id)
    }
}

// 处理私发
function messagePrivateHandler(data) {

}

module.exports = {
    messageGroupHandler,
    messagePrivateHandler
}

