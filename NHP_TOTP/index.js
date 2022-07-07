const ENCRYPTED = "U2FsdGVkX1/zh5jDn8IHrV3BRuclevX7IShRuWqwmZ73PhyZxup1JeMGFmVDh6trx2Zcy2Hq5FutMKl1qHDkXa/bwshfcdb3SWNDWmVYB15ZzE11hZ87p6qwENNikqNLjanDjBbRglFI4HMKLdJtfSCzDnkd4yWB0nwHBMHAyDmzLNCrPpBElluItnexCl4VHG5kO77ZG59254nNlR3UdraOseIsuIcFfUM34iHW87+Y8IeKdBsN62YYLCV5W+IsaOM4lxEsLzrw6jeLG6s1RmJcxpkifQ+cjIFNU39gzB752dG8wZ1/lCvIn4pp/abD+jx0LdszTZMUhzCsMh615Pb8Ueu21HO5n1mQe/84KHIT6Nn8MBFYsyDdhZtZ74n32rhxIpsZnbEPdqETx2Kft+vJJ7xp1RUSkUivmtI3HX1u9iz07OrJx2uBkdZC+jmKwnwNZ0njyxO5t0Aia/hfjFZm2rS3EcpX/rU2mgeQlX26BDqBBuU274P42ATcZwGI102RCIViiJAl+T9+uiq6hagaYVR4Ri2V++sJBpt8UyQcovkcBWboRVMPk6NTIduI7fGiAkRPcqxnOmIQB1RAsyIIbi9oxMkek64V1sjvGvbM5Ygu551+KQ5P3JOTm2vN7koFPqXY8OCX9PlA4Hc2GpMdCtxkHETDfMEVGfA4g9JejNEtrKbC/7tkIr8zUu3igLXvri2Eh3cT4TjZ70tzokZ5QPX6TDKAlxTL5wVAk4FceDsrCGXGRH1imYgigBIziGeCgPyDYdPDqqpOFxbjCL5qluTZDVSbfnftqSy4dw1DEbB5FexzMxCWquJItNIZnzpwF2YN23dzCDTnWcszXqzyFpmuSZAKYwIm0elX3YhN2PdXet3YfnIri1TNsjTHhOsorqdG/bkWltJIJvybW1cH+/HATQ4rUBxe6E2grOHuj/yJAlKSXw8+yzAxLbuKaL9zZN+7w2tHUvNVmSys5Y3FoMWjIB2SSJaGBAgF+FDw977v5cMyBjjVH2Nb+JeJsuz5YIkDiKZg/6Vmx+UpoQq+eLavEMZct0Qf/uxAqUMXBVH7+w7Gxs4qCNcUljT2+R/XPKk+DUTQx+0ERn1xP19XARbjd6EipEEjf0iIpqZVLK/TQo+eC5icjUUhGkkkjMvyAP6XwsglMEbujNJO518M+tiD2IPKTPfk48uaQmkoY7H0mztdPMkrEZ24yDZfuMyp61AGYi8gIK+oLBjNCc5hSIDPXuGrwRVs595uft8ekqrQlmXl1RNRV05xi52n7NH2d5X2jET2XNIbITK3EvNh6iDuBYTEe7Tdz0zbn5/JRa/9HORfw281ICpv22zFUDS29e6sDrtZGeIeG3baXXKank2igrIztC/nIsOjY6feJimmj7xZaNUB0i4J/lMshQdRtHoV0CBuYxZCLlGfx6weEslX9bSx5DzYv83U9TDkNsy140veQKUDaIR6gjgQybqmCDxLZITo6ay/xcUpS3Z7ksqsBecrBx/+hNias3k2ZxZ1UDHQ4U0HzdWOXarjv4N5wUD/KJ4ajNd1YBLpBQ==";

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