class PHNotion_Hey_Mirmor {
    constructor(
        encrypted_endpoint,
        habit_database = HABITS,
        extension_database = EXTENSIONS,
        homepage_top_container = document.body,
        options = DEFAULT_OPTIONS
    ) {
        this.timestamp = new Date(
            new URL(location.href).searchParams.get("date")
            || PPPL_JS.XDate(new Date()).date_object_expanded.date_string
        ).getTime();
        this.habit_database = habit_database;
        this.extension_database = extension_database;
        this.homepage_top_container = homepage_top_container;
        this.options = options;
        this.StatusBar_class = new StatusBar(this.homepage_top_container);

        this.endpoint = this.get_endpoint(encrypted_endpoint);

        this.server_cache = {};
        this.initialization_data;
        this.last_set_point;
        this.queue = {
            is_fetching: false,
            normal: null,
            server_caching: null
        };

        this.get(
            PPPL_JS.XDate(this.timestamp).date_object_expanded.date_string,
            getted_data => {
                this.initialization_data =
                    JSON.parse(
                        CryptoJS.enc.Base64.parse(getted_data.date)
                            .toString(CryptoJS.enc.Utf8)
                        || "{}"
                    );
                this.init_js();
                this.DataStorage_class.independent_data =
                    JSON.parse(
                        CryptoJS.enc.Base64.parse(getted_data.independent_data)
                            .toString(CryptoJS.enc.Utf8)
                        || "{}"
                    );
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
            .then(response => response.json())
            .then(json => callback(json));
    }

    set(date_string, data, point, goal_point, callback) {
        data =
            CryptoJS.enc.Base64.stringify(
                CryptoJS.enc.Utf8.parse(data)
            );
        if (this.last_set_point == point) return;
        this.last_set_point = point;
        this.queue.normal = {
            type: "normal",
            url: `${this.endpoint}/${date_string}`,
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    date: { data, point, goal_point },
                    independent_data: {
                        data: CryptoJS.enc.Base64.stringify(
                            CryptoJS.enc.Utf8.parse(
                                JSON.stringify(this.DataStorage_class.independent_data)
                            )
                        )
                    }
                })
            },
            callback: callback,
            fetching: false
        };
        this.process_queue();
    }

    process_tersBOT(habits_json_data, streak_infos) {
        function get_unfinished_important_habits(name, data) {
            if (data && data.data && data.data.important && data.point < data.goal_point)
                unfinished_important_habits.push(name);
            else if (data && typeof data == "object")
                Object.entries(data)
                    .forEach(item => get_unfinished_important_habits(item[0], item[1]));
        }

        function get_streaks_info(streak_base_date, timestamp, dates) {
            const format_date = (date = new Date()) => {
                let day = date.getDate();
                let month = date.getMonth() + 1;
                if (day <= 9) day = `0${day}`;
                if (month <= 2) month = `0${month}`;
                return `${day}/${month}/${date.getFullYear()}`;
            };

            let streaks = [];
            let current_streak = [];
            let lost_count = 0;

            for (let i = 0; i < dates.length; i++) {
                let current_date = new Date(dates[i]).getTime();
                let previous_date = i > 0 ? new Date(dates[i - 1]).getTime() : null;
                if (current_date < new Date(streak_base_date).getTime())
                    continue;
                if (previous_date && previous_date + 86400000 !== current_date)
                    lost_count++;
                if (i === 0 || previous_date + 86400000 === current_date)
                    current_streak.push(current_date);
                else {
                    streaks.push(current_streak);
                    current_streak = [current_date];
                }
            }
            if (current_streak.length) streaks.push(current_streak);

            let current_streak_object =
                streaks.find(streak => streak.includes(timestamp))
                || streaks.find(streak => streak.includes(timestamp - 86400000))
                || { length: 0, 0: timestamp };
            let longest_streak = streaks.reduce(
                (maximum_streak, streak) => streak.length > maximum_streak.length ? streak : maximum_streak,
                []
            );

            let ongoing_penalty_count = 0;
            if (current_streak_object.length === 0) {
                let start_penalty_date = streaks[streaks.length - 1].slice(-1)[0] + 86400000;
                while (start_penalty_date < timestamp && ongoing_penalty_count < 2 * lost_count + 1) {
                    ongoing_penalty_count++;
                    start_penalty_date += 86400000;
                }
            }

            let ongoing_reward_count = Math.floor(current_streak_object.length / 30);

            return {
                current_streak_days: current_streak_object.length,
                current_streak_start_date: format_date(new Date(current_streak_object[0])),
                longest_streak_days: longest_streak.length,
                longest_streak_start_date: format_date(new Date(longest_streak[0] || timestamp)),
                penalty_days: 2 * (lost_count + (current_streak_object.length === 0)) + 1,
                ongoing_penalty_days:
                    current_streak_object.length === 0 && ongoing_penalty_count < 2 * lost_count + 1
                        ? 2 * lost_count + 1
                        : 0,
                ongoing_reward_count: ongoing_reward_count,
                ongoing_reward_date:
                    ongoing_reward_count > 0
                        ? format_date(new Date(
                            streaks[streaks.length - 1][0] + 30 * ongoing_reward_count * 86400000
                        ))
                        : 0,
                upcoming_reward_date:
                    current_streak_object.length !== 0 && ongoing_reward_count + 1 > 0
                        ? format_date(new Date(
                            streaks[streaks.length - 1][0] + 30 * (ongoing_reward_count + 1) * 86400000
                        ))
                        : 0,
            };
        }

        let unfinished_important_habits = [];
        Object.entries(habits_json_data)
            .forEach(item => get_unfinished_important_habits(item[0], item[1]));

        return {
            Mirmor: {
                timestamp: this.timestamp,
                unfinished_important_habits: unfinished_important_habits,
            },
            streak_infos: get_streaks_info(
                this.options.streak_base_date,
                this.timestamp,
                streak_infos.satisfied_dates
            ),
            quotes: this.options.tersBOT.quotes,
            year_quarter_goals: this.options.tersBOT.year_quarter_goals
        };
    }

    set_server_cache(callback) {
        this.queue.server_caching = {
            type: "server_caching",
            url: `${this.endpoint}/server_cache`,
            options: {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: this.server_cache })
            },
            callback: callback,
            fetching: false
        };
        this.process_queue();
    }

    process_queue() {
        const process_queue_type = type => {
            let callback = this.queue[type].callback;
            this.queue.is_fetching = true;
            this.fetch(
                this.queue[type].url,
                this.queue[type].options,
                json => {
                    this.queue.is_fetching = false;
                    callback(json);
                    this.process_queue();
                }
            );
            this.queue[type] = null;
        }

        if (this.queue.is_fetching)
            return;
        if (this.queue.normal)
            process_queue_type("normal");
        else if (this.queue.server_caching)
            process_queue_type("server_caching");
    }

    fetch(url, options, callback) {
        window.onbeforeunload = () => true;
        try {
            fetch(url, options)
                .then(response => response.json())
                .then(json => {
                    window.onbeforeunload = false;
                    callback(json);
                });
        } catch (error) {
            this.fetch(url, options, callback);
        }
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
                        getted_data => {
                            let status_element = document.createElement("span");
                            status_element.style.color = "var(--LIME)";
                            let point = json_data.point || json_data._point || 0;
                            let goal_point = json_data.goal_point || json_data._goal_point || 0;
                            status_element.innerHTML = `Đã lưu vào Notion! (${point} / ${goal_point} ≈ ${Math.floor(point / goal_point * 100)}%)`;
                            this.StatusBar_class.show_status(status_element);

                            this.DataStorage_class.independent_data =
                                JSON.parse(
                                    CryptoJS.enc.Base64.parse(getted_data.independent_data)
                                        .toString(CryptoJS.enc.Utf8)
                                    || "{}"
                                );

                            let { streak_infos } =
                                this.Habits_class.data.children.xem_thong_ke
                                    .Extension_class.ExtensionPopup_class
                                    .run_function("update_data", [
                                        getted_data.points,
                                        this.options.point_info_extension_parameters.percent_criterions,
                                        this.options.point_info_extension_parameters.chart_date_range
                                    ]);
                            this.Habits_class.data.children.xem_chuoi
                                .Extension_class.ExtensionPopup_class
                                .run_function("update_data", [
                                    streak_infos,
                                    this.timestamp,
                                    Object.keys(this.options
                                        .point_info_extension_parameters.percent_criterions)[0]
                                ]);

                            this.server_cache.tersBOT = this.process_tersBOT(json_data, streak_infos);
                            this.set_server_cache(() => {
                                let status_element = document.createElement("span");
                                status_element.style.color = "var(--LIME)";
                                status_element.innerHTML = `Đã lưu vào bộ nhớ đệm máy chú!`;
                                this.StatusBar_class.show_status(status_element);
                            });
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