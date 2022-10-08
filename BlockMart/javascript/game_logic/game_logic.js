class Game_Logic {
    /*
     * ===== ABREVIATED =====
     * prod_cap = production capacity
     * PCD = production capacity difference (firm's prod_cap - based_union's prod_cap)
     */

    #game_notification = new Game_Notification();
    #objnetwork = new ObjNetwork();

    #firms = [];
    #unions = [];

    constructor(game_notification_callback) {
        this.#game_notification.callback = game_notification_callback;
    }

    generate_random_name() {
        let setted_names = [];
        this.#firms.forEach(firm => setted_names.push(firm.name));
        this.#unions.forEach(union => setted_names.push(union.name));

        if (setted_names.length == NAMES_DATABASE.length)
            throw `Run out of NAMES_DATABASE`;

        let random_name = NAMES_DATABASE[Math.floor(Math.random() * NAMES_DATABASE.length)];
        while (setted_names.includes(random_name)) {
            random_name = NAMES_DATABASE[Math.floor(Math.random() * NAMES_DATABASE.length)];
        }

        return random_name;
    }

    generate_random_minPCDR(items) {
        if (items.length <= 10) {
            return 10;
        } else {
            let random_minPCDR = 0;
            while (random_minPCDR < 10) {
                random_minPCDR = Math.floor(Math.random() * items.length);
            }
            return random_minPCDR;
        }
    }

    create_firm() {
        let firm = new Firm(this, this.#game_notification, this.#objnetwork);
        firm.name = this.generate_random_name();
        firm.minPCDR = this.generate_random_minPCDR(this.#firms);
        this.#firms.push(firm);
        return firm;
    }

    remove_firm(firm) {
        if (!this.#firms.includes(firm))
            return this.#game_notification.throw("Game_Logic__NO_FIRM_FOUND");

        firm.leave_joined_union();
        this.#objnetwork.remove_object(firm);
        this.#firms.splice(this.#firms.indexOf(firm), 1);
    }

    create_union() {
        let union = new Union(this, this.#game_notification, this.#objnetwork);
        union.name = this.generate_random_name();
        union.minPCDR = this.generate_random_minPCDR(this.#unions);
        this.#unions.push(union);
        return union;
    }

    remove_union(union) {
        if (!this.#unions.includes(union))
            return this.#game_notification.throw("Game_Logic__NO_UNION_FOUND");

        let members = union.get_members();
        members.forEach(member => union.remove_member(member));
        this.#objnetwork.remove_object(union);
        this.#unions.splice(this.#unions.indexOf(union), 1);
    }

    rank_firms_by_PCD(based_union) {
        if (!this.#unions.includes(based_union))
            return this.#game_notification.throw("Game_Logic__NO_UNION_FOUND");

        let union_prod_cap = based_union.calculate_prod_cap();

        let ranked_firms = this.#firms.slice();
        ranked_firms.sort((a, b) => {
            let a_PCD = a.prod_cap - union_prod_cap;
            let b_PCD = b.prod_cap - union_prod_cap;
            return b_PCD - a_PCD;
        });

        return ranked_firms;
    }

    rank_unions_by_PCD(based_firm) {
        if (!this.#firms.includes(based_firm))
            return this.#game_notification.throw("Game_Logic__NO_FIRM_FOUND");

        let firm_prod_cap = based_firm.prod_cap;

        let ranked_unions = this.#unions.slice();
        ranked_unions.sort((a, b) => {
            let a_PCD = firm_prod_cap - a.calculate_prod_cap();
            let b_PCD = firm_prod_cap - b.calculate_prod_cap();
            return b_PCD - a_PCD;
        });

        return ranked_unions;
    }

    random_firm_produce() {
        if (this.#firms.length <= 0) return false;
        let random_firm = this.#firms[Math.floor(Math.random() * this.#firms.length)];
        random_firm.produce();
    }

    random_firm_update_prod_cap() {
        if (this.#firms.length <= 0) return false;
        let random_firm = this.#firms[Math.floor(Math.random() * this.#firms.length)];
        let updated_prod_cap = random_firm.update_prod_cap();
        if (updated_prod_cap < 0) {
            this.remove_firm(random_firm);
        }
    }

    random_firm_union_link() {
        if (this.#firms.length <= 0) return false;
        if (this.#unions.length <= 0) return false;

        let random_firm = this.#firms[Math.floor(Math.random() * this.#firms.length)];
        let random_union = this.#unions[Math.floor(Math.random() * this.#unions.length)];

        let decision_of_firm = random_firm.consider_join_union(random_union);
        let decision_of_union = random_union.consider_add_member(random_firm);

        if (decision_of_firm && decision_of_union) {
            random_firm.join_union(random_union);
            random_union.add_member(random_firm);
            return true;
        }

        return false;
    }

    random_remove_firm() {
        if (this.#firms.length <= 0) return false;
        let random_firm = this.#firms[Math.floor(Math.random() * this.#firms.length)];
        this.remove_firm(random_firm);
    }

    random_remove_union() {
        if (this.#unions.length <= 0) return false;
        let random_union = this.#unions[Math.floor(Math.random() * this.#unions.length)];
        this.remove_union(random_union);
    }

    random_all_events() {
        if (this.#firms.length <= 0) {
            this.create_firm();
        }
        if (this.#unions.length <= 0) {
            this.create_union();
        }

        function random_event(data) {
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
        }

        random_event({
            55.0: () => this.random_firm_produce(),
            25.0: () => this.random_firm_update_prod_cap(),
            10.0: () => this.random_firm_union_link(),
            3.5: () => this.create_firm(),
            3.0: () => this.create_union(),
            3.0: () => this.random_remove_firm(),
            0.5: () => this.random_remove_union(),
        });
    }

    get data_for_UI() {
        let firms = [];
        for (let firm of this.#firms) {
            let name = firm.name;
            let alpha = firm.alpha.toFixed(3);
            let union_name =
                firm.get_joined_union()?.name || "";
            firms.push({ name, alpha, union_name });
        }
        firms.sort((a, b) => b.alpha - a.alpha);

        let unions = [];
        for (let union of this.#unions) {
            let name = union.name;
            let average_alpha = union.calculate_average_alpha().toFixed(3);
            let members_name =
                union.get_members();
            members_name = members_name.map(member => member.name);
            members_name = members_name.join(", ");
            unions.push({ name, average_alpha, members: members_name });
        }
        unions.sort((a, b) => b.average_alpha - a.average_alpha);

        return { firms, unions };
    }
}