function collect_transaction_mapping_tree(config, prefix_description, prefix_object, mapping_tree, depth = 0) {
    if (!config.child_dropdown_choices) return;
    for (const child of config.child_dropdown_choices) {
        const description = prefix_description + child.value;
        const object = prefix_object ? prefix_object + " > " + child.text : child.text;
        if (child.amount) {
            mapping_tree.push({
                transaction_description: description,
                transaction_object: object,
                amount_required: child.amount,
                label: child.text,
                depth: depth
            });
        } else {
            mapping_tree.push({
                is_parent: true,
                label: child.text,
                depth: depth
            });
            collect_transaction_mapping_tree(child, description, object, mapping_tree, depth + 1);
        }
    }
}

function format_currency_vnd(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

function download_text_file(content, filename) {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { URL.revokeObjectURL(link.href); link.remove(); }, 250);
}

function process_and_export_transactions(config_root) {
    const mapping_tree = [];
    collect_transaction_mapping_tree(config_root, config_root.value, "", mapping_tree, 0);

    const result_map = {};
    mapping_tree.forEach(item => {
        if (!item.is_parent) {
            result_map[item.transaction_description] = {
                label: item.label,
                amount_required: item.amount_required,
                total_amount: 0,
                datetimes: [],
                depth: item.depth
            };
        }
    });

    const entry_nodes = document.querySelectorAll(
        "#tab1 > div.list.list-line.list-his > div.list-line-item.hightlight-fadeout > div.row"
    );

    let entry_count = 0;
    for (const node of entry_nodes) {
        entry_count += 1;
        const content_text = node.querySelector("div.col.flex-grow-1 > div.txt-main")?.innerText?.replace(/\s/g, "") || "";
        const datetime_text = node.querySelector("div.col.flex-grow-1 > div.txt-sub.color-base-3.mb5")?.innerText?.trim() || "";
        const amount_text = node.querySelector("div.col-auto.text-right > div.txt-main.b.color-accent")?.innerText?.replace(/[^\d\-]/g, "") || "";
        const amount_value = parseInt(amount_text, 10) || 0;

        if ((content_text.match(/PHONGHNG/g) || []).length >= 2) {
            console.error(`Transaction #${entry_count} contains more than one "PHONGHNG": ${content_text}`);
        }

        for (const description_code in result_map) {
            if (content_text.includes(description_code)) {
                const info = result_map[description_code];
                info.total_amount += amount_value;
                info.datetimes.push(datetime_text);
                break;
            }
        }
    }

    let output_lines = [];
    for (const item of mapping_tree) {
        if (item.is_parent) {
            output_lines.push(" ".repeat(item.depth * 10) + item.label);
        } else {
            const info = result_map[item.transaction_description];
            const datetimes_text = info.datetimes.length ? ` (${info.datetimes.join("; ")})` : "";
            const total = info.total_amount;
            const required = info.amount_required;
            output_lines.push(
                " ".repeat(info.depth * 10) +
                `${info.label}: ${format_currency_vnd(total)}/${format_currency_vnd(required)}${datetimes_text}`
            );
        }
    }

    download_text_file(output_lines.join("\n"), "output.txt");
}

process_and_export_transactions(list_config);