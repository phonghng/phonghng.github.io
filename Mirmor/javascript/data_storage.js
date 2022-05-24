class DataStorage {
    constructor(get_function, set_function, options = {}) {
        this.get_function = get_function;
        this.set_function = set_function;
        this.options = {
            parse_when_get: options.parse_when_get || true,
            stringify_when_set: options.stringify_when_set || true
        }
    }

    get_date_string() {
        return new Date().toISOString().slice(0, 10);
    }

    get_data() {
        let data = this.get_function("Mirmor");
        if (!data) {
            return undefined;
        }
        let date_string = this.get_date_string();
        if (this.options.parse_when_get && data) {
            data = JSON.parse(data);
        }
        return data[date_string];
    }

    set_data(Habits_class) {
        let exported_data = Habits_class.export_data();
        let date_string = this.get_date_string();
        let data_to_save = this.get_function("Mirmor") || {};

        if (this.options.parse_when_get && typeof data_to_save == "string") {
            data_to_save = JSON.parse(data_to_save);
        }

        data_to_save[date_string] = exported_data;

        for (let date in data_to_save) {
            if (new Date(date) < new Date(date_string)) {
                delete data_to_save[date];
            }
        }

        if (this.options.stringify_when_set) {
            data_to_save = JSON.stringify(data_to_save);
        }
        this.set_function("Mirmor", data_to_save);

        return this.get_data();
    }
}