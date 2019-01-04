
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui.main {
    export class MainUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":640,"height":1136},"child":[{"type":"Animation","props":{"y":618,"x":344,"width":512,"source":"res/skilleffect/100054/00000.png,res/skilleffect/100054/00001.png,res/skilleffect/100054/00002.png,res/skilleffect/100054/00003.png,res/skilleffect/100054/00004.png,res/skilleffect/100054/00005.png,res/skilleffect/100054/00006.png,res/skilleffect/100054/00007.png,res/skilleffect/100054/00008.png,res/skilleffect/100054/00009.png,res/skilleffect/100054/00010.png,res/skilleffect/100054/00011.png","pivotY":256,"pivotX":256,"index":0,"height":512,"autoPlay":true}},{"type":"Image","props":{"y":314,"x":105,"skin":"comp/bg.png"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.MainUI.uiView);

        }

    }
}
