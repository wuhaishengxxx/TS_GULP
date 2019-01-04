namespace scene {

    export class SceneManager {


        private static _instance: SceneManager;
        public static get instance() {
            return this._instance || (this._instance = new SceneManager());
        }

        map: Map;
        mapLoadedHander: Laya.Handler;

        private constructor() { }


        public enterScene(mapID: number) {
            if (this.map == null) {
                this.map = new Map();
            }
            if (this.mapLoadedHander == null) {
                this.mapLoadedHander = Laya.Handler.create(this, this.onMapLoad)
            }
            this.map.load(mapID, this.mapLoadedHander);
        }

        onMapLoad(...args) {

        }



    }
}