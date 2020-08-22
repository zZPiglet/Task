/*
"滴滴出行" app 打车后忘领取的福利金自动领取，支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。
默认已使用 DiDi.js，故请先使用 DiDi.js 获取 Token。
到 cron 设定时间自动签到时，若弹出"滴滴出行 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet

----------
版本记录：
- 2020/06/12：
因为最近没有打车所以并未进行任何一次测试，请反馈问题以及时修正。
由于暂时不确定此福利金领取期限，建议每天 23:59 执行此脚本。此脚本与主脚本暂时区分为两个脚本，未后续 aff 考虑建议主脚本不要太晚运行。若后期测试打车后福利金领取期限更长，考虑将此脚本合并至主脚本。
----------

Quantumult X (App Store:1.0.5+, TestFlight 190+):
[task_local]
59 23 * * * DiDi_reward.js
or remote
59 23 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_reward.js

Surge 4.0+ & Loon:
[Script]
cron "59 23 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_reward.js
*/

const mainURL = 'https://api.udache.com/gulfstream/passenger/v2/other/'
const $cmp = compatibility()
const token = encodeURIComponent($cmp.read("DiDi"))
Checkin()
$cmp.done()

function Checkin() {
    let listURL = mainURL + 'pListReward?token=' + token
    const list = {
        url: listURL
    }
    $cmp.get(list, function(error, response, data) {
        if (!error) {
            let listresult = JSON.parse(data)
            if (listresult.errno == 0) {
                if (listresult.data) {
                    let total = 0
                    for (let l of listresult.data) {
                        let order_id = l.oid
                        let rewardURL = mainURL + 'pGetRewards?order_id=' + order_id + '&token=' + token
                        const reward = {
                            url: rewardURL
                        }
                        $cmp.get(reward, function (error, response, data) {

                        })
                        total += Number(l.bonus_info.amount)
                    }
                    $cmp.notify('滴滴出行 - 遗忘的福利金', '', '捡回遗忘的 ' + total + ' 元福利金。🤸🏼')
                } else {
                    $cmp.notify('滴滴出行 - 遗忘的福利金', '', '今天没有忘记领取的福利金～ 🎉')
                }
            } else {
                $cmp.notify('滴滴出行 - 遗忘的福利金', 'Token 未获取或失效❗', '请按脚本开头注释完成配置并首次或重新获取 Token。\n' + listresult.errmsg)
                $cmp.log("DiDi_reward failed response : \n" + listresult)
            }
        } else {
            $cmp.notify('滴滴出行 - 遗忘的福利金', '领取接口请求失败，详情请见日志。', error)
            $cmp.log("DiDi_reward failed response : \n" + error)
        }
    })
}

function compatibility(){const e="undefined"!=typeof $request,t="undefined"!=typeof $httpClient,r="undefined"!=typeof $task,n="undefined"!=typeof $app&&"undefined"!=typeof $http,o="function"==typeof require&&!n,s=(()=>{if(o){const e=require("request");return{request:e}}return null})(),i=(e,s,i)=>{r&&$notify(e,s,i),t&&$notification.post(e,s,i),o&&a(e+s+i),n&&$push.schedule({title:e,body:s?s+"\n"+i:i})},u=(e,n)=>r?$prefs.setValueForKey(e,n):t?$persistentStore.write(e,n):void 0,d=e=>r?$prefs.valueForKey(e):t?$persistentStore.read(e):void 0,l=e=>(e&&(e.status?e.statusCode=e.status:e.statusCode&&(e.status=e.statusCode)),e),f=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="GET",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.get(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.get(e))},p=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.post(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request.post(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.post(e))},a=e=>console.log(e),y=(n={})=>{if(r)return $done(n);t&&(e?$done(n):$done())};return{isQuanX:r,isSurge:t,isJSBox:n,isRequest:e,notify:i,write:u,read:d,get:f,post:p,log:a,done:y}}