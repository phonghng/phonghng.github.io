const ENCRYPTED = "U2FsdGVkX1+0Lv4sGsOHYxpxZufdMfHIcOdFkt2itge5as6GxnIFy6Q8vSwNQOHXsuuVQjsMeoXP71cHunf+SVwWFTovHCBvXXJvTlFSDfswkHwPcMrMYi9Bnq7rl2J1QR5hIaPvgDP1pNW3UsUBdKOo3ukgNNslRxkGSenpZfIFu17mvU7EUmtadRZxhZ00Zb5FVDt4weZJpH0ezUwDiFA9UkPgOlAigvFDheyf26c5MrJk3G7ZK48VTpCvIq/t2CXEQdL+IozeieqmimbQQXYIKCgHt4v4DfClufzYCZytrGMVmtrUCUiWw7AAEGyRfUJWHudMtM4sbEJ7HByOoZju/716TXUpUDfPODzHIxrCGSH1p6i5bfou+35LQzGHGay48Rrql208zsFUVaZPzpbe5oapYO8G5ya+zWqJNGTpsAYy5A1v12n5uHsKK43ShcFJJINGS5/U3Ihp1ZWcdQpAAr+USbcnbV/i72ZmTErczhhiHU46jbfCbVsuhwk3r0JGrCYC4hOlAVsbePPbFTsyYQdFy89rVLtHETFgrbZvb4L8XKZIcVdjoiMuJIjpEv2jegXDumeLIO/NEuo8k4cxGMd8j7w64efneWHNz4Gik10tDhl22k4bAnVBrb6lV1StpuLY0unHFwndT/n6GQhEH5Bcj482zZGoWCqIJ+N5q8df+MOd2yY9NF0sy8jwe+UZtH4/JrT1xHW5whyDsUuDImFFECzGqleZtEyfXk3xG+IS3xDQM5Qyo1Yot2N9RmNxTZq3e1T6ws6osfiuaiLA2T1uf/PeJly2Xf3v0LDnxWGxju6Qq9eYGGg8H3a7yQnc924ie36gwNor5unrLRwIM0r2/VsXEQiu0GLkOLiuVDiws66/PJKihnDe0a6j71Yn5Bja4nkeLBvvRAT4zX8sPAKER/5sprzKAbkyTCwVrx4be8N977s2m7BO6GYq95bpOM7Ynt1qQnjx+MFriljXBS1ouVhPI+JmLGKSSpRzm0Z3e//iKHoxSo7jgkv66o07L3XbslUeKSs1CE4YkjSp9j6K63aodUctLhdxoHI8tQ1dEIhTUjFREVVdmVlPeSvZKDOQWxKZDKUouXNidaYNqtb0oYCarQ3FvE6fPWhrSDpE1YnWcl9bd75R+hRUwtwNIzui+W3rBIaxgyb9/AM6Ha5BmHQl2Z/op2FvQDE65E0MHUgo5JUJaBp2wy4R6VHNdavK6t0todhYxGBb/UV5UwXNwXOVUkjVV6pBhIu3JJZcUuhysGv2hgqhFwtQmZyTkgEQ0uEWzPT2XGcjUOY6WpFjv7OYPgFW85ch+OLXAN3OhjfuGL/nr7+lhu+Kyg4pyL8O4ik97Gjj77AXogzfoWZZ4AoC1m11Upo91YeMi+kagnTWXm2NK/O84cyjkxH0RuMFmqVxTwqtwUkNSEkUA0sOU23pTXXhB49mLeoAJIqOWRozVTqEPZrBCw0rYYvqeoSYW4q5lozfYxbVmZYfnZ5iNhR28KM+PEhQzmUpRIRZpd5sHo75Dt3P2K/sNAZfDMGn1A3zDB1OHOGGKadBW4mELJJk5e1BJbewvUCRL/C5zVdMwdQA7xPZ+h9NoyObywctGGwXWBRVFjvGhjmFl+4of47rVXXxqj8jygG6HoDuZ7c2KWYy4vYip+9R/vNWFa/8SU7RDBEQlfTjp+rV1BnI4pq0MtblVddmVkQzDA7nKSHBZLr9EyIowam+tROMauz3XC22tG+qBBSDeq6MtV1+eyXHarPiSjdU3YAMmVA76+ITsL13sgOWpN4+eSzL9jZBt/7p2SIRa8MKApuWRzhq4yHGaAU/j5Y29tAIcSGcNFuIeieLVKRRIeibcJ+0/51JV/FHACQWdC/ABQ==";

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
