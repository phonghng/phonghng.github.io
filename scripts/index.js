/**
 * - - - ABBRAVIATION - - -
 * eci = emergency contact information
 */

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