class Extension {
    constructor(extension_database, extension_id, data_onchange_callback, XDate_function) {
        this.extension_database = extension_database;
        this.id = extension_id;
        this.setting = extension_database[extension_id];
        this.info = {
            point: undefined,
            goal_point: undefined,
            data: undefined
        };
        this.data_onchange_callback = data_onchange_callback;
        this.ExtensionPopup_class =
            new ExtensionPopup(
                this.id,
                (info, options) => this.info_onchange(info, options),
                XDate_function
            );
    }

    info_onchange(info, options) {
        this.info = info;
        if (this.data_onchange_callback) {
            this.data_onchange_callback(options);
        }
    }

    import_data(data) {
        if (!data) {
            return undefined;
        }
        this.ExtensionPopup_class.import_info(data);
    }

    toJSON() {
        return this.info;
    }

    delete() {
        this.ExtensionPopup_class.delete();
    }

    open_popup() {
        this.ExtensionPopup_class.show();
    }
}