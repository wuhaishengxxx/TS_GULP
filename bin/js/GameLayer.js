var GameLayerManager = /** @class */ (function () {
    function GameLayerManager() {
    }
    Object.defineProperty(GameLayerManager, "instance", {
        get: function () {
            return this._instance || (this._instance = new GameLayerManager());
        },
        enumerable: true,
        configurable: true
    });
    GameLayerManager.prototype.init = function () {
        this.uiLayer = new Laya.Sprite;
        this.sceneLayer = new Laya.Sprite;
        Laya.stage.addChild(this.sceneLayer);
        Laya.stage.addChild(this.uiLayer);
    };
    return GameLayerManager;
}());
