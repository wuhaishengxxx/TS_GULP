var Rectangle = laya.maths.Rectangle;
var Timer = laya.utils.Timer;
var Camera = /** @class */ (function () {
    /**
     * @param viewport  可视区域
     * @param view  视图区域
     */
    function Camera(world) {
        this._zorder_speed = 500;
        this._add_role_time = 1000;
        this._moveAngle = 0;
        this._viewport = new Rectangle;
        this._maxOrigin = new Point;
        this._worldH = 0;
        this._worldW = 0;
        this._sw = 0;
        this._sh = 0;
    }
    Camera.prototype.setViewport = function (x, y, w, h) {
        this._viewport.x = x;
        this._viewport.y = y;
        this._viewport.width = w;
        this._viewport.height = h;
        this._sw = Math.floor(w) >> 1;
        this._sh = Math.floor(h) >> 1;
        this._maxOrigin.x = this._worldW - this._viewport.width;
        this._maxOrigin.y = this._worldH - this._viewport.height;
    };
    Camera.prototype.setWorldSize = function (w, h) {
        this._worldW = w;
        this._worldH = h;
        this._maxOrigin.x = w - this._viewport.width;
        this._maxOrigin.y = h - this._viewport.height;
    };
    Object.defineProperty(Camera.prototype, "viewport", {
        get: function () {
            return this._viewport;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "originX", {
        get: function () {
            return this._viewport.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "originY", {
        get: function () {
            return this._viewport.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "zorderSpeed", {
        get: function () {
            return this._zorder_speed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "addRoleTime", {
        get: function () {
            return this._add_role_time;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置镜头笛卡尔坐标原点相对于地图坐标
     * @param x
     * @param y
     */
    Camera.prototype.setOrigin = function (x, y) {
        x >>= 0, y >>= 0;
        if (x != this._viewport.x || y != this._viewport.y) {
            this._viewport.x = x;
            this._viewport.y = y;
            this._viewport.x = this._viewport.x < 0 ? 0 : this._viewport.x;
            this._viewport.x = this._viewport.x > this._maxOrigin.x ? this._maxOrigin.x : this._viewport.x;
            this._viewport.y = this._viewport.y < 0 ? 0 : this._viewport.y;
            this._viewport.y = this._viewport.y > this._maxOrigin.y ? this._maxOrigin.y : this._viewport.y;
        }
    };
    /**
     *
     * @param x  镜头中心点
     * @param y 镜头中心点
     */
    Camera.prototype.lookAt = function (x, y) {
        this.setOrigin(x - this._sw, y - this._sh);
    };
    return Camera;
}());
