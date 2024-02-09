class Habits {
    constructor(
        habit_database,
        extension_database,
        data_onchange_callback,
        exported_data,
        XDate_function
    ) {
        this.data = { ...habit_database };
        this.extension_database = extension_database;
        this.data_onchange_callback = data_onchange_callback;
        this.XDate_function = XDate_function;

        if (exported_data)
            this.import_data(exported_data);
        this.assign_Extension_class();
    }

    import_data(exported_data, data = this.data) {
        if (!exported_data
            || (data.type != exported_data._type)) {
            return;
        }

        switch (data.type) {
            case "group": {
                let children = data.children;
                for (let key in children) {
                    let child = children[key];
                    this.import_data(exported_data[key], child);
                }
                break;
            }

            case "habit_ext": {
                data.Extension_class = exported_data.data;
                break;
            }

            case "habit_check": {
                data.completed_time = exported_data.completed_time;
                break;
            }

            case "habit_number": {
                data.value = exported_data.value;
                data.last_changed_time = exported_data.last_changed_time;
                break;
            }
        }
    }

    get_data(data_id) {
        if (data_id == "") {
            return this.data;
        }
        let data = this.data;
        let keys = data_id.trim().split(" ");
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (data.type === "group") {
                data = data.children[key];
            } else {
                return data;
            }
        }
        return data;
    }

    set_data(data_id, data) {
        let keys = data_id.split(" ");
        let last_key = keys.pop();
        let parent_data = this.get_data(keys.join(" "));
        if (parent_data.type === "group") {
            parent_data.children[last_key] = data;
        } else {
            parent_data = data;
        }

        if (this.data_onchange_callback) {
            this.data_onchange_callback();
        }
    }

    assign_Extension_class(data = this.data) {
        if (data.type === "group") {
            for (let key in data.children) {
                let child = data.children[key];
                this.assign_Extension_class(child);
            }
        } else if (data.type === "habit_ext") {
            let extension_data = undefined;
            let importing_flag = data.Extension_class && data.Extension_class.constructor.name == "Object";
            if (importing_flag) {
                extension_data = data.Extension_class;
            }

            let extension_setting = this.extension_database[data.extension_id];

            if (extension_setting) {
                data.Extension_class =
                    new Extension(
                        this.extension_database,
                        data.extension_id,
                        (options) => this.data_onchange_callback(options),
                        this.XDate_function
                    );
            } else {
                data.Extension_class = undefined;
            }

            if (importing_flag && extension_setting && extension_data) {
                data.Extension_class.import_data(extension_data);
            }
        }
    }

    toggle_habit_check(data_id) {
        let data = this.get_data(data_id);
        if (data.type == "habit_check") {
            if (data.completed_time) {
                data.completed_time = null;
            } else {
                data.completed_time = Date.now();
            }
        }
        if (this.data_onchange_callback) {
            this.data_onchange_callback();
        }
    }

    edit_habit_number(data_id, value) {
        let data = this.get_data(data_id);
        if (data.type == "habit_number") {
            if (data.value != value) {
                data.value = value;
                data.last_changed_time = Date.now();
            }
        }
        if (this.data_onchange_callback) {
            this.data_onchange_callback();
        }
    }

    open_habit_extension(data_id) {
        let data = this.get_data(data_id);
        if (data.type === "habit_ext") {
            data.Extension_class.open_popup();
        }
    }
}
