/*
"饿了么" app "我的 - 吃货豆" 遗忘的吃货豆自动领取，支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。
默认已使用 elemSign.js，故请先使用 elemGetCookies.js 获取 Cookie。(https://github.com/songyangzz/QuantumultX/blob/master/elem/elemGetCookies.js)

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet

Quantumult X (App Store:1.0.5+, TestFlight 190+):
[task_local]
50 23 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/elem/elemPea.js, tag=饿了么-遗忘的吃货豆

Surge 4.0+ & Loon:
[Script]
cron "50 23 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/elem/elemPea.js
*/

const mainURL = "https://h5.ele.me/restapi";
const $cmp = compatibility();
const token = $cmp.read("cookie_elem");
Checkin();
$cmp.done();

function Checkin() {
	let listURL = mainURL + "/biz.svip_core/v1/foodie/homepage";
	const list = {
		url: listURL,
		headers: {
			Cookie: token,
		},
	};
	$cmp.get(list, function (error, response, data) {
		if (!error) {
			let listresult = JSON.parse(data);
			if (response.statusCode == 200) {
				if (listresult.foodiePeaBlock.peaList.length) {
					let total = 0;
					for (let l of listresult.foodiePeaBlock.peaList) {
						$cmp.log(l);
						let pea_id = l.id;
						let rewardURL =
							mainURL + "/biz.svip_bonus/v1/users/supervip/pea/draw?peaId=" + pea_id;
						const reward = {
							url: rewardURL,
							headers: {
								Cookie: token,
							},
							body: "{}",
						};
						$cmp.post(reward, function (error, response, data) {
							$cmp.log(data);
						});
						total += Number(l.count);
					}
					$cmp.notify(
						"饿了么 - 遗忘的吃货豆",
						"",
						"捡回遗忘的 " + total + " 个吃货豆。🧆"
					);
				} else {
					$cmp.notify("饿了么 - 遗忘的吃货豆", "", "今天没有忘记领取的吃货豆～ 🎉");
				}
			} else {
				$cmp.notify(
					"饿了么 - 遗忘的吃货豆",
					"Cookie 未获取或失效❗",
					"请按脚本开头注释完成配置并首次或重新获取 Cookie。\n" + listresult.message
				);
				$cmp.log("elem_pea failed response : \n" + JSON.stringify(listresult));
			}
		} else {
			$cmp.notify("饿了么 - 遗忘的吃货豆", "领取接口请求失败，详情请见日志。", error);
			$cmp.log("elem_pea failed response : \n" + error);
		}
	});
}

// prettier-ignore
function compatibility(){const e="undefined"!=typeof $request,t="undefined"!=typeof $httpClient,r="undefined"!=typeof $task,n="undefined"!=typeof $app&&"undefined"!=typeof $http,o="function"==typeof require&&!n,s=(()=>{if(o){const e=require("request");return{request:e}}return null})(),i=(e,s,i)=>{r&&$notify(e,s,i),t&&$notification.post(e,s,i),o&&a(e+s+i),n&&$push.schedule({title:e,body:s?s+"\n"+i:i})},u=(e,n)=>r?$prefs.setValueForKey(e,n):t?$persistentStore.write(e,n):void 0,d=e=>r?$prefs.valueForKey(e):t?$persistentStore.read(e):void 0,l=e=>(e&&(e.status?e.statusCode=e.status:e.statusCode&&(e.status=e.statusCode)),e),f=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="GET",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.get(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.get(e))},p=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.post(e,(e,t,r)=>{i(e,l(t),r)}),o&&s.request.post(e,(e,t,r)=>{i(e,l(t),r)}),n&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.post(e))},a=e=>console.log(e),y=(t={})=>{e?$done(t):$done()};return{isQuanX:r,isSurge:t,isJSBox:n,isRequest:e,notify:i,write:u,read:d,get:f,post:p,log:a,done:y}}
