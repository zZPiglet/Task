/*
⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。
*/

const mainURL = "https://m.weibo.cn/feed/";
const configURL = "https://m.weibo.cn/api/config/";
//const uidURL = "https://m.weibo.cn/profile/info?uid="; // 增加了鉴权
const uidURL = "https://m.weibo.cn/api/container/getIndex?type=uid&value=";
const searchURL =
    "https://m.weibo.cn/api/container/getIndex?containerid=100103type%3D3%26t%3D1%26q%3D";
const listURL = configURL + "list";
const groupURL = mainURL + "group?gid=";
// const circleURL = mainURL + 'circle' // 好友圈，待做，🐦
// const timelineURL = mainURL + 'friends //时间线，待做，🐦

const $ = new API("Weibo");
$.debug = [true, "true"].includes($.read("debug")) || false;
const ERR = MYERR();
const CookieKey = "WeiboNotice";
const boxhost = $.read("#boxjs_host") || "http://boxjs.com";
const reg = /SUB=(\S*);/;

const groupdat = $.read("Group") || "Special";
$.choosegroup = [undefined, null, "null", ""].includes(groupdat) ? [] : groupdat.split(",");
const uiddat = $.read("Weibo_uids");
$.uids = [undefined, null, "null", ""].includes(uiddat) ? [] : uiddat.replace(/\n/, "").split(",");
const nicknamedat = $.read("Weibo_nicknames");
$.nicknames = [undefined, null, "null", ""].includes(nicknamedat)
    ? []
    : nicknamedat.replace(/\n/, "").split(",");

$.client = $.read("chooseClient") || "Safari";
if ($.client == "Safari") {
    $.openlink = "https://m.weibo.cn/detail/";
} else if ($.client == "Sinaweibo") {
    $.openlink = "sinaweibo://detail?mblogid=";
} else if ($.client == "Weibointernational") {
    $.openlink = "weibointernational://detail?mblogid=";
} else if ($.client == "VVebo") {
    $.openlink = "vvebo://status?id=";
}

$.realupdate = Number($.read("update") || 0);
$.update = $.debug ? 0 : $.realupdate;
$.log("debug update time: " + $.update);
$.info("update time: " + $.realupdate);

if ($.isRequest) {
    GetCookie();
    $.done({});
} else {
    !(async () => {
        if (!$.read(CookieKey)) {
            throw new ERR.CookieError("❌ 未获取或填写Cookie");
        } else {
            await checkCookie();
            if ($.validCookie) {
                if ($.choosegroup.includes("Special")) await Special();
                // if ($.choosegroup.includes('Circle')) await Circle()
                // if ($.choosegroup.includes('Timeline')) await Timeline()
                if ($.choosegroup.includes("Spider")) await Spider();
            } else {
                throw new ERR.CookieError("❌ Cookie 失效");
            }
        }
    })()
        .catch((err) => {
            $.write($.realupdate, "update");
            if (err instanceof ERR.CookieError) {
                $.notify("微博通知 - Cookie 错误", "", err.message, "https://m.weibo.cn");
            } else if (err instanceof ERR.BoxError) {
                $.notify("微博通知 - 信息填写错误", "", err.message, boxhost + "/app/zZ.Weibo");
            } else {
                $.notify(
                    "微博通知 - 出现错误",
                    "",
                    JSON.stringify(err, Object.getOwnPropertyNames(err))
                );
                $.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
            }
        })
        .finally(() => $.done());
}

function checkCookie() {
    return $.get({
        url: configURL,
        headers: {
            Cookie: "SUB=" + $.read(CookieKey),
        },
    })
        .then((resp) => {
            $.log("Cookie: SUB=" + $.read(CookieKey));
            $.write(new Date().getTime(), "update");
            let obj = JSON.parse(resp.body);
            $.validCookie = obj.data.login;
        })
        .catch((err) => {
            throw err;
        });
}

function ParseWeibo(obj) {
    let wbs = obj.data.statuses;
    for (let i = wbs.length - 1; i >= 0; i--) {
        let Title = "@";
        if (wbs[i].user) Title += wbs[i].user.screen_name;
        let releaseTime = new Date(wbs[i].created_at).getTime();
        let subTitile = "⌚️ " + new Date(wbs[i].created_at).Format("MM/dd hh:mm:ss");
        let open = $.openlink + wbs[i].bid;
        let showimg = wbs[i].user
            ? wbs[i].user.profile_image_url
            : "https://tvax2.sinaimg.cn/crop.0.0.1006.1006.1024/4242e8adly8gdirb4e9q2j20ry0rytbp.jpg";
        let detail = "";
        let newlineReg = /<br \/>/g;
        let ignoreReg = /<[^>]+>/g;
        detail += wbs[i].text.replace(newlineReg, "\n").replace(ignoreReg, "").trim();
        if (wbs[i].retweeted_status) {
            detail += "\n\n";
            if (wbs[i].retweeted_status.user)
                detail += "↪️ 转发自 @" + wbs[i].retweeted_status.user.screen_name + "：\n";
            detail += wbs[i].retweeted_status.text
                .replace(newlineReg, "\n")
                .replace(ignoreReg, "")
                .trim();
            if (wbs[i].retweeted_status.live_photo) {
                showimg = wbs[i].retweeted_status.live_photo[0];
            } else if (wbs[i].retweeted_status.original_pic) {
                showimg = wbs[i].retweeted_status.original_pic;
            } else if (wbs[i].retweeted_status.page_info) {
                let type = wbs[i].retweeted_status.page_info.type;
                if (type == "video") {
                    showimg = wbs[i].retweeted_status.page_info.media_info.stream_url_hd;
                } else if (type == "story") {
                    showimg = wbs[i].retweeted_status.page_info.slide_cover[0].pic;
                } else {
                    showimg = wbs[i].retweeted_status.page_info.page_pic.url;
                    $.log(JSON.stringify(wbs[i].retweeted_status.page_info));
                }
            }
        } else {
            if (wbs[i].live_photo) {
                showimg = wbs[i].live_photo[0];
            } else if (wbs[i].original_pic) {
                showimg = wbs[i].original_pic;
            } else if (wbs[i].page_info) {
                let type = wbs[i].page_info.type;
                if (type == "video") {
                    showimg = wbs[i].page_info.media_info.stream_url_hd;
                } else if (type == "story") {
                    showimg = wbs[i].page_info.slide_cover[0].pic;
                } else {
                    showimg = wbs[i].page_info.page_pic.url;
                    $.log(JSON.stringify(wbs[i].page_info));
                }
            }
        }
        detail += "\n\n👉🏼 点击跳转至全文及原微博。";
        if (releaseTime > $.update) $.notify(Title, subTitile, detail, open, showimg);
    }
}

async function Special() {
    await getSpecialId();
    await getSpeicalMessage();
}

function getSpecialId() {
    return $.get({
        url: listURL,
        headers: {
            Cookie: "SUB=" + $.read(CookieKey),
        },
    })
        .then((resp) => {
            let obj = JSON.parse(resp.body);
            let groups = obj.data.groups;
            for (let gIdx of groups) {
                let gid = gIdx.gid;
                if (gIdx.name == "特别关注") $.gid = gid;
            }
        })
        .catch((err) => {
            throw err;
        });
}

function getSpeicalMessage() {
    return $.get({
        url: groupURL + $.gid,
        headers: {
            Cookie: "SUB=" + $.read(CookieKey),
        },
    })
        .then((resp) => {
            let obj = JSON.parse(resp.body);
            ParseWeibo(obj);
        })
        .catch((err) => {
            throw err;
        });
}

async function Spider() {
    await getUid();
    await getSpiderMessage();
}

async function getUid() {
    if ($.nicknames.length) {
        for (let nameIdx = 0; nameIdx < $.nicknames.length; nameIdx++) {
            await $.get({
                url: searchURL + encodeURIComponent($.nicknames[nameIdx].trim()),
                headers: {
                    Cookie: "SUB=" + $.read(CookieKey),
                },
            })
                .then((resp) => {
                    let obj = isJSON(resp.body);
                    if (obj.ok) {
                        $.uids.push(obj.data.cards[1].card_group[0].user.id.toString());
                    } else {
                        $.error(resp.body);
                        throw new ERR.BoxError(
                            "微博昵称填写有误，请在 BoxJs 检查填写的微博昵称是否正确。\n若未新加入昵称且之前无错，可能是接口返回错误，请反馈日志"
                        );
                    }
                })
                .catch((err) => {
                    throw err;
                });
        }
    }
}

async function getSpiderMessage() {
    $.log($.uids);
    if ($.uids.length) {
        for (let uidIdx = 0; uidIdx < $.uids.length; uidIdx++) {
            let uid = $.uids[uidIdx].trim();
            let containerid = await $.get({
                url: uidURL + uid,
                headers: {
                    Cookie: "SUB=" + $.read(CookieKey),
                },
            })
                .then((resp) => {
                    let obj = isJSON(resp.body);
                    if (obj) {
                        let tabs = obj.data.tabsInfo.tabs;
                        for (let tab of tabs) {
                            if (tab.tabKey == "weibo") return tab.containerid;
                        }
                    } else {
                        $.error(resp.body);
                        throw new ERR.BoxError(
                            "uid 填写有误，请在 BoxJs 检查填写的 uid 是否正确。\n若未新加入 uid 且之前无错，可能是接口返回错误，请反馈日志"
                        );
                    }
                })
                .catch((err) => {
                    throw err;
                });
            if (containerid) {
                await $.get({
                    url: uidURL + uid + "&containerid=" + containerid,
                    headers: {
                        Cookie: "SUB=" + $.read(CookieKey),
                    },
                })
                    .then((resp) => {
                        let obj = isJSON(resp.body);
                        if (obj) {
                            let cards = obj.data.cards;
                            let statuses = cards.reduce((newcards, card) => {
                                return card.card_type == 9 ? newcards.concat(card.mblog) : newcards;
                            }, []);
                            let obj2 = { ok: 1, data: { statuses: statuses } };
                            ParseWeibo(obj2);
                        } else {
                            $.error(resp.body);
                            throw new ERR.BoxError(
                                `${
                                    uidURL + uid + "&containerid=" + containerid
                                } 接口返回错误，请反馈日志`
                            );
                        }
                    })
                    .catch((err) => {
                        throw err;
                    });
            }
        }
    } else {
        throw new ERR.BoxError(
            "填写信息不全，请在 BoxJs 填写需要关注人微博 uid，或取消针对个人的勾选！"
        );
    }
}

function GetCookie() {
    if (reg.exec($request.headers["Cookie"])[1]) {
        let CookieValue = reg.exec($request.headers["Cookie"])[1];
        if ($.read(CookieKey) != (undefined || null)) {
            if ($.read(CookieKey) != CookieValue) {
                let cookie = $.write(CookieValue, CookieKey);
                $.notify("更新 " + $.name + " Cookie 成功 🎉", "", "");
            }
        } else {
            let cookie = $.write(CookieValue, CookieKey);
            $.notify("首次写入 " + $.name + " Cookie 成功 🎉", "", "");
        }
    } else {
        $.notify("写入" + $.name + "Cookie 失败‼️", "", "配置错误, 无法读取请求头, ");
    }
}

function MYERR() {
    class CookieError extends Error {
        constructor(message) {
            super(message);
            this.name = "CookieError";
        }
    }

    class BoxError extends Error {
        constructor(message) {
            super(message);
            this.name = "BoxError";
        }
    }

    return {
        CookieError,
        BoxError,
    };
}

// isJSON
function isJSON(t){if("string"==typeof t)try{let r=JSON.parse(t);return!("object"!=typeof r||!r)&&r}catch(t){return!1}return!1}
// Format Date by meizz
Date.prototype.Format=function(t){var e={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(var s in/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t};
// OpenAPI by Peng-YM, modified by zZPiglet
function API(e="untitled",t=!1){return new class{constructor(e,t){this.name=e,this.debug=t,this.isRequest="undefined"!=typeof $request,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){const e="undefined"!=typeof $request?void 0:require("request"),t=require("fs");return{request:e,fs:t}}return null})(),this.initCache();const s=(e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)});Promise.prototype.delay=function(e){return this.then(function(t){return s(e,t)})}}get(e){return this.isQX?("string"==typeof e&&(e={url:e,method:"GET"}),$task.fetch(e)):new Promise((t,s)=>{this.isLoon||this.isSurge?$httpClient.get(e,(e,i,o)=>{e?s(e):t({statusCode:i.status,headers:i.headers,body:o})}):this.node.request(e,(e,i,o)=>{e?s(e):t({...i,statusCode:i.statusCode,body:o})})})}post(e){return e.body&&e.headers&&!e.headers["Content-Type"]&&(e.headers["Content-Type"]="application/x-www-form-urlencoded"),this.isQX?("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e)):new Promise((t,s)=>{this.isLoon||this.isSurge?$httpClient.post(e,(e,i,o)=>{e?s(e):t({statusCode:i.status,headers:i.headers,body:o})}):this.node.request.post(e,(e,i,o)=>{e?s(e):t({...i,statusCode:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(e,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(e,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},e=>console.log(e)))}write(e,t){this.log(`SET ${t}`),-1!==t.indexOf("#")?(t=t.substr(1),(this.isSurge||this.isLoon)&&$persistentStore.write(e,t),this.isQX&&$prefs.setValueForKey(e,t),this.isNode&&(this.root[t]=e)):this.cache[t]=e,this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),this.isSurge||this.isLoon?$persistentStore.read(e):this.isQX?$prefs.valueForKey(e):this.isNode?this.root[e]:void 0)}delete(e){this.log(`DELETE ${e}`),-1!==e.indexOf("#")?(e=e.substr(1),(this.isSurge||this.isLoon)&&$persistentStore.write(null,e),this.isQX&&$prefs.removeValueForKey(e),this.isNode&&delete this.root[e]):delete this.cache[e],this.persistCache()}notify(t=e,s="",i="",o,n){if(this.isSurge){let e=i,r={};$environment["surge-build"]<3112?(o&&(r.url=o),e+=null==n?"":`\n\n多媒体链接：${n}`):(o&&(r.action="open-url",r.url=o),n&&(r["media-url"]=n)),"{}"==JSON.stringify(r)?$notification.post(t,s,e):$notification.post(t,s,e,r)}if(this.isQX){let e={};o&&(e["open-url"]=o),n&&(e["media-url"]=n),"{}"==JSON.stringify(e)?$notify(t,s,i):$notify(t,s,i,e)}if(this.isLoon){let e={};o&&(e.openUrl=o),n&&(e.mediaUrl=n),"{}"==JSON.stringify(e)?$notification.post(t,s,i):$notification.post(t,s,i,e)}if(this.isNode){let e=i+(null==o?"":`\n\n跳转链接：${o}`)+(null==n?"":`\n\n多媒体链接：${n}`);if(this.isJSBox){const i=require("push");i.schedule({title:t,body:s?s+"\n"+e:e})}else console.log(`${t}\n${s}\n${e}\n\n`)}}log(e){this.debug&&console.log(e)}info(e){console.log(e)}error(e){console.log("ERROR: "+e)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){this.isQX||this.isLoon||this.isSurge?this.isRequest?$done(e):$done():this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}}(e,t)}