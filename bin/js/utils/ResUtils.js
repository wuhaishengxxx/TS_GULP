var ResUtils = /** @class */ (function () {
    function ResUtils() {
    }
    ResUtils.getMapSmallUrl = function (mapResID) {
        return "" + ResUtils.MAP_ROOT + mapResID + "/s.jpg";
    };
    ResUtils.getMapTileUrl = function (mapResID, x, y) {
        return "" + ResUtils.MAP_ROOT + mapResID + "/" + x + "_" + y;
    };
    ResUtils.getMapJson = function (mapResID) {
        return "" + ResUtils.MAP_ROOT + mapResID + "/map.json";
    };
    ResUtils.MAP_ROOT = "res/map/";
    return ResUtils;
}());
