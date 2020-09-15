# 达美乐比萨

"达美乐比萨" 微信公众号 "优惠｜咨询" - "有奖游戏" 获取奖励（省略玩游戏一步），支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。  
请先按下述方法进行配置，进入微信公众号"达美乐比萨" - "优惠｜咨询" - "有奖游戏"，正常游戏一次并获取验证码，若弹出"首次写入 Domino RequestBody 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。  
>>运行前请先在 BoxJs 中订阅[此订阅](https://raw.githubusercontent.com/zZPiglet/Task/master/zZPiglet.boxjs.json)。  


## ⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。


----------
## 版本记录：
- 2020 / 09 / 15  
    此版本活动无需每次输入验证码，首次活动绑定后即可。故此次为自动版本，请对[`Domino_getGift.js`](https://raw.githubusercontent.com/zZPiglet/Task/master/Domino/Domino_getGift.js) 设置定时任务。  
    >> 注意：此次更新需要更改定时任务脚本，且更改 hostname 及 rewrite 正则，重写脚本无需更改。
- 2020 / 08 / 09  
    由于每次获取奖励均需要验证码，故此为半自动版本。  
    且由于验证码有效期为 10 分钟，请对 [`Domino_getSMS.js`](https://raw.githubusercontent.com/zZPiglet/Task/master/Domino/Domino_getSMS.js) 设置使用手机时段对 cron，到 cron 设定时间自动签到时，若弹出"达美乐 - 点击填写验证码"表示成功，请点击通知跳转至 BoxJs 填写验证码并保存，再手动执 行「获取奖励」脚本即可，其他提示或无提示请发送日志信息至 issue。注意每日可以获取三次奖励。  
----------

## 配置 (0915 活动，全自动)
### Quantumult X:
```properties
[task_local]
0 15 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/Domino/Domino_getGift.js, tag=达美乐

[rewrite_local]
^https?:\/\/dominos\d{4}\.shjimang\.com\/Ajax\/GetSmsCode url script-request-body https://raw.githubusercontent.com/zZPiglet/Task/master/Domino/Domino_getSMS.js
```
### Surge 4.0+ & Loon:
```properties
[Script]
cron "0 15 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Domino/Domino_getGift.js
http-request ^https?:\/\/dominos\d{4}\.shjimang\.com\/Ajax\/GetSmsCode requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Domino/Domino_getSMS.js
```
### All apps:
```properties
[mitm]
hostname = dominos*.shjimang.com
```

## 配置 (0724 活动，半自动)
### Quantumult X:
```properties
[task_local]
0 15 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/Domino/Domino_getSMS.js, tag=达美乐
; cron 时间请设置为使用手机的时间，验证码有效期为 10 分钟。

[rewrite_local]
^https?:\/\/dominos0724\.shjimang\.com\/Ajax\/GetSmsCode url script-request-body https://raw.githubusercontent.com/zZPiglet/Task/master/Domino/Domino_getSMS.js
```
### Surge 4.0+ & Loon:
```properties
[Script]
cron "0 15 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Domino/Domino_getSMS.js
http-request ^https?:\/\/dominos0724\.shjimang\.com\/Ajax\/GetSmsCode requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Domino/Domino_getSMS.js
```
### All apps:
```properties
[mitm]
hostname = dominos0724.shjimang.com
```

获取完 RequestBody 后可不注释 rewrite / hostname，RequestBody 更新时会弹窗。若因 MitM 导致该软件或小程序网络不稳定，可注释掉 hostname。