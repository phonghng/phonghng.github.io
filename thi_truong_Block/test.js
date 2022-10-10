function update_table(table, data) {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    let header = table.insertRow();
    for (key in data[0]) {
        let cell = header.insertCell();
        cell.style.fontWeight = "bold";
        let text = document.createTextNode(key);
        cell.appendChild(text);
    }

    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

let game_logic = new Game_Logic(e => { throw e; });

let interval = setInterval(() => {
    game_logic.random_all_events();
    update_table(
        document.querySelector("#firms"),
        game_logic.data_for_UI.firms
    );
    update_table(
        document.querySelector("#unions"),
        game_logic.data_for_UI.unions
    );
}, 1);