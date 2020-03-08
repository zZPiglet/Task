/*
掌门好老师自动签到，支持Quantumult X、Surge。
制作者：Piglet

[task_local]
1 0 * * * ZMTeacher.js

[rewrite_local]
^https:\/\/teacherapi\.zmlearn\.com\/v1\/teacherApp\/app\/points\/sign url script-request-header ZMTeacher.js

[mitm]
hostname = teacherapi.zmlearn.com
*/

const CheckinURL = 'https://teacherapi.zmlearn.com/v1/teacherApp/app/points/sign';
const TokenName = '掌门好老师';
const TokenKey = 'zmteacher';
const $cmp = compatibility();

if ($cmp.isRequest) {
    GetToken()
    $cmp.end()
} else {
    Checkin()
    $cmp.end()
}

function GetToken() {
    if ($request.headers['token']) {
        var TokenValue = $request.headers['token'];
        if ($cmp.read(TokenKey) != (undefined || null)) {
            if ($cmp.read(TokenKey) != TokenValue) {
                var token = $cmp.write(TokenValue, TokenKey);
                if (!token) {
                    $cmp.notify("更新" + TokenName + " Token 失败‼️", "", "");
                } else {
                    $cmp.notify("更新" + TokenName + " Token 成功 🎉", "", "");
                }
            }
        } else {
            var token = $cmp.write(TokenValue, TokenKey);
            if (!token) {
                $cmp.notify("首次写入" + TokenName + " Token 失败‼️", "", "");
            } else {
                $cmp.notify("首次写入" + TokenName + " Token 成功 🎉", "", "");
            }
        }
    } else {
        $cmp.notify("写入" + TokenName + "Token 失败‼️", "", "配置错误, 无法读取请求头, ");
    }
}

function Checkin() {
    const ZMT = {
        url: CheckinURL,
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Api-Version": "4.3.0",
            "Connection": "keep-alive",
            "Content-Length": "2",
            "Content-Type": "application/json",
            "Cookie": "sessionId=",
            "Host": "teacherapi.zmlearn.com",
            "User-Agent": "ZMClientTeacher/432 CFNetwork/1121.2.2 Darwin/19.3.0",
            "platform": "ios_phone",
            "token": $cmp.read("zmteacher"),
            "version": "4.3.1",
            "version_code": "432",
        }
    };
    $cmp.post(ZMT, function(error, response, data) {
        const result = JSON.parse(data);
        if (!error) {
            if (result.code == 0) {
                console.log("ZMTeacher success response : \n" + data)
                var Days = result.data.lcountDay;
                var Points = result.data.eranPoints;
                var msg = "您已连续签到 " + Days + " 天，获得 " + Points + " 彩虹币！ 🌈";
                $cmp.notify("掌门好老师 - 签到成功！🎉", "", msg)
            } else if (result.code == 1) {
                $cmp.notify("掌门好老师 - 重复签到!😊", "", result.message)
            } else if (result.code == 11) {
                $cmp.notify("掌门好老师 - Token 失效❗️", "", result.message)
            } else {
                console.log("ZMTeacher failed response : \n" + data)
                $cmp.notify("掌门好老师 - 签到失败‼️", "", data)
            }
        } else {
            $cmp.notify("掌门好老师 - 签到接口请求失败", "", error)
        }
    })
}

function compatibility() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, post, end }
};
