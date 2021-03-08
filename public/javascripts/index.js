const socket = io();
const deck = document.getElementById("deck");

socket.on("connected", () => {
    console.log("Connected !");
    socket.emit("getDeck");
});

socket.on("getDeck", d => {
    console.log(d);
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
        for (const [y, col] of Object.entries(cols)) {
            let e = document.getElementById(`r${x}c${y}`);
            if (e) {
                if (col.image)
                    e.insertAdjacentHTML("beforeend", `<img src="${col.image}" alt="${col.text}">`);
                else if (col.text)
                    e.insertAdjacentHTML("beforeend", `<p>${col.text}</p>`);

                e.addEventListener("click", ev => {
                    ev.stopPropagation();
                    socket.emit("trigger", [name, x, y]);
                })
            }
        }
});

socket.on("trigger", data => {
    if (data.error)
        alert(data.error)
});
