/*
Skip the redirect page.

Quantumult X:
[rewrite_local]
# 简书
^https:\/\/links\.jianshu\.com\/go\?to= url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js
^https:\/\/www\.jianshu\.com\/go-wild\?ac=\d&url= url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js
# 知乎
^https:\/\/link\.zhihu\.com\/\?target= url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js
# 微博
^https?:\/\/weibo\.cn\/sinaurl\?toasturl= url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js
^https?:\/\/(sinaurl|t)\.cn\/ url script-response-header https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js

Surge
[Script]
# 简书
Jianshunoredirect = type=http-request,pattern=^https:\/\/links\.jianshu\.com\/go\?to=,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js
Jianshunoredirect2 = type=http-request,pattern=^https:\/\/www\.jianshu\.com\/go-wild\?ac=\d&url=,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js
# 知乎
Zhihunoredirect = type=http-request,pattern=^https:\/\/link\.zhihu\.com\/\?target=,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js
# 微博
Weibonoredirect = type=http-request,pattern=^https?:\/\/weibo\.cn\/sinaurl\?toasturl=,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js
Weibonoredirect2 = type=http-response,pattern=^https?:\/\/(sinaurl|t)\.cn\/,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js

[mitm]
hostname = links.jianshu.com, www.jianshu.com, link.zhihu.com, weibo.cn, t.cn, sinaurl.cn
*/

const jianshur = /https:\/\/links\.jianshu\.com\/go\?to=(.*)/;
const jianshur2 = /https:\/\/www\.jianshu\.com\/go-wild\?ac=\d&url=(.*)/;
const zhihur = /https:\/\/link\.zhihu\.com\/\?target=(.*)/;
const weibor = /https?:\/\/weibo\.cn\/sinaurl\?toasturl=(.*)/;

const oldurl = $request.url;
let newurl = "";
if (oldurl.indexOf("links.jianshu.com/go") != -1) {
	newurl = decodeURIComponent(jianshur.exec(oldurl)[1]);
} else if (oldurl.indexOf("www.jianshu.com/go") != -1) {
	newurl = decodeURIComponent(jianshur2.exec(oldurl)[1]);
} else if (oldurl.indexOf("link.zhihu.com/?target") != -1) {
	newurl = decodeURIComponent(zhihur.exec(oldurl)[1]);
} else if (oldurl.indexOf("weibo.cn/sinaurl?toasturl") != -1) {
	newurl = decodeURIComponent(weibor.exec(oldurl)[1]);
} else if (oldurl.indexOf("sinaurl.cn") != -1 || oldurl.indexOf("t.cn") != -1) {
	let headers = $response.headers;
	newurl = headers.Location;
}

const isQuanX = typeof $notify != "undefined";
const newstatus = isQuanX ? "HTTP/1.1 302 Temporary Redirect" : 302;

const noredirect = {
	status: newstatus,
	headers: {
		Location: newurl,
	},
};

let resp = isQuanX ? noredirect : { response: noredirect };
resp = typeof $response != "undefined" ? noredirect : resp;

$done(resp);
