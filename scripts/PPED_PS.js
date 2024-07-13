/**
         * regx (defined) = regular expression
         */

const ENCRYPTED_REGX = "U2FsdGVkX1+KwuCk7m2lYsvZFCkjWFLucQ2Bw/+vMeE=";
const REGX_ENCRYPTION_SALT = "NGUYENHAIPHONGDEPTRAISOMOTTHEGIOI";

function apply_regx(regx, string) {
    const REGX_RULES_FUNCTION = {
        "A": character => character.toUpperCase(),
        "a": character => character.toLowerCase(),
        "X": character => ""
    };
    if (!string) return false;
    let result_string = "";
    for (let index = 0; index < string.length; index++) {
        let regx_character = regx[index % regx.length];
        if (REGX_RULES_FUNCTION[regx_character])
            result_string += REGX_RULES_FUNCTION[regx_character](string[index]);
        else
            result_string += string[index];
    }
    return result_string;
}

async function encrypt_regx(regx, password, salt = REGX_ENCRYPTION_SALT) {
    return CryptoJS.AES.encrypt(
        regx,
        (await argon2.hash({
            pass: password,
            salt: salt,
            time: 3,
            mem: 65536,
            hashLen: 32,
            parallelism: 4,
            type: argon2.ArgonType.Argon2id
        })).encoded
    ).toString();
}

async function decrypt_regx(password, encrypted_regx = ENCRYPTED_REGX, salt = REGX_ENCRYPTION_SALT) {
    return CryptoJS.AES.decrypt(
        encrypted_regx,
        (await argon2.hash({
            pass: password,
            salt: salt,
            time: 3,
            mem: 65536,
            hashLen: 32,
            parallelism: 4,
            type: argon2.ArgonType.Argon2id
        })).encoded
    ).toString(CryptoJS.enc.Utf8);
}

async function generate_password(platform_names, notes_data, password) {
    document.querySelector("#form_regx_password").value = "";
    let regx = await decrypt_regx(password);
    platform_names = platform_names.filter(value => value);
    platform_names = platform_names.map(platform_name => apply_regx(regx, platform_name));
    notes_data = notes_data.filter(value => value.content).map(note_data => {
        if (note_data.apply_regx)
            return apply_regx(regx, note_data.content);
        else
            return note_data.content;
    });
    if (notes_data.length)
        return `PhongHNg.000/${platform_names.join("_")}/${notes_data.join("_")}`;
    else
        return `PhongHNg.000/${platform_names.join("_")}`;
}

function copy_to_clipboard(button_element) {
    if (!navigator.clipboard) {
        alert("Không thể sao chép!");
        return;
    }
    navigator.clipboard.writeText(
        document.querySelector("#created_password").value
    ).then(() => alert("Sao chép thành công!"), error => alert("Sao chép không thành công!"));
}

function show_password(button_element) {
    if (button_element.innerText == "Hiện") {
        button_element.innerText = "Ẩn";
        document.querySelector("#created_password").type = "text";
    } else {
        button_element.innerText = "Hiện";
        document.querySelector("#created_password").type = "password";
    }
}

async function form_submit(input_data) {
    let password = await generate_password(
        [
            input_data["form_primary_platform_name"],
            input_data["form_secondary_platform_name"]
        ],
        [{
            content: input_data["form_account_name"],
            apply_regx: true
        }, {
            content: input_data["form_password_count"],
            apply_regx: false
        }],
        input_data["form_regx_password"]
    );

    document.querySelector("#result").innerHTML =
        `Mật khẩu được tạo là <input id="created_password" type="password" `
        + `value="${password}" placeholder="Mật khẩu được tạo..."/>`
        + `<button onclick="show_password(this)">Hiện</button>`
        + `<button onclick="copy_to_clipboard(this)">Sao chép</button>`;
}

document.querySelector("#from_wrapper").appendChild(
    PPPL_JS.fADOM("form", [
        ["text", "primary_platform_name", "Tên nền tảng sơ cấp", { required: true }],
        ["text", "secondary_platform_name", "Tên nền tảng thứ cấp", {}],
        ["text", "account_name", "Tên tài khoản trên nền tảng", {}],
        ["text", "password_count", "Thứ tự mật khẩu trên tài khoản", {}],
        ["password", "regx_password", "Khoá bảo mật biểu thức chính quy", { required: true }],
        ["submit", "submit", "Tạo mật khẩu", {
            style: "--base_color: var(--LIME)",
            submit_callback: form_submit,
            submit_empty_callback: () => { }
        }]
    ])
);