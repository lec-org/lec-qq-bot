const axios = require("axios");
const fileServer = 'https://files.molicloud.com/'
const apiServer = 'https://api.mlyai.com/reply'
const config = {
    "apiKey": "go3pgk66gfi38usq",
    "apiSecret": "quw1mu9q"
}

function chat(message) {

    return new Promise((resolve, reject) => {
        let payload = {
            "content": message.content,
            "type": message.type,
            "from": message.from,
            "fromName": message.fromName,
            "to": message.to,
            "toName": message.toName
        }
        // console.debug(payload)
        axios({
            method: 'post',
            url: apiServer,
            data: JSON.stringify(payload),
            headers: {
                'Api-Key': config.apiKey,
                'Api-Secret': config.apiSecret,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            // console.debug(res.data)
            if (res.data.code !== '00000') {
                resolve("休息一下吧")
                return
            }
            resolve(res.data.data)
        }).catch(e => {
            console.log(e)
            resolve("休息一下吧")
        })
    })
}

function getAbsoluteUrl(url) {
    return fileServer + url
}

function getPlayLoad(type, msg, data, content) {
    return {
        "content": content !== undefined ? content : msg.data.text,
        "type": type == null ? 2 : type,
        "from": data.sender.user_id,
        "fromName": data.sender.card,
        "to": data.group_id,
        "toName": data.group_name,
    }
}

// let test = {
//     "content": "你好",
//     "type": "1",
//     "from": "1",
//     "fromName": "test"
// }
//
// chat(test).then(res => {
//     console.log(res)
// })

module.exports = {chat, getAbsoluteUrl, getPlayLoad}
