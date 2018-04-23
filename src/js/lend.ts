/// <reference path="util.ts">
import * as Util from "./util";

document.addEventListener("DOMContentLoaded", () => {

    Util.getElementById("returnItems").addEventListener("click", removeCheckedItems);
    Util.getElementById("LendForm").addEventListener("submit", (e) => {
        e.preventDefault();
        addLentItem();
        clearItemInput();
    });
    Util.getElementById("clearItemInput").addEventListener("click", clearItemInput);

});

// // Given a list item, add it to its correct place (alphabetically) in the package list.
function addLentListItem(listItem: HTMLLIElement) {
    const addName = listItem.innerText;
    const ol = Util.getElementById("itemList");
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

function addLentItem() {
    // FIXME should fail if required inputs are not present

    const item = Util.getInputValueById("itemToLend");
    const firstname = Util.getInputValueById("nameEntry");
    const nameText = `${item} - ${firstname}`;
    console.log(nameText);
    const li = createLentListItem(nameText);
    addLentListItem(li);
}

function createLentListItem(name: string): HTMLLIElement {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    li.appendChild(checkbox);

    li.insertAdjacentText("beforeend", name);
    return li;
}

// removes checked packages from the packages list
function removeCheckedItems() {
    const ol = Util.getElementById("itemList");
    const packages = ol.children;
    console.log(packages);
    for (let x = packages.length - 1; x >= 0; x--) {
        const checkbox = packages[x].children[0] as HTMLInputElement;
        console.log(checkbox);
        if (checkbox.checked) {
            packages[x].remove();
        }
    }
}

function clearItemInput() {
    const inputs = Util.getElementById("LendForm").getElementsByTagName("input");
    for (const input of inputs) {
        input.value = "";
    }
}
