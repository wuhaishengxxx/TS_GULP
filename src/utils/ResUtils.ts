class ResUtils {



    private static readonly MAP_ROOT: string = "res/map/";

    public static getMapSmallUrl(mapResID: number): string {
        return `${ResUtils.MAP_ROOT}${mapResID}/s.jpg`;
    }

    public static getMapTileUrl(mapResID: number, x: number, y: number): string {
        return `${ResUtils.MAP_ROOT}${mapResID}/${x}_${y}`
    }

    public static getMapJson(mapResID: number): string {
        return `${ResUtils.MAP_ROOT}${mapResID}/map.json`;
    }
}