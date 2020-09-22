/*
Skip the redirect page.

Quantumult X:
[rewrite_local]
# 简书
^https:\/\/links\.jianshu\.com\/go\?to= url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js
# 知乎
^https:\/\/link\.zhihu\.com\/\?target= url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js

Surge
[Script]
# 简书
Jianshu = type=http-request,pattern=^https:\/\/links\.jianshu\.com\/go\?to=,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js
# 知乎
Zhihu = type=http-request,pattern=^https:\/\/link\.zhihu\.com\/\?target=,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect.js

[mitm]
hostname = links.jianshu.com, link.zhihu.com
*/

const jianshur = /https:\/\/links\.jianshu\.com\/go\?to=(.*)/;
const zhihur= /https:\/\/link\.zhihu\.com\/\?target=(.*)/;

const oldurl = $request.url;
let newurl = '';
if (oldurl.indexOf('jianshu') != -1) {
    newurl = decodeURIComponent(jianshur.exec(oldurl)[1]);
} else if (oldurl.indexOf('zhihu') != -1) {
    newurl = decodeURIComponent(zhihur.exec(oldurl)[1]);
}

const isQuanX = typeof $notify != "undefined";
const newstatus = isQuanX ? "HTTP/1.1 302 Temporary Redirect" : 302;

const noredirect = {
    status: newstatus,
    headers: {
        "Location": newurl
    }
}

const resp = isQuanX ? noredirect : { response: noredirect };

$done(resp)