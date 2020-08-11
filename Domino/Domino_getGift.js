/*
此脚本为 Domino_getSMS.js 后续「获取奖励」脚本，请勿单独使用。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet
*/

const $ = new API("Domino");
const ERR = MYERR();
$.debug = [true, "true"].includes($.read("debug")) || false;
$.openid = $.read("openid");
$.phonenum = $.read("phonenum");
$.sec = $.read("sec");
$.smscode = $.read("smscode");
$.score = Number($.read("score") || 400);

const gift = {
    "1": "一等奖：免费 9″ 手拍扇贝大虾豪华比萨 1 个（共3000个）（需任意消费）",
    "2": "二等奖：半价 9″ 手拍扇贝大虾豪华比萨 1 个（共5000个）（需任意消费）",
    "3": "三等奖：买任意比萨送咖喱牛腩焗饭一份（共20000份）",
    "4": "四等奖：买任意比萨送酥嫩狭雪鱼粒一份（共50000份）",
    "5": "五等奖：买任意比萨送免费洋葱黄金圈一份（人人有礼，未获得 1-4 等奖的参与者均可得）"
}

!(async () => {
    if (!$.phonenum || !$.sec || !$.openid) {
        throw new ERR.RequestBodyError("❌ 请按 Domino_getSMS.js 脚本开头配置获取信息。");
    } else if (!$.smscode) {
        throw new ERR.SMSCodeError("❌ 验证码未填写或未保存。");
    } else {
        await getGift();
        await getGiftCode();
    }
})().catch((err) => {
    if (err instanceof ERR.RequestBodyError) {
        $.notify("达美乐 - 奖励", "缺失信息", err.message);
    } else if (err instanceof ERR.SMSCodeError) {
        $.notify("达美乐 - 奖励", "无验证码", err.message); 
    } else if (err instanceof ERR.BodyError) {
        $.notify("达美乐 - 奖励", "响应错误", err.message); 
    } else {
        $.notify("达美乐 - 奖励", "出现错误", JSON.stringify(err));
        $.error(JSON.stringify(err));
    }
}).finally($.done())


function getGift() {
    return $.post({
        url: "http://dominos0724.shjimang.com/Ajax/GetGift",
        headers: {
            "Content-Type": "application/json",
            "Cookie": "Web2005=controller=Home&action=Default&OpenId=" + $.openid + "&id=",
            "Host": "dominos0724.shjimang.com",
            "Origin": "http://dominos0724.shjimang.com",
            "Referer": "http://dominos0724.shjimang.com/Home/Default?utm_source=weixin&utm_campaign=0724%E6%89%87%E8%B4%9D&utm_channel=%E5%85%AC%E4%BC%97%E5%8F%B7&utm_content=%E8%8F%9C%E5%8D%95"
        },
        body: '{"sec":"' + $.sec + '","code":"' + $.smscode + '","mobile":' + $.phonenum + ',"score":' + $.score + '}'
    })
        .then((resp) => {
            $.log("getGift: " + JSON.stringify(resp.body));
            let obj = JSON.parse(resp.body);
            if (obj.Code == "1000") {
                $.giftcode = obj.Data.Id;
            } else if (obj.Code == "1001") {
                throw new ERR.BodyError(obj.Msg + "\n请检查 BoxJs 中验证码是否正确或删除重填。");
            } else if (obj.Code == "1001.4") {
                throw new ERR.BodyError(obj.Msg);
            } else {
                $.error("getGift ERROR: " + JSON.stringify(resp.body));
                throw new ERR.BodyError("❌ 获取奖励返回错误，请查看日志并反馈。\n" + JSON.stringify(resp.body));
            }
        })
        .catch((err) => {
            throw err;
        })
}

function getGiftCode() {
    return $.post({
        url: "http://dominos0724.shjimang.com/Ajax/GetGiftCode",
        headers: {
            "Content-Type": "application/json",
            "Cookie": "Web2005=controller=Home&action=Default&OpenId=" + $.openid,
            "Host": "dominos0724.shjimang.com",
            "Origin": "http://dominos0724.shjimang.com",
            "Referer": "http://dominos0724.shjimang.com/Home/Default?utm_source=weixin&utm_campaign=0724%E6%89%87%E8%B4%9D&utm_channel=%E5%85%AC%E4%BC%97%E5%8F%B7&utm_content=%E8%8F%9C%E5%8D%95"
        },
        body: '{"id":"' + $.giftcode + '"}'
    })
        .then((resp) => {
            $.log("getGiftCode: " + JSON.stringify(resp.body));
            let obj = JSON.parse(resp.body);
            if (obj.Code == "1000") {
                let id = obj.Data.GiftId;
                $.notify("达美乐 - 奖励", "领取成功", "恭喜您获得" + gift[id]);
                $.delete("smscode");
            } else {
                $.error("getGiftCode ERROR: " + JSON.stringify(resp.body));
                throw new ERR.BodyError("❌ 激活奖励返回错误，请查看日志并反馈。\n" + JSON.stringify(resp.body));
            }
        })
        .catch((err) => {
            throw err;
        })
}

function MYERR() {
    class RequestBodyError extends Error {
        constructor(message) {
            super(message);
            this.name = "RequestBodyError";
        }
    };
    class SMSCodeError extends Error {
        constructor(message) {
            super(message);
            this.name = "SMSCodeError";
        }
    };
    class BodyError extends Error {
        constructor(message) {
            super(message);
            this.name = "BodyError";
        }
    }; 
  
    return {
        RequestBodyError,
        SMSCodeError,
        BodyError,
    };
}

// OpenAPI by Peng-YM, modified by zZPiglet
function API(s="untitled",e=!1){return new class{constructor(s,e){this.name=s,this.debug=e,this.isRequest="undefined"!=typeof $request,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){const s="undefined"!=typeof $request?void 0:require("request"),e=require("fs");return{request:s,fs:e}}return null})(),this.initCache();const t=(s,e)=>new Promise(function(t){setTimeout(t.bind(null,e),s)});Promise.prototype.delay=function(s){return this.then(function(e){return t(s,e)})}}get(s){return this.isQX?("string"==typeof s&&(s={url:s,method:"GET"}),$task.fetch(s)):new Promise((e,t)=>{this.isLoon||this.isSurge?$httpClient.get(s,(s,i,o)=>{s?t(s):e({status:i.status,headers:i.headers,body:o})}):this.node.request(s,(s,i,o)=>{s?t(s):e({...i,status:i.statusCode,body:o})})})}post(s){return this.isQX?("string"==typeof s&&(s={url:s}),s.method="POST",$task.fetch(s)):new Promise((e,t)=>{this.isLoon||this.isSurge?$httpClient.post(s,(s,i,o)=>{s?t(s):e({status:i.status,headers:i.headers,body:o})}):this.node.request.post(s,(s,i,o)=>{s?t(s):e({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let s="root.json";this.node.fs.existsSync(s)||this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.root={},s=`${this.name}.json`,this.node.fs.existsSync(s)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.cache={})}}persistCache(){const s=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(s,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(s,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,s,{flag:"w"},s=>console.log(s)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},s=>console.log(s)))}write(s,e){this.log(`SET ${e}`),-1!==e.indexOf("#")?(e=e.substr(1),this.isSurge&this.isLoon&&$persistentStore.write(s,e),this.isQX&&$prefs.setValueForKey(s,e),this.isNode&&(this.root[e]=s)):this.cache[e]=s,this.persistCache()}read(s){return this.log(`READ ${s}`),-1===s.indexOf("#")?this.cache[s]:(s=s.substr(1),this.isSurge&this.isLoon?$persistentStore.read(s):this.isQX?$prefs.valueForKey(s):this.isNode?this.root[s]:void 0)}delete(s){this.log(`DELETE ${s}`),-1!==s.indexOf("#")?(s=s.substr(1),this.isSurge&this.isLoon&&$persistentStore.write(null,s),this.isQX&&$prefs.removeValueForKey(s),this.isNode&&delete this.root[s]):delete this.cache[s],this.persistCache()}notify(e=s,t="",i="",o,n){const r=i+(null==o?"":`\n\n跳转链接：${o}`)+(null==n?"":`\n\n多媒体链接：${n}`),h=i+(null==n?"":`\n\n多媒体链接：${n}`);if(this.isQX&&$notify(e,t,i,{"open-url":o,"media-url":n}),this.isSurge&&$notification.post(e,t,r),this.isLoon&&$notification.post(e,t,h,o),this.isNode)if(this.isJSBox){const s=require("push");s.schedule({title:e,body:t?t+"\n"+i:i})}else console.log(`${e}\n${t}\n${r}\n\n`)}log(s){this.debug&&console.log(s)}info(s){console.log(s)}error(s){console.log("ERROR: "+s)}wait(s){return new Promise(e=>setTimeout(e,s))}done(s={}){this.isQX?this.isRequest&&$done(s):this.isLoon||this.isSurge?this.isRequest?$done(s):$done():this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=s.headers,$context.statusCode=s.statusCode,$context.body=s.body)}}(s,e)}