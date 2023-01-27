/**
 * @file DDVT string generator and some utils
 * @version 1.1.0
 */

/**
 * DDVT string generator
 * @version 1.1
 * @param {Number} timestamp Time in milliseconds
 * @param {Number} latitude Latitude in decimal degrees
 * @param {Number} longitude Longitude in decimal degrees
 * @returns {String} DDVT string
 * @todo (t; x; y; z) in the Earth
 * @todo (t; x; y; z) in the universe
 */
function DDVT(timestamp, latitude, longitude) {
    const split_by_dot = number => {
        if (parseInt(number) == number)
            return [number, 0];
        else
            return number.toString().split(".");
    };

    const DDVT_VERSION = 1;

    let DDVT_array =
        []
            .concat(DDVT_VERSION.toString())
            .concat(timestamp.toString())
            .concat(split_by_dot(latitude))
            .concat(split_by_dot(longitude))
            .map(item => parseInt(item).toString(32));

    let DDVT_string = DDVT_array.join(".").toUpperCase();

    return DDVT_string;
}

let DDVT_Utils = {};

/**
 * @class
 * @classdesc Customized Error object
 * @since 1.1.0
 */
DDVT_Utils.error =
    class extends Error {
        /**
         * Construct an error
         * @param {String} util_name Util name
         * @param {String} code Error code
         * @param {String} message Error message
         */
        constructor(util_name, code, message) {
            super(message);
            this.name = `DDVT_Utils_Error__${util_name}`;
            this.code = code;
        }
    };

/**
 * @class
 * @classdesc Customized Geolocation API
 * @since 1.1.0
 */
DDVT_Utils.geolocation =
    class {
        /**
         * Construct a geolocation
         * @param {Function} callback Callback for position info
         * @param {Boolean} [watch=false] Use watchPosition in Geolocation API
         * @param {Boolean} [high_accuracy=undefined] Specify enableHighAccuracy in Geolocation API options
         * @param {Number} [maxiumm_age=undefined] Specify maximumAge in Geolocation API options
         * @param {Number} [timeout=undefined] Specify timeout in Geolocation API options
         */
        constructor(
            callback,
            watch = false,
            high_accuracy = undefined,
            maxiumm_age = undefined,
            timeout = undefined
        ) {
            if (navigator.geolocation) {
                let api_function_name =
                    watch ? "watchPosition" : "getCurrentPosition";
                this.watch_id =
                    navigator.geolocation[api_function_name](
                        position => this.#process_position(position, callback),
                        this.#position_error,
                        {
                            enableHighAccuracy: high_accuracy,
                            maximumAge: maxiumm_age,
                            timeout: timeout
                        }
                    );
            } else {
                throw new DDVT_Utils.error(
                    "geolocation",
                    "NOT_SUPPORTED",
                    "Geolocation API is not supported by this browser"
                );
            }
        }

        #position_error(error) {
            let error_code;
            let error_message;

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    error_code = "PERMISSION_DENIED";
                    error_message = "User denied the request for Geolocation API";
                    break;
                case error.POSITION_UNAVAILABLE:
                    error_code = "POSITION_UNAVAILABLE";
                    error_message = "Location information is unavailable";
                    break;
                case error.TIMEOUT:
                    error_code = "TIMEOUT";
                    error_message = "The request to get user location timed out";
                    break;
                default:
                    error_code = "UNKNOWN_ERROR";
                    error_message = "An unknown error occurred";
                    break;
            }

            throw new DDVT_Utils.error("geolocation", error_code, error_message);
        }

        #process_position(position, callback) {
            let position_info = {
                latitude: position.coords.latitude, // decimal degrees
                longitude: position.coords.longitude, // decimal degrees
                altitude: position.coords.altitude, // meters (relative to sea level)
                accuracy: position.coords.accuracy, // meters
                altitude_accuracy: position.coords.altitudeAccuracy, // meters
                heading: position.coords.heading, // degrees (from true north)
                speed: position.coords.speed, // meters per second
                timestamp: position.timestamp
            };

            callback(position_info);
        }

        /**
         * Clear watchPosition in Geolocation API (if used)
         */
        clear_watch() {
            navigator.geolocation.clearWatch(this.watch_id);
        }
    };