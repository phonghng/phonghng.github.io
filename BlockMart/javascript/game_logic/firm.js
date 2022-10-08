class Firm {
    /*
     * ===== ABREVIATED =====
     * prod_cap = production capacity
     * PCD = production capacity difference (firm's prod_cap - based_union's prod_cap)
     * PR = rank by PCD
     * minPR = minimum rank by PCD acceptable
     */

    #DEFAULT_PROD_CAP = 1;
    #PROD_CAP_CHANGE_RANGE = 0.1;

    #game_logic = undefined;
    #game_notification = undefined;
    #objnetwork = undefined;

    name = undefined;

    #prod_cap = this.#DEFAULT_PROD_CAP;
    #alpha = 0;
    #minPCDR = 0;

    constructor(
        game_logic,
        game_notification,
        objnetwork
    ) {
        this.#game_logic = game_logic;
        this.#game_notification = game_notification;
        this.#objnetwork = objnetwork;
        this.#objnetwork.add_object(this);
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
                this.#PROD_CAP_CHANGE_RANGE,
                0 - this.#PROD_CAP_CHANGE_RANGE
            ) * (
                this.prod_cap && union_prod_cap
                    ? (this.prod_cap / union_prod_cap)
                    : 1
            );
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

    consider_join_union(union) {
        let random = Math.random();

        if (random < 0.8) {
            let unions_PR = this.#game_logic.rank_unions_by_PCD(this);
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