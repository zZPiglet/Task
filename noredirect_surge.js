/*
Skip the redirect page.
Surge:
[Script]
# 简书
Jianshu = type=http-request,pattern=^https:\/\/links\.jianshu\.com\/go\?to=,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect_surge.js
# 知乎
Zhihu = type=http-request,pattern=^https:\/\/link\.zhihu\.com\/\?target=,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/noredirect_surge.js

[mitm]
hostname = links.jianshu.com, link.zhihu.com
*/

const jianshur = /https:\/\/links\.jianshu\.com\/go\?to=(.*)/
const zhihur= /https:\/\/link\.zhihu\.com\/\?target=(.*)/

const oldurl = $request.url
let newurl = ''
if (oldurl.indexOf('jianshu') != -1) {
    newurl += decodeURIComponent(jianshur.exec(oldurl)[1])
} else if (oldurl.indexOf('zhihu') != -1) {
    newurl += decodeURIComponent(zhihur.exec(oldurl)[1])
}

const noredirect = {
    status: 302,
    headers: {
        "Location": newurl
    }
}

$done({ response: noredirect })