class PHNotion_Hey_Mirmor {
    constructor(
        encrypted_endpoint,
        habit_database = HABITS,
        extension_database = EXTENSIONS,
        homepage_top_container = document.body,
        options
    ) {
        this.timestamp = Date.now();
        this.habit_database = habit_database;
        this.extension_database = extension_database;
        this.homepage_top_container = homepage_top_container;
        this.options = Object.assign({}, options, {
            point_info_extension_parameters: {
                percent_criterions: [0.75],
                chart_date_range: ["2024-04-01", "2024-08-31"]
            },
            texts: {
                password_prompt: "Nhập mật khẩu",
                wrong_password: "Sai mật khẩu!",
                missing_password: "Vui lòng nhập mật khẩu!",
                saved_to_Notion: "Đã lưu vào Notion!",
                please_wait: "Vui lòng chờ..."
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
        let password = prompt(this.options.texts.password_prompt);
        if (!password) {
            let status_element = document.createElement("span");
            status_element.style.color = "var(--CHERRY)";
            status_element.innerHTML = this.options.texts.missing_password;
            this.StatusBar_class.show_status(status_element);
            return undefined;
        }
        let endpoint =
            CryptoJS.AES.decrypt(encrypted_endpoint, password)
                .toString(CryptoJS.enc.Utf8);
        if (!endpoint) {
            let status_element = document.createElement("span");
            status_element.style.color = "var(--CHERRY)";
            status_element.innerHTML = this.options.texts.wrong_password;
            this.StatusBar_class.show_status(status_element);
        }
        return endpoint;
    }

    get(date_string, callback) {
        if (!this.endpoint) return;

        let status_element = document.createElement("span");
        status_element.style.color = "var(--LEMON)";
        status_element.innerHTML = this.options.texts.please_wait;
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

    set(date_string, data, point, goal_point, callback) {
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
            callback: callback,
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
        const DataStorage_class = new DataStorage(
            this.initialization_data,
            (options, object_data_function, json_data_function, string_data_function, date_string) => {
                if (!options?.is_from_view_data_extension)
                    Habits_class.data.children.utils.children.view_data
                        .Extension_class.ExtensionPopup_class
                        .run_function("update_textarea", [string_data_function()]);
                let json_data = json_data_function();
                this.StatusBar_class.show_status(json_data);
                if (Object.entries(json_data["Tiện ích"]["Xem dữ liệu Mirmor hôm nay"].data).length)
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
                            status_element.innerHTML = `${this.options.texts.saved_to_Notion} (${point} / ${goal_point} ≈ ${Math.floor(point / goal_point * 100)}%)`;
                            this.StatusBar_class.show_status(status_element);

                            fetch(`${this.endpoint}/`)
                                .then(response => response.json())
                                .then(json => {
                                    Habits_class.data.children.utils.children.point_info
                                        .Extension_class.ExtensionPopup_class
                                        .run_function("update_data", [
                                            json,
                                            this.options.point_info_extension_parameters.percent_criterions,
                                            this.options.point_info_extension_parameters.chart_date_range
                                        ]);
                                });
                        }
                    );
            }
        );

        const Habits_class = new Habits(
            this.habit_database,
            this.extension_database,
            (options) => {
                DataStorage_class.set_data(Data_class, Date.now(), options);
                HomepageView_class.update_view();
            },
            DataStorage_class.data,
            () => PPPL_JS.XDate(this.timestamp),
        );

        const Data_class = new Data(
            Habits_class,
            {
                XDate_function: () => PPPL_JS.XDate(this.timestamp),
                line_indent: `      `,
                line_spacing: `\n\n`
            }
        );

        const HomepageView_class = new HomepageView(
            DataStorage_class.data?._HomepageView_class_data,
            Habits_class,
            Data_class,
            {
                top_container: this.homepage_top_container
            },
            data => DataStorage_class.set_HomepageView_class_data(data, Data_class, Date.now())
        );
    }
}