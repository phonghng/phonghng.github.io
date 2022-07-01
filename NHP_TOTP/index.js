const ENCRYPTED = "U2FsdGVkX188WalysVL3qMDsFJIshCj5ZWIhDiLPvRXvbUY+L/6fVHr4Z521hNw7WpwQE54E0/5bXwzXPyUD2nX+yl3ccu8KGPAsLDdt6Fp0oqq7lAu9QHAo73PFWqupUEtp2jeVntb2K7puIzu/iXxuCyMH/03i2rEWyCtpzLlgbm+xNISnJAefxKkqoK9bd5XV525ihOGwVjRct4GLwjvF++Bs0gFQvCFEVIHRqj6YhqA40uqxbv4EScM3Z0eUjBV0tSyuXh+4Ma3r9TKrk4nY/JR/xxhxxWXXbs27DLYl62qP3rZJdy4MxAnDid9OsxFRkGrF1wEU8Qo4JtpcAx9oXaKYlnYyvvFNf00CZ3rcsbgWX0s9R0J1y3u5+IieG7vCzdJ0LmJPxaWRAwBLaVjEgQovyoyQ++yrzRaAAm/NhG0Ku+4WaW6JPBixPuVr7NDpQeOQc49Gy/CC36Zrjwx/7iwEeW2NlFFzGe06kmgCc56CRn7BuM/YCZkZl6/KKGma+cf7C4iOaK6IrAC2On2TYBMd+h3sY4CqtpJm4WQqPhjlQbsVNEMvZdlXpqB2z5GJ8srIFvteC58agFI2C+9d/iXSOWTFAJF3G3NIVzu3JLubflv7OsddRaIoIlphs7ZMBYyrIneaJw62kIzVJPjsA74L35XPagbl5bWHSPWVMpUGwXuXgb0t/MRzb6FxopkKUGEVsG7+72HMeT11KWVPPWYCnU2scJ7OTITKDL2pw6lJ7Vee/KD1w9099WILubFwY656vh1O1Oy1C0OkrzYpLLI5NpxHEN+IHUdx3flKyGA/ewMnl+tVWV7WHLgV6lNT0jXCiYBIhBgicDCexqE3AF6iGVR/5QNwQ5k4wWxwZw7YbWWe83FSMbr1GaSE6/xzU3WPW628dwzSMhfhWUqRCRHJfmWBkjrO48JG3d1MS7ltJxvtKa+P3fssDDt70D/Ztab75REd/KO3tRQPKvrqz1O1OWzRcDuaI4orAvelww1xkyIcYq5JE+YNTaYbmq848ytCOY4xH+L6PtwwYK9YBpSH8tFOjqIG2uRQsY4K+H11wyBdWpfJOgqJbvDYPJ+fuYjQfNBMbhn/GTdvOmqG3tmEKAQxUJeMog0LVcCnCdNh5MmKgxxfsPEeULyP/qCah4uHrRisbTqFmyLQmf3DfIWoPdBqsCo+AnkIOx9LsMLRJF3B/XdLssnDyAHWv6LHjLJxWjL8FsuVjpiPTSM0yglYcy3cldzljow4vRH8FOxeiLj4kcU2RwxorJNEKhJqX4oLazfxQCByLb7jUEkDAuLFKfjA6EqDgu9S1yrLap2b6PAjEaZNKxbH/22LsPSlCQgkezEitBXOWzUzi7qaVz67OjT8WDSupOxSIwjKkDHuISQjo4M6HsvJSY6FUHb7rFiF8Yy6c+dcheIYYCXcgitueZj3/KDNDr+Mjaw=";

function encrypt() {
    let file_input = document.querySelector("#encrypt_file");
    let file_reader = new FileReader();

    file_reader.onload = function () {
        let file_content = file_reader.result;
        let password = document.querySelector("#encrypt_password").value;
        let encrypted = CryptoJS.AES.encrypt(file_content, password);

        document.querySelector("#encrypt_result").value = encrypted;
        document.querySelector("#encrypt_password").value = "";
    }

    file_reader.readAsText(file_input.files[0]);
}

function decrypt() {
    let password = document.querySelector("#decrypt_password").value;
    let decrypted =
        CryptoJS.AES.decrypt(ENCRYPTED, password)
            .toString(CryptoJS.enc.Utf8);
    let json = JSON.parse(decrypted);
    
    let otps = NHP_TOTP(json.totp_secrets)
    let otp_list_element = document.querySelector("#otp_list");
    while(otp_list_element.firstChild) {
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