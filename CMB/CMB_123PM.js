const $ = new compatibility();

!(async () => {
	const cmb_123pm =
		"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20201120155636jBUUyuSQ&behavior_entryid=YYB002001&appflag=0&shorturl=https%3a%2f%2ft.cmbchina.com";
	$.notify("招商银行-年终奖预热", "", "点击跳转去抢券啦", cmb_123pm);
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
