class CheckboxInput {
    constructor(data, input_list_element, info_onchange_callback) {
        this.data = data;
        this.input_list_element = input_list_element;
        this.info_onchange_callback = info_onchange_callback;
        this.generate_input_list();
        this.update_box_color();
    }

    generate_input_list() {
        this.clear_input_list();
        for (let key in this.data) {
            let item = this.data[key];

            let label = document.createElement("label");

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = key;
            this.set_event_for_inputs(checkbox);
            label.appendChild(checkbox);

            let span = document.createElement("span");
            span.innerHTML = item.name;
            label.appendChild(span);

            let div = document.createElement("div");
            div.className = "box checkbox_input";
            div.onclick = event => {
                if (!event.path?.includes(label)
                    && !event.path?.includes(checkbox)) {
                    checkbox.click();
                }
            };
            div.appendChild(label);

            this.input_list_element.appendChild(div);
        }
    }

    set_event_for_inputs(element) {
        let events = ["change", "mouseup", "mousedown", "click"];
        for (let i = 0; i < events.length; i++) {
            element.addEventListener(events[i], () => this.checkbox_changed(element));
        }
    }

    checkbox_changed(element) {
        let id = element.id;
        let item = this.data[id];
        if (element.checked) {
            item.checked_time = Date.now();
        } else {
            item.checked_time = undefined;
        }
        this.update_box_color();
        this.info_onchange_callback();
    }

    toggle_check(checkbox_id, force_checked_status) {
        let checkbox = this.input_list_element.querySelector(`#${checkbox_id}`);
        if (force_checked_status != undefined) {
            if (force_checked_status != checkbox.checked) {
                checkbox.click();
            }
        } else {
            checkbox.click();
        }
    }

    clear_input_list() {
        let box_list = this.input_list_element.querySelectorAll(".box");
        for (let box of box_list) {
            box.remove();
        }
    }

    update_box_color() {
        for (let key in this.data) {
            let item = this.data[key];
            let checkbox = this.input_list_element.querySelector(`#${key}`);
            let box = checkbox.parentElement.parentElement;
            if (item.checked_time || !item.required) {
                box.style.backgroundColor = "var(--LEMON)";
            } else {
                box.style.backgroundColor = "";
            }
        }
    }

    import_data(exported_data) {
        for (let key in this.data) {
            let item = this.data[key];
            let checkbox = this.input_list_element.querySelector(`#${key}`);
            if (exported_data[key] && exported_data[key].checked_time) {
                checkbox.checked = true;
                item.checked_time = exported_data[key].checked_time;
            } else {
                checkbox.checked = false;
                item.checked_time = undefined;
            }
            this.checkbox_changed(checkbox);
        }
        this.info_onchange_callback();
    }

    get_point() {
        let point = 0;
        for (let key in this.data) {
            let item = this.data[key];
            if (item.checked_time) {
                point += item.point_if_checked;
            }
        }
        return point;
    }

    get_goal_point() {
        let goal_point = 0;
        for (let key in this.data) {
            let item = this.data[key];
            if (item.required) {
                goal_point += item.point_if_checked;
            }
        }
        return goal_point;
    }
}