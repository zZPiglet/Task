/*
使用方法参考：https://github.com/zZPiglet/Task/blob/master/Domino/README.md

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
$.debug = [true, "true"].includes($.read("debug")) || false;
$.boxlink = $.read("#boxjs_host") || "http://boxjs.com";

!(async () => {
	if ($.isRequest) {
		getRequestBody();
	} else {
		$.openid = $.read("openid");
		$.phonenum = $.read("phonenum");
		$.sec = $.read("sec");
		if (!$.phonenum || !$.sec || !$.openid) {
			$.notify("达美乐 - 验证码", "缺失信息", "请按脚本开头配置获取信息。");
		} else {
			await getSMS();
		}
	}
})().finally(() => $.done());

function getSMS() {
	return $.post({
		url: "http://dominos0125.shjimang.com/Ajax/GetSmsCode",
		headers: {
			"Content-Type": "application/json",
			Cookie: "Web2101=controller=Home&action=Default&OpenId=" + $.openid,
		},
		body: '{"mobile":"' + $.phonenum + '","sec":"' + $.sec + '"}',
	})
		.then((resp) => {
			$.log("getSMS: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			let openurl = $.boxlink + "/app/zZ.Domino";
			if (obj.Code == "1000") {
				$.notify(
					"达美乐 - 验证码",
					"发送成功，请点击填写验证码",
					"验证码有效期为 10 分钟，请尽快点击跳转至 BoxJs 中填写、保存并执行下一步。",
					openurl
				);
			} else {
				$.error("getSMS ERROR: " + JSON.stringify(resp.body));
				$.notify(
					"达美乐 - 验证码",
					"发送错误：" + obj.Msg,
					"请检查 BoxJs 中是否有数据，若有，数据可能失效，请重新获取。",
					openurl
				);
			}
		})
		.catch((err) => {
			$.notify(
				"达美乐 - 验证码",
				"发送错误",
				JSON.stringify(err, Object.getOwnPropertyNames(err))
			);
			$.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
		});
}

function getRequestBody() {
	const reg = /OpenId=((\w|-)*)/;
	//const regBody = /mobile=(\d{11})&sec=(.*)/;
	if ($request && $request.method == "POST" && $request.url.indexOf("GetSmsCode") >= 0) {
		let openidValue = reg.exec($request.headers["Cookie"])[1];
		//let phonenumValue = regBody.exec($request.body)[1];
		//let secValue = regBody.exec($request.body)[2];
		let rbody = JSON.parse($request.body);
		let phonenumValue = rbody.mobile;
		let secValue = rbody.sec;
		if ($.read("openid") != (undefined || null)) {
			if (
				$.read("openid") != openidValue ||
				$.read("phonenum") != phonenumValue ||
				$.read("sec") != secValue
			) {
				$.write(openidValue, "openid");
				$.write(phonenumValue, "phonenum");
				$.write(secValue, "sec");
				$.notify("更新 " + $.name + " RequestBody 成功 🎉", "", "");
			}
		} else {
			$.write(openidValue, "openid");
			$.write(phonenumValue, "phonenum");
			$.write(secValue, "sec");
			$.notify("首次写入 " + $.name + " RequestBody 成功 🎉", "", "");
		}
	} else {
		$.notify("写入" + $.name + "RequestBody 失败‼️", "", "配置错误, 无法读取请求头。");
	}
}

// prettier-ignore
// OpenAPI by Peng-YM, modified by zZPiglet
function API(s="untitled",t=!1){return new class{constructor(s,t){this.name=s,this.debug=t,this.isRequest="undefined"!=typeof $request,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){const s="undefined"!=typeof $request?void 0:require("request"),t=require("fs");return{request:s,fs:t}}return null})(),this.initCache();const e=(s,t)=>new Promise(function(e){setTimeout(e.bind(null,t),s)});Promise.prototype.delay=function(s){return this.then(function(t){return e(s,t)})}}get(s){return this.isQX?("string"==typeof s&&(s={url:s,method:"GET"}),$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.get(s,(s,i,o)=>{s?e(s):t({statusCode:i.status,headers:i.headers,body:o})}):this.node.request(s,(s,i,o)=>{s?e(s):t({...i,statusCode:i.statusCode,body:o})})})}post(s){return this.isQX?("string"==typeof s&&(s={url:s}),s.method="POST",$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.post(s,(s,i,o)=>{s?e(s):t({statusCode:i.status,headers:i.headers,body:o})}):this.node.request.post(s,(s,i,o)=>{s?e(s):t({...i,statusCode:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let s="root.json";this.node.fs.existsSync(s)||this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.root={},s=`${this.name}.json`,this.node.fs.existsSync(s)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.cache={})}}persistCache(){const s=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(s,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(s,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,s,{flag:"w"},s=>console.log(s)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},s=>console.log(s)))}write(s,t){this.log(`SET ${t}`),-1!==t.indexOf("#")?(t=t.substr(1),(this.isSurge||this.isLoon)&&$persistentStore.write(s,t),this.isQX&&$prefs.setValueForKey(s,t),this.isNode&&(this.root[t]=s)):this.cache[t]=s,this.persistCache()}read(s){return this.log(`READ ${s}`),-1===s.indexOf("#")?this.cache[s]:(s=s.substr(1),this.isSurge||this.isLoon?$persistentStore.read(s):this.isQX?$prefs.valueForKey(s):this.isNode?this.root[s]:void 0)}delete(s){this.log(`DELETE ${s}`),-1!==s.indexOf("#")?(s=s.substr(1),(this.isSurge||this.isLoon)&&$persistentStore.write(null,s),this.isQX&&$prefs.removeValueForKey(s),this.isNode&&delete this.root[s]):delete this.cache[s],this.persistCache()}notify(t=s,e="",i="",o,n){if(this.isSurge){let s=i+(null==n?"":`\n\n多媒体链接：${n}`),r={};o&&(r.url=o),"{}"==JSON.stringify(r)?$notification.post(t,e,s):$notification.post(t,e,s,r)}if(this.isQX){let s={};o&&(s["open-url"]=o),n&&(s["media-url"]=n),"{}"==JSON.stringify(s)?$notify(t,e,i):$notify(t,e,i,s)}if(this.isLoon){let s={};o&&(s.openUrl=o),n&&(s.mediaUrl=n),"{}"==JSON.stringify(s)?$notification.post(t,e,i):$notification.post(t,e,i,s)}if(this.isNode){let s=i+(null==o?"":`\n\n跳转链接：${o}`)+(null==n?"":`\n\n多媒体链接：${n}`);if(this.isJSBox){const i=require("push");i.schedule({title:t,body:e?e+"\n"+s:s})}else console.log(`${t}\n${e}\n${s}\n\n`)}}log(s){this.debug&&console.log(s)}info(s){console.log(s)}error(s){console.log("ERROR: "+s)}wait(s){return new Promise(t=>setTimeout(t,s))}done(s={}){this.isQX||this.isLoon||this.isSurge?this.isRequest?$done(s):$done():this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=s.headers,$context.statusCode=s.statusCode,$context.body=s.body)}}(s,t)}
