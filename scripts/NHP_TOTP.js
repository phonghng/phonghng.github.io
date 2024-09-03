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
