const $ = new compatibility();

!(async () => {
	const cmb_sport =
		"cmbmobilebank://cmbls/functionjump?action=gocorpno&corpno=791166&cmb_app_trans_parms_start=here&appflag=0&shorturl=https://t.cmbchina.com/AJbEju";
	$.notify("招商银行-便民运动会", "", "点击跳转去领能量兑换红包啦", cmb_sport);
})().finally(() => $done());

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
