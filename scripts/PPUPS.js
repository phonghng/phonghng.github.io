function process_item(item, item_list_element) {
    switch (item.type) {
        case "widget_image": {
            item_list_element.appendChild(
                PPPL_JS.ADOM([
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
                ], document)
            );
            break;
        }

        case "widget_iframe": {
            item_list_element.appendChild(
                PPPL_JS.ADOM([
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
                ], document)
            );
            break;
        }

        case "folder": {
            let children_ADOM = [];

            children_ADOM.push([
                "div",
                {
                    "class": "item button",
                    "title": item.name
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
                null
            ]);

            item.items.forEach(folder_item => {
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
                        "class": "item",
                        "data-link": folder_item.link,
                        "title": folder_item.link
                    },
                    {
                        "onclick": () => location.href = folder_item.link
                    },
                    icons,
                    null
                ]);
            });

            item_list_element.appendChild(
                PPPL_JS.ADOM([
                    "div",
                    {
                        "class": "folder",
                        "data-opened": item.opened.toString(),
                        "style": "--color: " + item.color + ";"
                    },
                    null,
                    children_ADOM,
                    folder => {
                        folder.querySelector(".item.button").onclick = () => {
                            folder.dataset.opened = folder.dataset.opened == "false";
                            mansory.layout();
                        };
                    }
                ], document)
            );
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

            item_list_element.appendChild(
                PPPL_JS.ADOM([
                    "div",
                    {
                        "class": "item",
                        "data-link": item.link,
                        "title": item.link
                    },
                    {
                        "onclick": () => location.href = item.link
                    },
                    icons,
                    null
                ], document)
            );
            break;
        }
    };
}

let item_list_element = document.querySelector("#item_list");

ITEMS.forEach(item => process_item(item, item_list_element));

let mansory = new Masonry("#item_list", {
    itemSelector: ".item",
    columnWidth: 105,
    gutter: 20,
    fitWidth: true
});

