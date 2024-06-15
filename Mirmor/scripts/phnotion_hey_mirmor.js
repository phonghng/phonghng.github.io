class PHNotion_Hey_Mirmor {
    constructor(
        encrypted_endpoint,
        habit_database = HABITS,
        extension_database = EXTENSIONS,
        homepage_top_container = document.body,
        options
    ) {
        this.timestamp = new Date().getTime();
        this.habit_database = habit_database;
        this.extension_database = extension_database;
        this.homepage_top_container = homepage_top_container;
        this.options = Object.assign({}, options, {
            point_info_extension_parameters: {
                percent_criterions: {
                    "2024-01-01": 0.85, // changed
                    "2024-02-23": 0.87,
                    "2024-02-26": 0.85, // changed
                    "2024-03-05": 0.87,
                    "2024-03-31": 0.85,
                    "2024-04-11": 0.80,
                    "2024-04-14": 0.75,
                    "2024-04-25": 0.85,
                    "2024-05-06": 0.75,
                    "2024-06-05": 0.80
                },
                chart_date_range: ["2024-06-05", "2024-08-31"]
            }
        });
        this.StatusBar_class = new StatusBar(this.homepage_top_container);

        this.endpoint = this.get_endpoint(encrypted_endpoint);

        this.initialization_data;
        this.last_set_point;
        this.queue = [];

        this.get(
            PPPL_JS.XDate(this.timestamp).date_object_expanded.date_string,
            getted_data => {
                this.initialization_data = getted_data;
                this.init_js();
                this.get_independent_data();
            }
        );

    }

    static change_password(new_password, current_password, encrypted_endpoint = ENCRYPTED_ENDPOINT) {
        return CryptoJS.AES.encrypt(
            CryptoJS.AES.decrypt(encrypted_endpoint, current_password)
                .toString(CryptoJS.enc.Utf8)
            , new_password).toString();
    }

    get_endpoint(encrypted_endpoint) {
        let password = prompt("Nhập mật khẩu");
        if (!password) {
            let status_element = document.createElement("span");
            status_element.style.color = "var(--CHERRY)";
            status_element.innerHTML = "Vui lòng nhập mật khẩu!";
            this.StatusBar_class.show_status(status_element);
            return undefined;
        }
        let endpoint =
            CryptoJS.AES.decrypt(encrypted_endpoint, password)
                .toString(CryptoJS.enc.Utf8);
        if (!endpoint) {
            let status_element = document.createElement("span");
            status_element.style.color = "var(--CHERRY)";
            status_element.innerHTML = "Sai mật khẩu!";
            this.StatusBar_class.show_status(status_element);
        }
        return endpoint;
    }

    get(date_string, callback) {
        if (!this.endpoint) return;

        let status_element = document.createElement("span");
        status_element.style.color = "var(--LEMON)";
        status_element.innerHTML = "Vui lòng chờ...";
        this.StatusBar_class.show_status(status_element);

        fetch(`${this.endpoint}/${date_string}`)
            .then(response => response.text())
            .then(text => callback(
                JSON.parse(
                    CryptoJS.enc.Base64.parse(text)
                        .toString(CryptoJS.enc.Utf8)
                    || "{}"
                )
            ));
    }

    get_independent_data() {
        fetch(`${this.endpoint}/independent_data`)
            .then(response => response.text())
            .then(text => {
                this.DataStorage_class.independent_data =
                    JSON.parse(
                        CryptoJS.enc.Base64.parse(text)
                            .toString(CryptoJS.enc.Utf8)
                        || "{}"
                    );
            });
    }

    set(date_string, data, point, goal_point, data_saved_callback, independent_data_saved_callback) {
        data =
            CryptoJS.enc.Base64.stringify(
                CryptoJS.enc.Utf8.parse(data)
            );
        if (this.last_set_point == point) return;
        this.last_set_point = point;
        this.queue.push({
            url: `${this.endpoint}/${date_string}`,
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data, point, goal_point })
            },
            callback: data_saved_callback,
            fetching: false
        });
        this.queue.push({
            url: `${this.endpoint}/independent_data`,
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: CryptoJS.enc.Base64.stringify(
                        CryptoJS.enc.Utf8.parse(
                            JSON.stringify(this.DataStorage_class.independent_data)
                        )
                    )
                })
            },
            callback: independent_data_saved_callback,
            fetching: false
        });
        this.process_queue();
    }

    process_queue() {
        let ready_for_next_fetch =
            this.queue[0] && this.queue.every(item => !item.fetching);
        if (!ready_for_next_fetch) return;

        this.queue[0].fetching = true;
        this.fetch(
            this.queue[0].url,
            this.queue[0].options,
            () => {
                let shifted_item = this.queue.shift();
                shifted_item.callback();
                this.process_queue();
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

    init_js() {
        this.DataStorage_class = new DataStorage(
            this.initialization_data,
            (options, object_data_function, json_data_function, string_data_function, date_string) => {
                if (!options?.is_from_view_data_extension)
                    this.Habits_class.data.children.xem_du_lieu
                        .Extension_class.ExtensionPopup_class
                        .run_function("update_textarea", [string_data_function()]);
                let json_data = json_data_function();
                this.StatusBar_class.show_status(json_data);
                if (Object.entries(json_data["Xem dữ liệu Mirmor hôm nay"].data).length)
                    this.set(
                        date_string,
                        JSON.stringify(object_data_function()),
                        json_data.point || json_data._point || 0,
                        json_data.goal_point || json_data._goal_point || 0,
                        () => {
                            let status_element = document.createElement("span");
                            status_element.style.color = "var(--LIME)";
                            let point = json_data.point || json_data._point || 0;
                            let goal_point = json_data.goal_point || json_data._goal_point || 0;
                            status_element.innerHTML = `Đã lưu vào Notion! (${point} / ${goal_point} ≈ ${Math.floor(point / goal_point * 100)}%)`;
                            this.StatusBar_class.show_status(status_element);

                            fetch(`${this.endpoint}/`)
                                .then(response => response.json())
                                .then(json => {
                                    this.Habits_class.data.children.xem_thong_ke
                                        .Extension_class.ExtensionPopup_class
                                        .run_function("update_data", [
                                            json,
                                            this.options.point_info_extension_parameters.percent_criterions,
                                            this.options.point_info_extension_parameters.chart_date_range
                                        ]);
                                });
                        },
                        () => {
                            let status_element = document.createElement("span");
                            status_element.style.color = "var(--LIME)";
                            status_element.innerHTML = `Đã lưu vào Notion! (Dữ liệu độc lập)`;
                            this.StatusBar_class.show_status(status_element);
                        }
                    );
            }
        );

        this.Habits_class = new Habits(
            this.habit_database,
            this.extension_database,
            (options) => {
                let date = PPPL_JS.XDate(this.timestamp).date_object_expanded.date_string;
                this.DataStorage_class.set_cumulative_habit_data(this.Data_class.Habits_class.data, "", date);
                this.DataStorage_class.set_data(this.Data_class, date, options);
                this.HomepageView_class.update_view();
            },
            this.DataStorage_class.data,
            () => PPPL_JS.XDate(this.timestamp),
        );

        this.Data_class = new Data(
            this.Habits_class,
            {
                XDate_function: () => PPPL_JS.XDate(this.timestamp),
                get_cumulative_info: (item_data) => {
                    let cumulative_info = {};
                    if (!item_data.cumulative_data)
                        return cumulative_info;
                    if (item_data.type == "habit_check") {
                        cumulative_info.completed_count =
                            Object.entries(item_data.cumulative_data)
                                .filter(item => item[1]).length;
                        cumulative_info.is_today_completed = item_data.completed_time ? true : false;
                    } else if (item_data.type == "habit_number") {
                        cumulative_info.total_value =
                            Object.entries(item_data.cumulative_data)
                                .reduce((total, current) => total + current[1], 0);
                        cumulative_info.today_value = item_data.value;
                    }
                    return cumulative_info;
                },
                line_indent: `      `,
                line_spacing: `\n\n`
            }
        );

        this.HomepageView_class = new HomepageView(
            this.DataStorage_class.data?._HomepageView_class_data,
            this.Habits_class,
            this.Data_class,
            {
                top_container: this.homepage_top_container
            },
            data => {
                let date = PPPL_JS.XDate(this.timestamp).date_object_expanded.date_string;
                this.DataStorage_class.set_HomepageView_class_data(data, this.Data_class, date);
            }
        );
    }
}