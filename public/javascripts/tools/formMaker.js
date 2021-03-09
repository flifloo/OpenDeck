export function inputFieldMaker(Type, type, name, options) {
    const inputField = document.createElement("div");
    inputField.classList.add("input-field", "col", "s12");

    let input;
    switch (type) {
        case "text":
            input = document.createElement("input");
            input.type = "text";
            break;
        case "select":
            input = document.createElement("select");
            for (const option of options.options) {
                const opt = document.createElement("option");
                opt.value = opt.innerText = option;
                input.insertAdjacentElement("beforeend", opt);
            }
            break;
        case "number":
            input = document.createElement("input");
            input.type = "number";
            break;
        case "password":
            input = document.createElement("input");
            input.type = "password";
            break;
    }
    input.id = Type + "-" + name;
    input.name = name;
    input.classList.add("validate");
    if (options.required)
        input.required = true;
    if (options.value) {
        input.value = options.value;
        if (type === "select")
            input.querySelectorAll(`option[value=${options.value}]`).forEach(o => o.selected = true);
    }

    inputField.insertAdjacentElement("beforeend", input);

    const label = document.createElement("label");
    label.for = input.id;
    label.innerText = name;
    inputField.insertAdjacentElement("beforeend", label);

    if (options.helper) {
        const helper = document.createElement("span");
        helper.classList.add("helper-text");
        helper.innerText = options.helper;
        inputField.insertAdjacentElement("beforeend", helper);
    }

    return inputField;
}

export function formMaker() {
    const row = document.createElement("div");
    row.classList.add("row");
    const form = document.createElement("form");
    form.classList.add("col", "s12");
    row.insertAdjacentElement("beforeend", form);
    return [row, form];
}
