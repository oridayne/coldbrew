import "./navbar";
import * as Util from "./util";
import lentItem from "./lentItem";

document.addEventListener("DOMContentLoaded", () => {

    Util.getElementById("returnItems").addEventListener("click", removeCheckedItems);
    // Util.getElementById("LendForm").addEventListener("submit", (e) => {
    //     e.preventDefault();
    //     addLentItem();
    //     clearItemInput();
    // });

   Util.getElementById("LendForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const item = makeLendItemFromInputs();
        allItems.add(item);
        redrawItems();

        clearItemInput();
        Util.getElementById("firstnameLend").focus();
    });
    Util.getElementById("clearItemInput").addEventListener("click", clearItemInput);

});


// stack of package objects deleted. This helps with undo.
const deletedItems: lentItem[] = [];

const allItems: Set<lentItem> = new Set();

function makeLendItemFromInputs(): lentItem {
    // FIXME should fail if user enters in only spaces
    const firstname = Util.getInputValueById("firstnameLend");
    const lastname = Util.getInputValueById("lastnameLend");
    const item = Util.getInputValueById("itemToLend");

    let comments: string | undefined = Util.getInputValueById("itemComments");
    if (comments.length === 0) {
        comments = undefined;
    }

    return new lentItem({
        firstname,
        lastname,
        item,
        comments,
    });
}

function redrawItems() {
    const ol = Util.getElementById("itemList");
    ol.innerHTML = "";

    const items = Array.from(allItems.values());
    items.sort((a, b) => {
        return a.label().localeCompare(b.label());
    });

    for (const it of items) {
        ol.appendChild(it.render(deleteItem));
    }

    filterItems(Util.getInputValueById("searchItems"));
}


function deleteItem(it: lentItem) {
    deletedItems.push(it);
    allItems.delete(it);
    Util.getElementById(`lent-${it.id}`).remove();
}

function filterItems(query: string) {
    // fc => case-folding, but JavaScript doesn't have Unicode case-folding
    // support :(
    const fcQuery = query.toLocaleLowerCase();

    const ol = Util.getElementById("itemList");

    for (const li of ol.children) {
        console.log(li);
        const summary = li.querySelector(".hiddenItem") as HTMLElement;
        const fcSummaryText = summary.innerText.toLocaleLowerCase();
        const containsQuery = fcSummaryText.indexOf(fcQuery) !== -1;
        li.classList.toggle("filtered-out", !containsQuery);
    }
}

// // // Given a list item, add it to its correct place (alphabetically) in the package list.
// function addLentListItem(listItem: HTMLLIElement) {
//     const addName = listItem.innerText;
//     const ol = Util.getElementById("itemList");
//     for (const li of ol.children) {
//         const itemName = li.textContent || "";
//         // if it comes before
//         if (addName.localeCompare(itemName) < 0) {
//             ol.insertBefore(listItem, li);
//             return;
//         }
//     }
//     ol.appendChild(listItem);
// }

// function addLentItem() {

//     const item = Util.getInputValueById("itemToLend");
//     const firstname = Util.getInputValueById("nameEntry");
//     const nameText = `${item} - ${firstname}`;
//     const li = createLentListItem(nameText);
//     addLentListItem(li);
// }

// function createLentListItem(name: string): HTMLLIElement {
//     const li = document.createElement("li");
//     const checkbox = document.createElement("input");
//     checkbox.type = "checkbox";
//     li.appendChild(checkbox);

//     li.insertAdjacentText("beforeend", name);
//     return li;
// }

// removes checked packages from the packages list
function removeCheckedItems() {
    const ol = Util.getElementById("itemList");
    const packages = ol.children;
    for (let x = packages.length - 1; x >= 0; x--) {
        const checkbox = packages[x].children[0] as HTMLInputElement;
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
