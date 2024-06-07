class DataStorage {
    constructor(initialization_data, set_function) {
        this.data = initialization_data;
        this.set_function = set_function;
        this.HomepageView_class_data;
        this.independent_data = {
            cumulative_habit_data: {}
        };
    }

    set_data(Data_class, date, options) {
        this.set_function(
            options,
            () => {
                let data = Data_class ? Data_class.to_object() : undefined;
                data = JSON.parse(JSON.stringify(data));
                data._HomepageView_class_data = this.HomepageView_class_data;
                this.data = data;
                return this.data;
            },
            () => Data_class.to_JSON(),
            () => Data_class.to_string(this.HomepageView_class_data),
            date
        );
    }

    set_HomepageView_class_data(data, Data_class, date) {
        this.HomepageView_class_data = data;
        this.set_data(Data_class, date);
    }

    set_cumulative_habit_data(item_data, item_id, date) {
        if (item_data.type === "group")
            Object.entries(item_data.children).forEach(child_item =>
                this.set_cumulative_habit_data(
                    child_item[1],
                    item_id + " " + child_item[0],
                    date
                )
            );
        else if (item_data.cumulative_period) {
            let [start_cumulative_period, end_cumulative_period] =
                PPPL_JS.XDate(date).start_end_of_current[item_data.cumulative_period];
            if (!this.independent_data.cumulative_habit_data[item_id])
                this.independent_data.cumulative_habit_data[item_id] = {};
            this.independent_data.cumulative_habit_data[item_id] =
                Object.fromEntries(
                    Object.entries(this.independent_data.cumulative_habit_data[item_id])
                        .filter(
                            entry => start_cumulative_period <= new Date(entry[0])
                                && new Date(entry[0]) <= end_cumulative_period
                        )
                );
            if (item_data.type == "habit_check")
                this.independent_data.cumulative_habit_data[item_id][date] = item_data.completed_time;
            else if (item_data.type == "habit_number")
                this.independent_data.cumulative_habit_data[item_id][date] = item_data.value;
            item_data.cumulative_data = this.independent_data.cumulative_habit_data[item_id];
        }
    }
}
