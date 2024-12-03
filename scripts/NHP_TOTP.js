const ENCRYPTED = "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";

function NHP_TOTP(secrets) {
    function dec_to_hex(string) {
        let zero_leftpad = (string < 15.5) ? ("0") : ("");
        let hex = Math.round(string).toString(16);
        return zero_leftpad + hex;
    }

    function hex_to_dec(string) {
        return parseInt(string, 16);
    }

    function leftpad(string, length, padding) {
        if (length + 1 >= string.length) {
            string = Array(length + 1 - string.length).join(padding) + string;
        }
        return string;
    }

    function base32_to_hex(base32) {
        let base32_charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        let hex = "";

        for (let i = 0; i < base32.length; i++) {
            let val = base32_charset.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, "0");
        }

        for (let i = 0; i + 4 <= bits.length; i += 4) {
            let chunk = bits.substring(i, i + 4);
            hex += parseInt(chunk, 2).toString(16);
        }

        return hex;
    }

    function generate_otp(secret_string) {
        let key = base32_to_hex(secret_string.replace(/ /g, "").toUpperCase());
        let epoch = Math.floor(new Date().getTime() / 1000);
        let time = leftpad(dec_to_hex(Math.floor(epoch / 30)), 16, "0");

        let sha = new jsSHA("SHA-1", "HEX");
        sha.setHMACKey(key, "HEX");
        sha.update(time);

        let hmac = sha.getHMAC("HEX");
        let offset = hex_to_dec(hmac.substr(hmac.length - 1));
        let otp = (hex_to_dec(hmac.substr(offset * 2, 8)) & hex_to_dec("7fffffff")) + "";
        otp = (otp).substring(otp.length - 6, otp.length);

        return otp;
    }

    function generate_all_otp(secrets) {
        let otps = {};
        /* otps_example = {
            "SERVICE_PROVIDER (ACCOUNT_NAME)": "ABCD EFGH IKLM NOPQ RSTU VWXY"
        } */

        Object.entries(secrets).forEach(secret => {
            let secret_name = secret[0];
            let secret_string = secret[1];
            otps[secret_name] = generate_otp(secret_string);
        });

        return otps;
    }

    return generate_all_otp(secrets);
}

function decrypt() {
    let password = document.querySelector("#decrypt_password").value;
    let decrypted =
        CryptoJS.AES.decrypt(ENCRYPTED, password)
            .toString(CryptoJS.enc.Utf8);
    let json = JSON.parse(decrypted);

    let otps = NHP_TOTP(json.totp_secrets)
    let otp_list_element = document.querySelector("#otp_list");
    while (otp_list_element.firstChild) {
        otp_list_element.removeChild(otp_list_element.firstChild);
    }
    Object.entries(otps).forEach(otp => {
        let otp_element = document.createElement("div");
        otp_element.classList.add("lv2_box", "otp");

        let otp_name = otp[0];
        let otp_name_element = document.createElement("div");
        otp_name_element.classList.add("otp_name");
        otp_name_element.innerHTML = otp_name;
        otp_element.appendChild(otp_name_element);

        let otp_code = otp[1];
        let otp_code_element = document.createElement("button");
        otp_code_element.classList.add("otp_code");
        otp_code_element.innerHTML = otp_code;
        otp_code_element.onclick = () => {
            navigator.clipboard.writeText(otp_code).then(() => {
                otp_code_element.innerHTML = "Đã sao chép!";
                setTimeout(() => {
                    otp_code_element.innerHTML = otp_code;
                }, 1000);
            }, function (err) {
                otp_code_element.innerHTML = "Chưa sao chép!";
                setTimeout(() => {
                    otp_code_element.innerHTML = otp_code;
                }, 1000);
            });
        }
        otp_element.appendChild(otp_code_element);

        otp_list_element.appendChild(otp_element);

    });

    document.querySelector("#decrypt_password").value = "";
}

function encrypt() {
    let string_need_encrypt = document.querySelector("#string_need_encrypt").value;
    let password = document.querySelector("#encrypt_password").value;
    let encrypted = CryptoJS.AES.encrypt(string_need_encrypt, password);

    document.querySelector("#encrypt_result").value = encrypted;
    document.querySelector("#encrypt_password").value = "";
}
