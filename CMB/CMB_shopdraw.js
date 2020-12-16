const $ = new compatibility();

!(async () => {
	const cmb_gold =
		"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20201215160156PTwY2Vi3&behavior_entryid=YYD002001&appflag=0&shorturl=https%3a%2f%2ft.cmbchina.com%2fAfANJ3%3fActGroupID%3dAGP20201215160156PTwY2Vi3%26behavior_entryid%3dYYD002001";
	$.notify("招商银行-云逛街", "", "点击跳转去抽奖啦", cmb_gold);
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
