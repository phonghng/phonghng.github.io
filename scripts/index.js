const ECI_ENCRYPTED = `U2FsdGVkX1/+MwNJst8WB+kixC67pyk864wFse+940fO30BgE1KXe7AzYo6Ok1RhA/rrHUt9yN5d6jg+4dJH/gZmgWFP0K+mpDrCeGcq7cvP61ZZ4eUQabPfLGWq4//upP7rSmbjw7iahwrfvb1lZadTKNuL8Syoq5IdbJPBHXTMh6bJsU/VXUYKFBW5HxSIXtABSvBa3E3hlh7mKCCOlGv/nc0JlusNIcSeVqjx6RQfjrsrsxFK7Zi57E6j4Wp7e5ynM8fWe45wdMiJL9oZj5NZkvpLdq6iaCZZCNFeyPdeV6Y9JbKZYwbP9AVJWRlrPv2AVeU0bwEtcZjdGfOcxNs2GXcyHodHZ/EAifwO+VYZEYXis10zKxoCgfm63XGREmP/wO2hOK8ibdGB+CXDmuI5s2qDFHKD7LUKAFSUuXPAIOuiF9rcTUNDt6dnxMW3d8MLlawSfey4ngmtzskv9zRC6gYCWJR2P6KHlmT9uIC0ULthqMUhD+qO0m0Zi03u`;

function link_anchor_tags() {
    let elements = document.querySelectorAll("a[_link_type]");
    for (const element of elements) {
        let link_type = element.getAttribute("_link_type");
        switch (link_type) {
            case "email":
                element.href = `mailto:${element.innerHTML}`;
                break;
            case "link":
                element.href = `${element.innerHTML}`;
                break;
            case "zalo":
                element.href = `https://zalo.me/${element.innerHTML.replace(/\./g, "")}`;
                break;
            case "phone":
                element.href = `tel:${element.innerHTML.replace(/\./g, "")}`;
                break;
            case "geohack":
                let latitude = element.getAttribute("_geohack_latitude");
                let longitude = element.getAttribute("_geohack_longitude");
                element.href = `https://geohack.toolforge.org/geohack.php?language=vi&pagename=${element.innerHTML}&params=${latitude};${longitude}`;
                break;
        }

        element.target = "_blank";
    }
}

function append_items_title() {
    let items = document.querySelectorAll("p[_item_title]");
    for (const item of items) {
        let title = document.createElement("strong");
        title.innerHTML = `${item.getAttribute("_item_title")}:`;
        item.insertBefore(title, item.firstChild);
    }
}

function eci_encrypt(json, password) {
    let json_stringified = JSON.stringify(json);
    return CryptoJS.AES.encrypt(json_stringified, password).toString();
}

function eci_decrypt(encrypted_json, password, reveal_info_anchor) {
    let decrypted;

    try {
        decrypted =
            CryptoJS.AES.decrypt(
                encrypted_json || ECI_ENCRYPTED,
                password
            ).toString(CryptoJS.enc.Utf8);
    } catch (error) {
        alert(`Đã xảy ra lỗi: "${error.message}". Có thể là do mật khẩu bị sai. Vui lòng kiểm tra lại!`);
        return;
    }

    reveal_info_anchor.style.display = "none";

    let json = JSON.parse(decrypted);

    let item_title = reveal_info_anchor.parentElement.getAttribute("_item_title")

    let element =
        document.querySelector(`p[_item_title="${item_title}"] a[_link_type]`)
        || document.querySelector(`p[_item_title="${item_title}"] span`);

    let element_attributes = json[item_title];
    for (const name in element_attributes) {
        const value = element_attributes[name];
        if (name.startsWith("_")) {
            element.setAttribute(name, value);
        } else {
            element[name] = value;
        }
    }

    link_anchor_tags();
}

function assign_eci_reveal_info_anchor() {
    let anchors = document.querySelectorAll("p[_item_title] a.reveal_info");
    for (const anchor of anchors) {
        anchor.innerHTML = "Bấm vào đây để hiện thông tin...";
        anchor.onclick = (event) => {
            eci_decrypt(
                ECI_ENCRYPTED,
                prompt('Nhập mật khẩu:'),
                event.target
            );
        };
    }
}

link_anchor_tags();
append_items_title();
assign_eci_reveal_info_anchor();

const get_url_param = key => new URL(location.href).searchParams.get(key);
let private_note_type = get_url_param("private_note_type");
let private_note_content = ``;
switch (private_note_type) {
    case "code__closed_source__ctn__exercise": {
        let teacher = [
            "Đỗ Thị Linh",
            "Nguyễn Thị Kim Tuyến"
        ][parseInt(get_url_param("teacher_code"))];
        private_note_content =
            `Đoạn mã được viết bởi tôi, NGUYỄN HẢI PHONG. Thông tin liên lạc với tôi được đăng tải ở dưới.<br/>
            <br/>
            Bất kì trường hợp sử dụng đoạn mã nào, phải chấp hành theo pháp luật sở hữu trí tuệ của nước Cộng hoà xã hội chủ nghĩa Việt Nam. Trong đó, sử dụng toàn bộ hoặc một phần đoạn mã là sản phẩm trí tuệ của tôi phải giữ nguyên hoặc thêm dòng ghi chú có đường liên kết trỏ tới trang web này.<br/>
            <br/>
            Đoạn mã nằm trong khuôn khổ bài tập môn Chuyên Tin:<br/>
            — Trường: THPT Chuyên (tỉnh Thái Nguyên, Việt Nam).<br/>
            — Giáo viên: ${teacher}.<br/>
            — Nội dung tiết học: ${get_url_param("lesson_content")}.<br/>
            — Nội dung bài tập: ${get_url_param("exercise_content")}.`;
        let vnoj_problem_code = get_url_param("vnoj_problem_code");
        if (vnoj_problem_code)
            private_note_content +=
                `<br/>
                — Mã bài VNOJ (có thể xem đề bài, kết quả chấm bài làm của đoạn mã): <a href="https://oj.vnoi.info/problem/ctn_${vnoj_problem_code}">ctn_${vnoj_problem_code}</a>.`;
        break;
    }

    case "code__open_source__library": {
        private_note_content =
            `Thư viện ${get_url_param("language")} "${get_url_param("library_name")}" phiên bản ${get_url_param("version")} được viết bởi tôi, NGUYỄN HẢI PHONG. Thông tin liên lạc với tôi được đăng tải ở dưới.<br/>
            <br/>
            Bất kì trường hợp sử dụng thư viện nào, phải chấp hành theo pháp luật sở hữu trí tuệ của nước Cộng hoà xã hội chủ nghĩa Việt Nam. Trong đó, sử dụng toàn bộ hoặc một phần thư viện là sản phẩm trí tuệ của tôi phải giữ nguyên hoặc thêm dòng ghi chú có đường liên kết trỏ tới trang web này.`;
        break;
    }
}
document.querySelector("#private_note").innerHTML = private_note_content;