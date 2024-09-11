let folder_count = 0;

function process_item(item, item_list_element) {
    let ADOMs = [];

    switch (item.type) {
        case "widget_image": {
            ADOMs.push([
                "div",
                {
                    "class": "item widget",
                    "id": item.id,
                    "data-link": item.image_source,
                    "title": item.image_source
                },
                {
                    "onclick": () => location.href = item.image_source
                },
                [[
                    "img",
                    {
                        "src": item.image_source,
                        "style": "--base_color: " + item.image_base_color + ";"
                    },
                    null,
                    null,
                    null
                ]],
                null
            ]);
            break;
        }

        case "widget_iframe": {
            ADOMs.push([
                "div",
                {
                    "class": "item widget",
                    "id": item.id,
                    "data-link": item.iframe_url,
                    "title": item.iframe_url
                },
                {
                    "onclick": () => location.href = item.iframe_url
                },
                [[
                    "iframe",
                    {
                        "src": item.iframe_url
                    },
                    null,
                    null,
                    null
                ]],
                null
            ]);
            break;
        }

        case "folder": {
            let folder_id = "folder_" + folder_count++;

            ADOMs.push([
                "div",
                {
                    "class": "item folder_button",
                    "title": item.name,
                    "data-opened": item.opened.toString(),
                    "style": "--folder_color: " + item.color + ";"
                },
                null,
                [[
                    "img",
                    {
                        "src": item.icon_source,
                        "style": "--base_color: " + item.icon_base_color + ";"
                    },
                    null,
                    null,
                    null
                ]],
                button => {
                    button.onclick = () => {
                        let folder = document.querySelector("#" + folder_id);
                        let new_state = folder.dataset.opened == "false";
                        folder.dataset.opened = new_state;
                        button.dataset.opened = new_state;
                        mansory.layout();
                    };
                }
            ]);

            let children_ADOM = [];
            item.items
                .filter(folder_item => folder_item.type == "folder" || folder_item.type == "item")
                .forEach(folder_item => {
                    if (folder_item.type == "folder") {
                        process_item(folder_item).forEach(ADOM => children_ADOM.push(ADOM));
                        return;
                    }

                    let icons = [];

                    icons.push([
                        "img",
                        {
                            "src": folder_item.icon_source,
                            "style": "--base_color: " + folder_item.icon_base_color + ";"
                        },
                        null,
                        null,
                        null
                    ]);

                    if (folder_item.sub_icon_source)
                        icons.push([
                            "img",
                            {
                                "src": folder_item.sub_icon_source,
                                "style": "--base_color: " + folder_item.sub_icon_base_color + ";"
                            },
                            null,
                            null,
                            null
                        ]);

                    children_ADOM.push([
                        "div",
                        {
                            "class": "item" +
                                (folder_item.important
                                    ? " important_" + folder_item.important_color_type
                                    : ""),
                            "data-link": folder_item.link,
                            "title": folder_item.link,
                        },
                        {
                            "onclick": () => location.href = folder_item.link
                        },
                        icons,
                        null
                    ]);
                });

            ADOMs.push([
                "div",
                {
                    "id": folder_id,
                    "class": "folder",
                    "data-opened": item.opened.toString(),
                    "style": "--color: " + item.color + ";"
                },
                null,
                children_ADOM,
                null
            ]);

            break;
        }

        case "item": {
            let icons = [];

            icons.push([
                "img",
                {
                    "src": item.icon_source,
                    "style": "--base_color: " + item.icon_base_color + ";"
                },
                null,
                null,
                null
            ]);

            if (item.sub_icon_source)
                icons.push([
                    "img",
                    {
                        "src": item.sub_icon_source,
                        "style": "--base_color: " + item.sub_icon_base_color + ";"
                    },
                    null,
                    null,
                    null
                ]);

            ADOMs.push([
                "div",
                {
                    "class": "item" +
                        (item.important
                            ? " important_" + item.important_color_type
                            : ""),
                    "data-link": item.link,
                    "title": item.link
                },
                {
                    "onclick": () => location.href = item.link
                },
                icons,
                null
            ]);
            break;
        }
    };

    if (item_list_element)
        ADOMs.forEach(ADOM =>
            item_list_element.appendChild(PPPL_JS.ADOM(ADOM, document))
        );
    return ADOMs;
}

let item_list_element = document.querySelector("#item_list");

ITEMS.forEach(item => process_item(item, item_list_element));

let mansory = new Masonry("#item_list", {
    itemSelector: ".item",
    columnWidth: 105,
    gutter: 20,
    fitWidth: true
});
