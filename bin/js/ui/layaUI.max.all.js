var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var main;
    (function (main) {
        var MainUI = /** @class */ (function (_super) {
            __extends(MainUI, _super);
            function MainUI() {
                return _super.call(this) || this;
            }
            MainUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.main.MainUI.uiView);
            };
            MainUI.uiView = { "type": "View", "props": { "width": 640, "height": 1136 }, "child": [{ "type": "Animation", "props": { "y": 618, "x": 344, "width": 512, "source": "res/skilleffect/100054/00000.png,res/skilleffect/100054/00001.png,res/skilleffect/100054/00002.png,res/skilleffect/100054/00003.png,res/skilleffect/100054/00004.png,res/skilleffect/100054/00005.png,res/skilleffect/100054/00006.png,res/skilleffect/100054/00007.png,res/skilleffect/100054/00008.png,res/skilleffect/100054/00009.png,res/skilleffect/100054/00010.png,res/skilleffect/100054/00011.png", "pivotY": 256, "pivotX": 256, "index": 0, "height": 512, "autoPlay": true } }, { "type": "Image", "props": { "y": 314, "x": 105, "skin": "comp/bg.png" } }] };
            return MainUI;
        }(View));
        main.MainUI = MainUI;
    })(main = ui.main || (ui.main = {}));
})(ui || (ui = {}));
