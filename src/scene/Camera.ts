

import Rectangle = laya.maths.Rectangle;
import Timer = laya.utils.Timer;

class Camera {


    private _viewport: Rectangle;
    private _worldW: number;
    private _worldH: number;

    /** 视图宽高的一半 */
    private _sw: number;
    private _sh: number;

    private _zorder_speed: number = 500;
    private _add_role_time: number = 1000;
    private _maxOrigin: Point;
    private _focus: Laya.Sprite;
    private _moveStart: Point;
    private _moveEnd: Point;
    private _moveAngle: number = 0;
    private _moveCallback: Function;


    /**
     * @param viewport  可视区域
     * @param view  视图区域
     */
    public constructor(world: any) {
      
        this._viewport = new Rectangle;
        this._maxOrigin = new Point;
        this._worldH = 0;
        this._worldW = 0;
        this._sw = 0;
        this._sh = 0;
    }


    public setViewport(x, y, w, h) {

        this._viewport.x = x;
        this._viewport.y = y;
        this._viewport.width = w;
        this._viewport.height = h;
        this._sw = Math.floor(w) >> 1;
        this._sh = Math.floor(h) >> 1;
        this._maxOrigin.x = this._worldW - this._viewport.width;
        this._maxOrigin.y = this._worldH - this._viewport.height
    }


    public setWorldSize(w, h) {
        this._worldW = w;
        this._worldH = h;
        this._maxOrigin.x = w - this._viewport.width;
        this._maxOrigin.y = h - this._viewport.height

    }

    public get viewport(): Rectangle {
        return this._viewport;
    }

    public get originX(): number {
        return this._viewport.x;
    }
    public get originY(): number {
        return this._viewport.y;
    }

    public get zorderSpeed(): number {
        return this._zorder_speed;
    }
    public get addRoleTime(): number {
        return this._add_role_time;
    }

    /**
     * 设置镜头笛卡尔坐标原点相对于地图坐标
     * @param x 
     * @param y 
     */
    public setOrigin(x: number, y: number): void {
        x >>= 0, y >>= 0;
        if (x != this._viewport.x || y != this._viewport.y) {
            this._viewport.x = x
            this._viewport.y = y;

            this._viewport.x = this._viewport.x < 0 ? 0 : this._viewport.x;
            this._viewport.x = this._viewport.x > this._maxOrigin.x ? this._maxOrigin.x : this._viewport.x;

            this._viewport.y = this._viewport.y < 0 ? 0 : this._viewport.y;
            this._viewport.y = this._viewport.y > this._maxOrigin.y ? this._maxOrigin.y : this._viewport.y;
        }

    }

    /**
     * 
     * @param x  镜头中心点
     * @param y 镜头中心点
     */
    public lookAt(x: number, y: number): void {
        this.setOrigin(x - this._sw, y - this._sh);
    }

}


