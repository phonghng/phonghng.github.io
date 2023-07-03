/**
  * ===== ABBREVIATION =====
  * iwd: income waiting to be distributed into funds
  * rrid: rate of receiving income distribution (n% out of 100%)
  * anb: allow negative balance
  * args: arguments
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

    QCr(
        timestamp = Date.now(),
        action_code = "QCr",
        queue_name
    ) {
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

    FCr(
        timestamp = Date.now(),
        action_code = "FCr",
        fund_name,
        is_anb,
        rrid
    ) {
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
                    `Tạo quỹ <b>${fund_name}</b>`]
            ]
        };

        return arguments;
    }

    BCr(
        timestamp = Date.now(),
        action_code = "BCr",
        bacc_name,
        bacc_type
    ) {
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

    DCr(
        timestamp = Date.now(),
        action_code = "DCr",
        debt_name,
        repayment_term,
        debtor
    ) {
        this.Data.data.debts[String(timestamp)] = {
            name: debt_name,
            repayment_term,
            debtor, /* false is me, true is other(s) */
            balance: 0,
            is_anb: true,
            logs: [
                [timestamp, "fas fa-sparkles", "var(--LEMON)",
                    `Tạo khoản nợ <b>${debt_name}</b>`]
            ]
        };

        return arguments;
    }

    O2O(
        timestamp = Date.now(),
        action_code,
        source_id,
        amount,
        content,
        target_id
    ) {
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
        timestamp = Date.now(),
        action_code,
        object_id,
        amount,
        content
    ) {
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
        timestamp = Date.now(),
        action_code,
        object_id,
        amount,
        method,
        category,
        content
    ) {
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
        timestamp = Date.now(),
        action_code = "F1B",
        fund_id,
        bacc_id
    ) {
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
        timestamp = Date.now(),
        action_code = "F0B",
        fund_id,
        bacc_id
    ) {
        if (this.error_checker({
            "FUND_BACC_UNLINKED": { fund_id, bacc_id }
        }))
            return false;

        let fund = this.Data.data.funds[fund_id];
        let bacc = this.Data.data.baccs[bacc_id];

        fund.linked_baccs.splice(fund.linked_baccs.indexOf(bacc_id), 1);
        fund.logs.push([timestamp, "fas fa-link-slash", "var(--CHERRY)",
            `Hủy liên kết với tài khoản ${OBJECT_TYPES_NAME[bacc.type]} <b>${bacc.name}</b>`]);

        bacc.linked_fund = null;
        bacc.logs.push([timestamp, "fas fa-link-slash", "var(--CHERRY)",
            `Hủy liên kết với quỹ <b>${fund.name}</b>`]);

        return arguments;
    }

    QID(
        timestamp = Date.now(),
        action_code = "QID",
        queue_id,
        content
    ) {
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
                .map(fund => [fund[0], fund[1].rrid]);

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
        queue.logs.push([timestamp, "fas fa-filter-circle-dollar", "var(--LEMON)",
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

    get_logs() {

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
        this.Notification.notify("DATA__PARSED_LOG");
        return true;
    }

    set_logs() {

    }
}

class Notification {
    constructor() {
        this.codes = {
            "CANT_FIND_QUEUE": "Can't find queue",
            "CANT_FIND_FUND": "Can't find fund",
            "CANT_FIND_BACC": "Can't find bank account",
            "CANT_FIND_DEBT": "Can't find debt",
            "NOT_ENOUGH_BALANCE": "Not enough balance",
            "FUND_BACC_UNLINKABLE__DIFFERENT_ON_ANB": "Unable to link fund and bank account (because ...)",
            "CANT_FUND_BACC_UNLINK__NOT_LINKING": "Unable to unlink fund and bank account (because ...)",
            "OUT_OF_RRID_SPACE": "Out of RRID space",
            "DATA__PARSED_LOG": "Parsed log",
            "DATA__CANT_PARSE_LOG": "Can't parse log",
            "ACTION_FORM__EMPTY_REQUIRED_FIELD": "Empty required field"
        };
    }

    notify(code) {
        console.log(this.codes[code]);
        console.trace();
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
                let is_linkable = fund.is_anb == bacc.is_anb;

                if (!is_linkable)
                    this.notify("FUND_BACC_UNLINKABLE__DIFFERENT_ON_ANB");
                return is_linkable;
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
                    (current_accumulated_rrid + args.rrid) > 1;
                if (is_out_of_rrid_space)
                    this.notify("OUT_OF_RRID_SPACE");
                return !is_out_of_rrid_space;
            }
        }
    }
}

class Action_Form {
    constructor(Notification, Data, form_elm, submit_callback) {
        this.Notification = Notification;
        this.Data = Data;
        this.form_elm = form_elm;
        this.submit_callback = submit_callback;

        this.xADOM_args = {
            "QCr": [
                ["action_code", "action_code", "Mã hành động", "QCr"],
                ["text", "queue_name", "Tên hành đợi"],
                ["submit", "submit", "Tạo hàng đợi"]
            ],
            "FCr": [
                ["action_code", "action_code", "Mã hành động", "FCr"],
                ["text", "fund_name", "Tên quỹ"],
                ["checkbox", "is_anb", "Số dư có thể âm"],
                ["number", "rrid", "Phần trăm nhận phân bổ thu nhập", { min: 0, max: 100 }],
                ["submit", "submit", "Tạo hàng đợi"]
            ],
            "BCr": [
                ["action_code", "action_code", "Mã hành động", "BCr"],
                ["text", "bacc_name", "Tên tài khoản ngân hàng"],
                ["select", "bacc_type", "Loại tài khoản ngân hàng", BACC_TYPES],
                ["submit", "submit", "Tạo tài khoản ngân hàng"]
            ],
            "DCr": [
                ["action_code", "action_code", "Mã hành động", "DCr"],
                ["text", "debt_name", "Tên khoản nợ"],
                ["datetime", "repayment_term", "Thời hạn trả nợ"],
                ["checkbox", "debtor", "Tôi là người nợ"],
                ["submit", "submit", "Tạo khoản nợ"]
            ],
            "O2O": [
                ["action_code", "action_code", "Mã hành động", "O2O"],
                ["select_group", "source_id", "Đối tượng gửi", this.get_object_list()],
                ["number", "repayment_term", "Số tiền", { min: 0 }],
                ["text", "content", "Nội dung"],
                ["select_group", "target_id", "Đối tượng nhận", this.get_object_list()],
                ["submit", "submit", "Chuyển tiền"]
            ],
            "OPM": [
                ["action_code", "action_code", "Mã hành động", "OPM"],
                ["select_group", "object_id", "Đối tượng", this.get_object_list()],
                ["number", "amount", "Số tiền"],
                ["text", "content", "Nội dung"],
                ["submit", "submit", "Cộng/trừ tiền"]
            ],
            "Pay": [
                ["action_code", "action_code", "Mã hành động", "Pay"],
                ["select_group", "object_id", "Đối tượng", this.get_object_list()],
                ["number", "amount", "Số tiền"],
                ["select", "method", "Phương thức thanh toán", PAYMENT_METHODS],
                ["select", "category", "Loại thanh toán", PAYMENT_CATEGORIES],
                ["text", "content", "Nội dung"],
                ["submit", "submit", "Thanh toán"]
            ],
            "F1B": [
                ["action_code", "action_code", "Mã hành động", "F1B"],
                ["select", "fund_id", "Quỹ", this.get_object_list("fund")],
                ["select", "bacc_id", "Tài khoản ngân hàng", this.get_object_list("bacc")],
                ["submit", "submit", "Liên kết quỹ – tài khoản ngân hàng"]
            ],
            "F0B": [
                ["action_code", "action_code", "Mã hành động", "F0B"],
                ["select", "fund_id", "Quỹ", this.get_object_list("fund")],
                ["select", "bacc_id", "Tài khoản ngân hàng", this.get_object_list("bacc")],
                ["submit", "submit", "Hủy liên kết quỹ – tài khoản ngân hàng"]
            ],
            "QID": [
                ["action_code", "action_code", "Mã hành động", "F0B"],
                ["select", "fund_id", "Quỹ", this.get_object_list("fund")],
                ["text", "content", "Nội dung"],
                ["submit", "submit", "Phân bổ thu nhập"]
            ]
        };
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
                    placeholder: title,
                    title: title,
                    required: true
                }, null, null], document);
            }

            case "submit": {
                let elm = PhongHNg_JSL.ADOM(["button", {
                    title: title
                }, title, null], document);
                elm.onclick = (event) => this.submit_form(event);
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
                        placeholder: title,
                        title: title,
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
                }, title, null]);
                for (let [value, title] of Object.entries(data))
                    option_ADOMs.push(["option", { value }, title, null]);
                return PhongHNg_JSL.ADOM(["select", {
                    name: name, title: title, required: true
                }, null, option_ADOMs], document);
            }

            case "datetime": {
                return PhongHNg_JSL.ADOM(["input", {
                    type: "datetime-local",
                    name: name,
                    placeholder: title,
                    title: title,
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
                    title,
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
                        title: title,
                        required: true
                    },
                    null,
                    select_ADOM_children
                ], document);
            }
        }
    }

    generate_form(action_code) {
        for (let xADOM_args of this.xADOM_args[action_code]) {
            let elms = this.xADOM(...xADOM_args);
            if (elms.constructor.name != "Array")
                elms = [elms];
            for (let elm of elms)
                this.form_elm.appendChild(elm);
        }
        return true;
    }

    submit_form(button_event) {
        button_event.preventDefault();

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

        let Action_function_name = Action_function_args[0];

        if(Action_function_name == "O2O") {

        } else if (Action_function_name == "OPM") {

        }else if (Action_function_name == "OPm") {
            
        }

        console.log(Action_function_args);
        this.submit_callback();
    }
}