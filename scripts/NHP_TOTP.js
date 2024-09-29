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
