class Data {
    constructor(Habits_class, options) {
        this.Habits_class = Habits_class;
        this.options = options;
    }

    to_object(data = this.Habits_class.data) {
        switch (data.type) {
            case "group": {
                let children = data.children;
                let children_data = {
                    _type: "group"
                };
                for (let key in children) {
                    let child = children[key];
                    children_data[key] = this.to_object(child);
                }
                return children_data;
            }

            case "habit_ext": {
                return {
                    data: data.Extension_class ? data.Extension_class.info.data : undefined,
                    _type: "habit_ext"
                };
            }

            case "habit_check": {
                return {
                    completed_time: data.completed_time,
                    _type: "habit_check"
                };
            }

            case "habit_number": {
                return {
                    value: data.value,
                    last_changed_time: data.last_changed_time,
                    _type: "habit_number"
                }
            }
        }
    }

    to_JSON(data = this.Habits_class.data, data_id = "") {
        switch (data.type) {
            case "group": {
                let children = data.children;
                let children_data = {
                    _point: 0,
                    _goal_point: 0
                };

                for (let key in children) {
                    let child = children[key];
                    let child_export = this.to_JSON(child, data_id + " " + key);
                    children_data[child.name] = child_export;
                    children_data._point += child_export._point || child_export.point || 0;
                    children_data._goal_point += child_export._goal_point || child_export.goal_point || 0;
                }

                return JSON.parse(JSON.stringify(children_data));
            }

            case "habit_ext": {
                if (data.Extension_class) {
                    return {
                        point: data.Extension_class.info.point,
                        goal_point: data.Extension_class.info.goal_point,
                        data: JSON.parse(JSON.stringify(data.Extension_class.info.data || {}))
                    };
                } else {
                    return {
                        point: undefined,
                        goal_point: undefined,
                        data: undefined
                    }
                }
            }

            case "habit_check": {
                let is_required =
                    typeof data.required == "function"
                        ? data.required({
                            XDate_function: this.options.XDate_function,
                            get_cumulative_info: () => this.options.get_cumulative_info(data)
                        })
                        : data.required;

                return {
                    point: data.completed_time ? data.point : 0,
                    goal_point: is_required ? data.point : 0,
                    data: {
                        important: data.important,
                        required_function: data.required.toString(),
                        completed_time: data.completed_time
                    }
                };
            }

            case "habit_number": {
                let is_required =
                    typeof data.required == "function"
                        ? data.required({
                            XDate_function: this.options.XDate_function,
                            get_cumulative_info: () => this.options.get_cumulative_info(data)
                        })
                        : data.required;

                return {
                    point: data.value ? (data.point_per_value * data.value) : 0,
                    goal_point: is_required ? (data.point_per_value * data.goal_value) : 0,
                    data: {
                        important: data.important,
                        required_function: data.required.toString(),
                        unit: data.unit,
                        value: data.value,
                        last_changed_time: data.last_changed_time
                    }
                };
            }
        }
    }

    to_string(HomepageView_class_data, data = this.Habits_class.data, layer = 0, data_id = ``) {
        const CUMULATIVE_PERIOD_NAME = {
            "week": "tuần",
            "month": "tháng",
            "year_quarter": "quý",
            "year_half": "nửa năm",
            "year": "năm"
        };

        let add_indent =
            (string, indent_times = layer) =>
                this.options.line_indent.repeat(indent_times) + string;

        switch (data.type) {
            case "group": {
                let strings = [];

                let point = 0;
                let goal_point = 0;

                let children = data.children;
                for (let key in children) {
                    let child = children[key];
                    let child_export = this.to_string(HomepageView_class_data, child, layer + 1, `${data_id} ${key}`);

                    for (let string of child_export.strings) {
                        strings.push(string);
                    }

                    point += child_export.point;
                    goal_point += child_export.goal_point;
                }

                let view_scroll_top = HomepageView_class_data.scroll[data_id]?.top || 0;
                let view_scroll_left = HomepageView_class_data.scroll[data_id]?.left || 0;
                let is_current_view =
                    data_id == HomepageView_class_data.view_id
                        ? ` <Giao diện hiện tại; cuộn xuống vị trí ${view_scroll_top} px từ lề trên, ${view_scroll_left} px từ lề trái>`
                        : ``;

                strings.unshift(
                    add_indent(
                        `${data.name} [${point} / ${goal_point} điểm]${is_current_view}`
                    )
                );

                if (layer == 0) {
                    return strings.join(this.options.line_spacing);
                } else {
                    return { strings, point, goal_point };
                }
            }

            case "habit_ext": {
                let strings = [];

                let point = data.Extension_class.info.point || 0;
                let goal_point = data.Extension_class.info.goal_point || 0;

                strings.push(
                    add_indent(
                        `${data.name} [${point} / ${goal_point} điểm]`
                    )
                );

                let data_lines =
                    JSON.stringify(
                        data.Extension_class.info.data || {},
                        null,
                        this.options.line_indent
                    ).split(`\n`);
                data_lines[0] = `Dữ liệu tiện ích: ` + data_lines[0];
                for (let [index, line] of data_lines.entries()) {
                    data_lines[parseInt(index)] = add_indent(line, layer + 1);
                }
                data_lines = data_lines.join(`\n`);
                strings.push(data_lines);

                return { strings, point, goal_point };
            }

            case "habit_check": {
                let strings = [];

                let is_required =
                    typeof data.required == "function"
                        ? data.required({
                            XDate_function: this.options.XDate_function,
                            get_cumulative_info: () => this.options.get_cumulative_info(data)
                        })
                        : data.required;
                let point = data.completed_time ? data.point : 0;
                let goal_point = is_required ? data.point : 0;
                let max_point = data.point;
                let completed_time_string =
                    data.completed_time
                        ? (`Hoàn thành lúc ` + data.completed_time)
                        : `Chưa hoàn thành`;
                let technical_note = [];
                if (data.cumulative_period)
                    technical_note.push(`Tích luỹ theo`
                        + ` ${CUMULATIVE_PERIOD_NAME[data.cumulative_period]}`);
                if (data.important)
                    technical_note.push(`Quan trọng`);
                if (technical_note.length > 0)
                    technical_note = ` {${technical_note.join(" ; ")}}`;

                strings.push(
                    add_indent(
                        `${data.name}`
                        + ` [${point} / ${goal_point} (${max_point}) điểm]`
                        + `${technical_note}`
                        + ` <${completed_time_string}>`
                    )
                );
                if (typeof data.required != "boolean") {
                    strings.push(
                        add_indent(`Hàm xác định tính bắt buộc: ` + data.required.toString(), layer + 1)
                    );
                }
                if (data.cumulative_data) {
                    let data_lines =
                        JSON.stringify(
                            data.cumulative_data,
                            null,
                            this.options.line_indent
                        ).split(`\n`);
                    data_lines[0] = `Dữ liệu tích luỹ: ` + data_lines[0];
                    for (let [index, line] of data_lines.entries()) {
                        data_lines[parseInt(index)] = add_indent(line, layer + 1);
                    }
                    data_lines = data_lines.join(`\n`);
                    strings.push(data_lines);
                }

                return { strings, point, goal_point };
            }

            case "habit_number": {
                let strings = [];

                let is_required =
                    typeof data.required == "function"
                        ? data.required({
                            XDate_function: this.options.XDate_function,
                            get_cumulative_info: () => this.options.get_cumulative_info(data)
                        })
                        : data.required;
                let point = data.last_changed_time ? (data.point_per_value * data.goal_value) : 0;
                let goal_point = is_required ? (data.point_per_value * data.goal_value) : 0;
                let max_point = data.point_per_value * data.goal_value;
                let last_changed_time_string =
                    data.last_changed_time
                        ? (`Sửa đổi lần cuối lúc ` + data.last_changed_time)
                        : `Chưa sửa đổi`;
                let technical_note = [];
                if (data.cumulative_period)
                    technical_note.push(`Tích luỹ theo`
                        + ` ${CUMULATIVE_PERIOD_NAME[data.cumulative_period]}`);
                if (data.important)
                    technical_note.push(`Quan trọng`);
                if (technical_note.length > 0)
                    technical_note = ` {${technical_note.join(" ; ")}}`;

                strings.push(
                    add_indent(
                        `${data.name}`
                        + ` [${point} / ${goal_point} (${max_point}) điểm`
                        + ` ; ${data.value || 0} / ${data.goal_value} ${data.unit}]`
                        + `${technical_note}`
                        + ` <${last_changed_time_string}>`,
                    )
                );
                if (typeof data.required != "boolean") {
                    strings.push(
                        add_indent(`Hàm xác định tính bắt buộc: ` + data.required.toString(), layer + 1)
                    );
                }
                if (data.cumulative_data) {
                    let data_lines =
                        JSON.stringify(
                            data.cumulative_data,
                            null,
                            this.options.line_indent
                        ).split(`\n`);
                    data_lines[0] = `Dữ liệu tích luỹ: ` + data_lines[0];
                    for (let [index, line] of data_lines.entries()) {
                        data_lines[parseInt(index)] = add_indent(line, layer + 1);
                    }
                    data_lines = data_lines.join(`\n`);
                    strings.push(data_lines);
                }

                return { strings, point, goal_point };
            }
        }
    }
}