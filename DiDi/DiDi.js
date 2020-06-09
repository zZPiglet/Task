/*
"滴滴出行" app 自动签到，支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。
请先按下述方法进行配置，进入"滴滴出行"，若弹出"首次写入滴滴出行 Token 成功"即可正常食用，先手动运行一次脚本，弹出成功后回到"滴滴出行"，点击右上角"天天领福利"查看福利金是否到账，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"滴滴出行 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。
Author：zZPiglet

Quantumult X (App Store:1.0.5+, TestFlight 190+):
[task_local]
1 0 * * * DiDi.js, tag=滴滴出行
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js, tag=滴滴出行

[rewrite_local]
^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? url script-request-header DiDi.js
or remote
^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js


Surge 4.0+ & Loon:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js
http-request ^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js

All app:
[mitm]
hostname = as.xiaojukeji.com

获取完 Token 后可不注释 rewrite / hostname，Token 更新时会弹窗。若因 MitM 导致该软件或小程序网络不稳定，可注释掉 hostname。
*/

const aff = true //若不想提供 aff 请改为 false。
const mainURL = 'https://bosp-api.xiaojukeji.com/wechat/benefit/public/index?'
const TokenName = '滴滴出行'
const TokenKey = 'DiDi'
const CityKey = 'DiDi_city'
const reg = /^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\?(.*)location_cityid=(\d*)&(.*)ticket=(.*)&/
const source_id = ['WTZs7tfSPrADJ8uLRVMOKA%253D%253D', 'DRKV%252BEcE4Gqn%252BH1mKz2HQg%253D%253D']
const today = new Date().getFullYear() + "-" + ("00" + Number(new Date().getMonth() + 1)).substr(-2) + "-" + ("00" + new Date().getDate()).substr(-2)
const $cmp = compatibility()

if ($cmp.isRequest) {
    GetToken()
    $cmp.done()
} else {
    Checkin()
    $cmp.done()
}

function GetToken() {
    if ($request) {
        const requrl = $request.url
        let TokenValue = decodeURIComponent(reg.exec(requrl)[4])
        let CityValue = reg.exec(requrl)[2]
        $cmp.write(CityValue, CityKey)
        if ($cmp.read(TokenKey) != (undefined || null)) {
            if ($cmp.read(TokenKey) != TokenValue) {
                let token = $cmp.write(TokenValue, TokenKey)
                if (!token) {
                    $cmp.notify("更新" + TokenName + " Token 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + TokenName + " Token 成功 🎉", "", "")
                }
            }
        } else {
            let token = $cmp.write(TokenValue, TokenKey)
            if (!token) {
                $cmp.notify("首次写入" + TokenName + " Token 失败‼️", "", "")
            } else {
                $cmp.notify("首次写入" + TokenName + " Token 成功 🎉", "", "")
            }
        }
    } else {
        $cmp.notify("写入" + TokenName + "Token 失败‼️", "", "配置错误, 无法读取请求头, ")
    }
}

function Choose(v) {
    let r = Math.floor(Math.random() * Math.floor(2))
    return v[r]
}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            let obj = JSON.parse(str)
            if (typeof obj == 'object' && obj) {
                return obj
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }
    return false
}

function Checkin() {
    let subTitle = ''
    let detail = ''
    let CheckinURL = mainURL + 'city_id=' + $cmp.read("DiDi_city")
    if (aff) {
        let s_i = Choose(source_id)
        CheckinURL += '&share_source_id=' + s_i + '&share_date=' + today
    }
    const didi = {
        url: CheckinURL,
        headers: {
            "Didi-Ticket": $cmp.read("DiDi"),
        }
    }
    $cmp.get(didi, function(error, response, data) {
        if (!error) {
            if (response.statusCode == 403) {
                subTitle += 'Token 未获取或失效❗'
                detail += '请按脚本开头注释完成配置并首次或重新获取 Token。'
            } else {
                const result = isJSON(data)
                if (result && result.errno == 0) {
                    if(result.data.sign.sign) {
                        subTitle += '签到成功！🚕'
                        let todayearn = Number(result.data.sign.sign.subsidy_state.subsidy_amount + result.data.sign.sign.subsidy_state.extra_subsidy_amount)
                        detail += '签到获得 ' + todayearn + ' 福利金，'
                    } else {
                        subTitle += '重复签到！🚖'
                    }
                    let total = result.data.welfare.balance
                    detail += '账户共有 ' + total + ' 福利金，可抵扣 ' + total/100 + ' 元。'
                    for (let message of result.data.notification.reverse()) {
                        detail += '\n' + message
                    }
                } else if (result && result.errno == 101) {
                    subTitle += '签到失败‼️ 城市代码错误。'
                    detail += '请重新获取 Token。\n' + result.errmsg
                } else {
                    subTitle += '签到失败‼️ 详情请见日志。'
                    detail += data
                    $cmp.log("DiDi failed response : \n" + data)
                }
            }
        } else {
            subTitle += '签到接口请求失败，详情请见日志。'
            detail += error
            $cmp.log("DiDi failed response : \n" + error)
        }
        $cmp.notify(TokenName, subTitle, detail)
    })
}

function compatibility() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
    const isNode = typeof require == "function" && !isJSBox
    const node = (() => {
        if (isNode) {
            const request = require('request')
            return ({request})
        } else {
            return (null)
        }
    })()
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (isNode) log(title+subtitle+message)
        if (isJSBox) $push.schedule({title: title, body: subtitle?subtitle+"\n"+message:message})
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        })
        if (isNode) {
            node.request(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options}
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.get(options)
        }
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isNode) {
            node.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options}
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.post(options)
        }
    }
    const log = (message) => console.log(message)
    const done = (value = {}) => {
        if (isQuanX) isRequest ? $done(value) : null
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return { isQuanX, isSurge, isJSBox, isRequest, notify, write, read, get, post, log, done }
}