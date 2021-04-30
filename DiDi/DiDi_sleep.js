/*
cron 参考：
https://dpubstatic.udache.com/static/dpubimg/aa88e9ba6b8a95abec85ad62661afd98/index.html

1 6,22 * * *
*/
const $ = API("Didi");
$.debug = [true, "true"].includes($.read("debug"));
const ERR = MYERR();
$.subTitle = "";
$.detail = "";
$.tail = "";
const sleepURL = "https://sigma.xiaojukeji.com/api/sleep";

!(async () => {
    $.Ticket = $.read("#DiDi");
    if (!$.Ticket) {
        throw new ERR.TokenError("❌ 未获取或填写 Token");
    } else {
        await sleep();
        await $.info("滴滴睡觉\n" + $.subTitle + "\n" + $.detail + "\n" + $.tail);
        await $.notify("滴滴睡觉 🥟", $.subTitle, $.detail + "\n" + $.tail);
    }
})()
    .catch((err) => {
        if (err instanceof ERR.TokenError) {
            $.notify("滴滴出行 - Token 错误", "", err.message, "OneTravel://");
        } else if (err instanceof ERR.BodyError) {
            $.notify("滴滴出行 - 返回错误", "", err.message);
        } else {
            $.notify(
                "滴滴出行 - 出现错误",
                "",
                JSON.stringify(err, Object.getOwnPropertyNames(err))
            );
            $.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        }
    })
    .finally(() => $.done());

async function sleep() {
    await sleepInfo();
    if ($.button_type == 2) {
        await goSleep();
    } else if ($.button_type == 3) {
        await wake();
    } else if ($.button_type == 1) {
        $.detail += $.button_text;
    } else {
        /*
		$.wait(3000).then(() => {
			sleep();
		});
		*/
    }
}

function sleepInfo() {
    return $.post({
        url: sleepURL + "/info",
        headers: {
            "Content-Type": "application/json",
            ticket: $.Ticket,
        },
        body: "{}",
    })
        .then((resp) => {
            $.log("sleepInfo: " + JSON.stringify(resp.body));
            let obj = JSON.parse(resp.body);
            if (obj.errno == 0) {
                $.button_type = obj.data.button_type;
                $.button_text = obj.data.button_text;
                $.tips_text = obj.data.tips_text;
                $.tail = obj.data.text;
            } else {
                $.info("sleepInfo: " + JSON.stringify(resp.body) + "\n请检查是否有睡觉赚钱活动。");
                throw new ERR.BodyError("请检查是否有睡觉赚钱活动\n" + JSON.stringify(resp.body));
            }
        })
        .catch((err) => {
            $.error("sleepInfo: \n");
            $.error(err);
            throw new ERR.BodyError("睡觉赚钱查询信息接口错误\n" + JSON.stringify(err));
        });
}

function goSleep() {
    return $.post({
        url: sleepURL + "/sleep",
        headers: {
            "Content-Type": "application/json",
            ticket: $.Ticket,
        },
        body: "{}",
    })
        .then((resp) => {
            $.log("sleepBonus: " + JSON.stringify(resp.body));
            let obj = JSON.parse(resp.body);
            if (obj.errno == 0) {
                $.subTitle = "晚安 🌃";
                $.detail += "睡觉了，" + $.tips_text;
            } else {
                $.info("sleepBonus: " + JSON.stringify(resp.body));
            }
        })
        .catch((err) => {
            $.error("sleepBonus: \n");
            $.error(err);
            throw new ERR.BodyError("睡觉赚钱领取奖励接口错误\n" + JSON.stringify(err));
        });
}

function wake() {
    return $.post({
        url: sleepURL + "/wake",
        headers: {
            "Content-Type": "application/json",
            ticket: $.Ticket,
        },
        body: "{}",
    })
        .then((resp) => {
            $.log("sleepBonus: " + JSON.stringify(resp.body));
            let obj = JSON.parse(resp.body);
            if (obj.errno == 0) {
                if (obj.data.bonus_amount) {
                    $.subTitle = "早安 🌆";
                    let sleepBonus = obj.data.bonus_amount;
                    $.detail += "该起床了，已领取 " + sleepBonus + " 福利金。";
                } else {
                    $.detail += "睡觉福利金: " + obj.data.message_text + "。";
                }
            } else {
                $.info("sleepBonus: " + JSON.stringify(resp.body));
            }
        })
        .catch((err) => {
            $.error("sleepBonus: \n");
            $.error(err);
            throw new ERR.BodyError("睡觉赚钱领取奖励接口错误\n" + JSON.stringify(err));
        });
}

function MYERR() {
    class TokenError extends Error {
        constructor(message) {
            super(message);
            this.name = "TokenError";
        }
    }

    class BodyError extends Error {
        constructor(message) {
            super(message);
            this.name = "BodyError";
        }
    }

    return {
        TokenError,
        BodyError,
    };
}

// prettier-ignore
// isJSON
function isJSON(t){if("string"==typeof t)try{let r=JSON.parse(t);return!("object"!=typeof r||!r)&&r}catch(t){return!1}return!1}
// prettier-ignore
// OpenAPI by Peng-YM, modified by zZPiglet
function API(e="untitled",s=!1){return new class{constructor(e,s){this.name=e,this.debug=s,this.isRequest="undefined"!=typeof $request,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){const e="undefined"!=typeof $request?void 0:require("request"),s=require("fs");return{request:e,fs:s}}return null})(),this.initCache();const t=(e,s)=>new Promise(function(t){setTimeout(t.bind(null,s),e)});Promise.prototype.delay=function(e){return this.then(function(s){return t(e,s)})}}get(e){return this.isQX?("string"==typeof e&&(e={url:e,method:"GET"}),$task.fetch(e)):new Promise((s,t)=>{this.isLoon||this.isSurge?$httpClient.get(e,(e,i,o)=>{e?t(e):s({statusCode:i.status,headers:i.headers,body:o})}):this.node.request(e,(e,i,o)=>{e?t(e):s({...i,statusCode:i.statusCode,body:o})})})}post(e){return e.body&&e.headers&&!e.headers["Content-Type"]&&(e.headers["Content-Type"]="application/x-www-form-urlencoded"),this.isQX?("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e)):new Promise((s,t)=>{this.isLoon||this.isSurge?$httpClient.post(e,(e,i,o)=>{e?t(e):s({statusCode:i.status,headers:i.headers,body:o})}):this.node.request.post(e,(e,i,o)=>{e?t(e):s({...i,statusCode:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(e,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(e,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},e=>console.log(e)))}write(e,s){this.log(`SET ${s}`),-1!==s.indexOf("#")?(s=s.substr(1),(this.isSurge||this.isLoon)&&$persistentStore.write(e,s),this.isQX&&$prefs.setValueForKey(e,s),this.isNode&&(this.root[s]=e)):this.cache[s]=e,this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),this.isSurge||this.isLoon?$persistentStore.read(e):this.isQX?$prefs.valueForKey(e):this.isNode?this.root[e]:void 0)}delete(e){this.log(`DELETE ${e}`),-1!==e.indexOf("#")?(e=e.substr(1),(this.isSurge||this.isLoon)&&$persistentStore.write(null,e),this.isQX&&$prefs.removeValueForKey(e),this.isNode&&delete this.root[e]):delete this.cache[e],this.persistCache()}notify(s=e,t="",i="",o,n){if(this.isSurge){let e=i+(null==n?"":`\n\n多媒体链接：${n}`),r={};o&&(r.url=o),"{}"==JSON.stringify(r)?$notification.post(s,t,e):$notification.post(s,t,e,r)}if(this.isQX){let e={};o&&(e["open-url"]=o),n&&(e["media-url"]=n),"{}"==JSON.stringify(e)?$notify(s,t,i):$notify(s,t,i,e)}if(this.isLoon){let e={};o&&(e.openUrl=o),n&&(e.mediaUrl=n),"{}"==JSON.stringify(e)?$notification.post(s,t,i):$notification.post(s,t,i,e)}if(this.isNode){let e=i+(null==o?"":`\n\n跳转链接：${o}`)+(null==n?"":`\n\n多媒体链接：${n}`);if(this.isJSBox){const i=require("push");i.schedule({title:s,body:t?t+"\n"+e:e})}else console.log(`${s}\n${t}\n${e}\n\n`)}}log(e){this.debug&&console.log(e)}info(e){console.log(e)}error(e){console.log("ERROR: "+e)}wait(e){return new Promise(s=>setTimeout(s,e))}done(e={}){this.isQX||this.isLoon||this.isSurge?this.isRequest?$done(e):$done():this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}}(e,s)}
