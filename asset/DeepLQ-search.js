/*
Encode spaces as "%20" when using key "dlc" / "dle" / "dlj" in Q-Search.

Quantumult X:
# dlc xxx (DeepL 译至中)
^https:\/\/duckduckgo.com\/\?q=dlc(\+|%20)([^&]+).+ url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/asset/DeepLQ-search.js
# dle xxx (DeepL 译至英)
^https:\/\/duckduckgo.com\/\?q=dle(\+|%20)([^&]+).+ url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/asset/DeepLQ-search.js
# dlj xxx (DeepL 译至日)
^https:\/\/duckduckgo.com\/\?q=dlj(\+|%20)([^&]+).+ url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/asset/DeepLQ-search.js

Surge:
# dlc xxx (DeepL 译至中)
DeepLtoChinese = type=http-request,pattern=^https:\/\/duckduckgo.com\/\?q=dlc(\+|%20)([^&]+).+,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/DeepLQ-search.js
# dle xxx (DeepL 译至英)
DeepLtoEnglish = type=http-request,pattern=^https:\/\/duckduckgo.com\/\?q=dle(\+|%20)([^&]+).+,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/DeepLQ-search.js
# dlj xxx (DeepL 译至日)
DeepLtoJapanese = type=http-request,pattern=^https:\/\/duckduckgo.com\/\?q=dlj(\+|%20)([^&]+).+,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/DeepLQ-search.js

Notice that the URL Rewirte methods have higher priority than using a script, so need modify the final URL Rewrite's(the rewrite with no key) regular expression.
 */

const deeplr = /^https:\/\/duckduckgo.com\/\?q=dl(c|e|j)(\+|%20)([^&]+).+/;
const oldurl = $request.url;
let newurl = "https://www.deepl.com/translator#auto/";
if (oldurl.indexOf("dlc") != -1) {
	newurl += "zh/" + deeplr.exec(oldurl)[3].replace(/\+/g, "%20");
} else if (oldurl.indexOf("dle") != -1) {
	newurl += "en/" + deeplr.exec(oldurl)[3].replace(/\+/g, "%20");
} else if (oldurl.indexOf("dlj") != -1) {
	newurl += "ja/" + deeplr.exec(oldurl)[3].replace(/\+/g, "%20");
}

/*
// Need add MitM hostname = www.deepl.com when using this method, but choose your key flexibly.
// Quantumult X:
// ^https:\/\/www.deepl.com\/translator#(\S+?)\/(\S+?)\/([\s\S]*) url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/asset/DeepLQ-Search.js
// Surge:
// DeepLQ-Search = type=http-request,pattern=^https:\/\/www.deepl.com\/translator#(\S+?)\/(\S+?)\/([\s\S]*),script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/DeepLQ-Search.js

const deeplr = /^https:\/\/www.deepl.com\/translator#(\S+?)\/(\S+?)\/([\s\S]*)/;
const oldurl = $request.url;
let newurl =
	"https://www.deepl.com/translator#" +
	deeplr.exec(oldurl)[1] +
	"/" +
	deeplr.exec(oldurl)[2] +
	"/" +
    deeplr.exec(oldurl)[3].replace(/%2B/g, "%20");
 */

const isQuanX = typeof $notify != "undefined";
const newstatus = isQuanX ? "HTTP/1.1 302 Temporary Redirect" : 302;

const deepl = {
	status: newstatus,
	headers: {
		Location: newurl,
	},
};

let resp = isQuanX ? deepl : { response: deepl };
resp = typeof $response != "undefined" ? deepl : resp;

$done(resp);
