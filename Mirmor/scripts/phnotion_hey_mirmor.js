class PHNotion_Hey_Mirmor {
    constructor(
        encrypted_endpoint = ENCRYPTED_PHNOTION_HEY_MIRMOR_ENDPOINT,
        texts,
        habit_database = HABITS,
        extension_database = EXTENSIONS,
        homepage_top_container = document.body
    ) {
        this.timestamp = Date.now();
        this.texts = texts || {
            password_prompt: "Nhập mật khẩu",
            wrong_password: "Sai mật khẩu!",
            missing_password: "Vui lòng nhập mật khẩu!",
            saved_to_Notion: "Đã lưu vào Notion!",
            please_wait: "Vui lòng chờ..."
        };
        this.habit_database = habit_database;
        this.extension_database = extension_database;
        this.homepage_top_container = homepage_top_container;
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

    get_endpoint(encrypted_endpoint) {
        let password = prompt(this.texts.password_prompt);
        if (!password) {
            let status_element = document.createElement("span");
            status_element.style.color = "var(--CHERRY)";
            status_element.innerHTML = this.texts.missing_password;
            this.StatusBar_class.show_status(status_element);
            return undefined;
        }
        let endpoint =
            CryptoJS.AES.decrypt(encrypted_endpoint, password)
                .toString(CryptoJS.enc.Utf8);
        if (!endpoint) {
            let status_element = document.createElement("span");
            status_element.style.color = "var(--CHERRY)";
            status_element.innerHTML = this.texts.wrong_password;
            this.StatusBar_class.show_status(status_element);
        }
        return endpoint;
    }

    get(date_string, callback) {
        if (!this.endpoint) return;

        let status_element = document.createElement("span");
        status_element.style.color = "var(--LEMON)";
        status_element.innerHTML = this.texts.please_wait;
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
            (data_to_set, json_data, string_data, date_string) => {
                Habits_class.data.children.view_data
                    .Extension_class.ExtensionPopup_class
                    .run_function("update_textarea", [string_data]);

                this.StatusBar_class.show_status(json_data);

                this.set(
                    date_string,
                    data_to_set,
                    json_data.point || json_data._point || 0,
                    json_data.goal_point || json_data._goal_point || 0,
                    () => {
                        let status_element = document.createElement("span");
                        status_element.style.color = "var(--LIME)";
                        status_element.innerHTML = this.texts.saved_to_Notion;
                        this.StatusBar_class.show_status(status_element);

                        fetch(`${this.endpoint}/`)
                            .then(response => response.json())
                            .then(json => {
                                Habits_class.data.children.point_info
                                    .Extension_class.ExtensionPopup_class
                                    .run_function("update_data", [json]);
                            });
                    }
                );
            }
        );

        const Habits_class = new Habits(
            this.habit_database,
            this.extension_database,
            () => {
                DataStorage_class.set_data(Data_class, Date.now());
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