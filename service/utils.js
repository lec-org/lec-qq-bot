const {segment} = require("oicq");
const mlyai = require("./chat/mlyai");

function getYoudaoVoiceUrl(text) {
    return 'https://tts.youdao.com/fanyivoice?le=zh&keyfrom=speaker-target&word=' + text
}

function convertToElems(msgs, isVoiceOpen) {
    let res = []
    msgs.forEach(item => {
        if (item.typed === 1) {
            if (isVoiceOpen && item.content.length < 30) {
                let url = segment.record(getYoudaoVoiceUrl(item.content));
                res.push(url)
            } else {
                res.push(item.content)
            }
        } else if (item.typed === 2) {
            res.push(segment.image(mlyai.getAbsoluteUrl(item.content)))
        } else if (item.typed === 4) {
            res.push(segment.record(mlyai.getAbsoluteUrl(item.content)))
        }
    })

    return res
}

function getMsgItemByType(msgList, type) {
    for (let item of msgList) {
        if (item.type === type) {
            return item
        }
    }

    return undefined
}

module.exports = {convertToElems, getMsgItemByType}
