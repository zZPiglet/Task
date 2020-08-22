/*
微信小程序"奈雪点单"自动签到，支持 Quantumult X（理论上也支持 Surge，未尝试）。
请先按下述方法进行配置，进入"奈雪点单"小程序，若弹出"首次写入奈雪の茶 Token 成功"即可正常食用，请先手动执行一次脚本后再回到小程序，点击"我的"进行授权登陆查看签到积分是否增加，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"奈雪の茶 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。
Author：zZPiglet

Quantumult X (App Store:1.0.5+, TestFlight 190+):
[task_local]
1 0 * * * Naixue.js
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/Naixue/Naixue.js

[rewrite_local]
^https:\/\/webapi\.qmai\.cn\/web\/cy\/v\d\/store\/template-scene url script-request-header Naixue.js
or remote
^https:\/\/webapi\.qmai\.cn\/web\/cy\/v\d\/store\/template-scene https://raw.githubusercontent.com/zZPiglet/Task/master/Naixue/Naixue.js


Surge 4.0+:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Naixue/Naixue.js
http-request ^https:\/\/webapi\.qmai\.cn\/web\/cy\/v\d\/store\/template-scene script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Naixue/Naixue.js

All app:
[mitm]
hostname = webapi.qmai.cn

获取完 Token 后可不注释 rewrite / hostname，Token 更新时会弹窗。若因 MitM 导致该软件或小程序网络不稳定，可注释掉 hostname。
*/

const aff = true //新用户若不想提供 aff 请改为 false。
const CheckinURL = 'https://webapi.qmai.cn/web/marketing/attendance/user_attendance'
const TokenName = '奈雪の茶'
const TokenKey = 'Naixue'
const appid = 'wxab7430e6e8b9a4ab'
const cardNo = '405831385964130305'
const $cmp = compatibility()

if ($cmp.isRequest) {
    GetToken()
    $cmp.done()
} else {
    if (aff) {
        Affiliate()
    }
    Checkin()
    $cmp.done()
}

function GetToken() {
    if ($request.headers['Qm-User-Token']) {
        var TokenValue = $request.headers['Qm-User-Token']
        if ($cmp.read(TokenKey) != (undefined || null)) {
            if ($cmp.read(TokenKey) != TokenValue) {
                var token = $cmp.write(TokenValue, TokenKey)
                if (!token) {
                    $cmp.notify("更新" + TokenName + " Token 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + TokenName + " Token 成功 🎉", "", "")
                }
            }
        } else {
            var token = $cmp.write(TokenValue, TokenKey);
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

function Affiliate() {
    const commonheaders = {
        "Content-Type": "application/json",
        "Qm-From": "wechat",
        "Qm-User-Token": $cmp.read("Naixue"),
    }
    const detail = {
        url: 'https://webapi.qmai.cn/web/marketing/old_newer/detail?user_id=' + cardNo + '&appid=' + appid,
        headers: commonheaders
    }
    $cmp.get(detail, function (error, response, data) {
        const obj = JSON.parse(data)
        const user_str = obj.data.user_str
        const old_new_activties_id = obj.data.old_rules[0].old_new_activties_id
        const user = {
            url: 'https://webapi.qmai.cn/web/marketing/old_newer/user',
            headers: commonheaders,
            body: '{"user_str":"' + user_str + '","old_new_activties_id":' + old_new_activties_id + ',"appid":"' + appid + '"}'
        }
        $cmp.post(user, function (error, response, data) {
            const thx = JSON.parse(data)
            $cmp.log(thx.message)
        })
    })
}

function Checkin() {
    const nxdc = {
        url: CheckinURL,
        headers: {
            "Qm-From": "wechat",
            "Qm-User-Token": $cmp.read("Naixue"),
        },
        body: '{"appid":"' + appid + '"}'
    };
    $cmp.post(nxdc, function(error, response, data) {
        const result = JSON.parse(data)
        if (!error) {
            if (result.code == 150200) {
                $cmp.notify(TokenName, "", "签到成功！🎉")
            } else if (result.code == 150201) {
                $cmp.notify(TokenName, "",  "重复签到！😊")
            } else if (result.code == 9001 || result.code ==58000) {
                $cmp.notify(TokenName, "", "Token 失效❗ 请重新获取。️")
            } else {
                console.log("Naixue failed response : \n" + data)
                $cmp.notify(TokenName, "签到失败‼️ 详情请见日志。", data)
            }
        } else {
            $cmp.notify(TokenName,  "签到接口请求失败，详情请见日志。", error)
        }
    })
}

function compatibility(){const e="undefined"!=typeof $request,t="undefined"!=typeof $httpClient,r="undefined"!=typeof $task,n="undefined"!=typeof $app&&"undefined"!=typeof $http,o="function"==typeof require&&!n,s=(()=>{if(o){const e=require("request");return{request:e}}return null})(),i=(e,s,i)=>{r&&$notify(e,s,i),t&&$notification.post(e,s,i),o&&a(e+s+i),n&&$push.schedule({title:e,body:s?s+"\n"+i:i})},u=(e,n)=>r?$prefs.setValueForKey(e,n):t?$persistentStore.write(e,n):void 0,d=e=>r?$prefs.valueForKey(e):t?$persistentStore.read(e):void 0,l=e=>(e&&(e.status?e.statusCode=e.status:e.statusCode&&(e.status=e.statusCode)),e),f=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="GET",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.get(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.get(e))},p=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.post(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request.post(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.post(e))},a=e=>console.log(e),y=(n={})=>{if(r)return $done(n);t&&(e?$done(n):$done())};return{isQuanX:r,isSurge:t,isJSBox:n,isRequest:e,notify:i,write:u,read:d,get:f,post:p,log:a,done:y}}