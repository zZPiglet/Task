/*
"滴滴出行" app 自动签到，支持 Quantumult X、Surge、Loon（理论上也支持 Shadowrocket，未尝试）。
请先按下述方法进行配置，进入"滴滴出行"，若弹出"首次写入滴滴出行 Token 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"滴滴出行 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet

----------
版本记录：
- 2021 / 02 / 26
增加“走路赚钱”中“天天步数赛”活动，并将“走路赚钱”系列移至 20:01 之后所有时间运行有效，且这段时间不再执行主任务。  
注：20:00 时段保留，滴滴有可能还会发晚八点优惠券。
- 2021 / 01 / 30  
增加“走路赚钱”活动，限晚八点运行。
- 2020 / 11 / 24  
增加从小程序获取 Token，从 App 或小程序获取任选一个即可。
- 2020 / 11 / 23  
测试阶段，可能会出现各种问题，希望因脚本出现问题可及时反馈。
若使用此脚本则可以去掉原有的滴滴相关所有脚本，此脚本为整合集，以后也只更新此脚本。
aff 默认开启，可在 BoxJs 中关闭，如关闭 aff，将无法使用一些关于抽奖、滴滴金融等之类的功能，因为这些功能需要持续维护活动编号。
若希望使用关于“滴滴金融”方面的签到，请在 BoxJs 中开启，此功能默认关闭。
相对之前的脚本，此脚本整合进了福利金签到、遗忘的福利金领取、遗忘的积分领取、稳赚的抽奖、金融签到以及抢券（此功能目前只写入了晚八点的券，如需使用请保证 cron 含有晚八点）。
由于 iOS 14 通知字数的限制，通知可能不完全（尤其是出行已省、现有部分优惠券及福利金优惠券即将过期的信息），请在日志中查看完整信息。
常见错误：
1. 若是 Token 获取问题请先自行排查重写及主机名是否正确，若均正确且日志无报错的情况下无法获取，请反馈，并最好能提供抓包记录（打开抓包软件，然后再进入滴滴，进入打车的界面之后关闭抓包的软件，导出这个包私发给我就行）。
----------

Quantumult X:
[task_local]
0 1,20,21 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_new.js, tag=滴滴出行
[rewrite_local]
# APP
^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_new.js
# MiniApp
^https:\/\/common\.diditaxi\.com\.cn\/webapp\/config\/sidebar\? url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_new.js

Surge:
[Script]
滴滴出行 = type=cron,cronexp="0 1,20,21 * * *",wake-system=1,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_new.js
滴滴出行APPCookie = type=http-request,pattern=^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\?,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_new.js
滴滴出行小程序Cookie = type=http-request,pattern=^https:\/\/common\.diditaxi\.com\.cn\/webapp\/config\/sidebar\?,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_new.js

Loon、Shadowrocket:
[Script]
cron "0 1,20,21 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_new.js
# APP
http-request ^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_new.js
# WeChat-MiniApp
http-request ^https:\/\/common\.diditaxi\.com\.cn\/webapp\/config\/sidebar\? script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_new.js

All app:
[mitm]
hostname = as.xiaojukeji.com, common.diditaxi.com.cn // 前者为 App 获取，或者为微信小程序获取

获取完 Token 后可不注释 rewrite / hostname，Token 更新时会弹窗。若因 MitM 导致该软件或小程序网络不稳定，可注释掉 hostname。
*/

const $ = API("Didi");
$.debug = [true, "true"].includes($.read("debug"));
const ERR = MYERR();
$.subTitle = "";
$.detail = "";
$.drawgifts = "";
$.couponids = "";
$.tail = "";
$.expire = "";
$.times = {};
const mainURL = "https://bosp-api.xiaojukeji.com";
const awardURL = "https://api.udache.com/gulfstream/passenger/v2/other";
const financeURL =
	"https://manhattan.webapp.xiaojukeji.com/marvel/api/manhattan-signin-task/signIn";
const pointURL = "https://quartz.xiaojukeji.com/volcano/quartz";
const signgiftURL = "https://gsh5act.xiaojukeji.com/dpub_data_api/activities";
const busURL = "https://market.bus.xiaojukeji.com/api/transit";
const stepURL = "https://sigma.xiaojukeji.com/api";
const treeURL = "https://tree.xiaojukeji.com:9443";
let noaff = $.read("noaff");
const aff = noaff == undefined ? true : ![true, "true"].includes(noaff);
const today =
	new Date().getFullYear() +
	"-" +
	("00" + Number(new Date().getMonth() + 1)).substr(-2) +
	"-" +
	("00" + new Date().getDate()).substr(-2);
const NINE_O_CLOCK_AM = new Date(
	new Date().toString().replace(/\d{2}:\d{2}:\d{2}/, "09:00:00")
).getTime();
const EIGHT_O_CLOCK_PM = new Date(
	new Date().toString().replace(/\d{2}:\d{2}:\d{2}/, "20:00:00")
).getTime();
const delay = Number($.read("drawdelay") || 2000);

$.isFinance = [true, "true"].includes($.read("isFinance"));
$.isExpenddrawlids = [true, "true"].includes($.read("isExpenddrawlids"));

if ($.isRequest) {
	getToken();
	$.done({});
} else {
	!(async () => {
		$.Ticket = $.read("#DiDi");
		$.city = $.read("#DiDi_city");
		$.now = new Date().getTime();
		if (!$.Ticket || !$.city) {
			throw new ERR.TokenError("❌ 未获取或填写 Token");
		} else {
			if ($.now >= EIGHT_O_CLOCK_PM - 10 * 1000 && $.now < EIGHT_O_CLOCK_PM + 60 * 1000) {
				$.pmids = isJSON($.read("actIdPM"));
				if ($.pmids && $.pmids.length) {
					await Promise.all(
						$.pmids.map(async (id) => {
							await grabCoupons(id);
						})
					);
					await $.info("滴滴出行\n" + $.subTitle + "\n" + $.detail);
					await $.notify("滴滴出行 🚕", $.subTitle, $.detail);
				}
				/*
				if (aff) await getIds();
				await getIds();
				if ($.activity_instance_id && Math.random() < $.probability) {
					await instance();
				}
				*/
			} else if ($.now >= EIGHT_O_CLOCK_PM + 60 * 1000) {
				if (aff) await getIds();
				await steps();
				await $.info("滴滴走路\n" + $.subTitle + "\n" + $.detail);
				await $.notify("滴滴走路 ♿️", $.subTitle, $.detail);
			} else {
				/* 
			else if ($.now >= NINE_O_CLOCK_AM - 2 * 1000 && $.now <= NINE_O_CLOCK_AM + 60 * 1000) {
				$.amids = isJSON($.read("actIdAM"));
				if ($.amids && $.amids.length) {
					await Promise.all(
						$.amids.map(async (id) => {
							await grabCoupons(id);
						})
					);
					await $.info("滴滴出行\n" + $.subTitle + "\n" + $.detail);
					await $.notify("滴滴出行 🚕", $.subTitle, $.detail);
				}
				await getIds();
				//await tree();
				if ($.activity_instance_id && Math.random() < $.probability) {
					await instance();
				}
			}  
			*/
				if (aff) await getIds();
				$.checkinParams = "&city_id=" + $.city;
				if ($.source_id) {
					let s_i = await Choose($.source_id);
					$.checkinParams += "&share_source_id=" + s_i + "&share_date=" + today;
				}
				await checkin();
				await storeActId();
				await reward();
				if ($.drawlids) {
					await Promise.all(
						$.drawlids.map(async (lid) => {
							$.times[lid] = 1;
							while ($.times[lid]) {
								await draw(lid);
								await drawShare(lid);
							}
						})
					);
				}
				if ($.isExpenddrawlids && $.expenddrawlids) {
					await Promise.all(
						$.expenddrawlids.map(async (lid) => {
							$.times[lid] = 1;
							while ($.times[lid]) {
								await draw(lid);
								await drawShare(lid);
							}
						})
					);
				}
				await pointCollect();
				await pointSign();
				await pointInfo();
				//await lucina();
				//await didibus();
				/*
				if ($.activity_instance_id && Math.random() < $.probability) {
					await instance();
				}
				*/
				if ($.isFinance && $.financeActId) {
					await finance();
					while ($.fbroken) {
						await restartFinace();
						await finance();
					}
				}
				await $.info(
					"滴滴出行\n" +
						$.subTitle +
						"\n" +
						$.detail +
						$.couponids +
						$.drawgifts +
						$.tail +
						$.expire
				);
				await $.notify(
					"滴滴出行 🚕",
					$.subTitle,
					$.detail + $.couponids + $.drawgifts + $.tail + $.expire
				);
			}
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
}

function Choose(v) {
	let r = Math.floor(Math.random() * v.length);
	return v[r];
}

function getIds() {
	return $.get({
		url:
			"https://gist.githubusercontent.com/zZPiglet/a9a537190bc6353923191520cf9a2c89/raw/DiDi.json",
	})
		.then((resp) => {
			$.log("getIds: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			$.sparePointSignURL = obj.sparePointSignURL;
			$.probability = obj.p;
			$.source_id = obj.source_id;
			let other_source_id = obj.other_source_id;
			$.source_id.push(Choose(other_source_id));
			$.step_share_source_id = obj.step_share_source_id;
			$.drawlids = obj.drawlids;
			$.expenddrawlids = obj.expenddrawlids;
			$.financeActId = obj.financeActId;
			//$.instanceScene = obj.instanceScene;
			//$.activity_instance_id = [];
			//$.activity_instance_id.push(obj.activity_instance_id1);
			//$.activity_instance_id.push(obj.activity_instance_id2);
		})
		.catch((err) => {
			throw err;
		});
}

function checkin() {
	return $.get({
		url: mainURL + "/wechat/benefit/public/index?" + $.checkinParams,
		headers: {
			"Didi-Ticket": $.Ticket,
		},
	})
		.delay(500)
		.then((resp) => {
			if (resp.statusCode == 403) {
				throw new ERR.TokenError("Token 失效");
			} else {
				$.log("benefit: " + JSON.stringify(resp.body));
				let obj = isJSON(resp.body);
				if (obj && obj.errno == 0) {
					if (obj.data.sign.sign) {
						$.subTitle += "福利金🆗";
						let todayearn = Number(
							obj.data.sign.sign.subsidy_state.subsidy_amount +
								obj.data.sign.sign.subsidy_state.extra_subsidy_amount
						);
						$.detail += "签到获得 " + todayearn + " 福利金，";
					} else {
						$.subTitle += "福利金🔄";
					}
					let total = Number(obj.data.welfare.carousel_text[0].slice(4));
					$.detail += "账户共有 " + total + " 福利金，可抵扣 " + total / 100 + " 元。";
					//if (obj.data.message && obj.data.message.text) $.info(obj.data.message.text);
					if (obj.data.notification) {
						for (let message of obj.data.notification.reverse()) {
							$.expire += "\n" + message;
						}
					}
				} else if (obj && obj.errno == 101) {
					throw new ERR.TokenError("签到失败‼️ 城市代码错误。");
				} else {
					$.error(resp.body);
					throw new ERR.BodyError(
						"活动页返回错误，请在 BoxJs 中开启调试模式运行后反馈日志。\n" +
							JSON.stringify(resp.body)
					);
				}
			}
		})
		.catch((err) => {
			throw err;
		});
}

function storeActId() {
	return $.get({
		url:
			mainURL +
			"/wechat/benefit/public/v2/index?%7B%22resource_name%22:%22welfare_through_train_calendar%22%7D" +
			$.checkinParams,
		headers: {
			"Didi-Ticket": $.Ticket,
		},
	})
		.then((resp) => {
			$.log("storeActId: " + JSON.stringify(resp.body));
			let obj = isJSON(resp.body);
			$.delete("actIdAM");
			$.delete("actIdPM");
			if (obj && (obj.errno == 0 || obj.errno == 500)) {
				let actIdAM = [];
				let actIdPM = [];
				for (let a of obj.data.calendar[today]) {
					if (a.act_conf.receive_start_at) {
						if (a.act_conf.receive_start_at.match("09:00:00")) {
							actIdAM.push(a.act_id);
							$.info(a.act_conf.receive_start_at + ": " + a.act_id + " 已存 ✅");
							//$.detail += "\n券编号：" + a.act_conf.receive_start_at + ": " + a.act_id;
							//$.couponids += " 已存 ✅";
						} else if (a.act_conf.receive_start_at.match("20:00:00")) {
							actIdPM.push(a.act_id);
							$.info(a.act_conf.receive_start_at + ": " + a.act_id + " 已存 ✅");
							$.couponids +=
								"\n券编号：" + a.act_conf.receive_start_at + ": " + a.act_id;
							$.couponids += " 已存 ✅";
						} else {
							$.info(a.act_conf.receive_start_at + ": " + a.act_id + " 未存 ❌");
							//$.couponids += "\n券编号：" + a.act_conf.receive_start_at + ": " + a.act_id;
							//$.couponids += " 未存 ❌";
						}
					}
				}
				//if (obj.data.message && obj.data.message.text) $.info(obj.data.message.text);
				$.write(JSON.stringify(actIdAM), "actIdAM");
				$.write(JSON.stringify(actIdPM), "actIdPM");
				$.tail +=
					"\n\n" +
					obj.data.greeting.text.substr(3) +
					"，现有" +
					obj.data.coupon.carousel_text[0].slice(0, -1) +
					" 张";
				if (obj.data.coupon.carousel_text.length == 1) {
					$.tail += "。";
				} else {
					$.tail += "，含：";
					for (let i = 1; i < obj.data.coupon.carousel_text.length; i++) {
						$.tail += obj.data.coupon.carousel_text[i].substr(1) + "、";
					}
					$.tail += "...";
				}
				$.info("DiDi source_id : \n" + obj.data.share.source_id);
				$.info("DiDi new_source_id : \n" + obj.data.share.new_source_id);
			} else {
				$.error(resp.body);
				throw new ERR.BodyError(
					"查询优惠券返回错误，请在 BoxJs 中开启调试模式运行后反馈日志。\n" +
						JSON.stringify(resp.body)
				);
			}
		})
		.catch((err) => {
			throw err;
		});
}

function pointCollect() {
	return $.post({
		url: pointURL + "/points/collect",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "app_id=common&token=" + encodeURIComponent($.Ticket),
	})
		.then((resp) => {
			$.log("pointCollect: " + JSON.stringify(resp.body));
		})
		.catch((err) => {
			$.error(err);
		});
}

async function pointSign() {
	await getPointSignURL();
	await prePointSign();
	if ($.pointSignWrongURL) {
		$.realPointSignURL = $.sparePointSignURL;
		await prePointSign();
	}
	if ($.pointSignActivityId) {
		await getPointSignDay();
		await doPointSign();
		if ($.canRewardPointSign) await rewardPointSign();
	}
}

function getPointSignURL() {
	return $.post({
		url: "https://res.xiaojukeji.com/resapi/activity/getMulti",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "resource_name=dcoin_mall_carousel",
	})
		.then((resp) => {
			$.log("getPointSignURL: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			let list = obj.data.dcoin_mall_carousel["256"].data;
			$.pointSignURL = "";
			for (let i = 0; i < list.length; i++) {
				if (list[i].timesegs[0].end_time - list[i].timesegs[0].start_time == 604799)
					$.pointSignURL = list[i].link;
			}
			$.realPointSignURL = $.pointSignURL ? $.pointSignURL : $.sparePointSignURL;
		})
		.catch((err) => {
			throw err;
		});
}

function prePointSign() {
	return $.get({
		url: $.realPointSignURL,
	})
		.then((resp) => {
			$.log("prePointSign: " + resp.body);
			let resphtml = resp.body;
			let exec = /window.scenes = \[(\{.*\})\]/.exec(resphtml);
			if (exec) {
				let signobj = JSON.parse(exec[1]);
				let obj = signobj.layers[0].activityConfig;
				$.pointSignActivityId = obj.activity_id;
				$.signPointIds = obj.config.daily_prize;
				$.pointSignDayMax = obj.config.signin_days;
			} else {
				$.pointSignWrongURL = true;
			}
		})
		.catch((err) => {
			throw err;
		});
}

function getPointSignDay() {
	return $.get({
		url:
			signgiftURL +
			"/" +
			$.pointSignActivityId +
			"/signin?signin_user_token=" +
			encodeURIComponent($.Ticket),
	})
		.then((resp) => {
			$.log("getPointSignDay: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			$.pointSignDay =
				obj.signins.length + 1 > $.pointSignDayMax
					? $.pointSignDayMax
					: obj.signins.length + 1;
		})
		.catch((err) => {
			throw err;
		});
}

function doPointSign() {
	return $.post({
		url: signgiftURL + "/" + $.pointSignActivityId + "/signin",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
		body:
			'{"signin_day":' +
			$.pointSignDay +
			',"signin_type":0,"signin_user_token":"' +
			$.Ticket +
			'"}',
	})
		.then((resp) => {
			$.log("doPointSign: " + JSON.stringify(resp.body));
			$.canRewardPointSign = true;
		})
		.catch((err) => {
			throw err;
		});
}

function rewardPointSign() {
	return $.post({
		url: signgiftURL + "/" + $.pointSignActivityId + "/reward_lottery",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
		body:
			'{"user_token":"' +
			$.Ticket +
			'","signin_day":' +
			$.pointSignDay +
			',"lottery_id":"' +
			$.signPointIds[$.pointSignDay - 1].prize_id +
			'"}',
	})
		.then((resp) => {
			$.log("rewardPointSign: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				$.subTitle += " 积分🆗";
				let todayearn = obj.lottery.prize.name.slice(0, -2);
				//let total = obj.lottery.userinfo.current_point;
				$.detail += "\n签到获得 " + todayearn + " 积分，"; //"账户共有 " + total + " 积分。";
			} else if (obj.errno == 1) {
				$.subTitle += " 积分🔄";
			}
		})
		.catch((err) => {
			throw err;
		});
}

function pointInfo() {
	return $.get({
		url: pointURL + "/user/account?source_id=ckjf_10001&token=" + encodeURIComponent($.Ticket),
	})
		.then((resp) => {
			$.log("pointInfo: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			let total = obj.data.dcoin.coin;
			let expirepoint = obj.data.dcoin.expire_balance;
			let expiredate = obj.data.dcoin.expire_date;
			$.detail += "账户共有 " + total + " 积分";
			$.detail +=
				expiredate && expirepoint
					? "，有 " + expirepoint + " 积分将在 " + expiredate + " 过期。"
					: "。";
		})
		.catch((err) => {
			$.error(err);
		});
}

async function reward() {
	$.rewardtotal = 0;
	await rewardList();
	if ($.rewardList) await getReward();
	if ($.rewardtotal) $.detail += "捡回遗忘的 " + $.rewardtotal.toFixed(2) + " 元福利金。";
}

function rewardList() {
	return $.get({
		url: awardURL + "/pListReward?token=" + encodeURIComponent($.Ticket),
	})
		.then((resp) => {
			$.log("rewardList: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				if (obj.data) {
					$.rewardList = obj.data;
				}
			} else {
				$.error(resp.body);
				throw new ERR.BodyError(
					"打车后未领福利金列表返回错误，请在 BoxJs 中开启调试模式运行后反馈日志。\n" +
						obj.errmsg
				);
			}
		})
		.catch((err) => {
			throw err;
		});
}

async function getReward() {
	for (let l of $.rewardList) {
		await $.get({
			url:
				awardURL +
				"/pGetRewards?order_id=" +
				l.oid +
				"&token=" +
				encodeURIComponent($.Ticket),
		})
			.then((resp) => {
				$.log("reward: " + JSON.stringify(resp.body));
				let obj = JSON.parse(resp.body);
				if (obj.errno == 0) {
					$.rewardtotal += Number(obj.data.bonus_info.amount);
				} else {
					$.error(resp.body);
					throw new ERR.BodyError(
						"打车后未领福利金领取返回错误，请在 BoxJs 中开启调试模式运行后反馈日志。\n" +
							obj.errmsg
					);
				}
			})
			.catch((err) => {
				throw err;
			});
	}
}

function draw(lid) {
	return $.get({
		url:
			mainURL +
			"/bosp-api/lottery/draw?lid=" +
			lid +
			"&token=" +
			encodeURIComponent($.Ticket),
	})
		.delay(delay)
		.then((resp) => {
			$.log(lid + " draw: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.code == 0) {
				$.drawgifts += "\n" + obj.data.prize.name + "：" + obj.data.prize.win_content;
				$.times[lid] = obj.data.userinfo.draw_times;
			} else {
				$.times[lid] = 0;
				$.info(lid + ": " + obj.message);
			}
		})
		.catch((err) => {
			$.error("draw " + lid + ": \n");
			$.error(err);
		});
}

function drawShare(lid) {
	return $.get({
		url:
			mainURL +
			"/bosp-api/lottery/incrDpubShareParticipateLimit?lid=" +
			lid +
			"&token=" +
			encodeURIComponent($.Ticket) +
			"&role=1",
	})
		.delay(delay)
		.then((resp) => {
			$.log(lid + " drawShare: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			$.times[lid] += obj.data.incr_num;
		})
		.catch((err) => {
			$.error("drawShare " + lid + ": \n");
			$.error(err);
		});
}

function finance() {
	return $.post({
		url: financeURL + "/execute",
		headers: {
			"Content-Type": "application/json",
		},
		body: '{"token":"' + $.Ticket + '","activityId":"' + $.financeActId + '","clientId":1}',
	})
		.then((resp) => {
			$.log("execute: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			$.fbroken = false;
			if (obj.errorCode == 0) {
				let serialTimes = obj.data.serialSignInTimes;
				let period = obj.data.periodDays;
				$.subTitle += " 金融 [" + serialTimes + "/" + period + "] 天";
				$.detail += "\n金融签到获得如下奖品：";
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
				if (obj.errorMsg == "今天已经签到过了") {
					$.subTitle += " 金融🔄";
				} else if (obj.errorMsg == "断签") {
					$.fbroken = true;
				} else {
					throw new ERR.BodyError(obj.errorMsg);
				}
			} else {
				throw new ERR.BodyError(JSON.stringify(resp.body));
			}
		})
		.catch((err) => {
			throw err;
		});
}

function restartFinace() {
	return $.post({
		url: financeURL + "/restart",
		headers: {
			"Content-Type": "application/json",
		},
		body: '{"token":"' + $.Ticket + '","activityId":"' + $.financeActId + '","clientId":1}',
	})
		.then((resp) => {
			$.log("restart: " + JSON.stringify(resp.body));
		})
		.catch((err) => {
			throw err;
		});
}

async function instance() {
	$.joinInstance = false;
	$.instancechoose = await Choose($.activity_instance_id);
	await joinInstance();
	if ($.joinInstance) {
		await getInstance();
		await rewardInstance();
	}
}

function joinInstance() {
	$.log($.instancechoose);
	return $.post({
		url: mainURL + "/toggle/api/instance/join?ticket=" + encodeURIComponent($.Ticket),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "scene=" + $.instanceScene + "&activity_instance_id=" + $.instancechoose,
	})
		.then((resp) => {
			$.log("joinInstance: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				$.joinInstanceFlag = true;
			}
		})
		.catch((err) => {
			$.error("joinInstance: \n");
			$.error(err);
		});
}

function getInstance() {
	return $.get({
		url:
			mainURL +
			"/toggle/api/instance/getInstanceByInstanceID?scene=" +
			$.instanceScene +
			"&activity_instance_id=" +
			$.instancechoose +
			"&ticket=" +
			$.Ticket +
			"&need_reward=true",
	})
		.then((resp) => {
			$.log("getInstance: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			$.instance_activity_id = obj.data.activity_info.activity_id;
		})
		.catch((err) => {
			$.error("getInstance: \n");
			$.error(err);
		});
}

function rewardInstance() {
	return $.get({
		url:
			mainURL +
			"/toggle/api/query/queryAvailableReward?token=" +
			$.Ticket +
			"&scene=" +
			$.instanceScene +
			"&activity_id=" +
			$.instance_activity_id,
	})
		.then((resp) => {
			$.log("rewardInstance: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			for (let c of obj.data.batchs) {
				$.detail += "\n" + c.batch_name + "：" + c.remark;
			}
		})
		.catch((err) => {
			$.error("rewardInstance: \n");
			$.error(err);
		});
}

function grabCoupons(id) {
	return $.post({
		url: mainURL + "/wechat/soraka/gainAward",
		headers: {
			"Content-Type": "application/json",
			"Didi-Ticket": $.Ticket,
		},
		body: '{"app_id":"common","city_id":"' + $.city + '","act_id":"' + id + '"}',
	})
		.then((resp) => {
			$.log("time: " + $.now + "\naward[" + id + "]: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				$.detail += "\n抢到：" + obj.data.act_name + "。";
			} else if (obj.errno == 12000 || obj.errno == 13000) {
				$.detail += "\n" + id + ": 此券" + obj.errmsg + "。";
			} else if (obj.errno == 114514) {
				throw new ERR.BodyError("请求体错误，请开启抓包运行脚本后反馈抓包内容。");
			} else {
				$.error(resp.body);
				throw new ERR.BodyError(
					id + ": 抢券返回错误，请在 BoxJs 中开启调试模式运行后反馈日志。\n" + obj.errmsg
				);
			}
		})
		.catch((err) => {
			throw err;
		});
}

async function steps() {
	$.stepFlag = true;
	$.stepInfoBody = aff
		? '{"step_count":"' +
		  Math.round(Math.random() * 5000 + 20001) +
		  '","share_source_id":"' +
		  Choose($.step_share_source_id) +
		  '","share_date":"' +
		  today.replace(/-/g, "") +
		  '"}'
		: '{"step_count":"' +
		  Math.round(Math.random() * 5000 + 20001) +
		  '","share_source_id":"","share_date":""}';
	await stepInfo();
	if ($.stepFlag) {
		await stepBonus();
		await stepSign();
		await stepMatch();
	}
}

function stepInfo() {
	return $.post({
		url: stepURL + "/step/info",
		headers: {
			"Content-Type": "application/json",
			ticket: $.Ticket,
		},
		body: $.stepInfoBody,
	})
		.then((resp) => {
			$.log("stepInfo: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				$.info("DiDi step share_source_id: " + obj.data.share.share_source_id);
				$.todayStep = obj.data.greeting.today_step;
				$.stepShareActivityId = obj.data.task.activity_id;
			} else {
				$.stepFlag = false;
				$.info(
					"stepInfo: " + JSON.stringify(resp.body) + "\n" + "请检查是否有走路赚钱活动。"
				);
			}
		})
		.catch((err) => {
			$.error("stepInfo: \n");
			$.error(err);
		});
}

function stepBonus() {
	return $.post({
		url: stepURL + "/step/getBonus",
		headers: {
			"Content-Type": "application/json",
			ticket: $.Ticket,
		},
		body: "{}",
	})
		.then((resp) => {
			$.log("stepBonus: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				if (obj.data.bonus_amount) {
					let stepBonus = obj.data.bonus_amount;
					$.detail += "上传 " + $.todayStep + " 步，已领取 " + stepBonus + " 福利金。";
				} else {
					$.detail += "步数达标福利金" + obj.data.message_text + "。";
				}
			} else {
				$.info("stepBonus: " + JSON.stringify(resp.body));
			}
		})
		.catch((err) => {
			$.error("stepBonus: \n");
			$.error(err);
		});
}

function stepSign() {
	return $.post({
		url: stepURL + "/step/sign",
		headers: {
			"Content-Type": "application/json",
			ticket: $.Ticket,
		},
		body: '{"city_id":"' + $.city + '"}',
	})
		.then((resp) => {
			$.log("stepSign: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				if (obj.data.type == 1) {
					let stepSignBonus = obj.data.amount;
					$.detail +=
						"步数签到奖励 " + stepSignBonus + " 福利金。\n" + obj.data.sign_text;
				} else if (obj.data.type == 4) {
					let stepSignBonus = obj.data.amount / 100;
					$.detail += "步数签到奖励 " + stepSignBonus + " 元。\n" + obj.data.sign_text;
				} else if (obj.data.type == 0) {
					$.detail += "步数签到奖励" + obj.data.message_text + "。";
				} else {
					$.detail += "步数签到奖励未知类型：" + JSON.stringify(resp.body);
				}
			} else {
				$.info("stepSign: " + JSON.stringify(resp.body));
			}
		})
		.catch((err) => {
			$.error("stepSign: \n");
			$.error(err);
		});
}

async function stepMatch() {
	$.todayDate = today.replace(/-/g, "").substr(4);
	$.stepMatchState = 1;
	while ($.stepMatchState == 1) {
		await stepMatchInfo();
		if ($.stepMatchState == 1) {
			await stepMatchReceive();
			await stepMatchSubmit();
		} else if ($.stepMatchState == 2) {
			await stepMatchSubmit();
			await stepMatchJoin();
		} else if ($.stepMatchState == 3) {
			await stepMatchJoin();
		}
	}
}

function stepMatchInfo() {
	return $.post({
		url: stepURL + "/match/info",
		headers: {
			"Content-Type": "application/json",
			ticket: $.Ticket,
		},
		body: '{"step_count":"' + $.todayStep + '"}',
	})
		.then((resp) => {
			$.log("stepMatchInfo: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				$.log("DiDi stepMatch share_md5_id: " + obj.data.log_data.share_md5_id);
				let todayDate = today.replace(/-/g, "").substr(4);
				let objUpperDate = obj.data.upper_info.activity_date;
				if (objUpperDate < todayDate || (todayDate == "0101" && objUpperDate == "1231")) {
					$.stepMatchState = 1;
					$.stepMatchReceiveActivityId = obj.data.upper_info.activity_id;
					$.stepMatchReceiveTaskId =
						obj.data.upper_info.step_stage[
							obj.data.upper_info.step_stage.length - 1
						].task_id;
				} else if (objUpperDate == todayDate) {
					$.stepMatchState = 2;
					$.stepMatchSubmitActivityId = obj.data.upper_info.activity_id;
					$.stepMatchSubmitTaskId =
						obj.data.upper_info.step_stage[
							obj.data.upper_info.step_stage.length - 1
						].task_id;
					$.stepMatchJoinActivityId = obj.data.lower_info.activity_id;
					$.stepMatchJoinTaskId =
						obj.data.lower_info.step_stage[
							obj.data.lower_info.step_stage.length - 1
						].task_id;
					$.stepMatchJoinBonus =
						obj.data.upper_info.step_stage[
							obj.data.upper_info.step_stage.length - 1
						].step_bonus;
				} else if (
					objUpperDate > todayDate ||
					(todayDate == "1231" && objUpperDate == "0101")
				) {
					$.stepMatchState = 3;
					$.stepMatchJoinActivityId = obj.data.upper_info.activity_id;
					$.stepMatchJoinTaskId =
						obj.data.upper_info.step_stage[
							obj.data.upper_info.step_stage.length - 1
						].task_id;
					$.stepMatchJoinBonus =
						obj.data.upper_info.step_stage[
							obj.data.upper_info.step_stage.length - 1
						].step_bonus;
				}
			} else {
				$.stepMatchState = 0;
				$.info(
					"stepMatchInfo: " +
						JSON.stringify(resp.body) +
						"\n" +
						"请检查是否有天天步数赛活动。"
				);
			}
		})
		.catch((err) => {
			$.stepMatchState = -1;
			$.detail += "\n步数赛接口错误。";
			$.error("stepMatchInfo: \n");
			$.error(err);
		});
}

function stepMatchReceive() {
	return $.post({
		url: stepURL + "/match/receive",
		headers: {
			"Content-Type": "application/json",
			ticket: $.Ticket,
		},
		body:
			'{"type":2,"activity_id":' +
			$.stepMatchReceiveActivityId +
			',"task_id":' +
			$.stepMatchReceiveTaskId +
			"}",
	})
		.then((resp) => {
			$.log("stepMatchReceive: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				$.detail +=
					"\n" +
					(obj.data.amount
						? "昨日步数赛完成奖励 " + obj.data.amount + " 福利金。"
						: "步数赛奖励：" + JSON.stringify(obj.data));
			} else {
				$.info("stepMatchInfo: " + JSON.stringify(resp.body));
			}
		})
		.catch((err) => {
			$.error("stepMatchReceive: \n");
			$.error(err);
		});
}

function stepMatchSubmit() {
	return $.post({
		url: stepURL + "/match/submit",
		headers: {
			"Content-Type": "application/json",
			ticket: $.Ticket,
		},
		body:
			'{"activity_id":' +
			$.stepMatchSubmitActivityId +
			',"task_id":' +
			$.stepMatchSubmitTaskId +
			',"step_count":' +
			$.todayStep +
			"}",
	})
		.then((resp) => {
			$.log("stepMatchSubmit: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				$.detail +=
					"\n" +
					(obj.data.type == 1 || obj.data.type == 2
						? "今日步数赛成功提交 " + $.todayStep + " 步。"
						: "步数赛提交：" + JSON.stringify(obj.data));
			} else {
				$.info("stepMatchSubmit: " + JSON.stringify(resp.body));
			}
		})
		.catch((err) => {
			$.error("stepMatchSubmit: \n");
			$.error(err);
		});
}

function stepMatchJoin() {
	return $.post({
		url: stepURL + "/match/join",
		headers: {
			"Content-Type": "application/json",
			ticket: $.Ticket,
		},
		body:
			'{"type":2,"activity_id":' +
			$.stepMatchJoinActivityId +
			',"task_id":' +
			$.stepMatchJoinTaskId +
			"}",
	})
		.then((resp) => {
			$.log("stepMatchJoin: " + JSON.stringify(resp.body));
			let obj = JSON.parse(resp.body);
			if (obj.errno == 0) {
				$.detail +=
					"\n" +
					(obj.data.type == 1
						? "明日步数赛报名花费 " + $.stepMatchJoinBonus + " 福利金。"
						: "步数赛报名：" + JSON.stringify(obj.data));
			} else {
				$.info("stepMatchJoin: " + JSON.stringify(resp.body));
			}
		})
		.catch((err) => {
			$.error("stepMatchJoin: \n");
			$.error(err);
		});
}

async function tree() {
	await treeLogin();
	await treeTask();
	await treeWater();
	await treeFertilize();
	await treeDbox();
	await treeLogout();
}

function getToken() {
	let appreg = /^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\?.*city=(\d+)&.*ticket=(.*?)&/;
	let minireg = /^https:\/\/common\.diditaxi\.com\.cn\/webapp\/config\/sidebar\?.*token=(.*?)&.*cityid=(\d+)/;
	if (appreg.exec($request.url)) {
		let CityValue = appreg.exec($request.url)[1];
		let TokenValue = decodeURIComponent(appreg.exec($request.url)[2]);
		if ($.read("#DiDi") != (undefined || null)) {
			if ($.read("#DiDi") != TokenValue || $.read("#DiDi_city") != CityValue) {
				$.write(TokenValue, "#DiDi");
				$.write(CityValue, "#DiDi_city");
				$.notify("更新 " + $.name + " Token 成功 🎉", "", "");
			}
		} else {
			$.write(TokenValue, "#DiDi");
			$.write(CityValue, "#DiDi_city");
			$.notify("首次写入 " + $.name + " Token 成功 🎉", "", "");
		}
	} else if (minireg.exec($request.url)) {
		let CityValue = minireg.exec($request.url)[2];
		let TokenValue = decodeURIComponent(minireg.exec($request.url)[1]);
		if ($.read("#DiDi") != (undefined || null)) {
			if ($.read("#DiDi") != TokenValue || $.read("#DiDi_city") != CityValue) {
				$.write(TokenValue, "#DiDi");
				$.write(CityValue, "#DiDi_city");
				$.notify("更新 " + $.name + " Token 成功 🎉", "", "");
			}
		} else {
			$.write(TokenValue, "#DiDi");
			$.write(CityValue, "#DiDi_city");
			$.notify("首次写入 " + $.name + " Token 成功 🎉", "", "");
		}
	} else {
		$.notify("写入" + $.name + " Token 失败‼️", "", "请开启定位权限，重开软件重新获取。");
	}
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
