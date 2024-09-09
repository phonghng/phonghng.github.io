class ExtensionPopup {
    constructor(extension_id, info_onchange_callback, XDate_function) {
        this.setting = EXTENSIONS[extension_id];
        this.popup = this.make_popup();
        this.set_document_click_event();
        this.info_onchange_callback = info_onchange_callback;
        this.XDate_function = XDate_function;
    }

    set_document_click_event() {
        let unfocus_all_popups = event => {
            let path = event.composedPath && event.composedPath();
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
        popup_wrapper.className = "extension_popup_wrapper not_focus";
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
            handle: ".popup .header .title",
            drag: () => this.update_info(),
            start: () => this.update_info(),
            stop: () => this.update_info()
        });
        $(popup_wrapper).resizable({
            handles: "all",
            resize: () => this.update_info(),
            start: () => this.update_info(),
            stop: () => this.update_info()
        });

        this.iframe_window = iframe.contentWindow;

        this.iframe_window.XDate_function = () => this.XDate_function();
        this.iframe_window.info_onchange = (options) => this.update_info(options);
        this.iframe_window.addEventListener("DOMContentLoaded", () => {
            this.set_detect_class_list_change(popup_wrapper);
            this.iframe_window.XDate_function = () => this.XDate_function();
            this.iframe_window.info_onchange = (options) => this.update_info(options);
            this.update_info();
        });

        this.iframe_window.onclick = () => this.focus();
        this.iframe_window.onmouseup = () => this.focus();
        this.iframe_window.onmousedown = () => this.focus();

        return popup_wrapper;
    }

    set_detect_class_list_change(popup_wrapper) {
        this.popup_wrapper_clast_list = popup_wrapper.classList.value;
        let observer = new MutationObserver(mutations => {
            for (let i = 0; i < mutations.length; i++) {
                if (mutations[i].attributeName === "class"
                    && popup_wrapper.classList.value != this.popup_wrapper_clast_list) {
                    this.update_info();
                    this.popup_wrapper_clast_list = popup_wrapper.classList.value;
                }
            }
        });
        observer.observe(popup_wrapper, { attributes: true });
    }

    focus() {
        let popups = document.querySelectorAll(".extension_popup_wrapper");
        for (let i = 0; i < popups.length; i++) {
            if (popups[i] != this.popup || popups[i].style.display == "none") {
                popups[i].classList.add("not_focus");
                popups[i].classList.remove("focus");
            } else {
                popups[i].classList.add("focus");
                popups[i].classList.remove("not_focus");
            }
        }
        this.update_info();
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
        popup.classList.add("not_focus");
        popup.classList.remove("focus");
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

    update_info(options) {
        let info = this.iframe_window.export_info();
        info = JSON.parse(JSON.stringify(info));
        info.data._extension_popup_style = this.popup.style.cssText;
        info.data._extension_popup_is_focusing = this.popup.classList.contains("focus");
        if (this.info_onchange_callback) {
            this.info_onchange_callback(info, options);
        }
    }

    import_data(exported_data) {
        let info = JSON.parse(JSON.stringify(exported_data));
        this.import_popup_style(info._extension_popup_style, info._extension_popup_is_focusing);
        delete info._extension_popup_style;
        delete info._extension_popup_is_focusing;
        info = JSON.parse(JSON.stringify(info));
        this.run_function("import_data", [info], () => this.update_info());
    }

    run_function(function_name, parameters, callback) {
        if (this.iframe_window[function_name]) {
            let function_return = this.iframe_window[function_name](...parameters);
            if (callback)
                callback(function_return);
            return function_return;
        } else {
            this.iframe_window.addEventListener("DOMContentLoaded", () => {
                let function_return = this.iframe_window[function_name](...parameters);
                if (callback)
                    callback(function_return);
                return function_return;
            });
        }
    }

    import_popup_style(css_text, is_focusing) {
        this.popup.style.cssText = css_text;
        if (is_focusing) {
            this.popup.classList.add("focus");
            this.popup.classList.remove("not_focus");
        } else {
            this.popup.classList.add("not_focus");
            this.popup.classList.remove("focus");
        }
    }
}
