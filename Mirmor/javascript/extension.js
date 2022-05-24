class Extension {
    constructor(extension_database, extension_id, data_onchange_callback) {
        this.extension_database = extension_database;
        this.id = extension_id;
        this.setting = extension_database[extension_id];
        this.info = {
            point: undefined,
            goal_point: undefined,
            data: {}
        };
        this.data_onchange_callback = data_onchange_callback;
        this.ExtensionPopup_class =
            new ExtensionPopup(
                this.id,
                info => this.info_onchange(info)
            );
    }

    info_onchange(info) {
        this.info = info;
        if (this.data_onchange_callback) {
            this.data_onchange_callback();
        }
    }

    import_info(info) {
        if (!info) {
            return undefined;
        }
        this.info = info;
        this.ExtensionPopup_class.import_info(info);
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