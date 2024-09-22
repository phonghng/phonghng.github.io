class PHNotion_Hey_Mirmor {
    constructor(
        encrypted_endpoint,
        habit_database = HABITS,
        extension_database = EXTENSIONS,
        homepage_top_container = document.body,
        options
    ) {
        this.timestamp = new Date(new URL(location.href).searchParams.get("date")).getTime() || new Date().getTime();
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
                    "2024-06-05": 0.80,
                    "2024-09-14": 0.85
                },
                chart_date_range: ["2024-09-23", "2024-12-31"]
            },
            streak_base_date: "2024-09-23",
            tersBOT: {
                quotes: [
                    "Người tích cực sẽ giống như mặt trời vậy, dù ở bất cứ nơi đâu cũng có thể toả sáng. Chỉ khi giữ được một trái tim bình lặng, cậu mới có thể không sợ hãi mà bình thản đối mặt với mọi biến cố. Chỉ khi có được một tâm hồn rộng mở, cậu mới có thể tìm thấy được sức mạnh khiến cậu làm được những gì mà bản thân mong muốn. Hy vọng rằng tất cả chúng ta đều có thể giữ được tâm thái thật tốt, vững vàng không sợ hãi mà tiến về phía trước.",
                    "Học để làm việc, làm người, làm cán bộ. Học để phụng sự đoàn thể, giai cấp và nhân dân, tổ quốc và nhân loại. Muốn đạt được mục đích thì phải cần, kiệm, liêm, chính, chí công, vô tư.",
                    "Thời gian sẽ trôi qua mà không để lại bất cứ một dấu vết với những người không biết nhìn về tương lai bằng bộ óc thông minh và sự khổ luyện. Hạnh phúc chắc chắn sẽ dành cho người biết sử dụng thời gian, siêng năng như con kiến chăm chỉ tha mồi về tổ",
                ],
                year_quarter_goals: [
                    "Theo sát lớp học (2 tiếng/ngày)",
                    "2⭐ Roadmap (2 tiếng/ngày)",
                    "7.5 IELTS (1 tiếng/ngày)"
                ]
            }
        });
        this.StatusBar_class = new StatusBar(this.homepage_top_container);

        this.endpoint = this.get_endpoint(encrypted_endpoint);

        this.server_cache = {};
        this.initialization_data;
        this.last_set_point;
        this.queue = [];

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
        this.queue.push({
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
        });
        this.process_queue();
    }

    process_tersBOT(habits_json_data, streak_infos) {
        function get_unfinished_important_habits(name, data) {
            if (data.data && data.data.important && data.point < data.goal_point)
                unfinished_important_habits.push(name);
            else if (typeof data == "object")
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
                if (current_date > streak_base_date
                    && previous_date
                    && previous_date + 86400000 !== current_date)
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

            let reward_date =
                new Date(streaks[streaks.length - 1][0]
                    + 7 * Math.floor(current_streak_object.length / 7) * 86400000);

            return {
                current_streak_days: current_streak_object.length,
                current_streak_start_date: format_date(new Date(current_streak_object[0])),
                longest_streak_days: longest_streak.length,
                longest_streak_start_date: format_date(new Date(longest_streak[0] || timestamp)),
                penalty_days: 2 * (lost_count + (current_streak_object.length === 0)) + 1,
                ongoing_penalty_days:
                    current_streak_object.length === 0 && ongoing_penalty_count < 2 * lost_count + 1
                        ? 2 * lost_count + 1 : 0,
                reward_amount:
                    current_streak_object.length > 0
                        ? 5000 * Math.floor(current_streak_object.length / 7) : 0,
                reward_date:
                    current_streak_object.length > 0
                        ? format_date(reward_date) : 0
            };
        }

        let unfinished_important_habits = [];
        Object.entries(habits_json_data)
            .forEach(item => get_unfinished_important_habits(item[0], item[1]));

        return {
            unfinished_important_habits: unfinished_important_habits,
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
        this.queue.push({
            type: "server_caching",
            url: `${this.endpoint}/server_cache`,
            options: {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: this.server_cache })
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

        if (this.queue[0].type == "server_caching" && this.queue.length > 1) {
            this.queue.shift();
            this.process_queue();
        }

        this.queue[0].fetching = true;
        this.fetch(
            this.queue[0].url,
            this.queue[0].options,
            json => {
                let shifted_item = this.queue.shift();
                shifted_item.callback(json);
                this.process_queue();
            }
        );
    }

    fetch(url, options, callback) {
        window.onbeforeunload = () => true;
        fetch(url, options)
            .then(response => response.json())
            .then(json => {
                window.onbeforeunload = false;
                callback(json);
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