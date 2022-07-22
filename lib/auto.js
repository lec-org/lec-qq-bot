// 主动进行的一些操作
// 比如定时推个加群信息啥的
// 目前先用一个计时器实现
const autoConfig = require('../service/time')

function autoHandler (bot) {
    console.log(`开启定时任务,当前小时:${new Date().getHours()}, 轮询时间:${autoConfig.data.intervalTime / 60000} 分钟`)
    setTimeout(() => {
        console.log('执行！')
        let currentTimeHour = new Date().getHours()
        for (let index = 0; index < autoConfig.events.length; index ++) {
            if (autoConfig.events[index].time == currentTimeHour) {
                autoConfig.events[index].callback?.(bot);
            }
        }
    }, autoConfig.data.intervalTime)
}

module.exports = autoHandler
