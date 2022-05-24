class ExtensionPopup {
    constructor(extension_id, info_onchange_callback) {
        this.setting = EXTENSIONS[extension_id];
        this.popup = this.make_popup();
        this.set_document_click_event();
        this.info_onchange_callback = info_onchange_callback;
    }

    set_document_click_event() {
        let unfocus_all_popups = event => {
            let path = event.path || (event.composedPath && event.composedPath());
            for (let i = 0; i < path.length; i++) {
                if (path[i].classList && path[i].classList.contains("extension_popup_wrapper")) {
                    return;
                }
            }

            let popups = document.querySelectorAll(".extension_popup_wrapper");
            for (let i = 0; i < popups.length; i++) {
                popups[i].classList.add("not_focus");
                popups[i].classList.remove("focus");
            }
        };
        document.onclick = event => unfocus_all_popups(event);
        document.onmouseup = event => unfocus_all_popups(event);
        document.onmousedown = event => unfocus_all_popups(event);
    }

    make_popup() {
        let popup_wrapper = document.createElement("div");
        popup_wrapper.className = "extension_popup_wrapper";
        popup_wrapper.style.display = "none";
        popup_wrapper.onclick = () => this.focus();
        popup_wrapper.onmousedown = () => this.focus();
        popup_wrapper.onmouseup = () => this.focus();

        let popup = document.createElement("div");
        popup.className = "popup";

        let header = document.createElement("div");
        header.className = "header";

        let title_wrapper = document.createElement("div");
        title_wrapper.className = "title_wrapper";

        let title = document.createElement("div");
        title.className = "title";
        title.innerText = this.setting.name;
        title_wrapper.appendChild(title);

        header.appendChild(title_wrapper);

        let close_button = document.createElement("button");
        close_button.className = "close_button";
        close_button.title = "Đóng tiện ích";
        close_button.innerHTML = "&times;";
        close_button.addEventListener("click", event => {
            this.update_info();
            this.close(popup_wrapper, event);
        });
        header.appendChild(close_button);

        popup.appendChild(header);

        let iframe = document.createElement("iframe");
        iframe.src = "./extensions/" + this.setting.filename;
        popup.appendChild(iframe);

        popup_wrapper.appendChild(popup);

        document.body.appendChild(popup_wrapper);

        $(popup_wrapper).draggable({
            handle: ".popup .header .title"
        });
        $(popup_wrapper).resizable({
            handles: "all"
        });

        this.iframe_window = iframe.contentWindow;
        this.iframe_window.info_onchange = () => this.update_info();
        this.iframe_window.addEventListener("DOMContentLoaded", () => {
            this.iframe_window.info_onchange = () => this.update_info();
            this.update_info();
        });
        this.iframe_window.onclick = () => this.focus();
        this.iframe_window.onmouseup = () => this.focus();
        this.iframe_window.onmousedown = () => this.focus();

        return popup_wrapper;
    }

    focus() {
        let popups = document.querySelectorAll(".extension_popup_wrapper");
        for (let i = 0; i < popups.length; i++) {
            if (popups[i] != this.popup) {
                popups[i].classList.add("not_focus");
                popups[i].classList.remove("focus");
            } else {
                popups[i].classList.add("focus");
                popups[i].classList.remove("not_focus");
            }
        }
    }

    delete() {
        this.popup.remove();
    }

    close(popup, event) {
        if (!popup) {
            popup = this.popup;
        }
        popup.style.display = "none";
        event.preventDefault();
    }

    show() {
        this.popup.style.display = "block";
        let scroll_top = document.documentElement.scrollTop || document.body.scrollTop;
        let scroll_left = document.documentElement.scrollLeft || document.body.scrollLeft;
        let window_width = window.innerWidth;
        let window_height = window.innerHeight;
        let popup_width = window_width / 2;
        let popup_height = window_height / 2;
        let popup_left = scroll_left + (window_width - popup_width) / 2;
        let popup_top = scroll_top + (window_height - popup_height) / 2;
        this.popup.style.left = popup_left + "px";
        this.popup.style.top = popup_top + "px";
        this.popup.style.width = popup_width + "px";
        this.popup.style.height = popup_height + "px";
        this.focus();
        setTimeout(() => {
            this.focus();
        }, 0);
    }

    update_info() {
        let info = this.iframe_window.export_info();
        if (this.info_onchange_callback) {
            this.info_onchange_callback(info);
        }
    }

    import_info(info) {
        if (this.iframe_window.import_info) {
            this.iframe_window.import_info(info);
            this.update_info();
        } else {
            this.iframe_window.addEventListener("DOMContentLoaded", () => {
                this.iframe_window.import_info(info);
                this.update_info();
            });
        }
    }
}

class StatusBar {
    constructor() {
        let status_bar = document.createElement("div");
        status_bar.id = "status_bar";
        document.body.appendChild(status_bar);
        this.element = status_bar;
        this.status_bar_timeout = undefined;
        this.history = {
            _example_timestamp: ["status", "status_element"]
        };
    }

    get_time_string() {
        let time_full_string = new Date().toLocaleString();
        let time_short_string = new Date().toLocaleTimeString().replace(" ", "");
        return { time_full_string, time_short_string };
    }

    generate_default_status(exported_data) {
        let { time_full_string, time_short_string } = this.get_time_string();
        let { _total_point, _goal_point } = exported_data;

        let status_element = document.createElement("span");

        let status_time_element = document.createElement("span");
        status_time_element.innerHTML = `Mốc thời gian: ${time_short_string}`;
        status_time_element.title = time_full_string;
        status_element.appendChild(status_time_element);

        status_element.appendChild(document.createElement("br"));

        let status_point_element = document.createElement("span");
        status_point_element.innerHTML = `Điểm hiện tại: ${_total_point} / ${_goal_point}`;
        status_point_element.title = `~${Math.round(_total_point / _goal_point * 100)}% so với mục tiêu`;
        status_element.appendChild(status_point_element);

        status_element.appendChild(document.createElement("br"));

        let status_consolelog_button = document.createElement("a");
        status_consolelog_button.innerHTML = `Xem chi tiết`;
        status_consolelog_button.title = `Ghi dữ liệu đã xuất ra "bàn điều khiển" (console) để xem chi tiết`;
        status_consolelog_button.onclick = () => console.log(exported_data, this);
        status_element.appendChild(status_consolelog_button);

        return status_element;
    }

    show_status(status) {
        let status_element = status;

        if (typeof status === "object") {
            status_element = this.generate_default_status(status);
        } else if (typeof status === "string") {
            status_element = document.createElement("span");
            status_element.innerHTML = status;
        }

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
        document.querySelector("#status_bar").appendChild(status_element);
        document.querySelector("#status_bar").style.display = "block";

        this.history[Date.now()] = [status, status_element];
        this.clean_history();

        if (this.status_bar_timeout) {
            clearTimeout(this.status_bar_timeout);
        }
        this.status_bar_timeout = setTimeout(() => {
            document.querySelector("#status_bar").style.display = "none";
        }, 5000);
    }

    clean_history() {
        let keys = Object.keys(this.history);
        while (keys.length > 10) {
            let key = keys.shift();
            delete this.history[key];
        }
    }
}

class HomepageView {
    constructor(default_view_id, Habits_class, elements, on_view_id_change) {
        this.current_view_id = default_view_id;
        this.on_view_id_change = on_view_id_change;
        this.Habits_class = Habits_class;
        this.elements = elements;
        this.generate_view_header();
        this.generate_view_item_list();
    }

    get_view_data() {
        return this.Habits_class.get_data(this.current_view_id);
    }

    change_view(view_id) {
        this.current_view_id = view_id;
        this.generate_view_header();
        this.generate_view_item_list();
        if (this.on_view_id_change) {
            this.on_view_id_change(view_id);
        }
    }

    get_point_info(data_id) {
        let data = this.Habits_class.get_data(data_id);
        let formatted_data = this.Habits_class.export_data_formatted(data);
        let point = formatted_data.point || formatted_data._total_point || 0;
        let goal_point = formatted_data.goal_point || formatted_data._goal_point || 0;
        let percent = goal_point == 0 ? 100 : Math.round(point / goal_point * 100);
        return { point, goal_point, percent };
    }

    generate_view_header() {
        let view_data = this.get_view_data();

        let current_view_id_keys = this.current_view_id.split(" ");
        current_view_id_keys.pop();
        let upper_view_id = current_view_id_keys.join(" ");
        let upper_view_data = this.Habits_class.get_data(upper_view_id);

        if (this.current_view_id != "") {
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
        this.elements.view_description.innerHTML = view_data.description;

        let view_point_info = this.get_point_info(this.current_view_id);
        let view_point_element = document.createElement("div");
        view_point_element.className = "box item_point";
        view_point_element.title = `Điểm hiện tại: ${view_point_info.point} / ${view_point_info.goal_point} (~${view_point_info.percent}% so với mục tiêu)`;
        view_point_element.innerHTML = `${view_point_info.point} / ${view_point_info.goal_point}`;
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
            let item_id = `${this.current_view_id} ${item_key}`;
            let item_data = view_data.children[item_key];
            let item_point_info = this.get_point_info(item_id);

            let item_element = document.createElement("div");
            item_element.className = "box item " + item_data.type;

            let item_info_element = document.createElement("div");
            item_info_element.className = "item_info";

            let item_title_element = document.createElement("div");
            item_title_element.className = "item_title";
            item_title_element.innerHTML = item_data.name;

            let item_point_element = document.createElement("div");
            item_point_element.className = "box item_point";
            item_point_element.title = `Điểm hiện tại: ${item_point_info.point} / ${item_point_info.goal_point} (~${item_point_info.percent}% so với mục tiêu)`;
            item_point_element.innerHTML = `${item_point_info.point} / ${item_point_info.goal_point}`;
            if (item_point_info.percent >= 100) {
                item_point_element.style.backgroundColor = "var(--LEMON)";
            }

            item_title_element.appendChild(item_point_element);
            item_info_element.appendChild(item_title_element);

            let item_description_element = document.createElement("div");
            item_description_element.className = "item_description";
            item_description_element.innerHTML = item_data.description;
            item_info_element.appendChild(item_description_element);

            item_element.appendChild(item_info_element);

            let item_button_element = document.createElement("button");
            item_button_element.className = "item_button";

            switch (item_data.type) {
                case "group":
                    item_button_element.innerHTML = "Mở";
                    item_button_element.onclick = () => {
                        this.change_view(item_id);
                    };
                    break;

                case "habit_ext":
                    item_button_element.innerHTML = "Mở";
                    item_button_element.onclick = () => {
                        this.Habits_class.open_habit_extension(item_id);
                    };
                    break;

                case "habit_check":
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

            item_element.appendChild(item_button_element);

            item_list.appendChild(item_element);
        }
    }

    update_view() {
        this.generate_view_header();
        this.generate_view_item_list();
    }
}