/*
[Script]
captureMode.js = type=generic,timeout=10,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/captureMode.js
// use "module", "title", "icon", "color1", "color2", "color3" or "showHostname" in "argument":
// captureMode.js = type=generic,timeout=10,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/captureMode.js,argument=title=CaptureMode&module=capturemode&icon=tray.and.arrow.down&color1=#008080&color2=#efc56f&color3=#994714&showHostname=false

[Panel]
captureMode.js = script-name=captureMode.js,update-interval=43200
*/

!(async () => {
    let module = "MitM All Hostnames",
        panel = { title: module, icon: "tray.and.arrow.down.fill" },
        showHostname = true,
        capture,
        mitmall,
        hostname,
        color1,
        color2,
        color3;
    if (typeof $argument != "undefined") {
        let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=")));
        if (arg.module) module = panel.title = arg.module;
        if (arg.title) panel.title = arg.title;
        if (arg.icon) panel.icon = arg.icon;
        if (arg.color1) color1 = arg.color1;
        if (arg.color2) color2 = arg.color2;
        if (arg.color3) color3 = arg.color3;
        if (arg.showHostname == "false") showHostname = false;
    }
    if ($trigger == "button") {
        capture = (await httpAPI("/v1/features/capture")).enabled;
        mitmall = (await httpAPI("/v1/modules")).enabled.includes(module);
        if (capture == mitmall)
            await httpAPI("/v1/features/capture", "POST", { enabled: !capture });
        let moduleBody = {};
        moduleBody[module] = !mitmall;
        await httpAPI("/v1/modules", "POST", moduleBody);
        await sleep(100);
    }
    capture = (await httpAPI("/v1/features/capture")).enabled;
    mitmall = (await httpAPI("/v1/modules")).enabled.includes(module);
    if (showHostname && mitmall) {
        hostname = /hostname\s?=\s?(.*)/.exec(
            (await httpAPI("/v1/profiles/current?sensitive=0")).profile
        )[1];
    }
    if (capture && mitmall) panel["icon-color"] = color3 ? color3 : "#ff0000";
    else if (capture || mitmall) panel["icon-color"] = color2 ? color2 : "#fcb515";
    else color1 ? (panel["icon-color"] = color1) : "";
    panel.content =
        `HTTP Capture: ${capture ? "enabled" : "disabled"}\n` +
        `${module}: ${mitmall ? "enabled" : "disabled"}` +
        (hostname ? `\nhostname: ${hostname}` : "");
    $done(panel);
})();

function httpAPI(path = "", method = "GET", body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
            resolve(result);
        });
    });
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// hostname\s?=\s?(.*?)
// (?<![^\s,])\*(:\d+)?(?![^\s,])
