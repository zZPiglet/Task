/*
豆瓣电影日历每日通知。

关于豆瓣 APIKey：
由于官方取消了 APIKey 的申请，请自行解决此问题：
1. 网上找别人之前申请的（关键字：豆瓣 API Key）
2. 下载 app 自行抓包 / 重写获取本机上的

若选择利用重写获得，请先按下述方法进行配置，进入  widget 界面（iOS 13 负一屏），添加「豆瓣·电影日历」，并重新进入此界面使其刷新获取内容，若弹出"首次写入 MovieCalendar APIKey 成功"即可正常食用，其他提示或无提示请使用其他方法获取 APIKey 并填入 BoxJs。

本脚本在 Quantumult X(build 316+) 中可做到显示多媒体，并可点击通知跳转。
本脚本在 Loon(build 163+) 中可做到显示多媒体链接，并可点击通知跳转。
本脚本在 Surge 中会提示多媒体链接及跳转链接，需长按通知再点击链接进行跳转。

多媒体可选择为「电影剧照」、「电影海报」、「预告片」，默认为「电影剧照」，可在 BoxJs 中更改配置。
跳转可选定指定客户端，默认为 Safari，可在 BoxJs 中更改至豆瓣官方客户端。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet
lite edition: notify modified by @vopacc

Quantumult X:
[task_local]
0 7 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/MovieCalendar/MovieCalendar.js, tag=电影日历

[rewrite_local]
^https:\/\/frodo\.douban\.com\/api\/v\d\/calendar\/today url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/MovieCalendar/MovieCalendar.js


Surge & Loon:
[Script]
cron "0 7 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/MovieCalendar/MovieCalendar.js
http-request ^https:\/\/frodo\.douban\.com\/api\/v\d\/calendar\/today script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/MovieCalendar/MovieCalendar.js

All app:
[mitm]
hostname = frodo.douban.com

获取完 APIKey 因 MitM 导致该软件网络不稳定，需注释掉 hostname。
*/

// sloarToLunar.js by xm2by, modified by zZPiglet
function toLunar(a,r,n){r-=1;let e,t,l,u=(Date.UTC(a,r,n)-Date.UTC(1949,0,29))/864e5+1;for(let a=0;a<lunarYearArr.length;a++)if(u-=lunarYearDays(lunarYearArr[a]),u<=0){e=1949+a,u+=lunarYearDays(lunarYearArr[a]);break}for(let a=0;a<lunarYearMonths(lunarYearArr[e-1949]).length;a++)if(u-=lunarYearMonths(lunarYearArr[e-1949])[a],u<=0){t=hasLeapMonth(lunarYearArr[e-1949])&&hasLeapMonth(lunarYearArr[e-1949])<=a?hasLeapMonth(lunarYearArr[e-1949])<a?a:hasLeapMonth(lunarYearArr[e-1949])===a?"闰"+a:a+1:a+1,u+=lunarYearMonths(lunarYearArr[e-1949])[a];break}return l=u,t=hasLeapMonth(lunarYearArr[e-1949])&&"string"==typeof t&&t.indexOf("闰")>-1?`闰${lunarMonth[/\d/.exec(t)-1]}`:lunarMonth[t-1],e=getTianGan(e)+getDiZhi(e),l<11?l=`${lunarDay[10]}${lunarDay[l-1]}`:l>10&&l<20?l=`${lunarDay[9]}${lunarDay[l-11]}`:20===l?l=`${lunarDay[1]}${lunarDay[9]}`:l>20&&l<30?l=`${lunarDay[11]}${lunarDay[l-21]}`:30===l&&(l=`${lunarDay[2]}${lunarDay[9]}`),e+"年"+t+"月"+l+"日"}function hasLeapMonth(a){return!!(15&a)&&15&a}function leapMonthDays(a){return hasLeapMonth(a)?983040&a?30:29:0}function lunarYearDays(a){let r=0;for(let n=32768;n>8;n>>=1){let e=a&n?30:29;r+=e}return hasLeapMonth(a)&&(r+=leapMonthDays(a)),r}function lunarYearMonths(a){let r=[];for(let n=32768;n>8;n>>=1)r.push(a&n?30:29);return hasLeapMonth(a)&&r.splice(hasLeapMonth(a),0,leapMonthDays(a)),r}function getTianGan(a){let r=(a-3)%10;return 0===r&&(r=10),tianGan[r-1]}function getDiZhi(a){let r=(a-3)%12;return 0===r&&(r=12),diZhi[r-1]}let lunarYearArr=[46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,21952,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19195,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,84835,37744,18936,18800,25776,92326,59984,27424,108228,43744,41696,53987,51552,54615,54432,55888,23893,22176,42704,21972,21200,43448,43344,46240,46758,44368,21920,43940,42416,21168,45683,26928,29495,27296,44368,84821,19296,42352,21732,53600,59752,54560,55968,92838,22224,19168,43476,41680,53584,62034,54560],lunarMonth=["正","二","三","四","五","六","七","八","九","十","冬","腊"],lunarDay=["一","二","三","四","五","六","七","八","九","十","初","廿"],tianGan=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"],diZhi=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

const $ = new API("MovieCalendar");
$.debug = [true, "true"].includes($.read("debug")) || false;
const ERR = MYERR();
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();
const week = "星期"+"日一二三四五六".charAt(new Date().getDay());
const today = year + "-" + ("00" + month).substr(-2) + "-" + ("00" + day).substr(-2);
const todaylunar = toLunar(year,month,day);
const reg = /https:\/\/frodo\.douban\.com\/api\/v\d\/calendar\/today.*apikey=(\w*)/;
$.time = Number($.read("time") || 10);
$.pic = $.read("choosePic") || "poster";
$.client = $.read("chooseClient") || "Safari";
if ($.client == "Safari") {
    $.openlink = "https://www.douban.com/doubanapp/dispatch/movie/";
} else if ($.client == "douban") {
    $.openlink = "douban://douban.com/movie/";
}
const boxhost = $.read("#boxjs_host") || "http://boxjs.com";
$.diylink = $.read("diylink") || boxhost + "/app/zZ.Douban"; 

if ($.isRequest) {
    getAPIKey();
    $.done({ body: $request.body });
} else {
    !(async () => {
        $.apikey = $.read("apikey");
        if (!$.apikey) {
            throw new ERR.APIKeyError("❌ 未获取或填写 APIKey");
        } else {
            $.code = "997"
            $.Cnt = 0;
            while ($.Cnt < $.time && $.code == "997") {
                await getCalendar();
            }
            if ($.comment) await getTrailer();
            await notify();
        }
    })().catch((err) => {
        if (err instanceof ERR.APIKeyError) {
            $.notify("电影日历 - APIKey 错误", "", err.message, boxhost + "/app/zZ.Douban");
        } else if (err instanceof ERR.bodyError) {
            $.notify("电影日历 - 返回错误", "", err.message);
        } else {
            $.notify("电影日历 - 出现错误", "", JSON.stringify(err));
            $.error(JSON.stringify(err));
        }
    }).finally($.done())
}

function getCalendar() {
    return $.get({
        url: "https://frodo.douban.com/api/v2/calendar/today?alt=json&apikey=" + $.apikey + "&date=" + today,
        headers: {
            "User-Agent": "api-client/0.1.3 com.douban.frodo/6.40.0"
        }
    })
        .then((resp) => {
            $.log("getCalendar: " + JSON.stringify(resp.body));
            let obj = JSON.parse(resp.body);
            $.code = obj.code
            if (obj.comment) {
                $.comment = obj.comment.content;
                $.poster = obj.comment.poster;
                $.solarterm = obj.today.title;
                $.movie = "《" + obj.subject.title + "》";
                $.movieid = obj.subject.id;
                $.cover = obj.subject.pic.large;
                $.movieinfo = obj.subject.card_subtitle;
                $.rating = Number(obj.subject.rating.value).toFixed(1);
                let entire = "★";
                let half = "☆";
                let blank = "○";
                let starnum = Number(obj.subject.rating.star_count);
                $.star = entire.repeat(parseInt(starnum)) + (starnum*10%10 ? half : "") + blank.repeat(parseInt(5 - starnum));
            } else if (obj.code == "104") {
                throw new ERR.APIKeyError("❌ APIKey 失效");
            } else if (obj.code == "997") {
                $.Cnt += 1;
            } else {
                throw new ERR.bodyError(JSON.stringify(resp.body));
            }
        })
        .catch((err) => {
            throw err;
        })

}

function getTrailer() {
    return $.get({
        url: "https://m.douban.com/rexxar/api/v2/movie/" + $.movieid + "?ck=&for_mobile=1",
        headers: {
            "Referer": "https://m.douban.com"
        }
    })
        .then((resp) => {
            $.log("getTrailer: " + JSON.stringify(resp.body));
            let obj = JSON.parse(resp.body);
            $.trailer = obj.trailer.video_url;
            $.intro = obj.intro;
        })
        .catch((err) => {
            throw err;
        })
}

async function notify() {
    if ($.Cnt < $.time) {
        let Title = month + " 月 " + day +  "日｜" + todaylunar + "｜" + week;
        if ($.solarterm) Title += "｜" + $.solarterm;
        let subTitle = $.movie + $.star + "\xa0\xa0\xa0\xa0" + $.rating + "/10";
        let detail = $.comment;
        detail += "\n\n" + $.movieinfo;
        detail += "\n简介：\n" + $.intro 
        let openurl = $.openlink + $.movieid;
        let imgurl = $.poster;
        if ($.pic == "cover") {
            imgurl = $.cover;
        } else if ($.pic == "trailer") {
            imgurl = $.trailer;
        }
        if ($.client = "diy") openurl = $.diylink; 
        $.notify(Title, subTitle, detail, openurl, imgurl)
    } else {
        $.notify("电影日历 - 出现错误", "", "接口返回错误，超出重试次数。\n或签名加密错误，请等待解决。")
    }
}

function getAPIKey() {
    $.log($request.url)
    if (reg.exec($request.url)[1]) {
        let APIKeyValue = reg.exec($request.url)[1];
        if ($.read("apikey") != (undefined || null)) {
            if ($.read("apikey") != APIKeyValue) {
                $.write(APIKeyValue, "apikey")
                $.notify("更新 " + $.name + " APIKey 成功 🎉", "", "")
            }
        } else {
            $.write(APIKeyValue, "apikey")
            $.notify("首次写入 " + $.name + " APIKey 成功 🎉", "", "")
        }
    } else {
        $.notify("写入" + $.name + "APIKey 失败‼️", "", "配置错误, 无法读取请求头。")
    }
}

function MYERR() {
    class APIKeyError extends Error {
        constructor(message) {
            super(message);
            this.name = "APIKeyError";
        }
    };
    class bodyError extends Error {
        constructor(message) {
            super(message);
            this.name = "bodyError";
        } 
    };
  
    return {
        APIKeyError,
        bodyError,
    };
}

// OpenAPI by Peng-YM, modified by zZPiglet
function API(s="untitled",e=!1){return new class{constructor(s,e){this.name=s,this.debug=e,this.isRequest="undefined"!=typeof $request,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){const s="undefined"!=typeof $request?void 0:require("request"),e=require("fs");return{request:s,fs:e}}return null})(),this.initCache();const t=(s,e)=>new Promise(function(t){setTimeout(t.bind(null,e),s)});Promise.prototype.delay=function(s){return this.then(function(e){return t(s,e)})}}get(s){return this.isQX?("string"==typeof s&&(s={url:s,method:"GET"}),$task.fetch(s)):new Promise((e,t)=>{this.isLoon||this.isSurge?$httpClient.get(s,(s,i,o)=>{s?t(s):e({status:i.status,headers:i.headers,body:o})}):this.node.request(s,(s,i,o)=>{s?t(s):e({...i,status:i.statusCode,body:o})})})}post(s){return this.isQX?("string"==typeof s&&(s={url:s}),s.method="POST",$task.fetch(s)):new Promise((e,t)=>{this.isLoon||this.isSurge?$httpClient.post(s,(s,i,o)=>{s?t(s):e({status:i.status,headers:i.headers,body:o})}):this.node.request.post(s,(s,i,o)=>{s?t(s):e({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let s="root.json";this.node.fs.existsSync(s)||this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.root={},s=`${this.name}.json`,this.node.fs.existsSync(s)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.cache={})}}persistCache(){const s=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(s,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(s,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,s,{flag:"w"},s=>console.log(s)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},s=>console.log(s)))}write(s,e){this.log(`SET ${e}`),-1!==e.indexOf("#")?(e=e.substr(1),this.isSurge&this.isLoon&&$persistentStore.write(s,e),this.isQX&&$prefs.setValueForKey(s,e),this.isNode&&(this.root[e]=s)):this.cache[e]=s,this.persistCache()}read(s){return this.log(`READ ${s}`),-1===s.indexOf("#")?this.cache[s]:(s=s.substr(1),this.isSurge&this.isLoon?$persistentStore.read(s):this.isQX?$prefs.valueForKey(s):this.isNode?this.root[s]:void 0)}delete(s){this.log(`DELETE ${s}`),delete this.cache[s],-1!==s.indexOf("#")?(s=s.substr(1),this.isSurge&this.isLoon&&$persistentStore.write(null,s),this.isQX&&$prefs.setValueForKey(null,s),this.isNode&&delete this.root[s]):this.cache[s]=data,this.persistCache()}notify(e=s,t="",i="",o,n){const h=i+(null==o?"":`\n\n跳转链接：${o}`)+(null==n?"":`\n\n多媒体链接：${n}`),r=i+(null==n?"":`\n\n多媒体链接：${n}`);if(this.isQX&&$notify(e,t,i,{"open-url":o,"media-url":n}),this.isSurge&&$notification.post(e,t,h),this.isLoon&&$notification.post(e,t,r,o),this.isNode)if(this.isJSBox){const s=require("push");s.schedule({title:e,body:t?t+"\n"+i:i})}else console.log(`${e}\n${t}\n${h}\n\n`)}log(s){this.debug&&console.log(s)}info(s){console.log(s)}error(s){console.log("ERROR: "+s)}wait(s){return new Promise(e=>setTimeout(e,s))}done(s={}){this.isQX?this.isRequest&&$done(s):this.isLoon||this.isSurge?this.isRequest?$done(s):$done():this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=s.headers,$context.statusCode=s.statusCode,$context.body=s.body)}}(s,e)}
