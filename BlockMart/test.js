let error_event = new Game_Error(e => { throw e; });
let objnetwork = new ObjNetwork();
let firm = new Firm(error_event, objnetwork);
let union = new Union(error_event, objnetwork);

union.name = "LimiBVN";
firm.name = "BVN";
console.log(firm.join_union(union));
console.log(firm.produce(), firm);