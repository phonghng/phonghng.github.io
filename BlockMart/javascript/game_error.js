const ERROR_CODES = {};

class Game_Error {
    constructor(callback) {
        this.callback = callback;
    }

    throw(code) {
        code = code.toUpperCase();
        this.callback(code, ERROR_CODES[code]);
        return new ErrorEvent("BlockMart Error", {
            error : new Error(code),
            message : ERROR_CODES[code]
        });
    }
}