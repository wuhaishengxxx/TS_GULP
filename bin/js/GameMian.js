var Label = Laya.Label;
var Handler = Laya.Handler;
var Loader = Laya.Loader;
var WebGL = Laya.WebGL;
var GameMian = /** @class */ (function () {
    function GameMian(w, h) {
        if (w === void 0) { w = 640; }
        if (h === void 0) { h = 1136; }
        Laya.init(w, h, WebGL);
        //激活资源版本控制
        Laya.ResourceVersion.enable("version.json", Handler.create(this, this.beginLoad), Laya.ResourceVersion.FILENAME_VERSION);
        GameLayerManager.instance.init();
    }
    GameMian.prototype.beginLoad = function () {
        Laya.loader.load("res/atlas/comp.atlas", Handler.create(this, this.onLoaded));
    };
    GameMian.prototype.onLoaded = function () {
        //实例UI界面
        var main = new view.main.Main();
        Laya.stage.addChild(main);
    };
    return GameMian;
}());
