class Firm {
    /*
     * ===== ABREVIATED =====
     * prod_cap = production capacity
     * PCD = production capacity difference (firm's prod_cap - based_union's prod_cap)
     * PR = rank by PCD
     * minPR = minimum rank by PCD acceptable
     */

    #configs = {
        prod_cap: {
            default: undefined,
            change_range: undefined
        }
    };

    #game_logic;
    #game_notification;
    #objnetwork;

    name;

    #prod_cap;
    #alpha = 0;
    #minPCDR = 0;

    constructor(
        game_logic,
        game_notification,
        objnetwork,
        configs
    ) {
        this.#game_logic = game_logic;
        this.#game_notification = game_notification;
        this.#objnetwork = objnetwork;
        this.#objnetwork.add_object(this);

        this.#configs = configs;
        this.#prod_cap = this.#configs.prod_cap.default;
    }

    get prod_cap() {
        return this.#prod_cap;
    }

    get alpha() {
        return this.#alpha;
    }

    set minPCDR(value) {
        this.#minPCDR = value;
    }

    produce() {
        let union_prod_cap = this.get_joined_union()?.calculate_prod_cap() || 0;

        let darkness = Math.random();
        let amount = this.prod_cap + union_prod_cap;
        let beta = darkness * amount;

        this.#alpha += beta;
    }

    update_prod_cap() {
        const random = (max, min) => Math.random() * (max - min) + min;

        let union_prod_cap = this.get_joined_union()?.calculate_prod_cap();
        let change_rate =
            random(
                this.#configs.prod_cap.change_range,
                0 - this.#configs.prod_cap.change_range
            ) * (
                this.prod_cap && union_prod_cap
                    ? (this.prod_cap / union_prod_cap)
                    : 1
            );
        if (this.name == "BVN" && this.prod_cap < 3000) {
            change_rate = 0.1;
        }
        let change_amount = this.prod_cap * change_rate;
        this.#prod_cap += change_amount;
        return this.#prod_cap;
    }

    join_union(union) {
        let union_link_info =
            this.#objnetwork.get_links_by_object_and_role
                (this, "union_member");
        this.#objnetwork.remove_links(union_link_info);

        union_link_info =
            this.#objnetwork.add_link
                (this, "union_member", union, "union");

        return union_link_info;
    }

    get_joined_union() {
        let union_link_info =
            this.#objnetwork.get_links_by_object_and_role
                (this, "union_member");
        return union_link_info?.[0]?.union;
    }

    leave_joined_union() {
        let union_link_info =
            this.#objnetwork.get_links_by_object_and_role
                (this, "union_member");
        this.#objnetwork.remove_links(union_link_info);
    }

    rank_unions_by_PCD(based_firm) {
        if (!this.#game_logic.firms.includes(based_firm))
            return this.#game_notification.throw("Game_Logic__NO_FIRM_FOUND");

        let firm_prod_cap = based_firm.prod_cap;

        let ranked_unions = this.#game_logic.unions.slice();
        ranked_unions.sort((a, b) => {
            let a_PCD = firm_prod_cap - a.calculate_prod_cap();
            let b_PCD = firm_prod_cap - b.calculate_prod_cap();
            return b_PCD - a_PCD;
        });

        return ranked_unions;
    }

    consider_join_union(union) {
        let random = Math.random();

        if (random < 0.8) {
            let unions_PR = this.rank_unions_by_PCD(this);
            let acceptable_unions = unions_PR.splice(0, this.#minPCDR);
            if (acceptable_unions.includes(union)) {
                return true;
            }
            return false;
        }

        else if (random < 0.9) {
            return false;
        }

        else {
            return true;
        }
    }
}