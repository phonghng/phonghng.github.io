/* PhongHNg's Personal Programming Library - JavaScript */
const PPPL_JS = {
    /* Seedable pseudorandom number generator */
    Nrand: (seed) => {
        const cyrb128 = (str) => {
            let h1 = 1779033703, h2 = 3144134277,
                h3 = 1013904242, h4 = 2773480762;
            for (let i = 0, k; i < str.length; i++) {
                k = str.charCodeAt(i);
                h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
                h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
                h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
                h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
            }
            h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
            h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
            h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
            h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
            return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
        };

        const sfc32 = (a, b, c, d) => {
            return function () {
                a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
                var t = (a + b) | 0;
                a = b ^ b >>> 9;
                b = c + (c << 3) | 0;
                c = (c << 21 | c >>> 11);
                d = d + 1 | 0;
                t = t + d | 0;
                c = c + t | 0;
                return (t >>> 0) / 4294967296;
            }
        };

        let formatted_seed = cyrb128(seed.toString());
        let random_function =
            sfc32(
                formatted_seed[0],
                formatted_seed[1],
                formatted_seed[2],
                formatted_seed[3]
            );

        return random_function;
    },

    /* Stock-style random option picker */
    Srand: (options, random_function = Math.random) => {
        /**
         * Pass in a two-dimensional array
         * (the first "column" represents
         * the number of shares of the option,
         * the second "column" represents the
         * corresponding option).
         */

        options = options.filter(option => option[0]);

        /**
         * Cumulative calculation of the number
         * of shares of options (to divide the
         * ownership range of each option,
         * serving to randomly select a range).
         */
        let shares_sum = 0;
        for (let i = 0; i < options.length; i++) {
            shares_sum += Number(options[i][0]);
            options[i][0] = shares_sum;
        }

        /**
         * Randomly select a range (by taking
         * a random number; then, determine the
         * range the random number belongs to).
         */
        let random_number = random_function() * shares_sum;
        let smallest_greater_number = Number.POSITIVE_INFINITY;
        for (let i = 0; i < options.length; i++)
            if (random_number <= options[i][0])
                smallest_greater_number =
                    Math.min(options[i][0], smallest_greater_number);

        return Object.fromEntries(options)[smallest_greater_number];
    },

    /* Ranges-style random number picker */
    Rrand: (ranges, random_function = Math.random) => {
        const min_max_random =
            (min, max) => random_function() * (max - min) + min;
        let Srand_options = ranges.map(range => {
            let min = range[0];
            let max = range[1];
            let difference = Math.abs(max - min);
            let random = min_max_random(min, max);
            return [difference, random];
        });
        let Srand_shares = Srand_options.map(option => option[0]);
        if (Srand_shares.every(shares => !shares)) {
            return Math.abs(ranges[0][0]);
        }
        return PPPL_JS.Srand(Srand_options, random_function);
    },

    /* Select random element from array */
    Arand: (array, random_function = Math.random) =>
        array[Math.floor(random_function() * array.length)],

    /* Extended information on Date object */
    XDate(timestamp) {
        const is_last_day_of_years_part = years_part_name => {
            const years_parts = {
                _format: "dd/mm",
                quarter: ["31/3", "30/6", "30/9", "31/12"],
                half: ["30/6", "31/12"],
                academic_year: ["31/5"],
                summer_vacation: ["31/8"],
                full: ["31/12"]
            };
            let current_month_and_date = `${date_object.getDate()}/${date_object.getMonth() + 1}`;
            return years_parts[years_part_name].includes(current_month_and_date);
        };

        const get_date_string = () => {
            let date_string;

            let dd = date_object.getDate();
            let mm = date_object.getMonth() + 1;
            let yyyy = date_object.getFullYear();

            if (dd < 10) {
                dd = "0" + dd
            }

            if (mm < 10) {
                mm = "0" + mm
            }

            date_string = yyyy + "-" + mm + "-" + dd;
            return date_string;
        };

        const get_day_of_year = () => {
            const MILLISECONDS_IN_MINUTE = 1000 * 60;
            const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
            let first_day_of_year = new Date(date_object.getFullYear(), 0, 0);
            let difference =
                (date_object - first_day_of_year)
                + (
                    (
                        first_day_of_year.getTimezoneOffset() - date_object.getTimezoneOffset()
                    ) * MILLISECONDS_IN_MINUTE
                );
            let day_of_year = Math.floor(difference / MILLISECONDS_IN_DAY);
            return day_of_year;
        }

        let date_object = new Date(timestamp);

        let date_object_info = {
            date_object: date_object,
            date_object_expanded: {
                date_string: get_date_string(),

                full_year: date_object.getFullYear(),
                month: date_object.getMonth(),
                date: date_object.getDate(),
                day: date_object.getDay(),
                hours: date_object.getHours(),
                minutes: date_object.getMinutes(),
                seconds: date_object.getSeconds(),
                milliseconds: date_object.getMilliseconds(),
                timestamp: date_object.getTime(),

                advanced: {
                    day_of_year: get_day_of_year()
                }
            },
            is_last_day_of: {
                week: date_object.getDay() == 0,
                month: new Date(date_object.getTime() + 86400000).getDate() == 1,
                year_quarter: is_last_day_of_years_part("quarter"),
                year_half: is_last_day_of_years_part("half"),
                academic_year: is_last_day_of_years_part("academic_year"),
                summer_vacation: is_last_day_of_years_part("summer_vacation"),
                year: is_last_day_of_years_part("full")
            }
        };

        return date_object_info;
    },

    /* Convert from ruled-array format to DOM format */
    ADOM(array, document) {
        let [tag_name, html_attributes, javascript_attributes, children_ADOM] = array;
        let DOM = document.createElement(tag_name);
        if (html_attributes)
            for (let [key, value] of Object.entries(html_attributes))
                if (value)
                    DOM.setAttribute(key, value);
                else
                    DOM.removeAttribute(key);
        if (javascript_attributes)
            for (let [key, value] of Object.entries(javascript_attributes))
                DOM[key] = value;
        if (children_ADOM)
            for (let child_ADOM of children_ADOM)
                DOM.appendChild(PPPL_JS.ADOM(child_ADOM, document));
        return DOM;
    },

    /* Extended PPPL_JS.ADOM for form */
    fADOM(form_unique_id, items, include_label, custom_item_types) {
        function process_item(item_type, item_id, item_title, item_data = {}, reset_callback) {
            if (typeof item_data == "function")
                item_data = item_data();

            let _item_id = `${form_element.id}_${item_id}`;
            let _item_title = item_title + (item_type != "checkbox" && item_data.required ? " *" : "");
            let main_ADOM;
            let label_ADOM =
                PPPL_JS.ADOM([
                    "label",
                    {
                        for: _item_id,
                        title: _item_title
                    },
                    {
                        innerHTML: _item_title
                    },
                    null
                ], document);

            switch (item_type) {
                /* item_data = { required, disabled, value } */
                case "text": {
                    main_ADOM =
                        PPPL_JS.ADOM([
                            "input",
                            {
                                type: "text",
                                id: _item_id,
                                placeholder: _item_title,
                                title: _item_title,
                                required: item_data.required,
                                disabled: item_data.disabled,
                                value: item_data.value
                            },
                            null,
                            null
                        ], document);
                    break;
                }
                /* item_data = { required, disabled, value, style } */
                case "textarea": {
                    main_ADOM =
                        PPPL_JS.ADOM([
                            "textarea",
                            {
                                id: _item_id,
                                placeholder: _item_title,
                                title: _item_title,
                                required: item_data.required,
                                disabled: item_data.disabled,
                                value: item_data.value,
                                style: item_data.style || undefined
                            },
                            null,
                            null
                        ], document);
                    break;
                }

                /* item_data = { disabled, checked } */
                case "checkbox": {
                    main_ADOM =
                        PPPL_JS.ADOM([
                            "input",
                            {
                                type: "checkbox",
                                id: _item_id,
                                title: _item_title,
                                disabled: item_data.disabled,
                                checked: item_data.checked,
                            },
                            null,
                            null
                        ], document);
                    break;
                }

                /* item_data = { required, disabled, value } */
                case "number": {
                    main_ADOM =
                        PPPL_JS.ADOM([
                            "input",
                            {
                                type: "number",
                                id: _item_id,
                                placeholder: _item_title,
                                title: _item_title,
                                required: item_data.required,
                                disabled: item_data.disabled,
                                value: item_data.value,
                            },
                            null,
                            null
                        ], document);
                    break;
                }

                /* item_data = { required, disabled, value } */
                case "date": {
                    main_ADOM =
                        PPPL_JS.ADOM([
                            "input",
                            {
                                type: "date",
                                id: _item_id,
                                title: _item_title,
                                required: item_data.required,
                                disabled: item_data.disabled,
                                value: item_data.value,
                            },
                            null,
                            null
                        ], document);
                    break;
                }

                /* item_data = { required, disabled, value } */
                case "time": {
                    main_ADOM =
                        PPPL_JS.ADOM([
                            "input",
                            {
                                type: "time",
                                id: _item_id,
                                title: _item_title,
                                required: item_data.required,
                                disabled: item_data.disabled,
                                value: item_data.value,
                            },
                            null,
                            null
                        ], document);
                    break;
                }

                /* item_data = { required, disabled, value } */
                case "datetime": {
                    main_ADOM =
                        PPPL_JS.ADOM([
                            "input",
                            {
                                type: "datetime-local",
                                id: _item_id,
                                title: _item_title,
                                required: item_data.required,
                                disabled: item_data.disabled,
                                value: item_data.value,
                            },
                            null,
                            null
                        ], document);
                    break;
                }

                /* item_data = { required, disabled, value, options: { key: title, title: { key: title } } */
                case "select": {
                    let children_ADOM = [];

                    if (!include_label)
                        children_ADOM.push([
                            "option",
                            {
                                value: "",
                                disabled: true,
                                selected: true
                            },
                            {
                                innerHTML: _item_title
                            },
                            null
                        ]);

                    for (let entry of Object.entries(item_data.options))
                        if (typeof entry[1] == "string")
                            children_ADOM.push([
                                "option",
                                {
                                    value: entry[0]
                                },
                                {
                                    innerHTML: entry[1]
                                },
                                null
                            ]);
                        else {
                            let optgroup_children_ADOM = [];

                            for (let [key, title] of Object.entries(entry[1]))
                                optgroup_children_ADOM.push([
                                    "option",
                                    {
                                        value: key
                                    },
                                    {
                                        innerHTML: title
                                    },
                                    null
                                ]);

                            children_ADOM.push([
                                "optgroup",
                                {
                                    label: entry[0]
                                },
                                null,
                                optgroup_children_ADOM
                            ]);
                        }

                    main_ADOM =
                        PPPL_JS.ADOM([
                            "select",
                            {
                                id: _item_id,
                                title: _item_title,
                                required: item_data.required,
                                disabled: item_data.disabled,
                                value: item_data.value,
                            },
                            null,
                            children_ADOM
                        ], document);
                    break;
                }

                /* item_data = { disabled, style, submit_callback, submit_empty_callback } */
                case "submit": {
                    let onclick_event = event => {
                        event.preventDefault();
                        let form_data = {};
                        for (let child_element of form_element.querySelectorAll("*[id]")) {
                            if (child_element.tagName == "BUTTON")
                                continue;

                            if (child_element.required && child_element.value == "") {
                                child_element.focus();
                                item_data.submit_empty_callback();
                                return false;
                            }

                            let form_data_id = child_element.id.replace("${form_element.id}_", "");
                            if (child_element.tagName == "INPUT" && child_element.type == "checkbox")
                                form_data[form_data_id] = child_element.checked;
                            else if (child_element.tagName == "INPUT" && child_element.type == "number")
                                form_data[form_data_id] = Number(child_element.value);
                            else if (child_element.tagName == "INPUT" && child_element.type == "date")
                                form_data[form_data_id] = child_element.valueAsNumber;
                            else if (child_element.tagName == "INPUT" && child_element.type == "datetime-local")
                                form_data[form_data_id] = (new Date(child_element.value)).getTime();
                            else
                                form_data[form_data_id] = child_element.value;
                        }
                        item_data.submit_callback(form_data);
                        return true;
                    };

                    return [
                        PPPL_JS.ADOM([
                            "button",
                            {
                                title: _item_title,
                                id: _item_id,
                                style: item_data.style || undefined,
                                disabled: item_data.disabled || undefined
                            },
                            {
                                innerHTML: _item_title,
                                onclick: onclick_event
                            },
                            null
                        ], document)
                    ];
                }

                /* item_data = { disabled, style, cancel_callback } */
                case "cancel": {
                    return [
                        PPPL_JS.ADOM([
                            "button",
                            {
                                title: _item_title,
                                id: _item_id,
                                style: item_data.style || undefined,
                                disabled: item_data.disabled || undefined
                            },
                            {
                                innerHTML: _item_title,
                                onclick: event => {
                                    event.preventDefault();
                                    item_data.cancel_callback();
                                    reset_callback();
                                }
                            },
                            null
                        ], document)
                    ];
                }

                default: {
                    return custom_item_types[item_type](
                        form_unique_id,
                        items,
                        include_label,
                        item_id,
                        item_title,
                        item_data
                    );
                }
            }

            if (item_type == "checkbox")
                return include_label ? [main_ADOM, label_ADOM] : [main_ADOM];
            else
                return include_label ? [label_ADOM, main_ADOM] : [main_ADOM];
        }

        let form_element =
            PPPL_JS.ADOM([
                "form",
                {
                    id: form_unique_id
                },
                null,
                null
            ], document);
        for (let [item_type, item_id, item_title, item_data] of items) {
            let elements =
                process_item(
                    item_type,
                    item_id,
                    item_title,
                    item_data,
                    () => {
                        for (let child_element of form_element.querySelectorAll("*"))
                            if (child_element.tagName == "INPUT"
                                || child_element.tagName == "TEXTAREA"
                                || child_element.tagName == "SELECT")
                                if (child_element.tagName == "INPUT" && child_element.type == "checkbox")
                                    child_element.checked = false;
                                else
                                    child_element.value = "";
                    }
                );
            for (let element of elements)
                form_element.appendChild(element);
        }
        return form_element;
    },

    /* Utils for PPPL-WUIC */
    PPPL_WUIC: {
        popup: {
            open(container_element, title, close_callback) {
                container_element.querySelector(".container .main .title").innerText = title;
                container_element.querySelector(".container .main .close_button").onclick = close_callback;

                container_element.style.display = "flex";
                container_element.querySelector(".container .main")
                    .animate([
                        { transform: "scale(0)" },
                        { transform: "scale(1)" },
                    ], {
                        duration: 250,
                        iterations: 1,
                    });

                return true;
            },

            close(container_element, closed_callback) {
                container_element.querySelector(".container .main")
                    .animate([
                        { transform: "scale(1)" },
                        { transform: "scale(0)" },
                    ], {
                        duration: 250,
                        iterations: 1,
                    });
                setTimeout(() => {
                    container_element.style.display = "none";
                    closed_callback();
                }, 250);
                return true;
            }
        }
    },

    /* Utils for JSEncrypt */
    JSEncrypt: {
        generate_keys: (private_key) => {
            let _JSEncrypt = new JSEncrypt();
            if (private_key)
                _JSEncrypt.setPrivateKey(private_key);
            return {
                public: _JSEncrypt.getPublicKey(),
                private: _JSEncrypt.getPrivateKey()
            };
        },
        encrypt: (public_key, message) => {
            let _JSEncrypt = new JSEncrypt();
            _JSEncrypt.setPublicKey(public_key);
            return _JSEncrypt.encrypt(message);
        },
        decrypt: (private_key, encrypted) => {
            let _JSEncrypt = new JSEncrypt();
            _JSEncrypt.setPrivateKey(private_key);
            return _JSEncrypt.decrypt(encrypted);
        }
    }
}