let _DataStorage = new DataStorage(
    key => localStorage.getItem(key),
    (key, data) => localStorage.setItem(key, data)
);

let _Habits = new Habits(
    _DataStorage.get_data() || HABITS,
    EXTENSIONS,
    () => {
        _DataStorage.set_data(_Habits);
        let formatted_exported_data = _Habits.export_data_formatted();
        if (window.top.export_data_extension_callback) {
            window.top.export_data_extension_callback(formatted_exported_data);
        }
        _HomepageView.update_view();
        _StatusBar.show_status(formatted_exported_data);
    }
);

let _StatusBar = new StatusBar();

let _HomepageView = new HomepageView(
    "",
    _Habits,
    {
        go_back_button: document.querySelector("#go_back"),
        view_name: document.querySelector("#view_name"),
        view_description: document.querySelector("#view_description"),
        item_list: document.querySelector("#item_list")
    }
);

window.onbeforeunload = () => true;