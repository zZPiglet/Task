/*
"滴滴出行" app "钱包 - 金融服务 - 天天有奖" 自动签到，支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。
默认已使用 DiDi.js，故请先使用 DiDi.js 获取 Cookie。(https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js)

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
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_finance.js, tag=滴滴金融

Surge & Loon:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_finance.js
*/

const $ = API("Didi");
$.debug = [true, "true"].includes($.read("debug")) || false;
const ERR = MYERR();
$.subTitle = "";
$.detail = "";

!(async () => {
	$.token = $.read("#DiDi");
	if (!$.token) {
		throw new ERR.TokenError(
			"❌ 未获取或填写 Token，请先参考以下链接获取 Token \n https://github.com/zZPiglet/Task/tree/master/DiDi "
		);
	} else {
		await getActId();
		await signIn();
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
	.finally($.done());

function getActId() {
	return $.get({
		url:
			"https://gist.githubusercontent.com/zZPiglet/a9a537190bc6353923191520cf9a2c89/raw/DiDi.json",
	})
		.then((resp) => {
			$.log("actId: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			$.actId = obj.financeActId;
		})
		.catch((err) => {
			throw err;
		});
}

function signIn() {
	return $.post({
		url:
			"https://manhattan.webapp.xiaojukeji.com/marvel/api/manhattan-signin-task/signIn/execute",
		headers: {
			"Content-Type": "application/json",
		},
		body: '{"token":"' + $.token + '","activityId":"' + $.actId + '","clientId":1}',
	})
		.then((resp) => {
			$.log("signIn: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errorCode == 0) {
				let serialTimes = obj.data.serialSignInTimes;
				let period = obj.data.periodDays;
				$.subTitle += "签到 [" + serialTimes + "/" + period + "] 天";
				$.detail += "获得如下奖品：";
				for (let l of obj.data.giftDetail) {
					$.detail +=
						"\n" +
						l.displayJson.displayName +
						"：" +
						l.displayValue +
						" " +
						l.displayUnit +
						"，" +
						l.displayJson.displayDesc +
						"。";
				}
			} else if (obj.errorCode == 500000) {
				$.subTitle += "签到重复";
				$.detail += obj.errorMsg;
			} else {
				throw new ERR.BodyError(JSON.stringify(resp.body));
			}
			$.notify("滴滴金融", $.subTitle, $.detail);
		})
		.catch((err) => {
			throw err;
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
// OpenAPI by Peng-YM, modified by zZPiglet
function API(s="untitled",t=!1){return new class{constructor(s,t){this.name=s,this.debug=t,this.isRequest="undefined"!=typeof $request,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){const s="undefined"!=typeof $request?void 0:require("request"),t=require("fs");return{request:s,fs:t}}return null})(),this.initCache();const e=(s,t)=>new Promise(function(e){setTimeout(e.bind(null,t),s)});Promise.prototype.delay=function(s){return this.then(function(t){return e(s,t)})}}get(s){return this.isQX?("string"==typeof s&&(s={url:s,method:"GET"}),$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.get(s,(s,i,o)=>{s?e(s):t({status:i.status,headers:i.headers,body:o})}):this.node.request(s,(s,i,o)=>{s?e(s):t({...i,status:i.statusCode,body:o})})})}post(s){return this.isQX?("string"==typeof s&&(s={url:s}),s.method="POST",$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.post(s,(s,i,o)=>{s?e(s):t({status:i.status,headers:i.headers,body:o})}):this.node.request.post(s,(s,i,o)=>{s?e(s):t({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let s="root.json";this.node.fs.existsSync(s)||this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.root={},s=`${this.name}.json`,this.node.fs.existsSync(s)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.cache={})}}persistCache(){const s=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(s,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(s,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,s,{flag:"w"},s=>console.log(s)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},s=>console.log(s)))}write(s,t){this.log(`SET ${t}`),-1!==t.indexOf("#")?(t=t.substr(1),this.isSurge||this.isLoon&&$persistentStore.write(s,t),this.isQX&&$prefs.setValueForKey(s,t),this.isNode&&(this.root[t]=s)):this.cache[t]=s,this.persistCache()}read(s){return this.log(`READ ${s}`),-1===s.indexOf("#")?this.cache[s]:(s=s.substr(1),this.isSurge||this.isLoon?$persistentStore.read(s):this.isQX?$prefs.valueForKey(s):this.isNode?this.root[s]:void 0)}delete(s){this.log(`DELETE ${s}`),-1!==s.indexOf("#")?(s=s.substr(1),this.isSurge||this.isLoon&&$persistentStore.write(null,s),this.isQX&&$prefs.removeValueForKey(s),this.isNode&&delete this.root[s]):delete this.cache[s],this.persistCache()}notify(t=s,e="",i="",o,n){if(this.isSurge){let s=i+(null==n?"":`\n\n多媒体链接：${n}`),r={};o&&(r.url=o),"{}"==JSON.stringify(r)?$notification.post(t,e,s):$notification.post(t,e,s,r)}if(this.isQX){let s={};o&&(s["open-url"]=o),n&&(s["media-url"]=n),"{}"==JSON.stringify(s)?$notify(t,e,i):$notify(t,e,i,s)}if(this.isLoon){let s={};o&&(s.openUrl=o),n&&(s.mediaUrl=n),"{}"==JSON.stringify(s)?$notification.post(t,e,i):$notification.post(t,e,i,s)}if(this.isNode){let s=i+(null==o?"":`\n\n跳转链接：${o}`)+(null==n?"":`\n\n多媒体链接：${n}`);if(this.isJSBox){const i=require("push");i.schedule({title:t,body:e?e+"\n"+s:s})}else console.log(`${t}\n${e}\n${s}\n\n`)}}log(s){this.debug&&console.log(s)}info(s){console.log(s)}error(s){console.log("ERROR: "+s)}wait(s){return new Promise(t=>setTimeout(t,s))}done(s={}){this.isQX||this.isLoon||this.isSurge?this.isRequest?$done(s):$done():this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=s.headers,$context.statusCode=s.statusCode,$context.body=s.body)}}(s,t)}
