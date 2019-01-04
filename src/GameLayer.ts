class GameLayerManager {

    private static _instance: GameLayerManager;
    public static get instance() {
        return this._instance || (this._instance = new GameLayerManager());
    }

    uiLayer: Laya.Sprite;
    sceneLayer: Laya.Sprite;

    private constructor() { }

    init() {
        this.uiLayer = new Laya.Sprite;
        this.sceneLayer = new Laya.Sprite;
        Laya.stage.addChild(this.sceneLayer);
        Laya.stage.addChild(this.uiLayer);
    }

}