/*
微信公众号"哈根达斯"会员专区积分签到自动签到，支持 Quantumult X（理论上也支持 Surge，未尝试）。
请先按下述方法进行配置，进入"哈根达斯"会员专区积分签到，若弹出"首次写入哈根达斯 Cookie 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"哈根达斯 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。
Author：zZPiglet

Quantumult X (App Store:1.0.5+, TestFlight 190+):
[task_local]
1 0 * * * HaagenDazs.js
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/HaagenDazs/HaagenDazs.js

[rewrite_local]
^https:\/\/www\.haagendazs\.com\.cn\/Weixin\/SignIndex\.aspx url script-request-header HaagenDazs.js
or remote
^https:\/\/www\.haagendazs\.com\.cn\/Weixin\/SignIndex\.aspx url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/HaagenDazs/HaagenDazs.js


Surge 4.0+:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/HaagenDazs/HaagenDazs.js
http-request ^https:\/\/www\.haagendazs\.com\.cn\/Weixin\/SignIndex\.aspx script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/HaagenDazs/HaagenDazs.js

All app:
[mitm]
hostname = www.haagendazs.com.cn

获取完 Cookie 后可不注释 rewrite / hostname，Cookie 更新时会弹窗。若因 MitM 导致该页面网络不稳定，可注释掉 hostname。
*/

const CheckinURL = 'https://www.haagendazs.com.cn/Weixin/SignIndex.aspx?action=Sign'
const CookieName = '哈根达斯'
const CookieKey = 'HaagenDazs'
const $cmp = compatibility()

if ($cmp.isRequest) {
    GetCookie()
    $cmp.done()
} else {
    Checkin()
    $cmp.done()
}

function GetCookie() {
    if ($request.headers['Cookie']) {
        var CookieValue = $request.headers['Cookie']
        if ($cmp.read(CookieKey) != (undefined || null)) {
            if ($cmp.read(CookieKey) != CookieValue) {
                var Cookie = $cmp.write(CookieValue, CookieKey)
                if (!Cookie) {
                    $cmp.notify("更新" + CookieName + " Cookie 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + CookieName + " Cookie 成功 🎉", "", "")
                }
            }
        } else {
            var Cookie = $cmp.write(CookieValue, CookieKey);
            if (!Cookie) {
                $cmp.notify("首次写入" + CookieName + " Cookie 失败‼️", "", "")
            } else {
                $cmp.notify("首次写入" + CookieName + " Cookie 成功 🎉", "", "")
            }
        }
    } else {
        $cmp.notify("写入" + CookieName + "Cookie 失败‼️", "", "配置错误, 无法读取请求头。")
    }
}

function Checkin() {
    const haagendazs = {
        url: CheckinURL,
        headers: {
            "Cookie": $cmp.read("HaagenDazs"),
        },
        body: '{"action":"Sign"}'
    };
    $cmp.post(haagendazs, function(error, response, data) {
        if (!error) {
            try {
                const result = JSON.parse(data)
                if (result.state == "success") {
                    $cmp.notify(CookieName, "签到成功！🎉", "签到获得 " + result.score + " 积分。")
                } else if (result.state == "signed") {
                    $cmp.notify(CookieName, "重复签到！🍦", "今日获得 " + result.score + " 积分～")
                } else {
                    console.log("HaagenDazs failed response : \n" + data)
                    $cmp.notify(CookieName, "签到失败‼️ 详情请见日志。", data)
                }
            } catch (e) {
                $cmp.notify(CookieName, "Cookie 未获取或失效❗", "请按脚本开头注释完成配置并首次或重新获取 Cookie。")
            }
        } else {
            $cmp.notify(CookieName,  "签到接口请求失败，详情请见日志。", error)
        }
    })
}

function compatibility() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
    const isNode = typeof require == "function" && !isJSBox;
    const node = (() => {
        if (isNode) {
            const request = require('request');
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
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data);
                callback(error, adapterStatus(resp.response), body)
            };
            $http.get(options);
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
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.post(options);
        }
    }
    const log = (message) => console.log(message)
    const done = (value = {}) => {
        if (isQuanX) isRequest ? $done(value) : null
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return { isQuanX, isSurge, isJSBox, isRequest, notify, write, read, get, post, log, done }
}