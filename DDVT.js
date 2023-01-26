/**
 * [ ] (t; x; y) in the Earth
 *      [V] t by computer; x, y by GPS
 *      [ ] t, x, y by a same engine
 * [ ] (t; x; y; z) in the Earth
 * [ ] (t; x; y; z) in the universe
 */

/**
 * DDVT string generater
 * @param {Number} timestamp Time in milliseconds
 * @param {Number} latitude Latitude in decimal degrees
 * @param {Number} longitude Longitude in decimal degrees
 * @returns DDVT string generated
 */

function DDVT(timestamp, latitude, longitude) {
    const VERSION = 1;

    let DDVT_array =
        []
            .concat(VERSION.toString())
            .concat(timestamp.toString())
            .concat(latitude.toString().split("."))
            .concat(longitude.toString().split("."))
            .map(item => parseFloat(item).toString(32));

    let DDVT_string = DDVT_array.join(".").toUpperCase();

    return DDVT_string;
}