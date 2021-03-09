const socket = io();
const deckSelect = document.getElementById("deck-select");
const deck = document.getElementById("deck");
const modal = document.getElementById("modal");
const type = document.getElementById("type");
const title = document.getElementById("title");
const customs = document.getElementById("customs");
const form = modal.querySelector("form");
let modalInstance, types, slot;


socket.on("connected", () => {
    console.log("Connected !");
    socket.emit("getDeck");
    socket.emit("getDecks");
    socket.emit("getType");
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
            c.addEventListener("click", ev => {
                ev.stopPropagation();
                socket.emit("getSlot", {name: name, slot: [x, y]});
            });
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
            }
        }
});

socket.on("getDecks", data => {
    deckSelect.innerHTML = "";
    for (const deck of data)
        deckSelect.insertAdjacentHTML("beforeend", `<option name="${deck}">${deck}</option>`);
    M.FormSelect.init(deckSelect);
});

socket.on("getSlot", data => {
    slot = data;
    customs.innerHTML = "";
    modal.querySelectorAll("#type>option[selected]").forEach(e => e.selected = false);

    if (data.data) {
        title.value = data.data.text;
        type.querySelector(`option[value=${data.data.type}]`).selected = true;
        customFields(data.data.options);
    } else
        type.value = title.value = "";

    M.updateTextFields();
    M.FormSelect.init(type);
    modalInstance.open();
});

socket.on("getType", data => {
    types = data;
    type.innerHTML = "";
    for (let t of data)
        type.insertAdjacentHTML("beforeend", `<option value="${t.type}">${t.name}</option>`);
});

socket.on("setSlot", data => {
    if (data.error)
        alert(data.error);
    else {
        modalInstance.close();
        let e = document.getElementById(`r${data.position[0]}c${data.position[1]}`);
        if (e) {
            e.innerHTML = "";
            if (data.data)
                if (data.data.image)
                    e.insertAdjacentHTML("beforeend", `<img src="${data.data.image}" alt="${data.data.text}">`);
                else if (data.data.text)
                    e.insertAdjacentHTML("beforeend", `<p>${data.data.text}</p>`);
        }
    }
});

deckSelect.addEventListener("change", ev => {
    ev.stopPropagation();
    socket.emit("getDeck", deckSelect.value);
});

document.getElementById("save").addEventListener("click", ev => {
    ev.stopPropagation();

    let data = {};
    for (const e of new FormData(form))
        data[e[0]] = e[1];

    if (!slot.data)
        slot.data = {};

    for (const k of ["text", "type"]) { //image
        slot.data[k] = data[k];
        delete data[k];
    }

    slot.data.options = data;

    socket.emit("setSlot", {name: slot.name, data: slot.data, position: slot.position});
});

document.getElementById("remove").addEventListener("click", ev => {
    ev.stopPropagation();
    socket.emit("setSlot", {name: slot.name, data: null, position: slot.position});
});

type.addEventListener("change", ev => {
    ev.stopPropagation();
    customFields();
});

document.addEventListener("DOMContentLoaded", () => {
    M.AutoInit();
    modalInstance = M.Modal.getInstance(modal);
});

function customFields(values) {
    customs.innerHTML = "";
    let t = types.find(v => v.type === type.value);
    for (const [name, field] of Object.entries(t.fields)) {
        let e;
        switch (field.type) {
            case "text":
                e = document.createElement("input");
                e.type = "text";
                break;
            case "select":
                e = document.createElement("select");
                for (let option of field.options)
                    e.insertAdjacentHTML("beforeend", `<option value="${option}">${option}</option>`);
                break;
        }
        e.name = name;
        e.id = name;
        e.required = true;
        e.classList.add("validate");
        let d = document.createElement("div");
        d.classList.add("input-field");
        d.insertAdjacentElement("beforeend", e);
        d.insertAdjacentHTML("beforeend", `<label for="${name}">${field.name}</label>`);
        if (field.helper)
            d.insertAdjacentHTML("beforeend", `<span class="helper-text">${field.helper}</span>`);
        customs.insertAdjacentElement("beforeend", d);
        if (values && name in values) {
            e.value = values[name];
            if (field.type === "select")
                e.querySelector(`option[value=${values[name]}]`).selected = true;
        }
        if (field.type === "select") {
            M.FormSelect.init(e);
            e.style.display = "none";
        }
    }
    M.updateTextFields();
}
