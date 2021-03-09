import { formMaker, inputFieldMaker } from "/javascripts/tools/formMaker.js"
const socket = io();
const collapsible = document.querySelector(".collapsible");

socket.on("connected", () => {
    console.log("Connected !");
    socket.emit("getType");
});

socket.on("getType", data => {
    collapsible.innerHTML = "";
    for (const type of data)
        if (type.configuration) {
            const [formRow, form] = formMaker();
            for (const [name, conf] of Object.entries(type.configuration)) {
                let secondRow = document.createElement("div");
                secondRow.classList.add("row");
                form.insertAdjacentElement("beforeend", secondRow);
                secondRow.insertAdjacentElement("beforeend", inputFieldMaker(type.type, conf.type, name, conf));
            }

            const save = document.createElement("a");
            save.classList.add("waves-effect", "waves-light", "btn", "blue");
            save.innerText = "Save";
            save.addEventListener("click", ev => {
                ev.stopPropagation();
                if (form.reportValidity()) {
                    let data = {};
                    for (const e of new FormData(form))
                        data[e[0]] = e[1];
                    socket.emit("setTypeConfig", {type: type.type, configuration: data})
                }
            });
            formRow.insertAdjacentElement("beforeend", save);

            addCollapsible(type.name, formRow);
        }
    M.updateTextFields();
});

socket.on("setTypeConfig", data => {
    if (data && data.configuration) {
        for (const [name, value] of Object.entries(data.configuration))
            document.getElementById(data.type + "-" + name).value = value;
        M.updateTextFields();
    }
});

function addCollapsible(title, content) {
    const li = document.createElement("li");
    const divTitle = document.createElement("div");
    divTitle.classList.add("collapsible-header");
    divTitle.innerText = title;
    li.insertAdjacentElement("beforeend", divTitle);
    const divContent = document.createElement("div");
    divContent.classList.add("collapsible-body");
    if (content)
        if (typeof content !== "string")
            divContent.insertAdjacentElement("beforeend", content);
        else
            divContent.insertAdjacentHTML("beforeend", content);
    li.insertAdjacentElement("beforeend", divContent);
    collapsible.insertAdjacentElement("beforeend", li);
    return li;
}

document.addEventListener("DOMContentLoaded", () => {
    M.AutoInit();
});
