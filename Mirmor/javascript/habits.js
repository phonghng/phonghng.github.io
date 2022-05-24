class Habits {
    constructor(habit_database, extension_database, data_onchange_callback) {
        this.habit_database = habit_database;
        this.extension_database = extension_database;
        this.data_onchange_callback = data_onchange_callback;
        this.data = JSON.parse(JSON.stringify(this.habit_database));
        this.assign_Extension_class();
    }

    export_data_formatted(data = this.data) {
        switch (data.type) {
            case "group":
                let children = data.children;
                let children_data = {
                    _total_point: 0,
                    _goal_point: 0
                };

                for (let key in children) {
                    let child = children[key];
                    let child_export = this.export_data_formatted(child);
                    children_data[child.name] = child_export;
                    children_data._total_point += child_export._total_point || child_export.point || 0;
                    children_data._goal_point += child_export._goal_point || child_export.goal_point || 0;
                }

                return children_data;

            case "habit_ext":
                return {
                    description: data.description,
                    point: data.Extension_class.info.point,
                    goal_point: data.Extension_class.info.goal_point,
                    data: data.Extension_class.info.data
                };

            case "habit_check":
                return {
                    description: data.description,
                    point: data.completed_time ? data.point : 0,
                    goal_point: data.point,
                    data: {
                        completed_time: data.completed_time
                    }
                };
        }
    }

    export_data() {
        let data = JSON.parse(JSON.stringify(this.data));
        return data;
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
                this.assign_Extension_class(child,);
            }
        } else if (data.type === "habit_ext") {
            let extension_info = undefined;
            let importing_flag = data.Extension_class && data.Extension_class.constructor.name == "Object";
            if (importing_flag) {
                extension_info = data.Extension_class;
            }
            data.Extension_class =
                new Extension(
                    this.extension_database,
                    data.extension_id,
                    () => this.data_onchange_callback()
                );
            if (importing_flag && extension_info) {
                data.Extension_class.import_info(extension_info);
            }
        }
    }

    toggle_habit_check(data_id) {
        let data = this.get_data(data_id);
        if (data.type === "habit_check") {
            if (data.completed_time) {
                data.completed_time = null;
            }
            else {
                data.completed_time = Date.now();
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