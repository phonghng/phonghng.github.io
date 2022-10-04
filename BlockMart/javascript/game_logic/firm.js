class Firm {
    #error_event = undefined;
    #objnetwork = undefined;

    name = undefined;

    #prod_cap = 1;
    #alpha = 0;

    constructor(error_event, objnetwork) {
        this.#error_event = error_event;
        this.#objnetwork = objnetwork;
        this.#objnetwork.add_object(this);
    }

    produce() {
        let darkness = Math.random();
        let amount = this.#prod_cap;
        let beta = darkness * amount;
        this.#alpha += beta;
    }

    update_prod_cap() {

    }

    get_union_info() {
        let joined_union =
            this.#objnetwork.get_links_by_object_and_role(this, "union_member");
        return joined_union;
    }

    join_union(union) {
        let joined_union = [this.get_union_info()];
        this.#objnetwork.remove_links(joined_union);
        joined_union =
            this.#objnetwork.add_link(this, "union_member", union, "union");
        return joined_union;
    }
}