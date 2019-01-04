var scene;
(function (scene) {
    var SceneManager = /** @class */ (function () {
        function SceneManager() {
        }
        Object.defineProperty(SceneManager, "instance", {
            get: function () {
                return this._instance || (this._instance = new SceneManager());
            },
            enumerable: true,
            configurable: true
        });
        SceneManager.prototype.enterScene = function (mapID) {
            if (this.map == null) {
                this.map = new scene.Map();
            }
            if (this.mapLoadedHander == null) {
                this.mapLoadedHander = Laya.Handler.create(this, this.onMapLoad);
            }
            this.map.load(mapID, this.mapLoadedHander);
        };
        SceneManager.prototype.onMapLoad = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
        };
        return SceneManager;
    }());
    scene.SceneManager = SceneManager;
})(scene || (scene = {}));
