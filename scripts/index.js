const BUTTONS_CONFIG = {
    "copy": {
        title: "Sao chép nội dung",
        icon: "copy",
        onclick: async (element, item_content, arguments) => {
            try {
                await navigator.clipboard.writeText(arguments.copy_content || item_content);
                show_signal_icon(element, "check", "var(--LIME)", 1000);
            } catch (err) {
                show_signal_icon(element, "x", "var(--CHERRY)", 1000);
            }
        }
    },
    "mailto": {
        title: "Gửi thư điện tử",
        icon: "envelope",
        onclick: (element, item_content, arguments) => {
            window.open("mailto:" + item_content);
        }
    },
    "tel": {
        title: "Gọi điện thoại",
        icon: "phone",
        onclick: (element, item_content, arguments) => {
            window.open("tel:" + arguments.phone_number || item_content);
        }
    },
    "Zalo": {
        title: "Kết bạn Zalo",
        icon: "user-plus",
        onclick: (element, item_content, arguments) => {
            window.open(arguments.Zalo_QR_link);
        }
    },
    "locate": {
        title: "Tra cứu vị trí",
        icon: "location-dot",
        onclick: (element, item_content, arguments) => {
            let latitude = arguments.latitude;
            let longitude = arguments.longitude;
            window.open(`https://geohack.toolforge.org/geohack.php`
                + `?language=vi&pagename=${item_content}&params=${latitude};${longitude}`);
        }
    },
    "open_link": {
        title: "Mở đường liên kết",
        icon: "up-right-from-square",
        onclick: (element, item_content, arguments) => {
            window.open(arguments.link || item_content);
        }
    }
};

const show_signal_icon =
    (element, icon_name, base_color, duration) => {
        let orginal_icon_name =
            element.innerHTML
                .replace(`<i class="fa-solid fa-`, "")
                .replace(`></i>`, "");
        let orginal_base_color = element.style.getPropertyValue("--base_color");

        element.innerHTML = `<i class="fa-solid fa-${icon_name}"></i>`;
        element.style.setProperty("--base_color", base_color);
        setTimeout(() => {
            element.innerHTML = `<i class="fa-solid fa-${orginal_icon_name}"></i>`;
            element.style.setProperty("--base_color", orginal_base_color);
        }, duration);
    }

const generate_QR_code_element =
    content => {
        let element = document.createElement("div");
        element.style.textAlign = "center";
        QrCreator.render({
            text: content,
            radius: 0.5,
            ecLevel: "H",
            fill: "#FFFFFF",
            background: null,
            size: 200
        }, element);
        return element;
    }

const generate_item_card =
    (title, button_names, buttons_arguments, content, children) =>
        PPPL_JS.ADOM([
            "div",
            { class: "item_card" },
            null,
            [[
                "div",
                { class: "title" },
                { innerHTML: title },
                null,
                null
            ], [
                "div",
                { class: "buttons" },
                null,
                button_names.map(button_name => [
                    "button",
                    { title: BUTTONS_CONFIG[button_name].title },
                    { innerHTML: `<i class="fa-solid fa-${BUTTONS_CONFIG[button_name].icon}"></i>` },
                    null,
                    DOM =>
                        DOM.onclick = () => {
                            if (buttons_arguments.constructor.name == "Protected_Information")
                                if (buttons_arguments.json)
                                    buttons_arguments = buttons_arguments.json.buttons_arguments;
                                else {
                                    show_signal_icon(DOM, "x", "var(--CHERRY)", 1000);
                                    return false;
                                }
                            BUTTONS_CONFIG[button_name].onclick(DOM, content, buttons_arguments);
                        }
                ]),
                null
            ], [
                "div",
                { class: "content" },
                { innerHTML: typeof content == "string" ? content : "" },
                [buttons_arguments.constructor.name == "Protected_Information"
                    ? buttons_arguments.generate_HTML(content)
                    : content],
                null
            ], [
                "div",
                { class: "children" },
                null,
                children?.map(child => generate_item_card(...child)),
                null
            ]],
            null
        ], document);


class Protected_Information {
    constructor(encrypted) {
        this.encrypted = encrypted;
        this.json = undefined;
    }

    encrypt(json, password) {
        let json_stringified = JSON.stringify(json);
        return CryptoJS.AES.encrypt(json_stringified, password).toString();
    }

    decrypt(password) {
        try {
            this.json = JSON.parse(
                CryptoJS.AES.decrypt(
                    this.encrypted,
                    password
                ).toString(CryptoJS.enc.Utf8)
            );
            return [true];
        } catch (error) {
            return [false, error.message];
        }
    }

    generate_form(submit_callback) {
        return PPPL_JS.ADOM([
            "div",
            { class: "protected_information_form" },
            null,
            [[
                "input",
                { placeholder: "Nhập mật khẩu để xem..." },
                null,
                null,
                null
            ], [
                "button",
                null,
                { innerHTML: "Gửi" },
                null,
                DOM =>
                    DOM.onclick = () =>
                        submit_callback(
                            DOM.parentElement,
                            DOM.parentElement.querySelector("input").value
                        )
            ]],
            null
        ], document);
    }

    generate_HTML(content_function) {
        return this.generate_form((form_element, password) => {
            let decrypt_response = this.decrypt(password);
            if (decrypt_response[0]) {
                let content_element = form_element.parentElement;
                let content = content_function ? content_function(this.json.content) : this.json.content;
                content_element.replaceWith(
                    PPPL_JS.ADOM([
                        "div",
                        { class: "content" },
                        { innerHTML: typeof content == "string" ? content : "" },
                        [content],
                        null
                    ], document)
                );
            } else {
                alert(`Đã xảy ra lỗi "${decrypt_response[1]}". `
                    + `Có thể do mật khẩu bị sai, vui lòng nhập lại mật khẩu!`);
                form_element.querySelector("input").focus();
            }
        })
    }
}