
namespace scene {
    /**
     * 地图类 
     * 负责管理地图加载 
     * @export
     * @class Map
     */
    export class Map {

        Tiled_Height: any;
        Tiled_Width: any;
        // 出错加载次数
        private static Max_Error_Load = 3;


        // 行数
        private _colsCount: number;
        private _rowsCount: number;

        public width: number;
        public height: number;
        private _mapResID: number;
        private _callBack: Function;
        private world: any;
        // 地图层 ，用来绘制地图
        public mapLayer: Laya.Sprite;

        // 当前起始行列索引
        private _startCols: number;
        private _startRows: number;
        // 一屏所需切图行列数
        private _colsArea: number;
        private _rowsArea: number;
        // 最大需要纹理数
        private _maxTiled: number;

        /**  纹理缓存 */
        private _texturePool: any;
        /** 模糊小图 */
        private _smallTexture: Laya.Texture;
        private _smallUrl: string;
        private _smallTileW: number;
        private _smallTileH: number;
        // 加载错误数
        private _loadErrorNum: number;
        /** 当前已加载的url */
        private _tileUrlList: Array<string>;

        /** 当前加载的缓存 */
        private _tempNowLoad: LoadData;
        private _posFlush: Array<any>;
        private _modBuffer: boolean;

        /**
         *Creates an instance of Map.
         * @param {World} world 世界
         */
        public constructor(world?: any) {
            this.mapLayer = world.mapLayer;
            this._texturePool = {};
            this.world = world;
        }



        public load(mapID: number, _callBack: Handler) {
            const  json = ResUtils.getMapJson(mapID);
            Laya.loader.load(json);
        }

        /**
         * 初始化地图
         * @param mapResID  场景资源ID
         * @param w  地图宽高
         * @param h 
         */
        public initMap(mapResID, w, h) {

            if (this._mapResID && mapResID == this._mapResID) { return; }

            this.reset();

            this._mapResID = mapResID;
            this.width = w;
            this.height = h;
            this._rowsCount = Math.floor(w / this.Tiled_Width);
            this._colsCount = Math.floor(h / this.Tiled_Height);

            this._mapResID = mapResID;
            this._colsArea = Math.floor(Laya.stage.height / this.Tiled_Height) + 2;
            this._rowsArea = Math.floor(Laya.stage.width / this.Tiled_Width) + 2;

            this._maxTiled = this._colsArea * this._rowsArea;
            this._smallUrl = ResUtils.getMapSmallUrl(mapResID);

            // 开始加载小地图
            Laya.loader.load(this._smallUrl, Handler.create(this, this.onSmallComplete, [this._mapResID]));
        }




        /**
         * 渲染方法，在镜头更新的时候执行
         * 
         * @param {boolean} [flush] 是否需要刷新
         */
        public render(flush?: boolean) {

            if (this.world && this._smallTexture) {
                // 起始行列
                let cols: number = Math.floor(this.world.camera.originY / this.Tiled_Height);
                let rows: number = Math.floor(this.world.camera.originX / this.Tiled_Width);
                this.makeData(cols, rows, flush);

                if (this._startCols == cols && this._startRows == rows && this._posFlush != null) {
                    this.mapLayer.x = -this.world.camera.originX % this.Tiled_Width;
                    this.mapLayer.y = -this.world.camera.originY % this.Tiled_Height;
                }
            }
        }

        public resize() {

        }


        public reset() {

            this._loadErrorNum = null;
            this._texturePool = {};
            this._startCols = -1;
            this._rowsArea = null;
            this._startRows = -1;
            this._colsArea = null;
            this._callBack = null;
            this._tempNowLoad = null;
            this._maxTiled = null;
            this._mapResID = null;
            if (this._smallUrl) {
                // Laya.loader.clearRes(this._smallUrl, true);
                // AssetsManager.instance.CancelFetchByResUrl(this._smallUrl);//清除掉未加载的资源
                this._smallUrl = null;
            }
            this._smallTexture = null;

            this._loadingXY = {};
            this._posFlush = [];

            if (this._tileUrlList) {
                while (this._tileUrlList.length > 0) {
                    // 	Laya.loader.clearRes(this._tileUrlList.pop(), true);
                    // AssetsManager.instance.CancelFetchByResUrl(this._tileUrlList.pop());//清除掉未加载的资源
                }

                this._tileUrlList = null;
            }

            // AssetsManager.instance.CutOffEntityAndResourceAssociation(this);
            this.mapLayer.graphics.clear();
            Laya.Pool.clearBySign("LoadData");

        }

        /**
         * 小地图加载完成回调
         * @param texture 小图资源
         */
        private onSmallComplete(...args): void {
            let texture: Laya.Texture, mapResID: number;
            if (args && args.length > 0) {
                mapResID = args[0];
                texture = args[1];
            }
            if (mapResID != this._mapResID) {
                // mapResID &&　console.warn(" >> 小地图加载错误 mapResID != _mapResID   >>> mapResID:" + mapResID + "   _mapResID:"+this._mapResID);
                return;	//小地图不对的不管
            }

            // 加载失败 重新加载
            if (texture == null) {
                this._loadErrorNum++;
                console.log(`load small error id = ${this._mapResID}`);
                if (this._loadErrorNum < Map.Max_Error_Load) {
                    // AssetsManager.instance.FetchTextureResAsync(this, this._smallUrl, Handler.create(this, this.onSmallComplete, [this._mapResID]));
                } else {
                    throw Error(`load small error id = ${this._mapResID}`);
                }

            } else { // 小图加载完成开始渲染
                this._loadErrorNum = 0;
                this._smallTexture = texture;
                this._smallTileW = Math.ceil(texture.width / this._rowsCount);
                this._smallTileH = Math.ceil(texture.height / this._colsCount);
                this.world.onMapReady();
                this.render();
            }
        }


        /**
         * 构建当前瓦块数据
         *
         * @private
         * @param {number} cols 起始行
         * @param {number} rows 起始列索引
         * @param {boolean} [flush=false]
         * @returns {void}
         */
        private makeData(cols: number, rows: number, flush: boolean = false): void {
            if (this._modBuffer) {
                this._modBuffer = false;
            }
            if (this._startCols == cols && this._startRows == rows) {
                return;
            }

            this._startCols = cols;
            this._startRows = rows;
            // this._posFlush = [];

            let max_y: number = Math.min(rows + this._rowsArea, this._rowsCount);
            let max_x: number = Math.min(cols + this._colsArea, this._colsCount);
            let name: string;
            let data: LoadData;
            for (let x: number = cols; x < max_x; x++) {
                for (let y: number = rows; y < max_y; y++) {
                    if (x >= 0 && y >= 0) {
                        name = x + '_' + y;
                        if (this._texturePool[name]) {
                            this.fillTile((x - this._startCols), (y - this._startRows), this._texturePool[name]);
                        } else {
                            if (!this._loadingXY[`${x}_${y}`]) {
                                this._loadingXY[`${x}_${y}`] = true;
                                data = LoadData.create(x, y, this._startCols, this._startRows, this._mapResID);
                                this._posFlush.push(data);
                            }
                            // data = LoadData.create(x, y, this._startCols, this._startRows, this._mapResID);
                            // this._posFlush.push(data);
                            this.fillSmallMap(x, y, (x - this._startCols), (y - this._startRows));
                        }
                    }
                }
            }
            this.loadTiles();
        }
        private _loadingXY: object = {};


        /**
         * 
         * @param texture  加载资源回调
         */
        private loadTiles(...args): void {
            let texture: Laya.Texture, mapResID: number;
            if (args && args.length > 0) {
                mapResID = args[0];
                texture = args[1];
            }

            if (mapResID == this._mapResID && texture != null) {
                let temp = this._tempNowLoad;
                if (!temp || temp.id != this._mapResID) {
                    return;
                }
                let key: string = `${temp.x}_${temp.y}`;
                if (this._texturePool[key] == null) {
                    this._texturePool[key] = texture;
                    // this._loadingXY[`${temp.x}_${temp.y}`] = false;
                }

                let tx: number = temp.x - this._startCols;
                let ty: number = temp.y - this._startRows;
                if (temp.cols === this._startCols && temp.rows === this._startRows) {
                    this.fillTile(tx, ty, texture);
                }

                this._tempNowLoad.dispose();
                this._tempNowLoad = null;
            }
            // else {
            // 	mapResID &&　console.warn(" >> mapResID != _mapResID   >>> mapResID:" + mapResID + "   _mapResID:"+this._mapResID);
            // }

            if (this._posFlush.length == 0) {
                this._modBuffer = true;
                return;
            } else if (!this._tempNowLoad) {

                this._tempNowLoad = this._posFlush.pop();
                let temp = this._tempNowLoad;
                let url: string = ResUtils.getMapTileUrl(this._mapResID, temp.x, temp.y);
                this._tileUrlList = this._tileUrlList || [];
                this._tileUrlList.push(url);
                // AssetsManager.instance.FetchTextureResAsync(this, url, Handler.create(this, this.loadTiles, [this._mapResID]));
            }
        }

        private getSmallTexture(colsIndex, rowIndex): Laya.Texture {
            let t: Laya.Texture = Laya.Texture.create(this._smallTexture, rowIndex * this._smallTileW,
                colsIndex * this._smallTileH, this._smallTileW, this._smallTileH);

            t.width = this.Tiled_Width;
            t.height = this.Tiled_Height;
            return t;
        }


        /**
         * 
         * @param startx  切图索引
         * @param starty  
         * @param tx  位置索引 
         * @param ty 
         */
        private fillSmallMap(startx: number, starty: number, tx: number, ty: number): void {

            let texture: Laya.Texture = this.getSmallTexture(startx, starty);
            this.fillTile(tx, ty, texture);
        }


        private fillTile(tx: number, ty: number, texture: Laya.Texture): void {

            const name = (tx + "_" + ty);
            let bitmap: Laya.Sprite = <Laya.Sprite><any>this.mapLayer.getChildByName(name);
            if (bitmap == null) {
                bitmap = new Laya.Sprite;
                bitmap.x = ty * this.Tiled_Width;
                bitmap.y = tx * this.Tiled_Height;
                bitmap.name = name;
                this.mapLayer.addChild(bitmap);
            }
            // if(	bitmap.texture){
            // 	Laya.loader.clearRes();
            // }
            bitmap.texture = texture;


            // let arr = this.mapLayer.graphics.cmds;
            // let x = ty * this.Tiled_Width;
            // let y = tx * this.Tiled_Height;
            // if (arr && arr.length > this._maxTiled) {
            // 	for (let i = arr.length - 1; i >= 0; i--) {
            // 		if (arr[i][1] == x && arr[i][2] == y) {
            // 			arr.splice(i, 1);
            // 		}
            // 	}
            // }
            // this.mapLayer.graphics.drawTexture(texture, x, y);
            // let arr = this.mapLayer.graphics.cmds, x = ty * this.Tiled_Width, y = tx * this.Tiled_Height;
            // let hasCmds: boolean, cmd:Array<any>;
            // if (arr){
            // 	for (let i = arr.length - 1; i >= 0; i--) {
            // 		cmd = arr[i];
            // 		if (cmd[1] == x && cmd[2] == y) {
            // 			cmd[0] = texture;
            // 			hasCmds = true;
            // 			break;
            // 		}
            // 	}
            // }
            // //没有命令流就加一个
            // if (!hasCmds) {
            // 	cmd = [
            // 		texture
            // 		, x
            // 		, y
            // 		, texture.width
            // 		, texture.height
            // 		, null
            // 		, 1
            // 	];
            // 	this.mapLayer.graphics._saveToCmd(Laya.Render._context._drawTexture, cmd);
            // }
        }


        public destroy() {
            this.reset();
        }
    }

    /**
     * 加载的资源数据
     */
    class LoadData {
        //  瓦块在地图起始坐标
        x: number;
        y: number;
        id: number; // 地图资源ID
        /** 行号 */
        cols: number;
        /** 列号 */
        rows: number;

        public dispose() {
            Laya.Pool.recover("LoadData", this);
            this.x = null;
            this.y = null;
            this.cols = null;
            this.rows = null;
            this.id = null;
        }

        public static create(x, y, cols, rows, id): LoadData {
            const cls: LoadData = Laya.Pool.getItemByClass("LoadData", LoadData);
            cls.x = x;
            cls.y = y;
            cls.cols = cols;
            cls.rows = rows;
            cls.id = id;

            return cls;
        }

    }
}
