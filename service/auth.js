const adminConfig = [['chat', 'lc'], // ['voice', 0]
]
const CHAT = 'chat'
const VOICE = 'voice'
const chatMap = new Map()
const voiceMap = new Map()
const globalMap = new Map(adminConfig)
const adminNumberList = [
    // yql
    1251958108,
    // syy
    2779066456,
    // zzx
    1353736793
    // todo
]

function isAdmin(userId) {
    return adminNumberList.includes(userId)
}

function isGlobalChatOpen() {
    return globalMap.get(CHAT) !== undefined
}

function isGlobalVoiceOpen() {
    return globalMap.get(VOICE) !== undefined
}

function isUserChatOpen(userId) {
    if (globalMap.get(CHAT) === undefined) {
        return false
    }
    return chatMap.get(userId) !== undefined;
}

function isUserVoiceOpen(userId) {
    if (globalMap.get(VOICE) === undefined) {
        return false
    }
    return voiceMap.get(userId) !== undefined;
}

function setUserChatState(userId, state) {
    if (state === 0 || state === undefined) {
        chatMap.delete(userId)
    } else {
        chatMap.set(userId, 'lc')
    }
}

function setUserVoiceState(userId, state) {
    if (state === 0 || state === undefined) {
        voiceMap.delete(userId)
    } else {
        voiceMap.set(userId, 'lc')
    }
}

function setGlobalState(name, state) {
    if (state === undefined || state === 0 || state === '0') {
        globalMap.delete(name)
    } else {
        globalMap.set(name, 'lc')
    }
}

module.exports = {
    isUserChatOpen,
    isUserVoiceOpen,
    setUserChatState,
    setUserVoiceState,
    setGlobalState,
    isGlobalChatOpen,
    isGlobalVoiceOpen,
    isAdmin
}
