const OBJECT_TYPES_NAME = {
    "Q": "queue",
    "F": "fund",
    "B": "bacc",
    "D": "debt",
    "queue": "hàng đợi",
    "fund": "quỹ",
    "bacc_savings": "tài khoản tiết kiệm",
    "bacc_current": "tài khoản giao dịch",
    "bacc_credit": "tài khoản tín dụng",
    "savings": "tiết kiệm",
    "current": "giao dịch",
    "credit": "tín dụng",
    "debt": "khoản nợ"
};

const BACC_TYPES = {
    "savings": "Tài khoản tiết kiệm",
    "current": "Tài khoản giao dịch",
    "credit": "Tài khoản tín dụng"
};

const PAYMENT_METHODS = {
    "cash": "Tiền mặt",
    "current_account_transfering": "Chuyển khoản tài khoản giao dịch",
    "current_account_card": "Thẻ tài khoản giao dịch",
    "credit_account_transfering": "Chuyển khoản tài khoản tín dụng",
    "credit_account_card": "Thẻ tài khoản tín dụng"
};

const PAYMENT_CATEGORIES = {
    "HocPhiC3": "Học phí cấp ba",
    "TienPhongKTXC3": "Tiền phòng kí túc xá cấp ba",
    "AnSang": "Ăn sáng",
    "AnTrua": "Ăn trưa",
    "AnToi": "Ăn tối",
    "AnQuanHe": "Ăn/uống chung (vì xây dựng quan hệ)",
    "AnVat": "Ăn vặt",
    "UongVat": "Uống vặt",
    "ChoPhanLoai": "Chờ phân loại"
};

const NOTIFICATION_TEXTS = {
    "CANT_FIND_QUEUE": "Không thể tìm thấy hàng đợi!",
    "CANT_FIND_FUND": "Không thể tìm thấy quỹ!",
    "CANT_FIND_BACC": "Không thể tìm thấy tài khoản ngân hàng!",
    "CANT_FIND_DEBT": "Không thể tìm thấy khoản nợ!",
    "NOT_ENOUGH_BALANCE": "Không đủ số dư!",
    "FUND_BACC_UNLINKABLE__DIFFERENT_ON_ANB": "Không thể liên kết quỹ – tài khoản ngân hàng (do một cái cho phép, một cái không cho phép số dư có thể âm)!",
    "FUND_BACC_UNLINKABLE__ALREADY_LINKED": "Không thể liên kết quỹ – tài khoản ngân hàng (do chúng đang liên kết với nhau)!",
    "FUND_BACC_UNLINKABLE__BACC_ON_OTHER_LINK": "Không thể liên kết quỹ – tài khoản ngân hàng (do tài khoản ngân hàng đang liên kết với một quỹ khác)!",
    "CANT_FUND_BACC_UNLINK__NOT_LINKING": "Không thể hủy liên kết quỹ – tài khoản ngân hàng (do chúng đang không liên kết với nhau)!",
    "OUT_OF_RRID_SPACE": "Vượt quá giới hạn tổng phần trăm nhận phân bổ thu nhập (100%)!",
    "NO_CHANGE_IN_EDITING": "Không thể sửa thông tin (do không có sự thay đổi nào)!",
    "DATA__CANT_PARSE_LOG": "Không thể phân tích nhật kí!",
    "DATA__MISSING_PASSWORD": "Không nhận được mật khẩu! Vui lòng tải lại trang để đăng nhập lại.",
    "DATA__WRONG_PASSWORD": "Sai mật khẩu! Vui lòng tải lại trang để đăng nhập lại.",
    "DATA__FAILED_FETCH": "Không thể lấy nhật kí! Vui lòng tải lại trang để đăng nhập lại.",
    "DATA__SAVED": "Đã lưu nhật kí thành công!",
    "DATA__PARSED_LOG": "Phân tích nhật kí thành công!",
    "ACTIONS_FORM__EMPTY_REQUIRED_FIELD": "Vui lòng điền hết những ô bắt buộc (có đánh dấu *)!",
    "CANT_CHANGE_ANB_WHEN_BALANCE_IS_NEGATIVE": "Không chuyển đổi thành không cho phép số dư có thể âm trong khi số dư đang âm!"
};

const format_time =
    (timestamp) =>
        moment(timestamp).format("HH:mm DD/MM/YYYY");

const format_currency =
    (amount) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
            .format(amount);

class Actions {
    constructor(Notification, Data) {
        this.Notification = Notification;
        this.Data = Data;
        this.error_checker = (checks_parameters) => {
            let checks_result = [];
            for (let [code, args] of Object.entries(checks_parameters)) {
                args = Object.assign({ Data: this.Data }, args);
                checks_result.push(
                    this.Notification.validate(code, args)
                );
            }
            return !checks_result.every(check => check);
        };
    }

    _edit_object_info(args, type, id, edit_data) {
        let changes = this.Notification.validate("EDIT", { Data: this.Data, type, id, edit_data });
        if (!changes) return false;

        let object = this.Data.data[`${type}s`][id];

        let log_messages = [];
        for (let [title, name, is_changed, old_value, new_value, new_value_formatter] of changes)
            if (is_changed) {
                if (name == "rrid")
                    if (this.error_checker({
                        "RRID": { rrid: new_value - old_value }
                    }))
                        return false;
                object[name] = new_value;
                if (new_value_formatter)
                    log_messages.push(`${title} thành ${new_value_formatter(new_value)}`);
                else
                    log_messages.push(`${title} thành ${new_value}`);
                if (type == "bacc" && name == "type")
                    object.is_anb = new_value == "credit";
            }

        object.logs.push([args[0], "pencil", "var(--BLUE)",
        `Thay đổi ${log_messages.join(", ")}`]);

        return args;
    }

    QCr(
        timestamp,
        Actions_code,
        queue_name
    ) {
        if (timestamp.constructor.name == "Function")
            return [
                ["text", "queue_name", "Tên hàng đợi"],
                ["submit", "submit", "Tạo hàng đợi"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        else if (timestamp.constructor.name == "Object") {
            let queue = this.Data.data.queues[timestamp.id];
            return [
                "no_info",
                "queue",
                "list",
                "Hàng đợi",
                queue.name,
                format_currency(queue.balance),
                null,
                [
                    ["Cộng/trừ tiền", "bolt", "OPM", [["object_id", "value", `Q_${timestamp.id}`]]],
                    ["Phân bổ thu nhập", "funnel-dollar", "QID", [["queue_id", "value", timestamp.id]]],
                    ["Chuyển tiền", "inbox-out", "O2O", [["source_id", "value", `Q_${timestamp.id}`]]],
                    ["Thanh toán", "receipt", "OPm", [["object_id", "value", `Q_${timestamp.id}`]]],
                    ["Xem nhật kí", "align-justify", false, `Q_${timestamp.id}`],
                    ["Sửa thông tin", "pencil", "QEd", [
                        ["queue_id", "value", timestamp.id],
                        ["queue_name", "value", queue.name]
                    ]],
                    ["Xóa", "trash", "QRm", [["queue_id", "value", timestamp.id]]]
                ]
            ];
        }

        this.Data.data.queues[String(timestamp)] = {
            name: queue_name,
            balance: 0,
            logs: [
                [timestamp, "sparkles", "var(--LEMON)",
                    `Tạo hàng đợi "${queue_name}"`]
            ]
        };

        return arguments;
    }

    QEd(
        timestamp,
        Actions_code,
        queue_id,
        queue_name
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "queue_id", "Hàng đợi", () => timestamp("queue")],
                ["text", "queue_name", "Tên hàng đợi"],
                ["submit", "submit", "Sửa thông tin hàng đợi"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        return this._edit_object_info(arguments, "queue", queue_id, [
            ["tên", "name", queue_name]
        ]);
    }

    QRm(
        timestamp,
        Actions_code,
        queue_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "queue_id", "Hàng đợi", () => timestamp("queue")],
                ["submit", "submit", "Xóa hàng đợi"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        if (this.error_checker({
            "FIND_QUEUE": { id: queue_id }
        }))
            return false;
        delete this.Data.data.queues[queue_id];
        return arguments;
    }

    FCr(
        timestamp,
        Actions_code,
        fund_name,
        is_anb,
        rrid
    ) {
        if (typeof timestamp == "function")
            return [
                ["text", "fund_name", "Tên quỹ"],
                ["checkbox", "is_anb", "Số dư có thể âm"],
                ["number", "rrid", "Phần trăm nhận phân bổ thu nhập", { min: 0, max: 100 }],
                ["submit", "submit", "Tạo quỹ"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        else if (timestamp.constructor.name == "Object") {
            let fund = this.Data.data.funds[timestamp.id];

            let linked_baccs_html = [];
            for (let linked_bacc_id of fund.linked_baccs) {
                let linked_bacc = this.Data.data.baccs[linked_bacc_id];
                let html_title =
                    `Tên: ${linked_bacc.name.toUpperCase()}\n`
                    + `Loại: ${BACC_TYPES[linked_bacc.type]}\n`
                    + `Số dư: ${format_currency(linked_bacc.balance)}\n`;
                linked_baccs_html.push(`<span title="${html_title}">${linked_bacc.name}</span>`);
            }
            linked_baccs_html = linked_baccs_html.join(", ");

            return [
                "three_info",
                "fund",
                "sack-dollar",
                "Quỹ",
                fund.name,
                format_currency(fund.balance),
                [
                    ["Số dư có thể âm", "user-minus", `Số dư ${fund.is_anb ? "có" : "không"} thể âm`],
                    ["Tài khoản ngân hàng đã liên kết", "link", linked_baccs_html || "Không có"],
                    ["Phần trăm nhận phân bổ thu nhập", "percent", `${fund.rrid}%`]
                ],
                [
                    ["Chuyển tiền", "inbox-out", "O2O", [["source_id", "value", `F_${timestamp.id}`]]],
                    ["Thanh toán", "receipt", "OPm", [["object_id", "value", `F_${timestamp.id}`]]],
                    ["Cộng/trừ tiền", "bolt", "OPM", [["object_id", "value", `F_${timestamp.id}`]]],
                    ["Liên kết với tài khoản ngân hàng", "link", "F1B", [["fund_id", "value", timestamp.id]]],
                    ["Hủy liên kết với tài khoản ngân hàng", "unlink", "F0B", [["fund_id", "value", timestamp.id]]],
                    ["Xem nhật kí", "align-justify", false, `F_${timestamp.id}`],
                    ["Sửa thông tin", "pencil", "FEd", [
                        ["fund_id", "value", timestamp.id],
                        ["fund_name", "value", fund.name],
                        ["is_anb", "checked", fund.is_anb],
                        ["rrid", "value", fund.rrid]
                    ]],
                    ["Xóa", "trash", "FRm", [["fund_id", "value", timestamp.id]]]
                ]
            ];
        }

        if (this.error_checker({
            "RRID": { rrid }
        }))
            return false;

        this.Data.data.funds[String(timestamp)] = {
            name: fund_name,
            balance: 0,
            is_anb,
            linked_baccs: [],
            rrid,
            logs: [
                [timestamp, "sparkles", "var(--LEMON)",
                    `Tạo quỹ "${fund_name}" với số dư ${is_anb ? "có" : "không"} `
                    + `thể âm, nhận ${rrid}% phân bổ thu nhập`]
            ]
        };

        return arguments;
    }

    FEd(
        timestamp,
        Actions_code,
        fund_id,
        fund_name,
        is_anb,
        rrid
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "fund_id", "Quỹ", () => timestamp("fund")],
                ["text", "fund_name", "Tên quỹ"],
                ["checkbox", "is_anb", "Số dư có thể âm"],
                ["number", "rrid", "Phần trăm nhận phân bổ thu nhập", { min: 0, max: 100 }],
                ["submit", "submit", "Sửa thông tin quỹ"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        return this._edit_object_info(arguments, "fund", fund_id, [
            ["tên", "name", fund_name],
            ["số dư có thể âm", "is_anb", is_anb, new_value => new_value ? "có" : "không"],
            ["phần trăm nhận phân bổ thu nhập", "rrid", rrid, new_value => `${new_value}%`]
        ]);
    }

    FRm(
        timestamp,
        Actions_code,
        fund_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "fund_id", "Quỹ", () => timestamp("fund")],
                ["submit", "submit", "Xóa quỹ"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        if (this.error_checker({
            "FIND_FUND": { id: fund_id }
        }))
            return false;
        delete this.Data.data.funds[fund_id];
        return arguments;
    }

    BCr(
        timestamp,
        Actions_code,
        bacc_name,
        bacc_type
    ) {
        if (typeof timestamp == "function")
            return [
                ["text", "bacc_name", "Tên tài khoản ngân hàng"],
                ["select", "bacc_type", "Loại tài khoản ngân hàng", BACC_TYPES],
                ["submit", "submit", "Tạo tài khoản ngân hàng"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        else if (timestamp.constructor.name == "Object") {
            let bacc = this.Data.data.baccs[timestamp.id];

            let object_id_prefilled = [["object_id", "value", `B_${timestamp.id}`]];
            let bacc_id_prefilled = [["bacc_id", "value", timestamp.id]];
            let F0B_prefilled = [["fund_id", "value", bacc.linked_fund], ["bacc_id", "value", timestamp.id]];
            let source_id_prefilled = [["source_id", "value", `B_${timestamp.id}`]];
            let edit_prefilled = [
                ["bacc_id", "value", timestamp.id],
                ["bacc_name", "value", bacc.name],
                ["bacc_type", "value", bacc.type]
            ];
            const TYPE_SETTINGS = {
                "savings": ["bacc_savings", "piggy-bank", "Tài khoản tiết kiệm", [
                    ["Cộng/trừ tiền", "bolt", "OPM", object_id_prefilled],
                    ["Chuyển tiền", "inbox-out", "O2O", source_id_prefilled],
                    ["Thanh toán", "receipt", "OPm", object_id_prefilled],
                    ["Liên kết với quỹ", "link", "F1B", bacc_id_prefilled],
                    ["Hủy liên kết với quỹ", "unlink", "F0B", F0B_prefilled],
                    ["Xem nhật kí", "align-justify", false, `B_${timestamp.id}`],
                    ["Sửa thông tin", "pencil", "BEd", edit_prefilled],
                    ["Xóa", "trash", "BRm", bacc_id_prefilled]
                ]],
                "current": ["bacc_current", "wallet", "Tài khoản giao dịch", [
                    ["Thanh toán", "receipt", "OPm", object_id_prefilled],
                    ["Chuyển tiền", "inbox-out", "O2O", source_id_prefilled],
                    ["Cộng/trừ tiền", "bolt", "OPM", object_id_prefilled],
                    ["Liên kết với quỹ", "link", "F1B", bacc_id_prefilled],
                    ["Hủy liên kết với quỹ", "unlink", "F0B", F0B_prefilled],
                    ["Xem nhật kí", "align-justify", false, `B_${timestamp.id}`],
                    ["Sửa thông tin", "pencil", "BEd", edit_prefilled],
                    ["Xóa", "trash", "BRm", bacc_id_prefilled]
                ]],
                "credit": ["bacc_credit", "credit-card", "Tài khoản tín dụng", [
                    ["Thanh toán", "receipt", "OPm", object_id_prefilled],
                    ["Chuyển tiền", "inbox-out", "O2O", source_id_prefilled],
                    ["Cộng/trừ tiền", "bolt", "OPM", object_id_prefilled],
                    ["Liên kết với quỹ", "link", "F1B", bacc_id_prefilled],
                    ["Hủy liên kết với quỹ", "unlink", "F0B", F0B_prefilled],
                    ["Xem nhật kí", "align-justify", false, `B_${timestamp.id}`],
                    ["Sửa thông tin", "pencil", "BEd", edit_prefilled],
                    ["Xóa", "trash", "BRm", bacc_id_prefilled]
                ]]
            };

            let linked_fund_html = ``;
            if (bacc.linked_fund) {
                let linked_fund = this.Data.data.funds[bacc.linked_fund];
                let linked_fund_linked_baccs_text =
                    linked_fund.linked_baccs
                        .map(linked_bacc_id => this.Data.data.baccs[linked_bacc_id].name)
                        .join(", ");
                let html_title =
                    `Tên: ${linked_fund.name.toUpperCase()}\n`
                    + `Số dư có thể âm: Số dư ${linked_fund.is_anb ? "có" : "không"} thể âm\n`
                    + `Tài khoản ngân hàng đã liên kết: ${linked_fund_linked_baccs_text || "Không có"} \n`;
                + `Phần trăm nhận phân bổ thu nhập: ${linked_fund.rrid}%\n`;
                + `Số dư: ${format_currency(linked_fund.balance)} \n`;
                linked_fund_html = `<span title="${html_title}">${linked_fund.name}</span>`;
            }

            return [
                "one_info",
                TYPE_SETTINGS[bacc.type][0],
                TYPE_SETTINGS[bacc.type][1],
                TYPE_SETTINGS[bacc.type][2],
                bacc.name,
                format_currency(bacc.balance),
                [
                    ["Quỹ đã liên kết", "link", linked_fund_html || "Không có"]
                ],
                TYPE_SETTINGS[bacc.type][3]
            ];
        }

        this.Data.data.baccs[String(timestamp)] = {
            name: bacc_name,
            balance: 0,
            is_anb: bacc_type == "credit",
            type: bacc_type,
            linked_fund: null,
            logs: [
                [timestamp, "sparkles", "var(--LEMON)",
                    `Tạo tài khoản ${OBJECT_TYPES_NAME[bacc_type]} "${bacc_name}"`]
            ]
        };

        return arguments;
    }

    BEd(
        timestamp,
        Actions_code,
        bacc_id,
        bacc_name,
        bacc_type
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "bacc_id", "Tài khoản ngân hàng", () => timestamp("bacc")],
                ["text", "bacc_name", "Tên tài khoản ngân hàng"],
                ["select", "bacc_type", "Loại tài khoản ngân hàng", BACC_TYPES],
                ["submit", "submit", "Sửa thông tin tài khoản ngân hàng"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        return this._edit_object_info(arguments, "bacc", bacc_id, [
            ["tên", "name", bacc_name],
            ["loại tài khoản ngân hàng", "type", bacc_type, new_value => BACC_TYPES[new_value]]
        ]);
    }

    BRm(
        timestamp,
        Actions_code,
        bacc_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "bacc_id", "Tài khoản ngân hàng", () => timestamp("bacc")],
                ["submit", "submit", "Xóa tài khoản ngân hàng"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        if (this.error_checker({
            "FIND_BACC": { id: bacc_id }
        }))
            return false;
        delete this.Data.data.baccs[bacc_id];
        return arguments;
    }

    DCr(
        timestamp,
        Actions_code,
        debt_name,
        repayment_term,
        debtor
    ) {
        if (typeof timestamp == "function")
            return [
                ["text", "debt_name", "Tên khoản nợ"],
                ["datetime", "repayment_term", "Thời hạn trả nợ"],
                ["checkbox", "debtor", "Tôi là người nợ"],
                ["submit", "submit", "Tạo khoản nợ"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        else if (timestamp.constructor.name == "Object") {
            let debt = this.Data.data.debts[timestamp.id];
            return [
                "two_info",
                "debt",
                "badge-dollar",
                "Khoản nợ",
                debt.name,
                format_currency(debt.balance),
                [
                    ["Thời hạn trả nợ", "calendar-exclamation", format_time(debt.repayment_term)],
                    ["Người nợ", "user", `${debt.debtor ? "Tôi" : "Người khác"} là người nợ`]
                ],
                [
                    ["Cộng/trừ tiền", "bolt", "OPM", [["object_id", "value", `D_${timestamp.id}`]]],
                    ["Chuyển tiền", "inbox-out", "O2O", [["source_id", "value", `D_${timestamp.id}`]]],
                    ["Thanh toán", "receipt", "OPm", [["object_id", "value", `D_${timestamp.id}`]]],
                    ["Xem nhật kí", "align-justify", false, `D_${timestamp.id}`],
                    ["Sửa thông tin", "pencil", "DEd", [
                        ["debt_id", "value", timestamp.id],
                        ["debt_name", "value", debt.name],
                        ["repayment_term", "value", moment(debt.repayment_term).format("YYYY-MM-DDThh:mm")],
                        ["debtor", "checked", debt.debtor]
                    ]],
                    ["Xóa", "trash", "DRm", [["debt_id", "value", timestamp.id]]]
                ]
            ];
        }

        this.Data.data.debts[String(timestamp)] = {
            name: debt_name,
            repayment_term,
            debtor, /* true is me, false is other(s) */
            balance: 0,
            is_anb: true,
            logs: [
                [timestamp, "sparkles", "var(--LEMON)",
                    `Tạo khoản nợ "${debt_name}" với thời hạn trả nợ là `
                    + `${format_time(repayment_term)}, ${debtor ? "tôi" : "người khác"} là người nợ`]
            ]
        };

        return arguments;
    }

    DEd(
        timestamp,
        Actions_code,
        debt_id,
        debt_name,
        repayment_term,
        debtor
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "debt_id", "Khoản nợ", () => timestamp("debt")],
                ["text", "debt_name", "Tên khoản nợ"],
                ["datetime", "repayment_term", "Thời hạn trả nợ"],
                ["checkbox", "debtor", "Tôi là người nợ"],
                ["submit", "submit", "Sửa thông tin khoản nợ"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        return this._edit_object_info(arguments, "debt", debt_id, [
            ["tên", "name", debt_name],
            ["thời hạn trả nợ", "repayment_term", repayment_term, new_value => format_time[new_value]],
            ["người nợ", "debtor", debtor, new_value => new_value ? "tôi" : "người khác"]
        ]);
    }

    DRm(
        timestamp,
        Actions_code,
        debt_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "debt_id", "Khoản nợ", () => timestamp("debt")],
                ["submit", "submit", "Xóa khoản nợ"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];
        if (this.error_checker({
            "FIND_DEBT": { id: debt_id }
        }))
            return false;
        delete this.Data.data.debts[debt_id];
        return arguments;
    }

    O2O(
        timestamp,
        Actions_code,
        source_id,
        amount,
        content,
        target_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select_group", "source_id", "Đối tượng gửi", () => timestamp()],
                ["number", "repayment_term", "Số tiền", { min: 0 }],
                ["text", "content", "Nội dung"],
                ["select_group", "target_id", "Đối tượng nhận", () => timestamp()],
                ["submit", "submit", "Chuyển tiền"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];

        let source_type = OBJECT_TYPES_NAME[Actions_code.split("2")[0]];
        let target_type = OBJECT_TYPES_NAME[Actions_code.split("2")[1]];

        let error_checker_options = {};
        error_checker_options[`FIND_${source_type.toUpperCase()}`] =
            { id: source_id };
        error_checker_options[`FIND_${target_type.toUpperCase()}`] =
            { id: target_id };
        error_checker_options[`ENOUGH_BALANCE`] =
            { type: source_type.split("_")[0], id: source_id, min_balance: amount };
        if (this.error_checker(error_checker_options))
            return false;

        let source = this.Data.data[`${source_type}s`][source_id];
        source_type = source.type ? `${source_type}_${source.type}` : source_type;
        let target = this.Data.data[`${target_type}s`][target_id];
        target_type = target.type ? `${target_type}_${target.type}` : target_type;

        source.balance -= amount;
        source.logs.push([timestamp, "inbox-out", "var(--CHERRY)",
            `Chuyển ${format_currency(amount)} tới ${OBJECT_TYPES_NAME[target_type]} `
            + `"${target.name}" với nội dung "${content}"`]);

        target.balance += amount;
        target.logs.push([timestamp, "inbox-in", "var(--LIME)",
            `Nhận ${format_currency(amount)} từ ${OBJECT_TYPES_NAME[source_type]} `
            + `"${source.name}" với nội dung "${content}"`]);

        return arguments;
    }

    OPM(
        timestamp,
        Actions_code,
        object_id,
        amount,
        content
    ) {
        if (typeof timestamp == "function")
            return [
                ["select_group", "object_id", "Đối tượng", () => timestamp()],
                ["number", "amount", "Số tiền"],
                ["text", "content", "Nội dung"],
                ["submit", "submit", "Cộng/trừ tiền"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];

        let object_type = OBJECT_TYPES_NAME[Actions_code.split("")[0]];

        let error_checker_options = {};
        error_checker_options[`FIND_${object_type.toUpperCase()}`] =
            { id: object_id };
        if (amount < 0)
            error_checker_options[`ENOUGH_BALANCE`] =
                { type: object_type, id: object_id, min_balance: amount };
        if (this.error_checker(error_checker_options))
            return false;

        let object = this.Data.data[`${object_type}s`][object_id];
        object.balance += amount;
        if (amount >= 0)
            object.logs.push([timestamp, "inbox-in", "var(--LIME)",
                `Cộng ${format_currency(amount)} với nội dung "${content}"`]);
        else
            object.logs.push([timestamp, "inbox-out", "var(--CHERRY)",
                `Trừ ${format_currency(-amount)} với nội dung "${content}"`]);

        if (object.linked_fund) {
            let fund = this.Data.data.funds[object.linked_fund];
            fund.balance += amount;
            if (amount >= 0)
                fund.logs.push([timestamp, "inbox-in", "var(--LIME)",
                    `Cộng ${format_currency(amount)} (gián tiếp từ tài khoản `
                    + `${OBJECT_TYPES_NAME[object.type]} "${object.name}") với nội dung "${content}"`]);
            else
                fund.logs.push([timestamp, "inbox-out", "var(--CHERRY)",
                    `Trừ ${format_currency(-amount)} (gián tiếp từ tài khoản `
                    + `${OBJECT_TYPES_NAME[object.type]} "${object.name}") với nội dung "${content}"`]);
        }

        return arguments;
    }

    OPm(
        timestamp,
        Actions_code,
        object_id,
        amount,
        method,
        category,
        content
    ) {
        if (typeof timestamp == "function")
            return [
                ["select_group", "object_id", "Đối tượng", () => timestamp()],
                ["number", "amount", "Số tiền", { min: 0 }],
                ["select", "method", "Phương thức thanh toán", PAYMENT_METHODS],
                ["select", "category", "Loại thanh toán", PAYMENT_CATEGORIES],
                ["text", "content", "Nội dung"],
                ["submit", "submit", "Thanh toán"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];

        let object_type = OBJECT_TYPES_NAME[Actions_code.split("")[0]];

        let error_checker_options = {};
        error_checker_options[`FIND_${object_type.toUpperCase()}`] =
            { id: object_id };
        error_checker_options[`ENOUGH_BALANCE`] =
            { type: object_type, id: object_id, min_balance: amount };
        if (this.error_checker(error_checker_options))
            return false;

        let object = this.Data.data[`${object_type}s`][object_id];
        object.balance -= amount;
        object.logs.push([timestamp, "receipt", "var(--CHERRY)",
            `Thanh toán (bằng ${PAYMENT_METHODS[method]}) ${format_currency(amount)} `
            + `cho loại ${PAYMENT_CATEGORIES[category]} với nội dung "${content}"`]);

        return arguments;
    }

    F1B(
        timestamp,
        Actions_code,
        fund_id,
        bacc_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "fund_id", "Quỹ", () => timestamp("fund")],
                ["select", "bacc_id", "Tài khoản ngân hàng", () => timestamp("bacc")],
                ["submit", "submit", "Liên kết quỹ – tài khoản ngân hàng"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];

        if (this.error_checker({
            "FUND_BACC_LINKABLE": { fund_id, bacc_id }
        }))
            return false;

        let fund = this.Data.data.funds[fund_id];
        let bacc = this.Data.data.baccs[bacc_id];

        fund.linked_baccs.push(bacc_id);
        fund.logs.push([timestamp, "link", "var(--LIME)",
            `Liên kết với tài khoản ${OBJECT_TYPES_NAME[bacc.type]} "${bacc.name}"`]);

        bacc.linked_fund = fund_id;
        bacc.logs.push([timestamp, "link", "var(--LIME)",
            `Liên kết với quỹ "${fund.name}"`]);

        return arguments;
    }

    F0B(
        timestamp,
        Actions_code,
        fund_id,
        bacc_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "fund_id", "Quỹ", () => timestamp("fund")],
                ["select", "bacc_id", "Tài khoản ngân hàng", () => timestamp("bacc")],
                ["submit", "submit", "Hủy liên kết quỹ – tài khoản ngân hàng"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];

        if (this.error_checker({
            "FUND_BACC_UNLINKED": { fund_id, bacc_id }
        }))
            return false;

        let fund = this.Data.data.funds[fund_id];
        let bacc = this.Data.data.baccs[bacc_id];

        fund.linked_baccs.splice(fund.linked_baccs.indexOf(bacc_id), 1);
        fund.logs.push([timestamp, "unlink", "var(--CHERRY)",
            `Hủy liên kết với tài khoản ${OBJECT_TYPES_NAME[bacc.type]} "${bacc.name}"`]);

        bacc.linked_fund = null;
        bacc.logs.push([timestamp, "unlink", "var(--CHERRY)",
            `Hủy liên kết với quỹ "${fund.name}"`]);

        return arguments;
    }

    QID(
        timestamp,
        Actions_code,
        queue_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "queue_id", "Hàng đợi", () => timestamp("queue")],
                ["submit", "submit", "Phân bổ thu nhập"],
                ["cancel", "cancel", "Hủy bỏ"]
            ];

        const BASE_PENNY = 1000;

        if (this.error_checker({
            "FIND_QUEUE": { id: queue_id }
        }))
            return false;

        let queue = this.Data.data.queues[queue_id];
        let funds = this.Data.data.funds;
        let funds_and_rrids =
            Object.entries(funds)
                .filter(fund => fund[1].rrid)
                .map(fund => [fund[0], fund[1].rrid / 100]);

        let smallest_share = 0;
        let smallest_share_flag = false;
        while (!smallest_share_flag) {
            smallest_share += BASE_PENNY;
            smallest_share_flag =
                funds_and_rrids
                    .map(fund_and_rrid =>
                        ((smallest_share * fund_and_rrid[1]) % BASE_PENNY) == 0
                    ).every(test => test);
        }

        if (this.error_checker({
            "ENOUGH_BALANCE": { type: "queue", id: queue_id, min_balance: smallest_share }
        }))
            return false;

        let valid_balance = queue.balance - (queue.balance % smallest_share);
        let distribution_info =
            funds_and_rrids.map(fund_and_rrid => [
                fund_and_rrid[0],
                valid_balance * fund_and_rrid[1]
            ]);

        let queue_log_strings = [];
        let total_distribution_amount = 0;
        for (let [fund_id, distribution_amount] of distribution_info) {
            let fund = funds[fund_id];
            fund.balance += distribution_amount;
            total_distribution_amount += distribution_amount;
            queue.balance -= distribution_amount;
            fund.logs.push([timestamp, "inbox-in", "var(--LIME)",
                `Nhận phân bổ thu nhập ${format_currency(distribution_amount)} `
                + `từ hàng đợi "${queue.name}"`]);
            queue_log_strings.push(`${format_currency(distribution_amount)} tới quỹ "${fund.name}"`);
        }
        queue.logs.push([timestamp, "funnel-dollar", "var(--LEMON)",
            `Phân bổ thu nhập ${queue_log_strings.join(", ")} (tổng cộng `
            + `${format_currency(total_distribution_amount)})`]);

        return arguments;
    }
}

class Data {
    constructor(Notification, UI_changed_callback, get_set_endpoint) {
        this.Notification = Notification;
        this.Actions = new Actions(Notification, this);
        this.logs = [];
        this.data = {
            queues: {},
            funds: {},
            baccs: {},
            debts: {}
        };
        this.UI_changed_callback = UI_changed_callback;
        this.get_set_endpoint = get_set_endpoint;

        this.fetch_queue = [];
    }

    do_Actions(function_name, function_args) {
        function_args[0] = Date.now();
        let function_return = this.Actions[function_name](...function_args);
        if (function_return)
            this.logs.push(Object.values(function_return));
        this.UI_changed_callback();
        this.set_logs();
        return function_return;
    }

    parse_logs() {
        for (let log of this.logs) {
            let function_name = log[1];
            if (/[QFBD]2[QFBD]/g.test(function_name))
                function_name = "O2O";
            else if (function_name.endsWith("PM"))
                function_name = "OPM";
            else if (function_name.endsWith("Pm"))
                function_name = "OPm";
            let parse_response = this.Actions[function_name](...log);
            if (!parse_response) {
                this.Notification.notify("DATA__CANT_PARSE_LOG");
                for (let key of Object.keys(this.data))
                    this.data[key] = {};
                return false;
            }
        }
        this.UI_changed_callback();
        this.Notification.notify("DATA__PARSED_LOG");
        return true;
    }

    get_logs() {
        let password = prompt(`Nhập mật khẩu:`);
        if (!password) {
            this.Notification.notify("DATA__MISSING_PASSWORD");
            return false;
        }
        let get_set_endpoint =
            CryptoJS.AES.decrypt(this.get_set_endpoint, password)
                .toString(CryptoJS.enc.Utf8);
        if (!get_set_endpoint) {
            this.Notification.notify("DATA__WRONG_PASSWORD");
            return false;
        }
        this.get_set_endpoint = get_set_endpoint;

        fetch(get_set_endpoint)
            .then(response => {
                if (response.ok)
                    return response.json();
                else {
                    this.Notification.notify("DATA__FAILED_FETCH");
                    return false;
                }
            })
            .then(json => {
                if (json) {
                    this.logs = json;
                    this.parse_logs();
                }
            });

        return true;
    }

    set_logs() {
        this.fetch_queue.push({
            url: this.get_set_endpoint,
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: JSON.stringify(this.logs) })
            },
            callback: () => this.Notification.notify("DATA__SAVED"),
            fetching: false
        });
        this.process_fetch_queue();
        return true;
    }

    process_fetch_queue() {
        let ready_for_next_fetch =
            this.fetch_queue[0] && this.fetch_queue.every(item => !item.fetching);
        if (!ready_for_next_fetch) return;

        this.fetch_queue[0].fetching = true;
        this.fetch(
            this.fetch_queue[0].url,
            this.fetch_queue[0].options,
            () => {
                let shifted_item = this.fetch_queue.shift();
                shifted_item.callback();
                this.process_fetch_queue();
            }
        );
    }

    fetch(url, options, callback) {
        window.onbeforeunload = () => true;
        fetch(url, options)
            .then(() => {
                window.onbeforeunload = false;
                callback();
            });
    }
}

class Notification {
    constructor() {

    }

    notify(code) {
        console.log(NOTIFICATION_TEXTS[code]);
        alert(NOTIFICATION_TEXTS[code]);
        return true;
    }

    validate(code, args) {
        switch (code) {
            case "FIND_QUEUE": {
                if (Object.keys(args.Data.data.queues)
                    .includes(args.id))
                    return true;
                this.notify("CANT_FIND_QUEUE");
                return false;
            }

            case "FIND_FUND": {
                if (Object.keys(args.Data.data.funds)
                    .includes(args.id))
                    return true;
                this.notify("CANT_FIND_FUND");
                return false;
            }

            case "FIND_BACC": {
                if (Object.keys(args.Data.data.baccs)
                    .includes(args.id))
                    return true;
                this.notify("CANT_FIND_BACC");
                return false;
            }

            case "FIND_DEBT": {
                if (Object.keys(args.Data.data.debts)
                    .includes(args.id))
                    return true;
                this.notify("CANT_FIND_DEBT");
                return false;
            }

            case "ENOUGH_BALANCE": {
                if (!this.validate(`FIND_${args.type.toUpperCase()}`, args))
                    return false;

                let object = args.Data.data[`${args.type}s`][args.id];
                if (object.is_anb)
                    return true;

                let is_enough_balance =
                    (object.balance - args.min_balance) >= 0;
                if (!is_enough_balance)
                    this.notify("NOT_ENOUGH_BALANCE");
                return is_enough_balance;
            }

            case "FUND_BACC_LINKABLE": {
                if (
                    !this.validate("FIND_FUND", { Data: args.Data, id: args.fund_id })
                    || !this.validate("FIND_BACC", { Data: args.Data, id: args.bacc_id })
                )
                    return false;

                let fund = args.Data.data.funds[args.fund_id];
                let bacc = args.Data.data.baccs[args.bacc_id];

                if (fund.is_anb != bacc.is_anb) {
                    this.notify("FUND_BACC_UNLINKABLE__DIFFERENT_ON_ANB");
                    return false;
                } else if (fund.linked_baccs.includes(args.bacc_id)) {
                    this.notify("FUND_BACC_UNLINKABLE__ALREADY_LINKED");
                    return false;
                } else if (bacc.linked_fund) {
                    this.notify("FUND_BACC_UNLINKABLE__BACC_ON_OTHER_LINK");
                    return false;
                }

                return true;
            }

            case "FUND_BACC_UNLINKED": {
                if (
                    !this.validate("FIND_FUND", { Data: args.Data, id: args.fund_id })
                    || !this.validate("FIND_BACC", { Data: args.Data, id: args.bacc_id })
                )
                    return false;

                let fund = args.Data.data.funds[args.fund_id];
                let bacc = args.Data.data.baccs[args.bacc_id];
                let is_linking =
                    fund.linked_baccs.includes(args.bacc_id)
                    && bacc.linked_fund == args.fund_id;

                if (!is_linking)
                    this.notify("CANT_FUND_BACC_UNLINK__NOT_LINKING");
                return is_linking;
            }

            case "RRID": {
                let funds = args.Data.data.funds;
                let current_accumulated_rrid =
                    Object.values(funds).reduce(
                        (accumulator, current_fund) =>
                            accumulator + current_fund.rrid,
                        0
                    );
                let is_out_of_rrid_space =
                    (current_accumulated_rrid + args.rrid) > 100;
                if (is_out_of_rrid_space)
                    this.notify("OUT_OF_RRID_SPACE");
                return !is_out_of_rrid_space;
            }

            case "EDIT": {
                if (!this.validate(`FIND_${args.type.toUpperCase()}`, args))
                    return false;

                let object = args.Data.data[`${args.type}s`][args.id];
                for (let [index, [title, name, new_value, some_function]] of Object.entries(args.edit_data)) {
                    if ((name == "is_anb" && new_value == false && object.balance < 0)
                        || (args.type == "bacc" && name == "type" && new_value != "credit" && object.balance < 0)) {
                        this.notify("CANT_CHANGE_ANB_WHEN_BALANCE_IS_NEGATIVE");
                        return false;
                    }

                    args.edit_data[index] = [
                        title,
                        name,
                        object[name] != new_value,
                        object[name],
                        new_value,
                        some_function
                    ];
                }

                if (args.edit_data.every(test => !test[2])) {
                    this.notify("NO_CHANGE_IN_EDITING");
                    return false;
                }

                return args.edit_data;
            }

            default: {
                return false;
            }
        }
    }
}

class Actions_Form {
    constructor(Notification, Data, form_elm, submit_callback, cancel_callback) {
        this.Notification = Notification;
        this.Data = Data;
        this.form_elm = form_elm;
        this.submit_callback = submit_callback;
        this.cancel_callback = cancel_callback;
    }

    get_object_list(type) {
        if (type)
            return Object.fromEntries(
                Object.entries(this.Data.data[`${type}s`])
                    .map(object => [object[0], object[1].name])
            );
        else
            return {
                "Hàng đợi":
                    Object.entries(this.Data.data.queues)
                        .map(object => [`Q_${object[0]}`, object[1].name]),
                "Quỹ":
                    Object.entries(this.Data.data.funds)
                        .map(object => [`F_${object[0]}`, object[1].name]),
                "Tài khoản tiết kiệm":
                    Object.entries(this.Data.data.baccs)
                        .filter(bacc => bacc[1].type == "savings")
                        .map(object => [`B_${object[0]}`, object[1].name]),
                "Tài khoản giao dịch":
                    Object.entries(this.Data.data.baccs)
                        .filter(bacc => bacc[1].type == "current")
                        .map(object => [`B_${object[0]}`, object[1].name]),
                "Tài khoản tín dụng":
                    Object.entries(this.Data.data.baccs)
                        .filter(bacc => bacc[1].type == "credit")
                        .map(object => [`B_${object[0]}`, object[1].name]),
                "Khoản nợ":
                    Object.entries(this.Data.data.debts)
                        .map(object => [`D_${object[0]}`, object[1].name])
            };
    }

    xADOM(elm_type, name, title, data) {
        /* Extended PPPL_JS.ADOM for Actions_Form */

        if (typeof data == "function")
            data = data();

        switch (elm_type) {
            case "Actions_code": {
                return PPPL_JS.ADOM(["input", {
                    type: "text",
                    name: name,
                    value: data,
                    style: "display: none",
                    required: true
                }, null, null], document);
            }

            case "text": {
                return PPPL_JS.ADOM(["input", {
                    type: "text",
                    name: name,
                    placeholder: `${title} *`,
                    title: `${title} *`,
                    required: true
                }, null, null], document);
            }

            case "submit": {
                let elm = PPPL_JS.ADOM(["button", {
                    title: title,
                    name: name,
                    style: "--base_color: var(--LIME);"
                }, {
                        innerHTML: title
                    }, null], document);
                elm.onclick = event => {
                    event.preventDefault();
                    if (this.submit_form())
                        this.submit_callback(this);
                };
                return elm;
            }

            case "cancel": {
                let elm = PPPL_JS.ADOM(["button", {
                    title: title,
                    name: name,
                    style: "--base_color: var(--CHERRY);"
                }, {
                        innerHTML: title
                    }, null], document);
                elm.onclick = event => {
                    event.preventDefault();
                    this.cancel_callback(this);
                };
                return elm;
            }

            case "checkbox": {
                return [
                    PPPL_JS.ADOM(["input", {
                        type: "checkbox",
                        name: name,
                        id: name,
                        title: title
                    }, null, null], document),

                    PPPL_JS.ADOM(["label", {
                        for: name, title: title
                    }, {
                            innerHTML: title
                        }, null], document),
                ];
            }

            case "number": {
                return PPPL_JS.ADOM([
                    "input",
                    Object.assign({
                        type: "number",
                        name: name,
                        placeholder: `${title} *`,
                        title: `${title} *`,
                        required: true
                    }, data || {}),
                    null,
                    null
                ], document);
            }

            case "select": {
                let option_ADOMs = [];
                option_ADOMs.push(["option", {
                    value: "", disabled: true, selected: true
                }, `${title} *`, null]);
                for (let [value, title] of Object.entries(data))
                    option_ADOMs.push(["option", { value }, { innerHTML: title }, null]);
                return PPPL_JS.ADOM(["select", {
                    name: name, title: `${title} *`, required: true
                }, null, option_ADOMs], document);
            }

            case "datetime": {
                return PPPL_JS.ADOM(["input", {
                    type: "datetime-local",
                    name: name,
                    placeholder: `${title} *`,
                    title: `${title} *`,
                    required: true
                }, null, null], document);
            }

            case "select_group": {
                let select_ADOM_children = [];

                select_ADOM_children.push([
                    "option",
                    {
                        value: "",
                        disabled: true,
                        selected: true
                    },
                    {
                        innerHTML: `${title} *`
                    },
                    null
                ]);

                for (let [optgroup_name, optgroup_data] of Object.entries(data)) {
                    let optgroup_ADOM_children = [];

                    for (let [object_id, object_name] of optgroup_data)
                        optgroup_ADOM_children.push([
                            "option",
                            { value: object_id },
                            { innerHTML: object_name },
                            null
                        ]);

                    select_ADOM_children.push([
                        "optgroup",
                        { label: optgroup_name },
                        null,
                        optgroup_ADOM_children
                    ]);
                }

                return PPPL_JS.ADOM([
                    "select",
                    {
                        name: name,
                        title: `${title} *`,
                        required: true
                    },
                    null,
                    select_ADOM_children
                ], document);
            }
        }
    }

    generate_form(Actions_code) {
        let xADOM_args_list = this.Data.Actions[Actions_code](type => this.get_object_list(type));
        xADOM_args_list.unshift(["Actions_code", "Actions_code", "Mã hành động", Actions_code]);
        for (let xADOM_args of xADOM_args_list) {
            let elms = this.xADOM(...xADOM_args);
            if (elms.constructor.name != "Array")
                elms = [elms];
            for (let elm of elms)
                this.form_elm.appendChild(elm);
        }
        return true;
    }

    submit_form() {
        let Actions_function_args = [null];

        let elms = this.form_elm.querySelectorAll("*[name]");
        for (let elm of elms) {
            if (elm.tagName == "BUTTON")
                continue;

            if (elm.required && elm.value == "") {
                elm.focus();
                this.Notification.notify("ACTIONS_FORM__EMPTY_REQUIRED_FIELD");
                return false;
            }

            if (elm.tagName == "INPUT" && elm.type == "checkbox")
                Actions_function_args.push(elm.checked);
            else if (elm.tagName == "INPUT" && elm.type == "number")
                Actions_function_args.push(Number(elm.value));
            else if (elm.tagName == "INPUT" && elm.type == "datetime-local")
                Actions_function_args.push((new Date(elm.value)).getTime());
            else
                Actions_function_args.push(elm.value);
        }

        let Actions_function_name = Actions_function_args[1];

        if (Actions_function_name == "O2O") {
            let [source_type, source_id] = Actions_function_args[2].split("_");
            let [target_type, target_id] = Actions_function_args[5].split("_");
            Actions_function_args[1] = `${source_type}2${target_type}`;
            Actions_function_args[2] = source_id;
            Actions_function_args[5] = target_id;
        } else if (Actions_function_name == "OPM"
            || Actions_function_name == "OPm") {
            let [object_type, object_id] = Actions_function_args[2].split("_");
            Actions_function_args[1] = Actions_function_name.replace("O", object_type);
            Actions_function_args[2] = object_id;
        }

        return this.Data.do_Actions(Actions_function_name, Actions_function_args);
    }
}

class UI {
    constructor(Notification, Data, elms) {
        this.Notification = Notification;
        this.Data = Data;
        this.elms = elms;
        this.Actions_Form = new Actions_Form(
            this.Notification,
            this.Data,
            this.elms.Actions_popup.querySelector("form"),
            () => this.close_Actions_popup(),
            () => this.close_Actions_popup()
        );

        this.bind_header_buttons();
    }

    bind_header_buttons() {
        const HEADER_BUTTONS_FUNCTIONS = [
            () => this.open_Actions_popup("QCr"),
            () => this.open_Actions_popup("FCr"),
            () => this.open_Actions_popup("BCr", [["bacc_type", "value", "savings"]]),
            () => this.open_Actions_popup("BCr", [["bacc_type", "value", "current"]]),
            () => this.open_Actions_popup("BCr", [["bacc_type", "value", "credit"]]),
            () => this.open_Actions_popup("DCr")
        ];

        let buttons = this.elms.header_buttons.querySelectorAll("button");
        for (let [index, button] of Object.entries(buttons))
            button.onclick = HEADER_BUTTONS_FUNCTIONS[index];
    }

    open_popup(popup_elm, title, close_callback) {
        popup_elm.querySelector(".title").innerText = title;
        popup_elm.querySelector(".close_button").onclick = close_callback;

        popup_elm.style.display = "flex";
        popup_elm.querySelector(".main")
            .animate([
                { transform: "scale(0)" },
                { transform: "scale(1)" },
            ], {
                duration: 250,
                iterations: 1,
            });

        return true;
    }

    close_popup(popup_elm, closed_callback) {
        popup_elm.querySelector(".main")
            .animate([
                { transform: "scale(1)" },
                { transform: "scale(0)" },
            ], {
                duration: 250,
                iterations: 1,
            });
        setTimeout(() => {
            popup_elm.style.display = "none";
            closed_callback();
        }, 250);
        return true;
    }

    open_Actions_popup(Actions_code, prefilled) {
        this.elms.Actions_popup.querySelector("form").innerHTML = "";
        this.Actions_Form.generate_form(Actions_code);
        if (prefilled)
            for (let [elm_name, attribute_name, value] of prefilled)
                this.elms.Actions_popup.querySelector(`*[name="${elm_name}"]`)[attribute_name] = value;
        this.open_popup(
            this.elms.Actions_popup,
            this.elms.Actions_popup.querySelector("button[name='submit']").innerText,
            () => this.close_Actions_popup()
        );
        this.elms.Actions_popup.querySelector("form *:nth-child(2)").focus();
        return true;
    }

    close_Actions_popup() {
        this.close_popup(this.elms.Actions_popup, () => {
            this.elms.Actions_popup.querySelector("form").innerHTML = "";
        });
        return true;
    }

    generate_object_card(type_name, object_id) {
        const swap_object_key_value = o => Object.entries(o).reduce((r, [k, v]) => (r[v] = k, r), {});

        let type_shortcode = swap_object_key_value(OBJECT_TYPES_NAME)[type_name];
        let object_card_info = this.Data.Actions[`${type_shortcode}Cr`]({ type: type_name, id: object_id });

        let object_card = document.createElement("div");
        object_card.classList.add("object_card", object_card_info[0], object_card_info[1]);

        let type_icon = document.createElement("div");
        type_icon.classList.add("type_icon");
        let type_icon_icon = document.createElement("i");
        type_icon_icon.classList.add("fas", `fa-${object_card_info[2]}`);
        type_icon.appendChild(type_icon_icon);
        object_card.appendChild(type_icon);

        let type_title = document.createElement("div");
        type_title.classList.add("type_title");
        type_title.innerHTML = object_card_info[3];
        object_card.appendChild(type_title);

        let name = document.createElement("div");
        name.classList.add("name");
        name.innerHTML = object_card_info[4];
        object_card.appendChild(name);

        let balance = document.createElement("div");
        balance.classList.add("balance");
        balance.innerHTML = object_card_info[5];
        object_card.appendChild(balance);

        if (object_card_info[6])
            for (let [title, icon, description] of object_card_info[6]) {
                let info_icon = document.createElement("div");
                info_icon.classList.add("info_icon");
                info_icon.title = title;
                let info_icon_icon = document.createElement("i");
                info_icon_icon.classList.add("fas", `fa-${icon}`);
                info_icon.appendChild(info_icon_icon);
                object_card.appendChild(info_icon);

                let info_description = document.createElement("div");
                info_description.classList.add("info_description");
                info_description.innerHTML = description;
                object_card.appendChild(info_description);
            }

        let buttons = document.createElement("div");
        buttons.classList.add("buttons");
        for (let [title, icon, Actions_code, prefiled_options] of object_card_info[7]) {
            let button = document.createElement("button");
            button.title = title;
            button.onclick = () => {
                if (Actions_code)
                    this.open_Actions_popup(Actions_code, prefiled_options);
                else
                    this.open_logs_viewer(type_name, prefiled_options);
            };
            let button_icon = document.createElement("i");
            button_icon.classList.add("fas", `fa-${icon}`);
            button.appendChild(button_icon);
            buttons.appendChild(button);
        }
        object_card.appendChild(buttons);

        return object_card;
    }

    reset_object_card_list() {
        this.elms.object_card_list.textContent = "";
        return true;
    }

    update_object_card_list() {
        this.reset_object_card_list();
        for (let [type_name, objects] of Object.entries(this.Data.data))
            for (let object_id of Object.keys(objects))
                this.elms.object_card_list.appendChild(
                    this.generate_object_card(type_name.replace(/s$/g, ""), object_id)
                );
        new Masonry(this.elms.object_card_list, {
            itemSelector: ".object_card",
            gutter: 10,
            fitWidth: true
        });
        return true;
    }

    open_logs_viewer(type_name, object_id) {
        const reverse_array = array => {
            let ret = new Array;
            for (let i = array.length - 1; i >= 0; i--)
                ret.push(array[i]);
            return ret;
        }

        this.elms.logs_popup.querySelector("table").innerHTML = "";

        let object = this.Data.data[`${type_name}s`][object_id.split("_")[1]];
        let formatted_type_name = type_name + (object.type ? `_${object.type}` : "");

        let table_elm = this.elms.logs_popup.querySelector("table");
        for (let log of reverse_array(object.logs)) {
            let tr_elm = document.createElement("tr");

            let timestamp_td_elm = document.createElement("td");
            timestamp_td_elm.innerText = format_time(log[0]);
            tr_elm.appendChild(timestamp_td_elm);

            let icon_td_elm = document.createElement("td");
            icon_td_elm.style = `color: ${log[2]};`;
            let icon_elm = document.createElement("i");
            icon_elm.classList.add("fas", `fa-${log[1]}`);
            icon_td_elm.appendChild(icon_elm);
            tr_elm.appendChild(icon_td_elm);

            let content_td_elm = document.createElement("td");
            content_td_elm.innerHTML = log[3];
            tr_elm.appendChild(content_td_elm);

            table_elm.appendChild(tr_elm);
        }

        this.open_popup(
            this.elms.logs_popup,
            `Nhật kí ${OBJECT_TYPES_NAME[formatted_type_name]} "${object.name}"`,
            () => this.close_popup(this.elms.logs_popup, () => {
                this.elms.logs_popup.querySelector("table").innerHTML = "";
            })
        );

        return true;
    }
}