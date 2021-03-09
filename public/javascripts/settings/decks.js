import { inputFieldMaker } from "/javascripts/tools/formMaker.js"

const socket = io();
const deckSelect = document.getElementById("deck-select");
const deck = document.getElementById("deck");
const modalEdit = document.getElementById("modalEdit");
const modalAdd = document.getElementById("modalAdd");
const modalDelete = document.getElementById("modalDelete");
const type = document.getElementById("type");
const title = document.getElementById("title");
const image = document.getElementById("image");
const upload = document.getElementById("upload");
const customs = document.getElementById("customs");
const form = modalEdit.querySelector("form");
const addForm = modalAdd.querySelector("form");
let modalInstance, modalAddInstance, modalDeleteInstance, types, slot;


socket.on("connected", () => {
    console.log("Connected !");
    socket.emit("getDeck");
    socket.emit("getDecks");
    socket.emit("getType");
});

socket.on("getDeck", d => {
    let data = d.data, name = d.name;
    modalDelete.querySelector("h4").innerText = modalDelete.querySelector("h4").innerText.split(":")[0] + ": " + name;
    deckSelect.querySelectorAll(`option[selected]`).forEach(o => o.selected = false);
    deckSelect.querySelectorAll(`option[value=${name}]`).forEach(o => o.selected = true);
    M.FormSelect.init(deckSelect);
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
        deckSelect.insertAdjacentHTML("beforeend", `<option value="${deck}">${deck}</option>`);
    M.FormSelect.init(deckSelect);
});

socket.on("getSlot", data => {
    slot = data;
    customs.innerHTML = "";
    modalEdit.querySelectorAll("#type>option[selected]").forEach(e => e.selected = false);

    if (data.data) {
        title.value = data.data.text;
        image.value = data.data.image ? data.data.image : "";
        type.querySelector(`option[value=${data.data.type}]`).selected = true;
        customFields(data.data.options);
    } else
        type.value = title.value = image.value = "";

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

socket.on("uploadImage", data => {
    if (data.error)
        console.log(data.error);
    else if (data)
        image.value = data
});

socket.on("addDeck", data => {
    if (data.error)
        alert(data.error);
    else {
        deckSelect.insertAdjacentHTML("beforeend", `<option value="${data}">${data}</option>`);
        M.FormSelect.init(deckSelect);
        modalAddInstance.close();
        clearAdd();
        socket.emit("getDeck", data);
    }
});

socket.on("deleteDeck", data => {
    if (data.error)
        alert(data.error);
    else {
        const curr = deckSelect.value;
        deckSelect.querySelector(`option[value=${data}]`).remove();
        M.FormSelect.init(deckSelect);
        modalDeleteInstance.close();
        if (data === curr)
            socket.emit("getDeck");
    }
});

upload.addEventListener("dragover", ev => {
    ev.preventDefault();
}, true);

upload.addEventListener("drop", ev => {
    ev.preventDefault();
    uploadImage(ev.dataTransfer.files)
}, true);

upload.addEventListener("change", ev => {
    ev.stopPropagation();
    uploadImage(upload.files)
});

deckSelect.addEventListener("change", ev => {
    ev.stopPropagation();
    socket.emit("getDeck", deckSelect.value);
});

document.getElementById("save").addEventListener("click", ev => {
    ev.stopPropagation();
    if (form.reportValidity()) {
        let data = {};
        for (const e of new FormData(form))
            data[e[0]] = e[1];

        if (!slot.data)
            slot.data = {};

        for (const k of ["text", "type", "image"]) {
            slot.data[k] = data[k];
            delete data[k];
        }

        slot.data.options = data;

        socket.emit("setSlot", {name: slot.name, data: slot.data, position: slot.position});
    }
});

document.getElementById("delete").addEventListener("click", ev => {
    ev.stopPropagation();
    socket.emit("deleteDeck", deckSelect.value);
});

document.getElementById("add").addEventListener("click", ev => {
    ev.stopPropagation();

    let data = {};
    for (const e of new FormData(addForm))
        data[e[0]] = e[1];

    socket.emit("addDeck", data);
});

document.getElementById("clearAdd").addEventListener("click", () => {
    clearAdd();
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
    modalInstance = M.Modal.getInstance(modalEdit);
    modalAddInstance = M.Modal.getInstance(modalAdd);
    modalDeleteInstance = M.Modal.getInstance(modalDelete);
    M.FloatingActionButton.init(document.querySelector(".fixed-action-btn"), {hoverEnabled: false})
});

function customFields(values) {
    customs.innerHTML = "";
    let t = types.find(v => v.type === type.value);
    for (const [name, field] of Object.entries(t.fields)) {
        if (values && name in values)
            field.value = values[name];
        customs.insertAdjacentElement("beforeend", inputFieldMaker(type.value, field.type, name, field));
        if (field.type === "select") {
            const sel = customs.querySelector("select");
            M.FormSelect.init(sel);
            sel.style.display = "none";
        }
    }
    M.updateTextFields();
}

function uploadImage(files) {
    if (files.length === 0)
        alert("No image !");
    else if (files.length > 1)
        alert("Only one image !");
    else if (!files[0].type.match(/image.*/))
        alert("Not a image !");
    else
        socket.emit("uploadImage", files[0]);
    M.updateTextFields();
}

function clearAdd() {
    document.getElementById("name").value = "";
    document.getElementById("x").value = "10";
    document.getElementById("y").value = "5";
    M.updateTextFields();
}
