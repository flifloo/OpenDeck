const socket = io();
const deckSelect = document.getElementById("deck-select");
const deck = document.getElementById("deck");

socket.on("connected", () => {
    console.log("Connected !");
    socket.emit("getDeck");
    socket.emit("getDecks");
});

socket.on("getDeck", d => {
    let data = d.data, name = d.name;
    deck.innerHTML = "";

    for (let x = 0; x < data.x; x++) {
        const r = document.createElement("div");
        r.id = "r" + x;
        for (let y = 0; y < data.y; y++) {
            const c = document.createElement("div");
            c.id = r.id+"c"+y;
            r.insertAdjacentElement("beforeend", c);
        }
        deck.insertAdjacentElement("beforeend", r);
    }

    for (const [x, cols] of Object.entries(data.rows))
        for (const [y, col] of Object.entries(cols))
            setSlot(name, col, x, y);
});

socket.on("getDecks", data => {
    deckSelect.innerHTML = "";
    for (const deck of data)
        deckSelect.insertAdjacentHTML("beforeend", `<option name="${deck}">${deck}</option>`);
    M.FormSelect.init(deckSelect);
});

socket.on("trigger", data => {
    if (data.error)
        alert(data.error)
});

socket.on("setSlot", data => {
    if (data && !data.error)
        setSlot(data.name, data.data, ...data.position)
});

document.getElementById("fullScreen").addEventListener("click", ev => {
    ev.stopPropagation();
    if (!document.fullscreenElement)
        document.documentElement.requestFullscreen();
    else if (document.exitFullscreen)
            document.exitFullscreen();
});

deckSelect.addEventListener("change", ev => {
    ev.stopPropagation();
    socket.emit("getDeck", deckSelect.value);
});

socket.on("addDeck", data => {
    if (data) {
        deckSelect.insertAdjacentHTML("beforeend", `<option value="${data}">${data}</option>`);
        M.FormSelect.init(deckSelect);
    }
});

socket.on("deleteDeck", data => {
    if (data) {
        const curr = deckSelect.value;
        deckSelect.querySelector(`option[value=${data}]`).remove();
        M.FormSelect.init(deckSelect);
        if (data === curr)
            socket.emit("getDeck");
    }
});

function setSlot(name, data, x, y) {
    let e = document.getElementById(`r${x}c${y}`);

    if (e) {
        let d = document.createElement("div");
        d.id = e.id;
        e.replaceWith(d);
        e = d;
        if (data) {
            if (data.image)
                e.insertAdjacentHTML("beforeend", `<img src="${data.image}" alt="${data.text}">`);
            else if (data.text)
                e.insertAdjacentHTML("beforeend", `<p>${data.text}</p>`);

            e.addEventListener("click", ev => {
                ev.stopPropagation();
                socket.emit("trigger", [name, x, y]);
            })
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    M.AutoInit();
    M.FloatingActionButton.init(document.querySelector(".fixed-action-btn"), {hoverEnabled: false})
});
