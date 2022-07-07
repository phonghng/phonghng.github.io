const ENCRYPTED = "U2FsdGVkX19N1zu8SETB1+tt+XzCvTXj420vUCV70BR2KLtHBFUc6ROByuRTaxt8lXqCW9tIGrDf2fe86siRj/rOB4KTTU2FkrWyFBHdoZ2EEKtEH2slBRhmDAAYPiqiFQHIFXPPOHCEETNI3icc7Uhzck1ibdlf7rKDCJC/djc3Is4DSJh/qSIzWFK/3HlbM8REavQKQeDfk+xjAFu+985BRcQEcMcXSJnEq4nig4mhOPCwKv1DQ43RfGXliV9ctA4BoMHfoAMv0wIAUqMdHIMHvcPd5Vwij+89aw8ru9OlLh4wRI5c+QVgsN87QCH89Cag3vl3qoQt6ve+dtRd6nZdpshaSibGmzFrxjhFmmFa8bfKLCH1lifmX7ou5ZJFgLvp4VI6HW06bfLTp3CZRP0YB8/Wy9elAk6yO9qe5PqsXDhFQLOyJHDCsam+Mikx9P+9bw+elExXG4Giw8HaJbVHxKxwLbwHZIn6+niAet5+dj6iPm+XGwP5RIGKJFDJqlBacV1ZDpECGwWtm4rTcQus7BtI7e8j3u4CNquKUEx1cF0dhRaIGBK5MyMZq08h+kIuZsUvbhMWkHCnpz6jhrZCmzDd6YiOM+2rB2S3G06FQwp/sT1LtLeyG14Yb067AYSAhtCc0wStES1N3kDmbQAUJ3kVVAJ6uZAiPXGHP9KzTfj4KGjU/Tg4l/Ko2swYIe/Ov80xbiDe1N1Mcffu5vzRHaYYLnunVJLFQ6FxwM8qJgbZJsxrzfsdhO/Z+UIMJbp1MT9yVRMKuS0Uij5slWIkSowPOJ7+hJxSNnqCbA5CJctYUAMZk654A0JxrpHz6dl+IdAIKonuUIj/lDT+f2yBwQ3/RcZt/PzCHxUHKTZX4ZWBr4V8BAj0Ukj7zTe+I/F3zyGe9AXOuG7Gh+j2byptxukV3QdBkixCCC8D/yK+e+m03xSMG45xTP0exJvSceI23sW63Q7LEwjJxSiM5YPtdNdM0v7kHe3vyFkfexKN0ErjQMXWZ8oEGlwwPK51OxNKAQFDTeEvhqJLIAUVzOwTLev35dzsbYaU+MGHuvAdA4JXbL1Ft0OP6FvIAqSOlh/QuPTNPQw/0hdoW3g34Vcn3DTNYhvpjzQY+g9AlDxSVFeXabt5I12z/QpaBCGuV4iiCnsgZR7AHBdj0gIcm7zwXrq/lZ5NG9rhi4R6i3qHNW25vzbiSRm/AHN2K8OgYba5W+es9lb71gMtnjxCKIomt+fF3ArSmcNZpXB82Wq41J/s4GG5n6uSaaB3UHZyeQfrDPLDRq0ek73S1LHt7GlzK5sP1xP3tb7GHm4ypO+w2Vf3RwscNrmZ9EsVbnQZuHDQ9ReoCrulKPHtPTJnBvrg7EQ/unU3OQO7SV+67pb+pxVv2VbX3CirNxszBNKBQEhrah3rl/N7tHCJAPwANcZkBtqUKVi8hd7VHx+zz3ssIJGrNp6JT+MCBU6iPhOia1QF7ctqXMfbvp8lv4z8ThxgFVxDPfzgYS78KB+z/aq1xX/ICj7WKsMTyaO8wur14xNo0LMlIlZdjvFqJ2WYe69fYDDacQmUxtA7Rlgkq0PxyfQWJjIYAhbZpenvMdlU";

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