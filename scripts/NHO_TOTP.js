const ENCRYPTED = "U2FsdGVkX19c2U9c90uXDb5Fi6/fFqtsozm5Ff6XLUo/d+RzpWOotGzFCd6BHibe1ryurOz3444EmTzdYGnGpxrDMK0obd7D59XglW51CWfKh4nZ0G1F7XvX/dZ2nDIs6xUzZNNeBuxa+PXEeGxNighbwZ+colh9TZbsjhfzFpiVUTxhxzGQudwgApnJSGWXQLGZO7WHAVBLniFYSIPk4nTEItnWVQFTQQ9I4LV0K9fHhrp3kV2Fj33FeJXLqHEqvY8L1PaHzjET7OsKVbhZsBwVp3fGsVREg+hGNLuOoRytrtyYtcgVSCQjVY3TxCgoZkSY4kSUB+x0LabDsXENtKODfzJLUCE2KVLiM0o3KXc1++KgO75HPD4qwN7NsjbyqTDCpux/WxdzA2QEmnfOGZT2bhq3TTjrOphQvTSCmyd/Krq4C1yC0nlMOG6IREUqJMl8ZDPpi6lYJsPuRXpMhpOSdL1veZOagdUr5wtx02O/lRb6QJZgOREIQNkJVYj7ldF6ob9z7ACjfCkpvzpn+ZVZA8hgkKHtEAQo8CTTeG24On1seuokU1ClD8mE8zE5D2dKFnmzGGVe5YRW6rqeQWZRRz+tcuSholdGsNE9MNYFjCR/So4Cr5HaJSPyaJtAtQDByqtMLCxtMuUHVUWuS+FBPf29m6anukowgR4ufPjCR+2tO1U7uw7XDJvJVJB8Lz8GhCYNAW9FcWQjqWmwmbvEG6N8yUqNRJ5ddyrwPWypNE0MZIC/yDempJye8IfHqEenRQuca6/19RwusGsXurAtmO3mufz2fLR0vmStWlQHOOTpATMEhBirQXRMvp8VsBPD+qBouHAiQuDarJ69ZfSZe3vCPP/kdDV4sWzDATSzQntunXJzqOlqWUOhkfQO9x4T6n7uIgP1GDg1n9dStpUwcSi4RCyNDu6xVDe7MSNtgOLYwy6zCFnnVxYkNz6mf8SDRvmrNAKF4SYon5AC3UTaAyykzaM4RVX/rQASZYEf4usBn67tUJcgk+Niyi8GjOfPogckTbrA/6LYs1abn62AvAdKM0BHdGyMahJE7eOGKTcrRiV8iuY4ujfEhxHUnTZfEZDkJv81at+b8LR2wXOcYPIh+N/0me3NSa/zxIgwS0wppXZCnFZj4MzWEbvB84BA1OCcpkBG9hI8uoQ4AT6QC8MtzAGTSzXlBtmPa6576hH65e+HsSGlfNhFGHVkiAsQ1zfSu5HTEAfRNIGlQl+Wpyid9dIZvHIPLt5UIyA9Kv3Stk037fe0VWMCkx10L+ZqnG6c0tCsmyt581B/8qA1ApM0u2BZj4itdk3JA/guHbfalujkhDbSE+WxZTVuefv2j3x4A9qqXLyx6AU8kawcrP4VSFswRK/659s1G8aZG2yxgany0KYbl6wvkEQnWKuZW6twmIkHy4badCwJfNvpSDKSmUhFyua1WsEZQcspEC0faRMOnEjjGXeqKWrvaFLdvWVyzT48nLcqLh54YmsaScgSOQjFOwIg4wbPyfmZqMliJM82t8xk1ioq9G1Y6FgrZJ+6GO32nJvMUOYKwNoS3fC1TMoItV5va717FvfhNczKsLXOT10qhXNI+G0IM71DYcxEsvpORHXvh/1MqB0vM15S6XyN1FJY9P/3FsJhEgCjuOd8d4sK5syAC58Dgd2ReCxWmbMOgxg2kziSt+oyd1yi1JMXIL7pE5HLu7f+2Nm2eZb1cCHcM79Bl2/M9uzroZSUaSLs99+udVQe4nnC7wZVAkp1nj8ouCP3ZG5l3hEZlWVFg1dm5inTXncFM5a7o0yyNEs9sDaeRDofxeuibGlxH5SUAqnWFpKGMIiePFZRJBTEDzsRjYS2sokmDoEgl4zHK2iG/AQQnDeox2N0ZBCd+w8wJhbLIZ27NE1LLV6l8RNQM3mgaW877o3bFoEdqdlyNkCRfe35LAxIRQiB+n7LY9RC66x0kApK3gE=";

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
