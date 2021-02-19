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
const ERR = MYERR();
$.debug = [true, "true"].includes($.read("debug")) || false;
$.openid = $.read("openid");
$.phonenum = $.read("phonenum");
$.sec = $.read("sec");
$.smscode = $.read("smscode");
$.score = Number($.read("score") || 900);

const gift =
	"\n一等奖：免费 9″ 手拍澳洲和牛芝香菌菇比萨 1 个（共5000个）（需任意消费）" +
	"\n二等奖：半价 9″ 手拍澳洲和牛芝香菌菇比萨 1 个（共8000个）（需任意消费）" +
	"\n三等奖：免费意大利风情肉酱面一份（需购买任意比萨后使用） （共 15000 份）" +
	"\n四等奖：免费任意口味鸡翅一对（四种口味可选 BBQ烧烤风味/樟茶风味/蜜汁风味/奥尔良风味，需购买任意比萨后使用） （共 40000 份）" +
	"\n五等奖：免费蛋挞一对（需购买任意比萨后使用）（人人有礼，未获得 1-4 等奖的参与者均可得）" +
	"\n1-4 等奖抽完即止，中奖率为实际抽出奖项个数与参与抽奖人数之比，未获得 1-4 等奖的参与者均可得 5 等奖。所有电子券兑换截止日期：2021 年 3 月 31 日。";

const giftname = {
	1: "一等奖",
	2: "二等奖",
	3: "三等奖",
	4: "四等奖",
	5: "五等奖",
};

!(async () => {
	if ($.isRequest) {
		getRequestBody();
	} else {
		if (!$.phonenum || !$.sec || !$.openid) {
			throw new ERR.RequestBodyError("❌ 请按 README.md 配置获取信息。");
		} else if (!$.smscode) {
			throw new ERR.SMSCodeError("❌ 验证码未填写或未保存。");
		} else {
			$.detail = "";
			await getGift();
			await getGiftCode();
			await $.notify(
				"达美乐 - 奖励",
				"领取成功 🍕",
				"恭喜获得：" + $.detail + "\n\n奖项详情：" + gift
			);
			/*
			$.last = false;
			$.times = 0;
			while (!$.last && $.times < 3) {
				$.flag = false;
				await getRank();
				if ($.flag) {
					await getGift();
					await getGiftCode();
				} else {
					throw new ERR.BodyError("❌ 信息错误，请重新按 README.md 获取。");
				}
			}
			await $.notify(
				"达美乐 - 奖励",
				"领取成功 🍕",
				"恭喜获得：" + $.detail + "\n\n奖项详情：" + gift
			);
			*/
		}
	}
})()
	.catch((err) => {
		if (err instanceof ERR.RequestBodyError) {
			$.notify("达美乐 - 奖励", "缺失信息", err.message);
		} else if (err instanceof ERR.SMSCodeError) {
			$.notify("达美乐 - 奖励", "无验证码", err.message);
		} else if (err instanceof ERR.BodyError) {
			$.notify("达美乐 - 奖励", "响应错误", err.message);
		} else {
			$.notify(
				"达美乐 - 奖励",
				"出现错误",
				JSON.stringify(err, Object.getOwnPropertyNames(err))
			);
			$.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
		}
	})
	.finally(() => $.done());

function getRank() {
	return $.post({
		url: "http://dominos0125.shjimang.com/Ajax/GetRank",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
			Cookie: "Web2101=controller=Home&action=Default&OpenId=" + $.openid,
		},
		body: '{"score":' + $.score + ',"sec":"' + $.sec + '"}',
	})
		.then((resp) => {
			if (resp.statusCode == 200) {
				$.log("getRank: " + JSON.stringify(resp.body));
				let obj = isJSON(resp.body);
				if (obj) {
					if (obj.Code == "1000") {
						$.flag = true;
					} else {
						$.flag = false;
					}
				} else {
					throw new ERR.RequestBodyError(
						'验证信息已过期，请再次访问公众号"达美乐比萨" - "优惠｜咨询" - "有奖游戏"，无需进行游戏，访问后即可执行脚本。'
					);
				}
			} else {
				throw new ERR.RequestBodyError(
					'验证信息已过期，请再次访问公众号"达美乐比萨" - "优惠｜咨询" - "有奖游戏"，无需进行游戏，访问后即可执行脚本。'
				);
			}
		})
		.catch((err) => {
			throw err;
		});
}

function getGift() {
	return $.post({
		url: "http://dominos0125.shjimang.com/Ajax/GetGift",
		headers: {
			"Content-Type": "application/json",
			Cookie: "Web2101=controller=Home&action=Default&OpenId=" + $.openid + "&id=",
		},
		body:
			'{"mobile":"' +
			$.phonenum +
			'","score":' +
			$.score +
			',"sec":"' +
			$.sec +
			'","code":"' +
			$.smscode +
			'"}',
	})
		.then((resp) => {
			$.log("getGift: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.Code == "1000") {
				$.giftcode = obj.Data.Id;
				$.delete("smscode");
			} else if (obj.Code == "1001") {
				throw new ERR.BodyError(obj.Msg + "\n请检查 BoxJs 中验证码是否正确或删除重填。");
			} else {
				/*
			else if (obj.Code == "1001.4") {
				$.last = true;
				$.detail += "今天领取次数用完啦～";
				throw new ERR.BodyError("今天领取次数用完啦～");
			}
			*/
				$.error("getGift ERROR: " + JSON.stringify(resp.body));
				throw new ERR.BodyError(
					"❌ 获取奖励返回错误，请查看日志并反馈。\n" + JSON.stringify(resp.body)
				);
			}
		})
		.catch((err) => {
			throw err;
		});
}

function getGiftCode() {
	return $.post({
		url: "http://dominos0125.shjimang.com/Ajax/GetGiftCode",
		headers: {
			"Content-Type": "application/json",
			Cookie:
				"Web2101=controller=Home&action=Default&OpenId=" +
				$.openid +
				"&id=&m=" +
				$.phonenum,
		},
		body: '{"id":"' + $.giftcode + '"}',
	})
		.then((resp) => {
			$.log("getGiftCode: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.Code == "1000") {
				let id = obj.Data.GiftId;
				$.detail += giftname[id] + " ";
				//$.times += 1;
			} else {
				$.error("getGiftCode ERROR: " + JSON.stringify(resp.body));
				throw new ERR.BodyError(
					"❌ 激活奖励返回错误，请查看日志并反馈。\n" + JSON.stringify(resp.body)
				);
			}
		})
		.catch((err) => {
			throw err;
		});
}

function getRequestBody() {
	const reg = /OpenId=((\w|-)*)/;
	if ($request && $request.method == "POST" && $request.url.indexOf("getgiftD") >= 0) {
		let openidValue = reg.exec($request.headers["Cookie"])[1];
		let body = JSON.parse($.request.body);
		let phonenumValue = body.mobile;
		let secValue = body.sec;
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

function MYERR() {
	class RequestBodyError extends Error {
		constructor(message) {
			super(message);
			this.name = "RequestBodyError";
		}
	}

	class SMSCodeError extends Error {
		constructor(message) {
			super(message);
			this.name = "SMSCodeError";
		}
	}

	class BodyError extends Error {
		constructor(message) {
			super(message);
			this.name = "BodyError";
		}
	}

	return {
		RequestBodyError,
		SMSCodeError,
		BodyError,
	};
}

// prettier-ignore
// isJSON
function isJSON(t){if("string"==typeof t)try{let r=JSON.parse(t);return!("object"!=typeof r||!r)&&r}catch(t){return!1}return!1}
// prettier-ignore
// OpenAPI by Peng-YM, modified by zZPiglet
function API(s="untitled",t=!1){return new class{constructor(s,t){this.name=s,this.debug=t,this.isRequest="undefined"!=typeof $request,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){const s="undefined"!=typeof $request?void 0:require("request"),t=require("fs");return{request:s,fs:t}}return null})(),this.initCache();const e=(s,t)=>new Promise(function(e){setTimeout(e.bind(null,t),s)});Promise.prototype.delay=function(s){return this.then(function(t){return e(s,t)})}}get(s){return this.isQX?("string"==typeof s&&(s={url:s,method:"GET"}),$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.get(s,(s,i,o)=>{s?e(s):t({statusCode:i.status,headers:i.headers,body:o})}):this.node.request(s,(s,i,o)=>{s?e(s):t({...i,statusCode:i.statusCode,body:o})})})}post(s){return this.isQX?("string"==typeof s&&(s={url:s}),s.method="POST",$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.post(s,(s,i,o)=>{s?e(s):t({statusCode:i.status,headers:i.headers,body:o})}):this.node.request.post(s,(s,i,o)=>{s?e(s):t({...i,statusCode:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let s="root.json";this.node.fs.existsSync(s)||this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.root={},s=`${this.name}.json`,this.node.fs.existsSync(s)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.cache={})}}persistCache(){const s=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(s,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(s,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,s,{flag:"w"},s=>console.log(s)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},s=>console.log(s)))}write(s,t){this.log(`SET ${t}`),-1!==t.indexOf("#")?(t=t.substr(1),(this.isSurge||this.isLoon)&&$persistentStore.write(s,t),this.isQX&&$prefs.setValueForKey(s,t),this.isNode&&(this.root[t]=s)):this.cache[t]=s,this.persistCache()}read(s){return this.log(`READ ${s}`),-1===s.indexOf("#")?this.cache[s]:(s=s.substr(1),this.isSurge||this.isLoon?$persistentStore.read(s):this.isQX?$prefs.valueForKey(s):this.isNode?this.root[s]:void 0)}delete(s){this.log(`DELETE ${s}`),-1!==s.indexOf("#")?(s=s.substr(1),(this.isSurge||this.isLoon)&&$persistentStore.write(null,s),this.isQX&&$prefs.removeValueForKey(s),this.isNode&&delete this.root[s]):delete this.cache[s],this.persistCache()}notify(t=s,e="",i="",o,n){if(this.isSurge){let s=i+(null==n?"":`\n\n多媒体链接：${n}`),r={};o&&(r.url=o),"{}"==JSON.stringify(r)?$notification.post(t,e,s):$notification.post(t,e,s,r)}if(this.isQX){let s={};o&&(s["open-url"]=o),n&&(s["media-url"]=n),"{}"==JSON.stringify(s)?$notify(t,e,i):$notify(t,e,i,s)}if(this.isLoon){let s={};o&&(s.openUrl=o),n&&(s.mediaUrl=n),"{}"==JSON.stringify(s)?$notification.post(t,e,i):$notification.post(t,e,i,s)}if(this.isNode){let s=i+(null==o?"":`\n\n跳转链接：${o}`)+(null==n?"":`\n\n多媒体链接：${n}`);if(this.isJSBox){const i=require("push");i.schedule({title:t,body:e?e+"\n"+s:s})}else console.log(`${t}\n${e}\n${s}\n\n`)}}log(s){this.debug&&console.log(s)}info(s){console.log(s)}error(s){console.log("ERROR: "+s)}wait(s){return new Promise(t=>setTimeout(t,s))}done(s={}){this.isQX||this.isLoon||this.isSurge?this.isRequest?$done(s):$done():this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=s.headers,$context.statusCode=s.statusCode,$context.body=s.body)}}(s,t)}
