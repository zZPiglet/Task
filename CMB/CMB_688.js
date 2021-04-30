const $ = new compatibility();
$.wait_in2 = $.read("CMB_wait_in2") * 1000 || 15000;
$.wait_6888 = $.read("CMB_wait_6888") * 1000 || 15000;
$.wait_688 = $.read("CMB_wait_688") * 1000 || 15000;
$.wait_188 = $.read("CMB_wait_188") * 1000 || 15000;
$.wait_out = $.read("CMB_wait_out") * 1000 || 15000;
const transfer_in = "alipays://platformapi/startapp?appId=60000126&url=/www/transfer_in.html";
const transfer_out = "alipays://platformapi/startapp?appId=60000126&url=/www/transfer_out.html";
const cmb_6888 =
	"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20210430211109d7CB7C4c";
const cmb_888 =
	"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20210330164443TSsdTso4";
const cmb_188 =
	"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP202103301639305YhKf512";

let delay = function (s) {
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, s);
	});
};

delay()
	.then(function () {
		$.notify(
			"招商银行-6888、888、188活动",
			"步骤 1：余额宝从招行卡转入",
			"点击跳转去余额宝转入(每月一次6888，每日可拆500+388)",
			transfer_in
		);
		return delay($.wait_in2);
	})
	.then(function () {
		$.notify(
			"招商银行-6888、888、188活动",
			"步骤 1'：余额宝从招行卡转入",
			"点击跳转去余额宝转入(每月一次6888，每日可拆500+388)",
			transfer_in
		);
		return delay($.wait_6888);
	})
	.then(function () {
		$.notify(
			"招商银行-6888、888、188活动",
			"步骤 2：招行 6888 刮奖",
			"点击跳转去招行 6888 刮奖页面",
			cmb_6888
		);
		return delay($.wait_688);
	})
	.then(function () {
		$.notify(
			"招商银行-6888、888、188活动",
			"步骤 3：招行 888 刮奖",
			"点击跳转去招行 888 刮奖页面",
			cmb_888
		);
		return delay($.wait_188);
	})
	.then(function () {
		$.notify(
			"招商银行-6888、888、188活动",
			"步骤 4：招行 188 刮奖",
			"点击跳转去招行 188 刮奖页面",
			cmb_188
		);
		return delay($.wait_out);
	})
	.then(function () {
		$.notify(
			"招商银行-6888、888、188活动",
			"步骤 5：余额宝转回招行卡",
			"点击跳转去余额宝转出",
			transfer_out
		);
	})
	.finally(() => $done());

function compatibility() {
	_isQuanX = typeof $task != "undefined";
	_isLoon = typeof $loon != "undefined";
	_isSurge = typeof $httpClient != "undefined" && !_isLoon;
	this.read = (key) => {
		if (_isQuanX) return $prefs.valueForKey(key);
		if (_isLoon) return $persistentStore.read(key);
	};
	this.notify = (title, subtitle, message, url) => {
		if (_isLoon) $notification.post(title, subtitle, message, url);
		if (_isQuanX) $notify(title, subtitle, message, { "open-url": url });
		if (_isSurge) $notification.post(title, subtitle, message, { url: url });
	};
}
