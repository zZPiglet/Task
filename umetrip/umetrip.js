/*
"航旅纵横(Pro)" app 自动签到，支持 Quantumult X（理论上也支持 Surge、Loon、shadowrocket，未尝试）。
请先按下述方法进行配置，进入"航旅纵横(Pro)" - "出行有礼" - "每日签到"，若弹出"首次写入 umetrip id 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"航旅纵横 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet


Quantumult X:
[task_local]
0 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/umetrip/umetrip.js, tag=航旅纵横

[rewrite_local]
^https:\/\/cloud\.umetrip\.com\/gateway\/api\/web\/rest\/polite\/app\/sign\/signpageinitdata url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/umetrip/umetrip.js


Surge & Loon:
[Script]
cron "0 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/umetrip/umetrip.js
http-request ^https:\/\/cloud\.umetrip\.com\/gateway\/api\/web\/rest\/polite\/app\/sign\/signpageinitdata script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/umetrip/umetrip.js

All app:
[mitm]
hostname = cloud.umetrip.com

获取完 id 后可不注释 rewrite / hostname，id 更新时会弹窗。若因 MitM 导致该软件网络不稳定，可注释掉 hostname。
*/

const $ = new API("umetrip");
$.debug = [true, "true"].includes($.read("debug")) || false;
const ERR = MYERR();
const mainURL = "https://cloud.umetrip.com/gateway/api/web/rest/polite/app";
$.subTitle = "";
$.detail = "";

if ($.isRequest) {
    getId();
    $.done({});
} else {
    !(async () => {
        $.id = $.read("id");
        if (!$.id) {
            throw new ERR.IdError("❌ 未获取或填写 id");
        } else {
            await sign();
            //await getInfo();
            await $.notify("航旅纵横", $.subTitle, $.detail);
        }
    })().catch((err) => {
        if (err instanceof ERR.IdError) {
            $.notify("航旅纵横 - id 错误", "", err.message);
        } else if (err instanceof ERR.SignError) {
            $.notify("航旅纵横 - 出现错误", "", err.message);
        } else {
            $.notify("航旅纵横 - 未知错误", "", JSON.stringify(err, Object.getOwnPropertyNames(err)));
            $.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        }
    }).finally(() => $.done())
}

function sign() {
    return $.post({
        url: mainURL + "/sign/usersign",
        headers: { "rsid": $.id },
        body: "{}"
    })
        .then((resp) => {
            $.log(resp);
            let obj = JSON.parse(resp.body);
            if (obj.errCode == 0) {
                $.subTitle += "签到成功 🛫";
                $.detail += "签到获得 " + Number(obj.result.random + obj.result.awardBean) + " 旅豆。";
            } else if (obj.errMsg == "今天已经签到了") {
                $.subTitle += "签到重复 🛬";
            } else {
                throw new ERR.SignError(obj.errMsg);
            }
        })
        .catch((err) => {
            throw err;
        })
}

function getInfo() {
    return $.post({
        url: mainURL + "/sign/signpageinitdata",
        headers: { "rsid": $.id },
        body: "{}"
    })
        .then((resp) => {
            $.log("getinfo: " + JSON.stringify(resp.body));
            let obj = JSON.parse(resp.body);
            $.detail += "账户共有 " + obj.result.userInfo.lvdou + " 旅豆。";
        })
        .catch((err) => {
            throw err;
        })
}

function getId() {
    let idreg = /\w+/;;
    if ($request.headers["rsid"]) {
        let id = idreg.exec($request.headers["rsid"])[0];
        if ($.read("id") != (undefined || null)) {
            if ($.read("id") != h_id) {
                $.write(id, "id")
                $.notify("更新 " + $.name + " id 成功 🎉", "", "")
            }
        } else {
            $.write(id, "id")
            $.notify("首次写入 " + $.name + " id 成功 🎉", "", "")
        }
    } else {
        $.notify("写入" + $.name + "id 失败‼️", "", "配置错误, 无法读取请求头, ")
    }
}

function MYERR() {
    class IdError extends Error {
        constructor(message) {
            super(message);
            this.name = "IdError";
        }
    }

    class SignError extends Error {
        constructor(message) {
            super(message);
            this.name = "SignError";
        }
    }
  
    return {
        IdError,
        SignError,
    };
}

function API(s="untitled",t=!1){return new class{constructor(s,t){this.name=s,this.debug=t,this.isRequest="undefined"!=typeof $request,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){const s="undefined"!=typeof $request?void 0:require("request"),t=require("fs");return{request:s,fs:t}}return null})(),this.initCache();const e=(s,t)=>new Promise(function(e){setTimeout(e.bind(null,t),s)});Promise.prototype.delay=function(s){return this.then(function(t){return e(s,t)})}}get(s){return this.isQX?("string"==typeof s&&(s={url:s,method:"GET"}),$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.get(s,(s,i,o)=>{s?e(s):t({statusCode:i.status,headers:i.headers,body:o})}):this.node.request(s,(s,i,o)=>{s?e(s):t({...i,statusCode:i.statusCode,body:o})})})}post(s){return this.isQX?("string"==typeof s&&(s={url:s}),s.method="POST",$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.post(s,(s,i,o)=>{s?e(s):t({statusCode:i.status,headers:i.headers,body:o})}):this.node.request.post(s,(s,i,o)=>{s?e(s):t({...i,statusCode:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let s="root.json";this.node.fs.existsSync(s)||this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.root={},s=`${this.name}.json`,this.node.fs.existsSync(s)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.cache={})}}persistCache(){const s=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(s,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(s,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,s,{flag:"w"},s=>console.log(s)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},s=>console.log(s)))}write(s,t){this.log(`SET ${t}`),-1!==t.indexOf("#")?(t=t.substr(1),(this.isSurge||this.isLoon)&&$persistentStore.write(s,t),this.isQX&&$prefs.setValueForKey(s,t),this.isNode&&(this.root[t]=s)):this.cache[t]=s,this.persistCache()}read(s){return this.log(`READ ${s}`),-1===s.indexOf("#")?this.cache[s]:(s=s.substr(1),this.isSurge||this.isLoon?$persistentStore.read(s):this.isQX?$prefs.valueForKey(s):this.isNode?this.root[s]:void 0)}delete(s){this.log(`DELETE ${s}`),-1!==s.indexOf("#")?(s=s.substr(1),(this.isSurge||this.isLoon)&&$persistentStore.write(null,s),this.isQX&&$prefs.removeValueForKey(s),this.isNode&&delete this.root[s]):delete this.cache[s],this.persistCache()}notify(t=s,e="",i="",o,n){const r=i+(null==o?"":`\n\n跳转链接：${o}`)+(null==n?"":`\n\n多媒体链接：${n}`);if(this.isSurge&&$notification.post(t,e,r),this.isQX){let s={};o&&(s["open-url"]=o),n&&(s["media-url"]=n),"{}"==JSON.stringify(s)?$notify(t,e,i):$notify(t,e,i,s)}if(this.isLoon){let s={};o&&(s.openUrl=o),n&&(s.mediaUrl=n),"{}"==JSON.stringify(s)?$notification.post(t,e,i):$notification.post(t,e,i,s)}if(this.isNode)if(this.isJSBox){const s=require("push");s.schedule({title:t,body:e?e+"\n"+i:i})}else console.log(`${t}\n${e}\n${r}\n\n`)}log(s){this.debug&&console.log(s)}info(s){console.log(s)}error(s){console.log("ERROR: "+s)}wait(s){return new Promise(t=>setTimeout(t,s))}done(s={}){this.isQX||this.isLoon||this.isSurge?this.isRequest?$done(s):$done():this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=s.headers,$context.statusCode=s.statusCode,$context.body=s.body)}}(s,t)}