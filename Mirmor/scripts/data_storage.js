class DataStorage {
    constructor(initialization_data, set_function) {
        this.data = initialization_data;
        this.set_function = set_function;
        this.HomepageView_class_data;
    }

    set_data(Data_class, timestamp) {
        let data = Data_class ? Data_class.to_object() : undefined;
        data = JSON.parse(JSON.stringify(data));
        data._HomepageView_class_data = this.HomepageView_class_data;
        this.data = data;

        this.set_function(
            JSON.stringify(this.data),
            Data_class.to_JSON(),
            Data_class.to_string(this.HomepageView_class_data),
            PPPL_JS.XDate(timestamp).date_object_expanded.date_string
        );
    }

    set_HomepageView_class_data(data, Data_class, timestamp) {
        this.HomepageView_class_data = data;
        this.set_data(Data_class, timestamp);
    }
}
