const $ = new compatibility();

const cmb_trip = [
	"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20210310163020oOiVxF7r&behavior_entryid=YYB001003&appflag=0&shorturl=https%3a%2f%2ft.cmbchina.com%2fAfANJ3%3fActGroupID%3dAGP20210310163020oOiVxF7r%26behavior_entryid%3dYYB001003",
	"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20210324151044qeSZOjyF&behavior_entryid=YYB001003&appflag=0&shorturl=https%3a%2f%2ft.cmbchina.com%2fAfANJ3%3fActGroupID%3dAGP20210324151044qeSZOjyF%26behavior_entryid%3dYYB001003",
	"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20210310162427th45BDah&behavior_entryid=YYB001003&appflag=0&shorturl=https%3a%2f%2ft.cmbchina.com%2fAfANJ3%3fActGroupID%3dAGP20210310162427th45BDah%26behavior_entryid%3dYYB001003",
	"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20210310163231ooqQL9G9&behavior_entryid=YYB001003&appflag=0&shorturl=https%3a%2f%2ft.cmbchina.com%2fAfANJ3%3fActGroupID%3dAGP20210310163231ooqQL9G9%26behavior_entryid%3dYYB001003",
	"cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20210324151441BUI4hB2v&behavior_entryid=YYB001003&appflag=0&shorturl=https%3a%2f%2ft.cmbchina.com%2fAfANJ3%3fActGroupID%3dAGP20210324151441BUI4hB2v%26behavior_entryid%3dYYB001003",
];

!(async () => {
	let i = new Date().getDay() - 1;
	$.notify("招商银行-出游有招", "", "点击跳转去抢券啦", cmb_trip[i]);
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
