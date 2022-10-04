let obj1 = { me: 1 };
let obj2 = { me2: 123 };
let obj3 = { me3: 134567 };

let one = new ObjNetwork();
one.add_object(obj1);
one.remove_object(obj1);
one.add_object(obj2);
one.add_object(obj3);

one.add_link(
    obj2,
    "parent",
    obj3,
    "child"
);

one.add_link(
    obj2,
    "parent123",
    obj3,
    "child123"
);

one.add_link(
    obj2,
    "parent123",
    obj3,
    "c124235d123"
);

one.add_object(obj1);

one.add_link(
    obj2,
    "c124235d123",
    obj1,
    "parent123"
);

console.log(one.remove_links(one.get_links_by_object(obj3)));