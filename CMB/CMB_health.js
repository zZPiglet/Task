const $ = new compatibility();

!(async () => {
	const cmb_health =
		"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=0069040&cmb_app_trans_parms_start=here&appflag=0&shorturl=https%3a%2f%2ft.cmbchina.com%2fJrumqy";
	$.notify("招商银行-健康金", "", "点击跳转去做健康金任务啦", cmb_health);
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
