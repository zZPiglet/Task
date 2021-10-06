/*
[Script]
moduleState.js = type=generic,timeout=10,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/moduleState.js
// use "module", "title", "icon", "color1" or "color2" in "argument":
// moduleState.js = type=generic,timeout=10,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/moduleState.js,argument=title=getCookies&module=TaskCookie&icon=person.icloud.fill&color1=#008080&color2=#994714

[Panel]
moduleState.js = script-name=moduleState.js,update-interval=43200
*/

!(async () => {
    let panel = { title: "Modole On-Off", icon: "cube.box.fill" },
        module = "router.com",
        moduleState,
        color1,
        color2;
    if (typeof $argument != "undefined") {
        let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=")));
        if (arg.module) module = panel.title = arg.module;
        if (arg.title) panel.title = arg.title;
        if (arg.icon) panel.icon = arg.icon;
        if (arg.color1) color1 = arg.color1;
        if (arg.color2) color2 = arg.color2;
    }
    if ($trigger == "button") {
        moduleState = (await httpAPI("/v1/modules")).enabled.includes(module);
        let moduleBody = {};
        moduleBody[module] = !moduleState;
        await httpAPI("/v1/modules", "POST", moduleBody);
        await sleep(100);
    }
    moduleState = (await httpAPI("/v1/modules")).enabled.includes(module);
    if (moduleState) panel["icon-color"] = color2 ? color2 : "#ff0000";
    else color1 ? (panel["icon-color"] = color1) : "";
    panel.content = `State: ${moduleState ? "enabled" : "disabled"}`;
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
