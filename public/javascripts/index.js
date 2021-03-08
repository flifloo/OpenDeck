const socket = io();
const deck = document.getElementById("deck");

socket.on("connected", () => {
    console.log("Connected !");
    socket.emit("getDeck");
});

socket.on("getDeck", d => {
    let data = d.data, name = d.name;
    console.log(name);
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

socket.on("trigger", data => {
    if (data.error)
        alert(data.error)
});

socket.on("setSlot", data => {
    if (data && !data.error)
        setSlot(data.name, data.data, ...data.position)
});

function setSlot(name, data, x, y) {
    let e = document.getElementById(`r${x}c${y}`);
    if (e) {
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
