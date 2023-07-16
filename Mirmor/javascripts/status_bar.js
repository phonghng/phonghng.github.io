class StatusBar {
    constructor(container) {
        let status_bar = document.createElement("div");
        status_bar.id = "status_bar";
        container.appendChild(status_bar);

        this.element = status_bar;
        this.status_bar_timeout = undefined;
        this.history = {
            _example_timestamp: ["status", "status_element"]
        };
    }

    get_time_string() {
        let time_full_string = new Date().toLocaleString();
        let time_short_string = new Date().toLocaleTimeString().replace(" ", "");
        return { time_full_string, time_short_string };
    }

    process_point_info(exported_data) {
        let point = exported_data.point || exported_data._point || 0;
        let goal = exported_data.goal_point || exported_data._goal_point || 0;
        let percent =
            (goal != 0)
                ? (point / goal * 100)
                : (point >= 0 ? 100 : 0);
        let color =
        (
            percent < 100
                ? "var(--CHERRY)"
                : (
                    percent < 100
                        ? "var(--LEMON)"
                        : "var(--LIME)"
                )
        );
        return { point, goal, percent, color };
    }

    generate_default_status(exported_data) {
        let { time_full_string, time_short_string } = this.get_time_string();
        let point_info = this.process_point_info(exported_data);

        let status_element = document.createElement("span");
        status_element.ondblclick = () => console.log(exported_data, this);

        let status_time_element = document.createElement("span");
        status_time_element.style.color = "var(--BLUE)";
        status_time_element.innerHTML = `${time_full_string}`;
        status_element.appendChild(status_time_element);

        status_element.innerHTML += `: `;

        let status_point_element = document.createElement("span");
        status_point_element.innerHTML = `${point_info.point} / ${point_info.goal}`;

        status_point_element.innerHTML += ` `;

        let status_point_percent_element = document.createElement("span");
        status_point_percent_element.style.color = point_info.color;
        status_point_percent_element.innerHTML = `(${Math.floor(point_info.percent)}%)`;
        status_point_element.appendChild(status_point_percent_element);

        status_element.appendChild(status_point_element);

        return status_element;
    }

    show_status(status) {
        let status_element = status;

        let parametered_status_type = status.constructor.name;
        if (parametered_status_type == "Object") {
            status_element = this.generate_default_status(status);
        } else if (parametered_status_type == "String") {
            status_element = document.createElement("span");
            status_element.innerHTML = status;
        } else if (parametered_status_type == "HTMLDivElement") {
            status_element = status;
        }

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
        document.querySelector("#status_bar").appendChild(status_element);
        document.querySelector("#status_bar").style.display = "block";

        this.history[Date.now()] = [status, status_element];
        this.clean_history();

        if (this.status_bar_timeout) {
            clearTimeout(this.status_bar_timeout);
        }
        this.status_bar_timeout = setTimeout(() => {
            document.querySelector("#status_bar").style.display = "none";
        }, 5000);
    }

    show_status_extension(extension_info) {
        extension_info = JSON.parse(JSON.stringify(extension_info));
        extension_info._point = extension_info.point;
        extension_info._goal_point = extension_info.goal_point;
        StatusBar_class.show_status(extension_info);
    }

    clean_history() {
        let keys = Object.keys(this.history);
        while (keys.length > 10) {
            let key = keys.shift();
            delete this.history[key];
        }
    }
}