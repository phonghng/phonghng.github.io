class ObjNetwork {
    constructor() {
    }

    objects = {};

    /**
     * Generate unique ID for object
     * @returns Generated ID
     */

    generate_id() {
        let id = 0;
        while (this.objects[id]) {
            id++;
        }
        return id.toString();
    }

    /**
     * Add new object to object list
     * @param {Object} object Object wants to add
     * @param {String} id Unique ID of object
     * @return Object added
     */

    add_object(object, id) {
        let existed_objects = Object.values(this.objects);
        if (object in existed_objects)
            throw `This object already exists, can't add again`;
        if (!id) {
            id = this.generate_id();
        }
        this.objects[id] = object;
        return this.objects[id];
    }

    /**
     * Remove a object from object list
     * @param {String} id ID of the object
     * @returns Result of deletion
     */

    remove_object(id) {
        return delete this.objects[id];
    }

    /**
     * Get a object from object list by its ID
     * @param {String} id ID of the object
     * @returns Found object
     */

    get_object(id) {
        return this.objects[id];
    }

    /**
     * Get a object's ID
     * @param {Object} object Object wants to identify
     * @returns String shows object's ID
     */

    get_object_id(object) {
        return Object.keys(this.objects).find(id => this.objects[id] === object);
    }

    links = [];

    /**
     * Get link information object
     * @param {String} first_object_id First object's ID
     * @param {String} first_object_role First object's role name
     * @param {String} second_object_id Second object's ID
     * @param {String} second_object_role Second object's role name
     * @return Link information object
     */

    get_link_info(
        first_object_id,
        first_object_role,
        second_object_id,
        second_object_role
    ) {
        let objects_keys = Object.keys(this.objects);
        if (!objects_keys.includes(first_object_id))
            throw `Can't find object with ID "${first_object_id}"`;
        if (!objects_keys.includes(second_object_id))
            throw `Can't find object with ID "${second_object_id}"`;
        if (first_object_id == second_object_id)
            throw `First and second object's ID can't be the same`;
        if (first_object_role == second_object_role)
            throw `First and second object's role name can't be the same`;

        let link_info = {
            [first_object_role]: this.objects[first_object_id],
            [second_object_role]: this.objects[second_object_id]
        };

        return link_info;
    }

    /**
     * Add new link between objects
     * @param {String} first_object_id First object's ID
     * @param {String} first_object_role First object's role name
     * @param {String} second_object_id Second object's ID
     * @param {String} second_object_role Second object's role name
     * @return Link information object
     */

    add_link(
        first_object_id,
        first_object_role,
        second_object_id,
        second_object_role
    ) {
        let link_info = this.get_link_info(
            first_object_id,
            first_object_role,
            second_object_id,
            second_object_role
        );

        if (this.links.includes(link_info))
            throw `This link already exists, can't link again`;

        this.links.push(link_info);

        return link_info;
    }

    /**
     * Remove a link from network
     * @param {String} first_object_id First object's ID
     * @param {String} first_object_role First object's role name
     * @param {String} second_object_id Second object's ID
     * @param {String} second_object_role Second object's role name
     * @returns Result of deletion
     */

    remove_link(
        first_object_id,
        first_object_role,
        second_object_id,
        second_object_role
    ) {
        let link_info = this.get_link_info(
            first_object_id,
            first_object_role,
            second_object_id,
            second_object_role
        );

        let link_index = this.links.indexOf(link_info);
        if (link_index > -1) {
            this.links.splice(link_index, 1);
            return true;
        }

        return false;
    }

    /**
     * Remove links from network by object's ID
     * @param {String} id Object's ID
     * @returns Result of deletion
     */

    remove_links_by_id(id) {
        let deletion_flag = false;

        for (const [index, info] of this.links.entries()) {
            let link_objects = Object.values(info);
            let link_ids = link_objects.map(object => this.get_object_id(object));
            if (link_ids.includes(id)) {
                this.links.splice(index, 1);
                deletion_flag = true;
            }
        }

        return deletion_flag;
    }

    /**
     * Remove links from network by object's role name
     * @param {String} role Role name
     * @returns Result of deletion
     */

    remove_links_by_role(role) {
        let deletion_flag = false;

        for (const [index, info] of this.links.entries()) {
            let link_role_names = Object.value(info);
            if (link_role_names.includes(role)) {
                this.links.splice(index, 1);
                deletion_flag = true;
            }
        }

        return deletion_flag;
    }
}