/*
qx(tf 1.0.11(316)) 、 loon(tf 2.1.1(163))、 surge(tf 4.10.0(1807)) 及更新版本可用。
半自动提醒完成招行小麦存钱罐 2.0 活动。
10 10 * * 2 （2020/09/22 - 2020/12/.. 每周二）
到时候点击通知即可跳转至招行小麦存钱罐 2.0 活动界面。

自用 by zZPiglet
*/

const $ = new compatibility();

const cmb_catbank =
	"cmbmobilebank://cmbls/functionjump?action=gocorpno&corpno=840156&cmb_app_trans_parms_start=here&appflag=0&shorturl=https%3a%2f%2ft.cmbchina.com%2fQzy2a2";

$.notify("招商银行-小麦存钱罐", "", "点击跳转去抽奖啦", cmb_catbank);

$done();

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
