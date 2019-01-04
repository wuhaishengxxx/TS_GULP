
import Label = Laya.Label;
import Handler = Laya.Handler;
import Loader = Laya.Loader;
import WebGL = Laya.WebGL;

class GameMian {

	constructor(w: number = 640, h: number = 1136) { 
		Laya.init(w, h, WebGL);
		//激活资源版本控制
		Laya.ResourceVersion.enable("version.json", Handler.create(this, this.beginLoad), Laya.ResourceVersion.FILENAME_VERSION);
		GameLayerManager.instance.init();
	}

	beginLoad() {

		Laya.loader.load("res/atlas/comp.atlas", Handler.create(this, this.onLoaded));
	}

	onLoaded(): void {
		//实例UI界面
		const main  = new view.main.Main();
		Laya.stage.addChild(main);
	}
}