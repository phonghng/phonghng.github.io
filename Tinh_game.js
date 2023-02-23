const Smarand = (data) => {
    /**
     * PhongHNg's Smart Random (Smarand)
     * Version: 1.0 (22-02-2022)
     * Personal website: https://phonghng.github.io/
     */

    let temp_counter = 0;

    data = Object.entries(data);
    data = data.map(event_data => {
        let chance_percent = event_data[0];
        let callback = event_data[1];
        temp_counter += Number(chance_percent) / 100;
        return [temp_counter, callback];
    });

    let random = Math.random();

    for (let event_data of data) {
        let chance = event_data[0];
        let callback = event_data[1];
        if (random < chance) {
            callback();
            return callback;
        }
    }

    return false;
};

class Person {
    /**
     * ----- ABBREVIATION -----
     * "TC" = "Tinh change"
     * "TCR" = "Tinh change rate"
     * "TCRecent" = "recent Tinh change rates"
     * "TCR_momentum" = "Tinh change rate based on momentum"
     * "TCR_random" = "Tinh change rate based on random"
     * "TCR_mutation" = "Tinh change rate based on mutation"
     * "poss" = "possibility"
     */

    constructor(name, custom_options = {}) {
        this.#name = name;
        Object.assign(this.#options, custom_options);
    }

    #options = {
        TCR_momentum_poss: 75,
        TCR_random_poss: 20,
        TCR_mutation_poss: 5,
        TCRecent_length: 5,
        max_TCR_amplitude: 0.05
    };

    #name = undefined;

    #Tinh = 1;
    #TCRecent = [];

    get name() {
        return this.#name;
    }

    get Tinh() {
        return this.#Tinh;
    }

    change_Tinh() {
        let TCR = 0;

        Smarand({
            [this.#options.TCR_momentum_poss]:
                () => {
                    TCR = this.#calculate_TCR_momentum();
                },
            [this.#options.TCR_random_poss]:
                () => {
                    TCR = this.#calculate_TCR_random();
                },
            [this.#options.TCR_mutation_poss]:
                () => {
                    TCR = this.#calculate_TCR_mutation();
                }
        });

        this.#TCRecent.push(TCR);

        this.#Tinh += this.#Tinh * TCR;
    }

    #calculate_TCR_momentum() {
        let { TCRecent_length, max_TCR_amplitude } = this.#options;

        this.#TCRecent = this.#TCRecent.slice(0 - TCRecent_length);
        let TCRecent = this.#TCRecent;
        let TCRecent_sum = TCRecent.reduce((a, b) => a + b, 0);
        let TCRecent_average = (TCRecent_sum / TCRecent.length) || 0;

        if (TCRecent_average >= 0) {
            return Math.random() * max_TCR_amplitude;
        } else {
            return 0 - Math.random() * max_TCR_amplitude;
        }
    }

    #calculate_TCR_random() {
        return (Math.random() * 2 - 1) * this.#options.max_TCR_amplitude;
    }

    #calculate_TCR_mutation() {
        let random = Math.random();
        if (0 <= random && random < 0.5) {
            return this.#options.max_TCR_amplitude;
        } else if (0.5 <= random && random < 1) {
            return 0 - this.#options.max_TCR_amplitude;
        }
    }
}

class Game {
    constructor(name_database, custom_options = {}) {
        this.#name_database = name_database;
        Object.assign(this.#options, custom_options);
    }

    #options = {
        new_person_event_possibility: 5,
        change_Tinh_all_event_possibility: 20,
        change_Tinh_random_event_possibility: 75
    };

    #persons = [];

    #name_database = [];

    new_person() {
        let names = this.#get_available_names();
        if (names.length == 0) {
            return false;
        }
        let name_index = Math.floor(Math.random() * names.length);
        let name = names[name_index];
        let person = new Person(name);
        this.#persons.push(person);
    }

    #get_available_names() {
        let available_names = [];
        let used_names = this.#persons.map(person => person.name);
        for (let name of this.#name_database) {
            if (used_names.indexOf(name) == -1) {
                available_names.push(name);
            }
        }
        return available_names;
    }

    change_Tinh_all() {
        for (let person of this.#persons) {
            person.change_Tinh();
        }
    }

    change_Tinh_random() {
        if (this.#persons.length == 0) {
            return false;
        }
        let random_index = Math.floor(Math.random() * this.#persons.length);
        let person = this.#persons[random_index];
        person.change_Tinh();
    }

    change_Tinh_by_index(person_index) {
        if (person_index > this.#persons.length) {
            return false;
        }
        let person = this.#persons[person_index];
        person.change_Tinh();
    }

    random_event() {
        Smarand({
            [this.#options.new_person_event_possibility]: () => this.new_person(),
            [this.#options.change_Tinh_all_event_possibility]: () => this.change_Tinh_all(),
            [this.#options.change_Tinh_random_event_possibility]: () => this.change_Tinh_random()
        });
    }

    get persons() {
        let parsed_persons =
            this.#persons.map((person, index) =>
                ({ index, name: person.name, Tinh: person.Tinh })
            );
        parsed_persons.sort((a, b) => b.Tinh - a.Tinh);
        return parsed_persons;
    }
}

class UI {
    /**
     * ----- ABBREVIATION -----
     * "elm" = "element"
     * "calc" = "calculate"
     */


    constructor(persons_elm, Game) {
        this.#persons_elm = persons_elm;
        this.#Game = Game;
    }

    #persons_elm = undefined;

    #Game = undefined;

    update() {
        this.#add_missing_person();
        this.#update_persons();
    }

    #add_missing_person() {
        for (let person of this.#Game.persons) {
            let person_elm =
                this.#persons_elm.querySelector(`#person_${person.index}`);

            if (person_elm) {
                continue;
            }

            person_elm = document.createElement("div");
            person_elm.classList = "person";
            person_elm.id = `person_${person.index}`;

            let person_name_ele = document.createElement("span");
            person_name_ele.classList = "name";
            person_elm.appendChild(person_name_ele);

            let person_Tinh_ele = document.createElement("span");
            person_Tinh_ele.classList = "Tinh";
            person_elm.appendChild(person_Tinh_ele);

            this.#persons_elm.appendChild(person_elm);
        }
    }

    #update_persons() {
        let persons_in_entries = Object.entries(this.#Game.persons);
        for (let [rank, person] of persons_in_entries) {
            let person_elm =
                this.#persons_elm.querySelector(`#person_${person.index}`);
            let person_elm_width_percent = this.#calc_person_elm_width(person.Tinh);
            person_elm.style = `--rank: ${rank}; width: calc(${person_elm_width_percent}% - 60px);`;

            let person_name_ele = person_elm.querySelector(".name");
            person_name_ele.innerText = person.name;

            let person_Tinh_ele = person_elm.querySelector(".Tinh");
            person_Tinh_ele.innerText = person.Tinh;
        }
    }

    #calc_person_elm_width(Tinh) {
        let Tinhs = this.#Game.persons.map(person => person.Tinh);
        let max_Tinh = Math.max(...Tinhs);
        let person_elm_width_percent = Tinh / max_Tinh * 100;
        return person_elm_width_percent;
    }
}