/* PhongHNg's personal use Javascript library */
const PhongHNg_JSL = {
    /* Seedable pseudorandom number generator */
    NRand: (seed) => {
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
        return PhongHNg_JSL.Srand(Srand_options, random_function);
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
    }
}