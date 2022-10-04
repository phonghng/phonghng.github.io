class Union {
    #error_event = undefined;
    #objnetwork = undefined;

    name = undefined;

    constructor(error_event, objnetwork) {
        this.#error_event = error_event;
        this.#objnetwork = objnetwork;
        this.#objnetwork.add_object(this);
    }

    calculate_prod_cap() {

    }
}