class Union {
    /*
     * ===== ABREVIATED =====
     * prod_cap = production capacity
     * PCD = production capacity difference (firm's prod_cap - based_union's prod_cap)
     * PR = rank by PCD
     * minPR = minimum rank by PCD acceptable
     */

    #game_logic;
    #game_notification;
    #objnetwork;

    name;

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

    set minPCDR(value) {
        this.#minPCDR = value;
    }

    calculate_prod_cap() {
        let members = this.get_members();
        if (members.length <= 0) return 0;
        let members_prod_cap = members.map(firm => firm.prod_cap);
        let total_prod_cap = members_prod_cap.reduce((sum, current) => sum + current);
        let prod_cap = total_prod_cap / members.length;
        return prod_cap;
    }

    calculate_average_alpha() {
        let members = this.get_members();
        if (members.length <= 0) return 0;
        let members_alpha = members.map(firm => firm.alpha);
        let total_alpha = members_alpha.reduce((sum, current) => sum + current);
        let average_alpha = total_alpha / members.length;
        return average_alpha;
    }

    add_member(firm) {
        let member_link_info =
            this.#objnetwork.get_link
                (this, "union", firm, "union_member");
        this.#objnetwork.remove_links([member_link_info]);

        member_link_info =
            this.#objnetwork.add_link
                (this, "union", firm, "union_member");

        return member_link_info;
    }

    remove_member(firm) {
        let member_link_info =
            this.#objnetwork.get_link
                (this, "union", firm, "union_member");
        this.#objnetwork.remove_links([member_link_info]);
    }

    get_members() {
        let member_link_info =
            this.#objnetwork.get_links_by_object_and_role
                (this, "union");
        let members = member_link_info.map(info => info.union_member);
        return members;
    }

    rank_firms_by_PCD(based_union) {
        if (!this.#game_logic.unions.includes(based_union))
            return this.#game_notification.throw("Game_Logic__NO_UNION_FOUND");

        let union_prod_cap = based_union.calculate_prod_cap();

        let ranked_firms = this.#game_logic.firms.slice();
        ranked_firms.sort((a, b) => {
            let a_PCD = a.prod_cap - union_prod_cap;
            let b_PCD = b.prod_cap - union_prod_cap;
            return b_PCD - a_PCD;
        });

        return ranked_firms;
    }

    consider_add_member(firm) {
        let random = Math.random();

        if (random < 0.8) {
            let firms_PR = this.rank_firms_by_PCD(this);
            let acceptable_firms = firms_PR.splice(0, this.#minPCDR);
            if (acceptable_firms.includes(firm)) {
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