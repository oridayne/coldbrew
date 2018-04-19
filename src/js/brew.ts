 // stack of package objects deleted. This helps with undo.
const deletedPackages: HTMLLIElement[][] = [];

/**
 * Get an element by ID or throw if it does not exist.
 */
function getElementById(id: string): HTMLElement {
    const elt = document.getElementById(id);
    if (elt == null) {
        throw new Error("no such element with id");
    }
    return elt;
}

document.addEventListener("DOMContentLoaded", () => {

    getElementById("checkAll").addEventListener("click", checkAll);
    getElementById("pickedUp").addEventListener("click", removeCheckedPackages);
    getElementById("delete").addEventListener("click", removeCheckedPackages);
    getElementById("undo").addEventListener("click", undo);
    getElementById("popExample").addEventListener("click", popUp);
    getElementById("packageForm").addEventListener("submit", (e) => {
        e.preventDefault();
        addPackage();
        clearPackageInput();
    });
    getElementById("clearPackageInput").addEventListener("click", clearPackageInput);

});

function clearPackageInput() {
    const inputs = getElementById("packageForm").getElementsByTagName("input");
    for (const input of inputs) {
        input.value = "";
    }
}

function getInputValueById(id: string): string {
    return (getElementById(id) as HTMLInputElement).value;
}

// not implemented yet, but here's skeleton code
// this should be used when Add Packages is implemented.
function addPackage() {
    const firstname = getInputValueById("firstname");
    const lastname = getInputValueById("lastname");
    const packageNumber = getInputValueById("packageNumber");

    const location = getInputValueById("location");
    // const carrier = getInputValueById("carrier");
    // const comments = getInputValueById("comments");

    const nameText = `${lastname}, ${firstname}`;
    const popupText = `${location}, pkg. #${packageNumber}`;

    const li = createListItem(nameText, popupText);
    addListItem(li);
}

function createListItem(name: string, popupText: string): HTMLLIElement {
    const li = document.createElement("li");
    li.classList.add("popup");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    li.appendChild(checkbox);

    li.insertAdjacentText("beforeend", name);

    const popup = document.createElement("span");
    popup.classList.add("popuptext");
    popup.textContent = popupText;
    li.appendChild(popup);

    return li;
}

// Given a list item, add it to its correct place (alphabetically) in the package list.
function addListItem(listItem: HTMLLIElement) {
    const addName = listItem.innerText;
    const ol = getElementById("packageList");
    for (const li of ol.children) {
        const itemName = li.textContent || "";
        // if it comes before
        if (addName.localeCompare(itemName) < 0) {
            ol.insertBefore(listItem, li);
            return;
        }
    }
    ol.appendChild(listItem);

}

function checkAll() {
    const ol = getElementById("packageList");
    for (const li of ol.children) {
        const checkbox = li.children[0] as HTMLInputElement;
        checkbox.checked = true;
    }
}

// removes checked packages from the packages list
function removeCheckedPackages() {
    const ol = getElementById("packageList");
    const packages = ol.children;
    const deleted = [];
    for (let x = packages.length - 1; x >= 0; x--) {
        const checkbox = packages[x].children[0] as HTMLInputElement;
        if (checkbox.checked) {
            const breadcrumb = packages[x] as HTMLLIElement;
            deleted.push(breadcrumb);
            packages[x].remove();
        }
    }
    deletedPackages.push(deleted);
}

// undo package deletions
function undo() {
    const lastDelete = deletedPackages.pop();
    if (lastDelete == null) {
        return;
    }

    for (const li of lastDelete) {
        const checkbox = li.children[0] as HTMLInputElement;
        checkbox.checked = false; // uncheck the item
        addListItem(li);
    }
}

function popUp() {
    // TODO make this work for any pop-up
    const popup = getElementById("zeng");
    popup.classList.toggle("show");
}
