const ENCRYPTED = "U2FsdGVkX1+INqTdGFzU/POkmzaiRttvVl/qCV/hRkghGE0gSGne5Y3gerQK6zFAemWCFEE5fPCQlBknL98zCDiSSgfl6U2Xy5tK7pnck2ciOtt38hdE/3e54DGdcMZFFK3UzqJkJ0g+QMvxVPKYkPaQzDjlA560N3jb7f8pJRkWDzjwAjXkrkbaUW3cGgCJZegiyQFlUV81QnH6vNPY+c03SoYNGmiTRPRM/2veWP77LZuiJftA4SKa5YVrj21cs8l6iXSBNntWDZcKgj/1R3MkTFMO3s6FpP/WTKXmCPo/1ISJTIVZvFWu+8ZnW+4YgNJRJ/vUyRsjtO4iQEkG9+u+V5F8tNKFZbbFAzkKsqLlZ5EDQdJOfMsZwP3b8VE9Ub2PbwFu6/SjR4bKpLMjmRWWnSEF1Nb7Qz2g+IKnfweFw73gMUfIs09dg0lCbcP/rc8ymOKyKEqpcHtY74K4JVV9I76NGKqf733ynWbNVACPsaskSjn3AICU1gQ9omMwWd230WsNQPhf1aIetITmRh1nh7ESPmFR+/svbY+fAK3QPOv62gDyFVaOK/NQvsm8nAQQ/4SPcKmV1XCUlywDE08slFejH5ug2Jh6T7iI6G3qXPgzu5abasgTXJj8ZPNKRl/FULVW6/NEWdO25odl1AEOgTh07fg9cdLyqNRT6Zx9lHAd5OO7XACV7rjdCHIRgSalHg3FYapVyHDMkJNLEi/p8HfuTsuSrqHAPn/gMrY6Tvy2cTWAr7nlnPnyH1GuSe7rj+53fXhIGmF2WwcZoIwnXiwVH67dQE0pSnUNWIu9yJnoInefVx9nxUtZf5uOpvfH4+3kLd1jClQ0y0OBW3CJeePvjyM1qzQmzyFT7+RJdQt4ZbA3LUx+nYUb2nnJROSg1QivYat3GJUc+b80bbeGS6zp9z7liAYTrNLMKTB+bYqBhw9VIpyDLbzjVXothPQEawxZ+omihKVJwEeTpWeWIioqTCg82a5CA4l9jsdqTWgJpR2evCsdsVyFb1mtok60EN+MSV2By/4AyFWRq3bC0vPMnh4/bgyx5iAUZQFihiO00xweZ2v5rcTQCSwRei341HwvHuPQfG5fIaMntCrMXAXI1aIPx8n2Iy404oSC+lCs+gy2AzjvBF4IUKZq7WG4QVr26QfyG8Kez+HXE9wT/j9GqEuOohYbQ3KsCiLSRq2cnhcxYcdmRdno+pQuXRMhPvVWDtGcyLHgkU2Q+zuX/qP5EcfcqkocKaploaUXjHjqXkQ2S49BqkBhid5hhOqVGcZW2M1a7O3BHAeXJ+ZxPizhVJJXoNZy7T9nIMMvJYjBNyIc8BKmjcZnAlMtFIi0XvhM8JeWPL4dJV6waXehXW9nslUy4QoC2drDfRTRl2BOYz5Rgc/POEINa8sQtvcivciB/sD6ai5rnuEbKPrto1tRR33AFTPxgcn2+uoNdxfJr0KM/iwVZnBu+ijAzAlXANHgmW0nE/jgNWJ4oCbIvbd32eIVnGp1sQ7zWHIdgVwbDzRWTxI1Iitg346h+6PesGCKmscuHu/bkzYywVv2E1gL+UlmSik1oK4XFfvsb74pBZMk2at9mJtXeJryGDt7inn2D2V509yxdelI1R0CYYl4LeUXPNcyc8X85My7emZ3fplQ1uGey+H9tfbWa158JA+6gQAUBOasObm9oJugEVnMX0Xk+zsjao3aYfmnFPfX3IqWkIT//44z3UuHKLSiinV3bl/YBbDqAutC1ZZMNQwk/WL+ptks/xZiLHost2YaPSSnq+74oNAaphEs";

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
