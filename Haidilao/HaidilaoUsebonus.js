/*
"海底捞"app自动签到，支持 Quantumult X（理论上也支持 Surge，未尝试）。
请先按下述方法进行配置，进入"海底捞"app，手动签到一次或点击"签到"，若弹出"首次写入海底捞等级 Token 成功"及"首次写入海底捞签到 Cookie 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"海底捞 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。
Author：zZPiglet

Quantumult X (TestFlight 195+, App Store:1.0.6+):
[task_local]
1 0 * * * HaidilaoUsebonus.js
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/Haidilao/HaidilaoUsebonus.js
[rewrite_local]
^https:\/\/superapp\.kiwa-tech\.com\/app\/coupon\/customerLevelShow url script-request-body HaidilaoUsebonus.js
^https:\/\/activity-1\.m\.duiba\.com\.cn\/signactivity\/getSignInfo url script-request-header HaidilaoUsebonus.js
or remote
^https:\/\/superapp\.kiwa-tech\.com\/app\/coupon\/customerLevelShow url script-request-body https://raw.githubusercontent.com/zZPiglet/Task/master/Haidilao/HaidilaoUsebonus.js
^https:\/\/activity-1\.m\.duiba\.com\.cn\/signactivity\/getSignInfo url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/Haidilao/HaidilaoUsebonus.js

Surge 4.0+:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Haidilao/HaidilaoUsebonus.js
http-request ^https:\/\/superapp\.kiwa-tech\.com\/app\/coupon\/customerLevelShow requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Haidilao/HaidilaoUsebonus.js
http-request ^https:\/\/activity-1\.m\.duiba\.com\.cn\/signactivity\/getSignInfo script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Haidilao/HaidilaoUsebonus.js


All app:
[mitm]
hostname = superapp.kiwa-tech.com, activity-1.m.duiba.com.cn,

获取完 Token 后可不注释 rewrite / mitm，Token 更新时会弹窗。若因 mitm 导致"海底捞"网络不稳定，可注释掉 mtim。
*/

const LevelURL = 'https://superapp.kiwa-tech.com/app/coupon/customerLevelShow'
const CoinURL = 'https://superapp.kiwa-tech.com/app/coinCommodity/getCoin'
const CheckinURL = 'https://activity-1.m.duiba.com.cn/signactivity/doSign'
const SignURL = 'https://activity-1.m.duiba.com.cn/customActivity/haidilao/signpet/feed'
const ResultURL = 'https://activity-1.m.duiba.com.cn/signpet/getPetsInfo?activityId=27'
const TokenName = '海底捞等级'
const TokenHeaderKey = 'hilh'
const TokenBodyKey = 'hilb'
const CookieName = '海底捞签到'
const CookieHeaderKey = 'hich'
const datainfo = {}
const $cmp = compatibility()

async function Sign() {
    await GetLevel()
    await GetCoin()
    await Checkin()
    await GetData()
    await Usebonus()
    await notify()
}

if ($cmp.isRequest) {
    Get()
    $cmp.done()
} else {
    Sign()
    $cmp.done()
}

function Get() {
    if ($request && $request.method == "POST" && $request.url.indexOf('Level') >= 0) {
        var TokenValue = $request.headers['Cookie']
        var BodyValue = $request.body
        $cmp.write(BodyValue, TokenBodyKey)
        if ($cmp.read(TokenHeaderKey) != (undefined || null)) {
            if ($cmp.read(TokenHeaderKey) != TokenValue) {
                var token = $cmp.write(TokenValue, TokenHeaderKey)
                if (!token) {
                    $cmp.notify("更新" + TokenName + " Token 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + TokenName + " Token 成功 🎉", "", "")
                }
            }
        } else {
            var token = $cmp.write(TokenValue, TokenHeaderKey);
            if (!token) {
                $cmp.notify("首次写入" + TokenName + " Token 失败‼️", "", "")
            } else {
                $cmp.notify("首次写入" + TokenName + " Token 成功 🎉", "", "")
            }
        }
    } else if ($request && $request.method == "POST" && $request.url.indexOf('getSignInfo') >= 0) {
        var CookieValue = $request.headers['Cookie']
        if ($cmp.read(CookieHeaderKey) != (undefined || null)) {
            if ($cmp.read(CookieHeaderKey) != CookieValue) {
                var cookie = $cmp.write(CookieValue, CookieHeaderKey)
                if (!cookie) {
                    $cmp.notify("更新" + CookieName + " Cookie 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + CookieName + " Cookie 成功 🎉", "", "")
                }
            }
        } else {
            var cookie = $cmp.write(CookieValue, CookieHeaderKey);
            if (!cookie) {
                $cmp.notify("首次写入" + CookieName + " Cookie 失败‼️", "", "")
            } else {
                $cmp.notify("首次写入" + CookieName + " Cookie 成功 🎉", "", "")
            }
        }
    } else {
        $cmp.notify("写入" + TokenName + " Token 及 " + CookieName + " Cookie 失败‼️", "", "配置错误, 无法读取请求头, ")
    }
}

function GetLevel() {
    return new Promise(resolve => {
        let HiLevel = {
            url: LevelURL,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Cookie": $cmp.read('hilh'),
            },
            body: $cmp.read("hilb")
        }
        $cmp.post(HiLevel, function (error, response, data) {
            try {
                const obj1 = JSON.parse(data)
                const customerlevel = ["红海会员", "银海会员",  "金海会员", "黑海会员"]
                datainfo.level = customerlevel[obj1.data.level - 1]
                resolve ('done')
            } catch (e) {
                $cmp.notify("海底捞等级"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function GetCoin() {
    return new Promise(resolve => {
        let HiCoin = {
            url: CoinURL,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Cookie": $cmp.read('hilh'),
            },
            body: $cmp.read("hilb")
        }
        $cmp.post(HiCoin, function (error, response, data) {
            try {
                const obj2 = JSON.parse(data)
                datainfo.coin = obj2.data
                resolve ('done')
            } catch (e) {
                $cmp.notify("海底捞捞币"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function Checkin() {
    return new Promise(resolve => {
        let HiCheckin = {
            url: CheckinURL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": $cmp.read("hich"),
                "Referer": "https://activity-1.m.duiba.com.cn/signpet/index?activityId=27&from=login&spm=47663.1.1.1",
            },
            body: "id=524&signActType=2"
        }
        $cmp.post(HiCheckin, function (error, response, data) {
            try {
                if (error) {
                    datainfo.error = 0
                    datainfo.errormessage = error
                } else {
                    const obj3 = JSON.parse(data)
                    if (obj3.success == true && obj3.signInfoVO.todaySigned == true) {
                        datainfo.success = 0
                        datainfo.bonus = obj3.customInfo.foodNum
                        datainfo.days = obj3.signInfoVO.continueDay
                    } else if (obj3.success == false && obj3.signInfoVO.todaySigned == true) {
                        datainfo.success = 2
                        datainfo.days = obj3.signInfoVO.continueDay
                    } else {
                        $cmp.log("hicheckin failed response : \n" + data)
                        datainfo.error = 2
                        datainfo.errormessage = data
                    }
                }
                resolve ('done')
            } catch (e) {
                $cmp.notify("海底捞签到"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function GetData() {
    return new Promise(resolve => {
        let HiData = {
            url: ResultURL,
            headers: {
                "Cookie": $cmp.read("hich")
            }
        }
        $cmp.get(HiData, function (error, response, data) {
            try {
                const obj4 = JSON.parse(data)
                datainfo.allbonus = obj4.data.foodNum
                datainfo.bonusname = obj4.data.foodName
                /*for (i = 0; i < obj4.data.pets.length; i++) {
                    datainfo.petid[i] = obj4.data.pets[i].id
                    $cmp.log(datainfo.petid[i])
                }*/
                datainfo.petid = obj4.data.pets[0].id
                resolve ('done')
            } catch (e) {
                $cmp.notify("海底捞结果"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function Usebonus() {
    return new Promise(resolve => {
        let HiSign = {
            url: SignURL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": $cmp.read("hich"),
                "Referer": "https://activity-1.m.duiba.com.cn/signpet/index?activityId=27&from=login&spm=47663.1.1.1",
            },
            body: "petId=" + datainfo.petid + "&activityId=27"
        }
        $cmp.post(HiSign, function (error, response, data) {
            try {
                if (error) {
                    datainfo.serror = 0
                    datainfo.errormessage = error
                } else {
                    const obj5 = JSON.parse(data)
                    if (obj5.success == true) {
                        datainfo.ssuccess = 0
                    } else if (obj5.success == false) {
                        datainfo.ssuccess = 2
                        $cmp.log(obj5)
                    } else {
                        $cmp.log("hicheckin failed response : \n" + data)
                        datainfo.serror = 2
                        datainfo.errormessage = data
                    }
                }
                resolve ('done')
            } catch (e) {
                $cmp.notify("海底捞签到"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function notify() {
    return new Promise(resolve => {
        try {
            const sub = "尊敬的" + datainfo.level + "，您共有 " + datainfo.coin + " 捞币。"
            if (datainfo.success == 0) {
                let msg1 = "连签 " + datainfo.days + " 天，今日获得 " + datainfo.bonus + " " + datainfo.bonusname + ", 共有 " + datainfo.allbonus + " " + datainfo.bonusname + "！♨️"
                $cmp.notify("海底捞🍲 - 签到成功！🎉", sub, msg1)
            } else if (datainfo.success == 2) {
                let msg2 = "连签 " + datainfo.days + " 天，共有 " + datainfo.allbonus + " " + datainfo.bonusname + "！♨️"
                $cmp.notify("海底捞🍲 - 重复签到！😊", sub, msg2)
            } else if (datainfo.error == 0) {
                $cmp.notify("海底捞🍲 - 签到接口请求失败", "", datainfo.errormessage)
            } else if (datainfo.error == 2) {
                $cmp.notify("海底捞🍲 - 签到失败‼️", "", datainfo.errormessage)
            }
            resolve('done')
        } catch (e) {
            $cmp.notify("通知模块 " + e.name + "‼️", JSON.stringify(e), e.message)
            resolve('done')
        }
    })
}

function compatibility(){const e="undefined"!=typeof $request,t="undefined"!=typeof $httpClient,r="undefined"!=typeof $task,n="undefined"!=typeof $app&&"undefined"!=typeof $http,o="function"==typeof require&&!n,s=(()=>{if(o){const e=require("request");return{request:e}}return null})(),i=(e,s,i)=>{r&&$notify(e,s,i),t&&$notification.post(e,s,i),o&&a(e+s+i),n&&$push.schedule({title:e,body:s?s+"\n"+i:i})},u=(e,n)=>r?$prefs.setValueForKey(e,n):t?$persistentStore.write(e,n):void 0,d=e=>r?$prefs.valueForKey(e):t?$persistentStore.read(e):void 0,l=e=>(e&&(e.status?e.statusCode=e.status:e.statusCode&&(e.status=e.statusCode)),e),f=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="GET",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.get(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.get(e))},p=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.post(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request.post(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.post(e))},a=e=>console.log(e),y=(n={})=>{if(r)return $done(n);t&&(e?$done(n):$done())};return{isQuanX:r,isSurge:t,isJSBox:n,isRequest:e,notify:i,write:u,read:d,get:f,post:p,log:a,done:y}}
