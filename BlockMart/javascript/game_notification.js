class Game_Notification {
    GAME_NOTIFICATION_CODES = {
        "Game_Logic__NO_FIRM_FOUND": "Không tìm thấy hãng",
        "Game_Logic__NO_UNION_FOUND": "Không tìm thấy liên minh"
    };

    constructor(callback) {
        this.callback = callback;
    }

    throw(code) {
        code = code.toUpperCase();
        this.callback(code, GAME_NOTIFICATION_CODES[code]);
        return new ErrorEvent("BlockMart Error", {
            error: new Error(code),
            message: GAME_NOTIFICATION_CODES[code]
        });
    }
}