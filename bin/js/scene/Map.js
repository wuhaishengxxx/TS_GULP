var scene;
(function (scene) {
    /**
     * 地图类
     * 负责管理地图加载
     * @export
     * @class Map
     */
    var Map = /** @class */ (function () {
        /**
         *Creates an instance of Map.
         * @param {World} world 世界
         */
        function Map(world) {
            this._loadingXY = {};
            this.mapLayer = world.mapLayer;
            this._texturePool = {};
            this.world = world;
        }
        Map.prototype.load = function (mapID, _callBack) {
            var json = ResUtils.getMapJson(mapID);
            Laya.loader.load(json);
        };
        /**
         * 初始化地图
         * @param mapResID  场景资源ID
         * @param w  地图宽高
         * @param h
         */
        Map.prototype.initMap = function (mapResID, w, h) {
            if (this._mapResID && mapResID == this._mapResID) {
                return;
            }
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
        };
        /**
         * 渲染方法，在镜头更新的时候执行
         *
         * @param {boolean} [flush] 是否需要刷新
         */
        Map.prototype.render = function (flush) {
            if (this.world && this._smallTexture) {
                // 起始行列
                var cols = Math.floor(this.world.camera.originY / this.Tiled_Height);
                var rows = Math.floor(this.world.camera.originX / this.Tiled_Width);
                this.makeData(cols, rows, flush);
                if (this._startCols == cols && this._startRows == rows && this._posFlush != null) {
                    this.mapLayer.x = -this.world.camera.originX % this.Tiled_Width;
                    this.mapLayer.y = -this.world.camera.originY % this.Tiled_Height;
                }
            }
        };
        Map.prototype.resize = function () {
        };
        Map.prototype.reset = function () {
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
        };
        /**
         * 小地图加载完成回调
         * @param texture 小图资源
         */
        Map.prototype.onSmallComplete = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var texture, mapResID;
            if (args && args.length > 0) {
                mapResID = args[0];
                texture = args[1];
            }
            if (mapResID != this._mapResID) {
                // mapResID &&　console.warn(" >> 小地图加载错误 mapResID != _mapResID   >>> mapResID:" + mapResID + "   _mapResID:"+this._mapResID);
                return; //小地图不对的不管
            }
            // 加载失败 重新加载
            if (texture == null) {
                this._loadErrorNum++;
                console.log("load small error id = " + this._mapResID);
                if (this._loadErrorNum < Map.Max_Error_Load) {
                    // AssetsManager.instance.FetchTextureResAsync(this, this._smallUrl, Handler.create(this, this.onSmallComplete, [this._mapResID]));
                }
                else {
                    throw Error("load small error id = " + this._mapResID);
                }
            }
            else { // 小图加载完成开始渲染
                this._loadErrorNum = 0;
                this._smallTexture = texture;
                this._smallTileW = Math.ceil(texture.width / this._rowsCount);
                this._smallTileH = Math.ceil(texture.height / this._colsCount);
                this.world.onMapReady();
                this.render();
            }
        };
        /**
         * 构建当前瓦块数据
         *
         * @private
         * @param {number} cols 起始行
         * @param {number} rows 起始列索引
         * @param {boolean} [flush=false]
         * @returns {void}
         */
        Map.prototype.makeData = function (cols, rows, flush) {
            if (flush === void 0) { flush = false; }
            if (this._modBuffer) {
                this._modBuffer = false;
            }
            if (this._startCols == cols && this._startRows == rows) {
                return;
            }
            this._startCols = cols;
            this._startRows = rows;
            // this._posFlush = [];
            var max_y = Math.min(rows + this._rowsArea, this._rowsCount);
            var max_x = Math.min(cols + this._colsArea, this._colsCount);
            var name;
            var data;
            for (var x = cols; x < max_x; x++) {
                for (var y = rows; y < max_y; y++) {
                    if (x >= 0 && y >= 0) {
                        name = x + '_' + y;
                        if (this._texturePool[name]) {
                            this.fillTile((x - this._startCols), (y - this._startRows), this._texturePool[name]);
                        }
                        else {
                            if (!this._loadingXY[x + "_" + y]) {
                                this._loadingXY[x + "_" + y] = true;
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
        };
        /**
         *
         * @param texture  加载资源回调
         */
        Map.prototype.loadTiles = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var texture, mapResID;
            if (args && args.length > 0) {
                mapResID = args[0];
                texture = args[1];
            }
            if (mapResID == this._mapResID && texture != null) {
                var temp = this._tempNowLoad;
                if (!temp || temp.id != this._mapResID) {
                    return;
                }
                var key = temp.x + "_" + temp.y;
                if (this._texturePool[key] == null) {
                    this._texturePool[key] = texture;
                    // this._loadingXY[`${temp.x}_${temp.y}`] = false;
                }
                var tx = temp.x - this._startCols;
                var ty = temp.y - this._startRows;
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
            }
            else if (!this._tempNowLoad) {
                this._tempNowLoad = this._posFlush.pop();
                var temp = this._tempNowLoad;
                var url = ResUtils.getMapTileUrl(this._mapResID, temp.x, temp.y);
                this._tileUrlList = this._tileUrlList || [];
                this._tileUrlList.push(url);
                // AssetsManager.instance.FetchTextureResAsync(this, url, Handler.create(this, this.loadTiles, [this._mapResID]));
            }
        };
        Map.prototype.getSmallTexture = function (colsIndex, rowIndex) {
            var t = Laya.Texture.create(this._smallTexture, rowIndex * this._smallTileW, colsIndex * this._smallTileH, this._smallTileW, this._smallTileH);
            t.width = this.Tiled_Width;
            t.height = this.Tiled_Height;
            return t;
        };
        /**
         *
         * @param startx  切图索引
         * @param starty
         * @param tx  位置索引
         * @param ty
         */
        Map.prototype.fillSmallMap = function (startx, starty, tx, ty) {
            var texture = this.getSmallTexture(startx, starty);
            this.fillTile(tx, ty, texture);
        };
        Map.prototype.fillTile = function (tx, ty, texture) {
            var name = (tx + "_" + ty);
            var bitmap = this.mapLayer.getChildByName(name);
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
        };
        Map.prototype.destroy = function () {
            this.reset();
        };
        // 出错加载次数
        Map.Max_Error_Load = 3;
        return Map;
    }());
    scene.Map = Map;
    /**
     * 加载的资源数据
     */
    var LoadData = /** @class */ (function () {
        function LoadData() {
        }
        LoadData.prototype.dispose = function () {
            Laya.Pool.recover("LoadData", this);
            this.x = null;
            this.y = null;
            this.cols = null;
            this.rows = null;
            this.id = null;
        };
        LoadData.create = function (x, y, cols, rows, id) {
            var cls = Laya.Pool.getItemByClass("LoadData", LoadData);
            cls.x = x;
            cls.y = y;
            cls.cols = cols;
            cls.rows = rows;
            cls.id = id;
            return cls;
        };
        return LoadData;
    }());
})(scene || (scene = {}));
