/*
仅更改手机端百度全站的 User-Agent。
[Script]
# 百度（全站替换为手机百度 Quark 的 User-Agent）
BaiduChangeUA = type=http-request,pattern=^https?:\/\/(?!d\.pcs).*(?<!map)\.baidu\.com,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/BaiduChangeUA.js

[MITM]
hostname = *.baidu.com
 */

let url = $request.url;
let headers = $request.headers;
if (url.indexOf("baidu.com") !== -1) {
	if (headers["User-Agent"].indexOf("iPhone") !== -1)
		headers["User-Agent"] =
			"Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/16C50 Quark/604.1 T7/10.3 SearchCraft/2.6.3 (Baidu; P1 8.0.0)";
}
$done({ headers });
