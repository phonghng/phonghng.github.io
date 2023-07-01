class HomepageView {
    constructor(data, Habits_class, Data_class, elements, on_data_change, tab_close_confirm) {
        this.data = {
            view_id: data?.view_id || "",
            scroll: data?.scroll || {}
        };
        this.Habits_class = Habits_class;
        this.Data_class = Data_class;
        this.elements = elements;
        this.on_data_change = () => on_data_change(this.data);

        this.init_elements();
        this.update_view();
        this.on_data_change();

        if (tab_close_confirm) {
            window.onbeforeunload = () => true;
        }
    }

    init_elements() {
        let top_container = this.elements.top_container;

        let go_back_button = document.createElement("button");
        go_back_button.id = "go_back";
        top_container.appendChild(go_back_button);

        let view_name = document.createElement("h2");
        view_name.id = "view_name";
        top_container.appendChild(view_name);

        let item_list = document.createElement("div");
        item_list.id = "item_list";
        top_container.appendChild(item_list);

        this.elements = { top_container, go_back_button, view_name, item_list };
    }

    get_view_data() {
        return this.Habits_class.get_data(this.data.view_id);
    }

    change_view(view_id) {
        this.data.view_id = view_id;
        this.update_view();
        this.on_data_change();
    }

    get_point_info(data_id) {
        let data = this.Habits_class.get_data(data_id);
        let JSON_data = this.Data_class.to_JSON(data);
        let point = JSON_data.point || JSON_data._point || 0;
        let goal_point = JSON_data.goal_point || JSON_data._goal_point || 0;
        let percent =
            (goal_point != 0)
                ? (point / goal_point * 100)
                : (point >= 0 ? 100 : 0);
        return { point, goal_point, percent };
    }

    generate_view_header() {
        let view_id = this.data.view_id;
        let view_data = this.get_view_data();

        let view_id_keys = view_id.split(" ");
        view_id_keys.pop();
        let upper_view_id = view_id_keys.join(" ");
        let upper_view_data = this.Habits_class.get_data(upper_view_id);

        if (view_id != "") {
            this.elements.go_back_button.innerHTML = `Quay lại "${upper_view_data.name}"`;
            this.elements.go_back_button.style.display = "block";
            this.elements.go_back_button.onclick = () => {
                this.change_view(upper_view_id);
            };
        } else {
            this.elements.go_back_button.innerHTML = "";
            this.elements.go_back_button.style.display = "none";
        }

        this.elements.view_name.innerHTML = view_data.name;

        let view_point_info = this.get_point_info(view_id);
        let view_point_element = document.createElement("div");
        view_point_element.className = "box item_point";
        view_point_element.innerHTML = `${view_point_info.point} / ${view_point_info.goal_point} ≈ ${Math.round(view_point_info.percent)}%`;
        if (view_point_info.percent >= 100) {
            view_point_element.style.backgroundColor = "var(--LEMON)";
        }
        this.elements.view_name.appendChild(view_point_element);
    }

    generate_view_item_list() {
        let view_data = this.get_view_data();
        let { item_list } = this.elements;

        while (item_list.firstChild) {
            item_list.removeChild(item_list.firstChild);
        }

        for (let item_key in view_data.children) {
            let item_id = `${this.data.view_id} ${item_key}`;
            let item_data = view_data.children[item_key];
            let item_point_info = this.get_point_info(item_id);

            let item_element = document.createElement("div");
            item_element.className = "box item " + item_data.type;

            let item_title_element = document.createElement("div");
            item_title_element.className = "item_title";
            item_title_element.innerHTML = item_data.name;
            item_element.appendChild(item_title_element);

            let item_point_element = document.createElement("div");
            item_point_element.className = "box item_point";
            item_point_element.innerHTML = `${item_point_info.point} / ${item_point_info.goal_point} ≈ ${Math.round(item_point_info.percent)}%`;
            if (item_point_info.percent >= 100) {
                item_point_element.style.backgroundColor = "var(--LEMON)";
            }
            item_element.appendChild(item_point_element);

            let item_button_element = document.createElement("button");
            item_button_element.className = "item_button";
            this.generate_view_item_button(item_id, item_data, item_button_element);
            item_element.appendChild(item_button_element);

            item_list.appendChild(item_element);
        }
    }

    generate_view_item_button(item_id, item_data, item_button_element) {
        switch (item_data.type) {
            case "group": {
                item_button_element.innerHTML = "Mở";
                item_button_element.onclick = () => {
                    this.change_view(item_id);
                };
                break;
            }

            case "habit_ext": {
                if (item_data.Extension_class) {
                    item_button_element.innerHTML = "Mở";
                } else {
                    item_button_element.innerHTML = "Lỗi";
                    item_button_element.title = "Không tìm thấy!";
                    item_button_element.disabled = true;
                    item_button_element.style.color = "var(--TOMATO)";
                }

                item_button_element.onclick = () => {
                    this.Habits_class.open_habit_extension(item_id);
                };

                break;
            }

            case "habit_check": {
                if (item_data.completed_time) {
                    item_button_element.innerHTML = "✔";
                    item_button_element.classList.add("checked");
                    item_button_element.classList.remove("not_checked");
                } else {
                    item_button_element.innerHTML = "✖";
                    item_button_element.classList.add("not_checked");
                    item_button_element.classList.remove("checked");
                }

                item_button_element.onclick = () => {
                    this.Habits_class.toggle_habit_check(item_id);
                    this.generate_view_item_list();
                };

                break;
            }

            case "habit_number": {
                item_button_element.innerHTML = item_data.value || 0;

                item_button_element.onclick = () => {
                    let prompt_text =
                        `${item_data.name.toUpperCase()}\n`
                        + `\n`
                        + `Đơn vị tính: ${item_data.unit}\n`
                        + `Mục tiêu: ${item_data.goal_value} ${item_data.unit}\n`
                        + `\n`
                        + `Nhập giá trị muốn sửa:`;
                    let prompt_value = prompt(prompt_text, item_data.value || 0);
                    let new_value = Number(prompt_value || item_data.value);
                    this.Habits_class.edit_habit_number(item_id, new_value);
                    this.generate_view_item_list();
                };

                break;
            }
        }
    }

    get_scroll_position(target) {
        const DOCUMENT = window.document;
        if (target == DOCUMENT) {
            let top =
                window.pageYOffset
                || DOCUMENT.documentElement.scrollTop
                || DOCUMENT.body.scrollTop
                || 0;
            let left =
                window.pageXOffset
                || DOCUMENT.documentElement.scrollLeft
                || DOCUMENT.body.scrollLeft
                || 0;
            return { top, left };
        } else {
            return {
                top: target.scrollTop,
                left: target.scrollLeft
            };
        }
    }

    bind_scroll_position_saving() {
        let { top_container } = this.elements;
        top_container.onscroll = (event) => {
            let target = event.target;
            this.data.scroll[this.data.view_id] = this.get_scroll_position(target);
            this.on_data_change();
        };
    }

    restore_scroll_position() {
        let { top, left } =
            this.data.scroll[this.data.view_id] || { top: 0, left: 0 };

        const DOCUMENT = window.document;
        let { top_container } = this.elements;

        if (top_container == DOCUMENT.body) {
            let scroll_element = DOCUMENT.documentElement || DOCUMENT.body;
            scroll_element.scrollTo(left, top)
        } else {
            top_container.scrollTo(left, top);
        }
    }

    update_view() {
        this.generate_view_header();
        this.generate_view_item_list();
        this.restore_scroll_position();
        this.bind_scroll_position_saving();
    }
}
