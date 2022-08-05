const fs = require('fs')
const adminConfig = [
    ['chat', 'lc'],
    // ['voice', 0]
]
const CHAT = 'chat'
const VOICE = 'voice'
const chatMap = new Map()
const voiceMap = new Map()
const adminMap = new Map(adminConfig)

function isChatGlobalOpen() {
    return adminMap.get(CHAT) !== undefined
}

function isVoiceGlobalOpen() {
    return adminMap.get(VOICE) !== undefined
}

function isChatOpen(userId) {
    if (adminMap.get(CHAT) === undefined) {
        return false
    }
    return chatMap.get(userId) !== undefined;
}

function isVoiceOpen(userId) {
    if (adminMap.get(VOICE) === undefined) {
        return false
    }
    return voiceMap.get(userId) !== undefined;
}

function setChatState(userId, state) {
    if (state === 0 || state === undefined) {
        chatMap.delete(userId)
    } else {
        chatMap.set(userId, 'lc')
    }
}

function setVoiceState(userId, state) {
    if (state === 0 || state === undefined) {
        voiceMap.delete(userId)
    } else {
        voiceMap.set(userId, 'lc')
    }
}

function setAdminMap(name, state) {
    if (state === undefined) {
        adminMap.delete(name)
    } else {
        adminMap.set(name, 'lc')
    }
}

module.exports = {
    isChatOpen, isVoiceOpen, setChatState, setVoiceState, setAdminMap, isVoiceGlobalOpen, isChatGlobalOpen
}
