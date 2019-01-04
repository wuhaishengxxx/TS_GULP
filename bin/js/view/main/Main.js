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
/**Created by the LayaAirIDE*/
var view;
(function (view) {
    var main;
    (function (main) {
        var Main = /** @class */ (function (_super) {
            __extends(Main, _super);
            function Main() {
                return _super.call(this) || this;
            }
            return Main;
        }(ui.main.MainUI));
        main.Main = Main;
    })(main = view.main || (view.main = {}));
})(view || (view = {}));
