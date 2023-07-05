/**
  * ===== ABBREVIATION =====
  * iwd: income waiting to be distributed into funds
  * anb: allow negative balance
  * args: arguments
  * rrid: rate of receiving income distribution (n% out of 100%)
  * bacc: bank account
  * elm: element
  */

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
    "credit": "ín dụng",
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
    "mandatory_recurring_spending": "Chi tiêu định kì bắt buộc",
    "nonmandatory_recurring_spending": "Chi tiêu định kì không bắt buộc",
    "essential_spending": "Chi tiêu thiết yếu",
    "consumption_spending": "Chi tiêu hưởng thụ",
    "other_payment": "Thanh toán khác"
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
    "DATA__CANT_PARSE_LOG": "Không thể phân tích nhật ký!",
    "ACTION_FORM__EMPTY_REQUIRED_FIELD": "Vui lòng điền hết những ô bắt buộc (có đánh dấu *)!",
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

    _edit_object_info(type, id, edit_data) {
        let changes = this.Notification.validate("EDIT", { Data: this.data, type, id, edit_data });
        if (!changes) return false;

        let object = this.Data.data[`${type}s`][id];

        let log_messages = [];
        for (let [title, name, is_changed, , new_value, new_value_formatter] of changes)
            if (is_changed) {
                object[name] = new_value;
                if (new_value_formatter)
                    log_messages.push(`${title} thành <b>${new_value_formatter(new_value)}</b>`);
                else
                    log_messages.push(`${title} thành <b>${new_value}</b>`);
                if (type == "bacc" && name == "type")
                    object.is_anb = new_value == "credit";
            }

        object.logs.push(
            [timestamp, "fas fa-pencil", "var(--BLUE)",
                `Thay đổi ${log_messages.join(", ")}`
            ]);

        return arguments;
    }

    QCr(
        timestamp,
        action_code,
        queue_name
    ) {
        if (typeof timestamp == "function")
            return [
                ["text", "queue_name", "Tên hành đợi"],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Tạo hàng đợi"]
            ];

        this.Data.data.queues[String(timestamp)] = {
            name: queue_name,
            balance: 0,
            logs: [
                [timestamp, "fas fa-sparkles", "var(--LEMON)",
                    `Tạo hàng đợi <b>${queue_name}</b>`]
            ]
        };

        return arguments;
    }

    QEd(
        timestamp,
        action_code,
        queue_id,
        queue_name
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "queue_id", "Hàng đợi", () => timestamp("queue")],
                ["text", "queue_name", "Tên hành đợi"],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Sửa thông tin hàng đợi"]
            ];
        return this._edit_object_info("queue", queue_id, [
            ["tên", "name", queue_name]
        ]);
    }

    QRm(
        timestamp,
        action_code,
        queue_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "queue_id", "Hàng đợi", () => timestamp("queue")],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Xóa hàng đợi"]
            ];
        if (this.error_checker({
            "FIND_QUEUE": { id: queue_id }
        }))
            return false;
        this.Data.data.queues.splice(this.Data.data.queues.indexOf(queue_id), 1);
        return arguments;
    }

    FCr(
        timestamp,
        action_code,
        fund_name,
        is_anb,
        rrid
    ) {
        if (typeof timestamp == "function")
            return [
                ["text", "fund_name", "Tên quỹ"],
                ["checkbox", "is_anb", "Số dư có thể âm"],
                ["number", "rrid", "Phần trăm nhận phân bổ thu nhập", { min: 0, max: 100 }],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Tạo hàng đợi"]
            ];

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
                [timestamp, "fas fa-sparkles", "var(--LEMON)",
                    `Tạo quỹ <b>${fund_name}</b> với số dư ${is_anb ? "CÓ" : "KHÔNG"} `
                    + `thể âm, ${rrid}% nhận phân bổ thu nhập`]
            ]
        };

        return arguments;
    }

    FEd(
        timestamp,
        action_code,
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
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Sửa thông tin quỹ"]
            ];
        return this._edit_object_info("fund", fund_id, [
            ["tên", "name", fund_name],
            ["số dư có thể âm", "is_anb", is_anb, new_value => new_value ? "CÓ" : "KHÔNG"],
            ["phần trăm nhận phân bổ thu nhập", "rrid", rrid]
        ]);
    }

    FRm(
        timestamp,
        action_code,
        fund_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "fund_id", "Quỹ", () => timestamp("fund")],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Xóa Quỹ"]
            ];
        if (this.error_checker({
            "FIND_QUEUE": { id: fund_id }
        }))
            return false;
        this.Data.data.funds.splice(this.Data.data.funds.indexOf(fund_id), 1);
        return arguments;
    }

    BCr(
        timestamp,
        action_code,
        bacc_name,
        bacc_type
    ) {
        if (typeof timestamp == "function")
            return [
                ["text", "bacc_name", "Tên tài khoản ngân hàng"],
                ["select", "bacc_type", "Loại tài khoản ngân hàng", BACC_TYPES],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Tạo tài khoản ngân hàng"]
            ];

        this.Data.data.baccs[String(timestamp)] = {
            name: bacc_name,
            balance: 0,
            is_anb: bacc_type == "credit",
            type: bacc_type,
            linked_fund: null,
            logs: [
                [timestamp, "fas fa-sparkles", "var(--LEMON)",
                    `Tạo tài khoản ${OBJECT_TYPES_NAME[bacc_type]} <b>${bacc_name}</b>`]
            ]
        };

        return arguments;
    }

    BEd(
        timestamp,
        action_code,
        bacc_id,
        bacc_name,
        bacc_type
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "bacc_id", "Tài khoản ngân hàng", () => timestamp("bacc")],
                ["text", "bacc_name", "Tên tài khoản ngân hàng"],
                ["select", "bacc_type", "Loại tài khoản ngân hàng", BACC_TYPES],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Sửa thông tin tài khoản ngân hàng"]
            ];
        return this._edit_object_info("bacc", bacc_id, [
            ["tên", "name", bacc_name],
            ["loại tài khoản ngân hàng", "type", bacc_type, new_value => BACC_TYPES[new_value]]
        ]);
    }

    BRm(
        timestamp,
        action_code,
        bacc_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "bacc_id", "Tài khoản ngân hàng", () => timestamp("bacc")],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Xóa tài khoản ngân hàng"]
            ];
        if (this.error_checker({
            "FIND_QUEUE": { id: bacc_id }
        }))
            return false;
        this.Data.data.baccs.splice(this.Data.data.baccs.indexOf(bacc_id), 1);
        return arguments;
    }

    DCr(
        timestamp,
        action_code,
        debt_name,
        repayment_term,
        debtor
    ) {
        if (typeof timestamp == "function")
            return [
                ["text", "debt_name", "Tên khoản nợ"],
                ["datetime", "repayment_term", "Thời hạn trả nợ"],
                ["checkbox", "debtor", "Tôi là người nợ"],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Tạo khoản nợ"]
            ];

        this.Data.data.debts[String(timestamp)] = {
            name: debt_name,
            repayment_term,
            debtor, /* true is me, false is other(s) */
            balance: 0,
            is_anb: true,
            logs: [
                [timestamp, "fas fa-sparkles", "var(--LEMON)",
                    `Tạo khoản nợ <b>${debt_name}</b> với thời hạn trả nợ là `
                    + `${format_time(repayment_term)}, ${debtor ? "tôi" : "người khác"} là người nợ`]
            ]
        };

        return arguments;
    }

    DEd(
        timestamp,
        action_code,
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
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Sửa thông tin khoản nợ"]
            ];
        return this._edit_object_info("debt", debt_id, [
            ["tên", "name", debt_name],
            ["thời hạn trả nợ", "repayment_term", repayment_termm, new_value => format_time[new_value]],
            ["người nợ", "debtor", debtor, new_value => new_value ? "tôi" : "người khác"]
        ]);
    }

    DRm(
        timestamp,
        action_code,
        debt_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "debt_id", "Khoản nợ", () => timestamp("debt")],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Xóa khoản nợ"]
            ];
        if (this.error_checker({
            "FIND_QUEUE": { id: debt_id }
        }))
            return false;
        this.Data.data.debts.splice(this.Data.data.debts.indexOf(debt_id), 1);
        return arguments;
    }

    O2O(
        timestamp,
        action_code,
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
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Chuyển tiền"]
            ];

        let source_type = OBJECT_TYPES_NAME[action_code.split("2")[0]];
        let target_type = OBJECT_TYPES_NAME[action_code.split("2")[1]];

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
        source.logs.push([timestamp, "fas fa-inbox-out", "var(--CHERRY)",
            `Chuyển <b>${format_currency(amount)}</b> tới ${OBJECT_TYPES_NAME[target_type]}`
            + ` <b>${target.name}</b> với nội dung "<i>${content}</i>"`]);

        target.balance += amount;
        target.logs.push([timestamp, "fas fa-inbox-in", "var(--LIME)",
            `Nhận <b>${format_currency(amount)}</b> từ ${OBJECT_TYPES_NAME[source_type]}`
            + ` <b>${source.name}</b> với nội dung "<i>${content}</i>"`]);

        return arguments;
    }

    OPM(
        timestamp,
        action_code,
        object_id,
        amount,
        content
    ) {
        if (typeof timestamp == "function")
            return [
                ["select_group", "object_id", "Đối tượng", () => timestamp()],
                ["number", "amount", "Số tiền"],
                ["text", "content", "Nội dung"],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Cộng/trừ tiền"]
            ];

        let object_type = OBJECT_TYPES_NAME[action_code.split("")[0]];

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
            object.logs.push([timestamp, "fas fa-inbox-in", "var(--LIME)",
                `Cộng <b>${format_currency(amount)}</b> với nội dung "<i>${content}</i>"`]);
        else
            object.logs.push([timestamp, "fas fa-inbox-out", "var(--CHERRY)",
                `Trừ <b>${format_currency(-amount)}</b> với nội dung "<i>${content}</i>"`]);

        if (object.linked_fund) {
            let fund = this.Data.data.funds[object.linked_fund];
            fund.balance += amount;
            if (amount >= 0)
                fund.logs.push([timestamp, "fas fa-inbox-in", "var(--LIME)",
                    `Cộng <b>${format_currency(amount)}</b> (gián tiếp từ tài khoản `
                    + `${OBJECT_TYPES_NAME[object.type]} ${object.name}) với nội dung "<i>${content}</i>"`]);
            else
                fund.logs.push([timestamp, "fas fa-inbox-out", "var(--CHERRY)",
                    `Trừ <b>${format_currency(-amount)}</b> (gián tiếp từ tài khoản `
                    + `${OBJECT_TYPES_NAME[object.type]} ${object.name}) với nội dung "<i>${content}</i>"`]);
        }

        return arguments;
    }

    OPm(
        timestamp,
        action_code,
        object_id,
        amount,
        method,
        category,
        content
    ) {
        if (typeof timestamp == "function")
            return [
                ["select_group", "object_id", "Đối tượng", () => timestamp()],
                ["number", "amount", "Số tiền"],
                ["select", "method", "Phương thức thanh toán", PAYMENT_METHODS],
                ["select", "category", "Loại thanh toán", PAYMENT_CATEGORIES],
                ["text", "content", "Nội dung"],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Thanh toán"]
            ];

        let object_type = OBJECT_TYPES_NAME[action_code.split("")[0]];

        let error_checker_options = {};
        error_checker_options[`FIND_${object_type.toUpperCase()}`] =
            { id: object_id };
        error_checker_options[`ENOUGH_BALANCE`] =
            { type: object_type, id: object_id, min_balance: amount };
        if (this.error_checker(error_checker_options))
            return false;

        let object = this.Data.data[`${object_type}s`][object_id];
        object.balance -= amount;
        object.logs.push([timestamp, "fas fa-receipt", "var(--CHERRY)",
            `Thanh toán (bằng ${PAYMENT_METHODS[method]}) <b>${format_currency(amount)}</b>`
            + ` cho loại <i>${PAYMENT_CATEGORIES[category]}</i> với nội dung "<i>${content}</i>"`]);

        return arguments;
    }

    F1B(
        timestamp,
        action_code,
        fund_id,
        bacc_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "fund_id", "Quỹ", () => timestamp("fund")],
                ["select", "bacc_id", "Tài khoản ngân hàng", () => timestamp("bacc")],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Liên kết quỹ – tài khoản ngân hàng"]
            ];

        if (this.error_checker({
            "FIND_FUND": { id: fund_id },
            "FIND_BACC": { id: bacc_id }
        }))
            return false;

        let fund = this.Data.data.funds[fund_id];
        let bacc = this.Data.data.baccs[bacc_id];

        fund.linked_baccs.push(bacc_id);
        fund.logs.push([timestamp, "fas fa-link", "var(--LIME)",
            `Liên kết với tài khoản ${OBJECT_TYPES_NAME[bacc.type]} <b>${bacc.name}<b/>`]);

        bacc.linked_fund = fund_id;
        bacc.logs.push([timestamp, "fas fa-link", "var(--LIME)",
            `Liên kết với quỹ <b>${fund.name}</b>`]);

        return arguments;
    }

    F0B(
        timestamp,
        action_code,
        fund_id,
        bacc_id
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "fund_id", "Quỹ", () => timestamp("fund")],
                ["select", "bacc_id", "Tài khoản ngân hàng", () => timestamp("bacc")],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Hủy liên kết quỹ – tài khoản ngân hàng"]
            ];

        if (this.error_checker({
            "FUND_BACC_UNLINKED": { fund_id, bacc_id }
        }))
            return false;

        let fund = this.Data.data.funds[fund_id];
        let bacc = this.Data.data.baccs[bacc_id];

        fund.linked_baccs.splice(fund.linked_baccs.indexOf(bacc_id), 1);
        fund.logs.push([timestamp, "fas fa-unlink", "var(--CHERRY)",
            `Hủy liên kết với tài khoản ${OBJECT_TYPES_NAME[bacc.type]} <b>${bacc.name}</b>`]);

        bacc.linked_fund = null;
        bacc.logs.push([timestamp, "fas fa-unlink", "var(--CHERRY)",
            `Hủy liên kết với quỹ <b>${fund.name}</b>`]);

        return arguments;
    }

    QID(
        timestamp,
        action_code,
        queue_id,
        content
    ) {
        if (typeof timestamp == "function")
            return [
                ["select", "fund_id", "Quỹ", () => timestamp("fund")],
                ["text", "content", "Nội dung"],
                ["cancel", "cancel", "Hủy bỏ"],
                ["submit", "submit", "Phân bổ thu nhập"]
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
            fund.logs.push([timestamp, "fas fa-inbox-in", "var(--LIME)",
                `Nhận phân bổ thu nhập <b>${format_currency(distribution_amount)}</b> `
                + `từ hàng đợi ${queue.name}) với nội dung "<i>${content}</i>"`]);
            queue_log_strings.push(`<b>${format_currency(distribution_amount)}</b> tới quỹ <b>${fund.name}</b>`);
        }
        queue.logs.push([timestamp, "fas fa-funnel-dollar", "var(--LEMON)",
            `Phân bổ thu nhập ${queue_log_strings.join(", ")} (tổng cộng `
            + `${format_currency(total_distribution_amount)}) với nội dung "<i>${content}</i>"`]);

        return arguments;
    }
}

class Data {
    constructor(Notification) {
        this.Notification = Notification;
        this.logs = [];
        this.data = {
            queues: {},
            funds: {},
            baccs: {},
            debts: {}
        };
        this.Actions = new Actions(Notification, this);
    }

    do_action(function_name, function_args) {
        function_args[0] = Date.now();
        let function_return = this.Actions[function_name](...function_args);
        if (function_return)
            this.logs.push(function_return);
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
        return true;
    }

    async get_logs() {
        /* TODO */
    }

    async set_logs() {
        /* TODO */
    }
}

class Notification {
    constructor() {

    }

    notify(code) {
        console.log(NOTIFICATION_TEXTS[code]);
        alert(NOTIFICATION_TEXTS[code]);
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
                    !this.validate("FIND_FUND", { Data: args.data, id: args.fund_id })
                    || !this.validate("FIND_BACC", { Data: args.data, id: args.bacc_id })
                )
                    return false;

                let fund = args.Data.data.funds[args.fund_id];
                let bacc = args.Data.data.baccs[args.bacc_id];

                if (fund.is_anb != bacc.is_anb) {
                    this.notify("FUND_BACC_UNLINKABLE__DIFFERENT_ON_ANB");
                    return false;
                } else if (bacc.linked_fund == fund_id) {
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
                    !this.validate("FIND_FUND", { Data: args.data, id: args.fund_id })
                    || !this.validate("FIND_BACC", { Data: args.data, id: args.bacc_id })
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
                        object[name] == new_value,
                        object[name],
                        new_value,
                        some_function
                    ];
                }

                let has_change =
                    Object.values(args.edit_data)
                        .every(test => test[2]);
                if (!has_change) {
                    this.notify("NO_CHANGE_IN_EDITING");
                    return false;
                }

                return args.edit_data;
            }
        }
    }
}

class Action_Form {
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
        /* Extended PhongHNg_JSL.ADOM for Action_Form */

        if (typeof data == "function")
            data = data();

        switch (elm_type) {
            case "action_code": {
                return PhongHNg_JSL.ADOM(["input", {
                    type: "text",
                    name: name,
                    value: data,
                    style: "display: none",
                    required: true
                }, null, null], document);
            }

            case "text": {
                return PhongHNg_JSL.ADOM(["input", {
                    type: "text",
                    name: name,
                    placeholder: `${title} *`,
                    title: `${title} *`,
                    required: true
                }, null, null], document);
            }

            case "submit": {
                let elm = PhongHNg_JSL.ADOM(["button", {
                    title: title
                }, title, null], document);
                elm.onclick = event => {
                    event.preventDefault();
                    if (this.submit_form())
                        this.submit_callback(this);
                };
                return elm;
            }

            case "cancel": {
                let elm = PhongHNg_JSL.ADOM(["button", {
                    title: title
                }, title, null], document);
                elm.onclick = event => {
                    event.preventDefault();
                    this.cancel_callback(this);
                };
                return elm;
            }

            case "checkbox": {
                return [
                    PhongHNg_JSL.ADOM(["input", {
                        type: "checkbox",
                        name: name,
                        id: name,
                        title: title
                    }, null, null], document),

                    PhongHNg_JSL.ADOM(["label", {
                        for: name, title: title
                    }, title, null], document),
                ];
            }

            case "number": {
                return PhongHNg_JSL.ADOM([
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
                    option_ADOMs.push(["option", { value }, title, null]);
                return PhongHNg_JSL.ADOM(["select", {
                    name: name, title: `${title} *`, required: true
                }, null, option_ADOMs], document);
            }

            case "datetime": {
                return PhongHNg_JSL.ADOM(["input", {
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
                    `${title} *`,
                    null
                ]);

                for (let [optgroup_name, optgroup_data] of Object.entries(data)) {
                    let optgroup_ADOM_children = [];

                    for (let [object_id, object_name] of optgroup_data)
                        optgroup_ADOM_children.push([
                            "option",
                            { value: object_id },
                            object_name,
                            null
                        ]);

                    select_ADOM_children.push([
                        "optgroup",
                        { label: optgroup_name },
                        null,
                        optgroup_ADOM_children
                    ]);
                }

                return PhongHNg_JSL.ADOM([
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

    generate_form(action_code) {
        let xADOM_args_list = this.Data.Actions[action_code](type => this.get_object_list(type));
        xADOM_args_list.unshift(["action_code", "action_code", "Mã hành động", action_code]);
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
        let Action_function_args = [null];

        let elms = this.form_elm.querySelectorAll("*[name]");
        for (let elm of elms) {
            if (elm.required && elm.value == "") {
                elm.focus();
                this.Notification.notify("ACTION_FORM__EMPTY_REQUIRED_FIELD");
                return false;
            }

            if (elm.tagName == "INPUT" && elm.type == "checkbox")
                Action_function_args.push(elm.checked);
            else if (elm.tagName == "INPUT" && elm.type == "number")
                Action_function_args.push(Number(elm.value));
            else if (elm.tagName == "INPUT" && elm.type == "datetime-local")
                Action_function_args.push((new Date(elm.value)).getTime());
            else
                Action_function_args.push(elm.value);
        }

        let Action_function_name = Action_function_args[1];

        if (Action_function_name == "O2O") {
            let [source_type, source_id] = Action_function_args[2].split("_");
            let [target_type, target_id] = Action_function_args[5].split("_");
            Action_function_args[1] = `${source_type}2${target_type}`;
            Action_function_args[2] = source_id;
            Action_function_args[5] = target_id;
        } else if (Action_function_name == "OPM"
            || Action_function_name == "OPm") {
            let [object_type, object_id] = Action_function_args[2].split("_");
            Action_function_args[1] = `${object_type}2${target_type}`;
            Action_function_args[2] = object_id;
        }

        this.Data.do_action(Action_function_name, Action_function_args);

        return true;
    }
}