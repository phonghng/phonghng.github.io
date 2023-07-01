/**
  * ===== ABBREVIATION =====
  * iwd: income waiting to be distributed
  * args: arguments
  * obj: object
  * bacc: bank account
  */

const NOTIFICATION_CODES = {
    "CANT_FIND_QUEUE": "Can't find queue",
    "CANT_FIND_FUND": "Can't find fund",
    "CANT_FIND_BACC": "Can't find bank account",
    "CANT_FIND_DEBT": "Can't find debt",
    "NOT_ENOUGH_BALANCE": "Not enough balance",
    "DATA__PARSED_LOG": "Parsed log",
    "DATA__CANT_PARSE_LOG": "Can't parse log"
}

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
        fund_name
    ) {
        this.Data.data.funds[String(timestamp)] = {
            name: fund_name,
            balance: 0,
            linked_baccs: [],
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
        const TYPES_NAME = {
            "savings": "tiết kiệm",
            "current": "giao dịch",
            "credit": "tín dụng"
        };

        this.Data.data.baccs[String(timestamp)] = {
            name: bacc_name,
            balance: 0,
            can_balance_be_negative: bacc_type == "credit",
            type: bacc_type,
            linked_fund: null,
            logs: [
                [timestamp, "fas fa-sparkles", "var(--LEMON)",
                    `Tạo tài khoản ${TYPES_NAME[bacc_type]} <b>${bacc_name}</b>`]
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
            can_balance_be_negative: true,
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
        const TYPES_NAME = {
            "Q": "queue",
            "F": "fund",
            "B": "bacc",
            "D": "debt",

            "queue": "hàng đợi",
            "fund": "quỹ",
            "bacc_savings": "tài khoản tiết kiệm",
            "bacc_current": "tài khoản giao dịch",
            "bacc_credit": "tài khoản tín dụng",
            "debt": "khoản nợ"
        };

        let source_type = TYPES_NAME[action_code.split("2")[0]];
        let target_type = TYPES_NAME[action_code.split("2")[1]];

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
            `Chuyển <b>${format_currency(amount)}</b> tới ${TYPES_NAME[target_type]}`
            + ` <b>${target.name}</b> với nội dung "<i>${content}</i>"`]);

        target.balance += amount;
        target.logs.push([timestamp, "fas fa-inbox-in", "var(--LIME)",
            `Nhận <b>${format_currency(amount)}</b> từ ${TYPES_NAME[source_type]}`
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
        const TYPES_NAME = {
            "Q": "queue",
            "F": "fund",
            "B": "bacc",
            "D": "debt"
        };

        let object_type = TYPES_NAME[action_code.split("")[0]];

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

        return arguments;
    }

    Pay(
        timestamp = Date.now(),
        action_code = "Pay",
        object_type,
        object_id,
        amount,
        method,
        content
    ) {
        const METHODS_NAME = {
            "cash": "tiền mặt",
            "current_account_transfering": "chuyển khoản tài khoản giao dịch",
            "current_account_card": "thẻ tài khoản giao dịch",
            "credit_account_transfering": "chuyển khoản tài khoản tín dụng",
            "credit_account_card": "thẻ tài khoản tín dụng"
        };

        let error_checker_options = {};
        error_checker_options[`FIND_${object_type.toUpperCase()}`] =
            { id: object_id };
        error_checker_options[`ENOUGH_BALANCE`] =
            { type: object_type, id: object_id, min_balance: amount };
        if (this.error_checker(error_checker_options))
            return false;

        let object = this.Data.data[`${object_type}s`][object_id];
        object.balance -= amount;
        object.logs.push([timestamp, "fas fa-inbox-in", "var(--LIME)",
            `Thanh toán (bằng ${METHODS_NAME[method]}) <b>${format_currency(amount)}</b>`
            + ` với nội dung "<i>${content}</i>"`]);

        return arguments;
    }

    FnB(

    ) {

    }
}

class Data {
    constructor(Notification) {
        this.Notification = Notification;
        this.logs = [
            //[1687278398481, "BCr", "0", "credit"],
            [1687278398482, "BCr", "1", "credit"],
            [1687278398483, "DCr", "2", 1687278398482, false],
            [1687278398945, "BPM", "1687278398482", -10, "Không có chi hết"],
            [1687278398949, "B2D", "1687278398482", 10, "Không có chi hết", "1687278398483"],
            [1687278398950, "Pay", "bacc", "1687278398482", 100, "credit_account_card", "Mua TV"]
        ];
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
            let action_code = log[1];
            if (/[QFBD]2[QFBD]/g.test(action_code))
                action_code = "O2O";
            if (action_code.endsWith("PM"))
                action_code = "OPM";
            let parse_response = this.Actions[action_code](...log);
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
        this.codes = NOTIFICATION_CODES;
    }

    notify(code) {
        console.log(this.codes[code]);
        console.trace();
    }

    validate(code, args) {
        switch (code) {
            case "FIND_QUEUE":
                if (Object.keys(args.Data.data.queues)
                    .includes(args.id))
                    return true;
                this.notify("CANT_FIND_QUEUE");
                return false;

            case "FIND_FUND":
                if (Object.keys(args.Data.data.funds)
                    .includes(args.id))
                    return true;
                this.notify("CANT_FIND_FUND");
                return false;

            case "FIND_BACC":
                if (Object.keys(args.Data.data.baccs)
                    .includes(args.id))
                    return true;
                this.notify("CANT_FIND_BACC");
                return false;

            case "FIND_DEBT":
                if (Object.keys(args.Data.data.debts)
                    .includes(args.id))
                    return true;
                this.notify("CANT_FIND_DEBT");
                return false;

            case "ENOUGH_BALANCE":
                let obj_type_s_obj = args.Data.data[`${args.type}s`];
                if (!Object.keys(obj_type_s_obj).includes(args.id))
                    return false;

                let obj = obj_type_s_obj[args.id];
                if (obj.can_balance_be_negative)
                    return true;

                let is_enough_balance =
                    (obj.balance - args.min_balance) >= 0;
                if (!is_enough_balance)
                    this.notify("NOT_ENOUGH_BALANCE");
                return is_enough_balance;
        }
    }
}