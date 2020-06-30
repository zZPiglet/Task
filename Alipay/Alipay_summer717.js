/*
qx(tf 1.0.11(316)) 及 loon(tf 2.1.1(163)) 及更新版本可用。
半自动提醒支付宝 717 生活狂欢节抢消费券。

qx:
0 0 8,12 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/Alipay/Alipay_summer717.js

loon:
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Alipay/Alipay_summer717.js

shortcut:
https://www.icloud.com/shortcuts/9399d49a3bb44102a2556e81f60fd01a

到时候点击通知即可跳转至支付宝 717 生活狂欢节界面。

自不用 by zZPiglet
*/

const $ = new cmp()

let summer717 = "alipays://platformapi/startapp?appId=2021001162654785&page=pages/summer717/summer717"

$.notify("支付宝", "", "点击跳转抢消费券啦", summer717)

$done()

function cmp() {
    _isQuanX = typeof $task != "undefined"
    _isLoon = typeof $loon != "undefined"
    this.notify = (title, subtitle, message, url) => {
        if (_isLoon) $notification.post(title, subtitle, message, url)
        if (_isQuanX) $notify(title, subtitle, message, {"open-url" : url})
    }
}