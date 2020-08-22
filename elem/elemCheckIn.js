/*
"饿了么" app(9.0.10) "我的 - 打卡领红包"自动签到，支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。
默认已使用 elemSign.js，故请先使用 elemGetCookies.js 获取 Token。(https://github.com/songyangzz/QuantumultX/blob/master/elem/elemGetCookies.js)
到 cron 设定时间自动签到时，若弹出"饿了么 - 打卡领红包 - 打卡成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet

Quantumult X (App Store:1.0.5+, TestFlight 190+):
[task_local]
1 0 * * * elemCheckIn.js, tag=饿了么-打卡领红包
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/elem/elemCheckIn.js, tag=饿了么-打卡领红包

Surge 4.0+ & Loon:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/elem/elemCheckIn.js
*/

const CheckInURL = 'https://h5.ele.me/restapi/acquisition/dailyCheckIn/v1/checkIn'
const $cmp = compatibility()
Checkin()
$cmp.done()

function Checkin() {
    let subTitle = ''
    let detail = ''
    const daily = {
        url: CheckInURL,
        headers: {
            "Cookie": $cmp.read("cookie_elem")
        }
    }
    $cmp.post(daily, function(error, response, data) {
        if (!error) {
            if (response.statusCode == 401) {
                subTitle += 'Token 未获取或失效❗'
                detail += '请按脚本开头注释完成配置并首次或重新获取 Token。'
            } else {
                const result = JSON.parse(data)
                if (result.code == 200) {
                    subTitle += '打卡成功！🍗'
                    let todayearn = result.data.checkInAmount / 100
                    let total = result.data.currentAmount / 100
                    detail += '打卡获得 ' + todayearn + ' 元，账户共有 ' + total + ' 元红包。'
                } else if (result.code == 4003) {
                    subTitle += '重复打卡！🥡'
                    detail += result.message
                } else {
                    subTitle += '打卡失败‼️ 详情请见日志。'
                    detail += data
                    $cmp.log("elem failed response : \n" + data)
                }
            }
        } else {
            subTitle += '打卡接口请求失败，详情请见日志。'
            detail += error
            $cmp.log("elem failed response : \n" + error)
        }
        $cmp.notify('饿了么 - 打卡领红包', subTitle, detail)
    })
}

function compatibility(){const e="undefined"!=typeof $request,t="undefined"!=typeof $httpClient,r="undefined"!=typeof $task,n="undefined"!=typeof $app&&"undefined"!=typeof $http,o="function"==typeof require&&!n,s=(()=>{if(o){const e=require("request");return{request:e}}return null})(),i=(e,s,i)=>{r&&$notify(e,s,i),t&&$notification.post(e,s,i),o&&a(e+s+i),n&&$push.schedule({title:e,body:s?s+"\n"+i:i})},u=(e,n)=>r?$prefs.setValueForKey(e,n):t?$persistentStore.write(e,n):void 0,d=e=>r?$prefs.valueForKey(e):t?$persistentStore.read(e):void 0,l=e=>(e&&(e.status?e.statusCode=e.status:e.statusCode&&(e.status=e.statusCode)),e),f=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="GET",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.get(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.get(e))},p=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.post(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request.post(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.post(e))},a=e=>console.log(e),y=(n={})=>{if(r)return $done(n);t&&(e?$done(n):$done())};return{isQuanX:r,isSurge:t,isJSBox:n,isRequest:e,notify:i,write:u,read:d,get:f,post:p,log:a,done:y}}