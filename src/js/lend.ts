import dummyItems from "./dummy-items";
import LentItem from "./lentItem";
import * as Util from "./util";

// stack of package objects deleted. This helps with undo.
const deletedItems: LentItem[] = [];

const allItems: Set<LentItem> = new Set();

document.addEventListener("DOMContentLoaded", () => {

    Util.getElementById("itemsearch").addEventListener("input", (e) => {
        const elt = e.target as HTMLInputElement;
        filterItems(elt.value);
    });
    Util.getElementById("undoItem").addEventListener("click", undoDeleteItems);

    Util.getElementById("LendForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const item = makeLendItemFromInputs();
        allItems.add(item);
        clearItemInput();

        redrawItems();
        Util.getElementById("firstnameLend").focus();
    });
    Util.getElementById("clearItemInput").addEventListener("click", clearItemInput);
    // initialize allPackages from dummy package data set
    for (const p of dummyItems) {
        allItems.add(p);
    }
    redrawItems();
});

function makeLendItemFromInputs(): LentItem {
    // FIXME should fail if user enters in only spaces
    const firstname = Util.getInputValueById("firstnameLend");
    const lastname = Util.getInputValueById("lastnameLend");
    const item = Util.getInputValueById("itemToLend");

    let comments: string | undefined = Util.getInputValueById("itemComments");
    if (comments.length === 0) {
        comments = undefined;
    }

    return new LentItem({
        comments,
        firstname,
        item,
        lastname,
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

    filterItems(Util.getInputValueById("itemsearch"));
}

function deleteItem(it: LentItem) {
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
        const itemName = li.querySelector(".smallText") as HTMLElement;
        const fcSummaryText = summary.innerText.toLocaleLowerCase();
        const itemText = itemName.innerText.toLocaleLowerCase();
        const containsQuery = fcSummaryText.indexOf(fcQuery) !== -1 || itemText.indexOf(fcQuery) !== -1;

        li.classList.toggle("filtered-out", !containsQuery);
    }
    console.log("after filtering");
}

// Given a list item, add it to its correct place (alphabetically) in the package list.
function addListItem(listItem: HTMLLIElement) {
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

// undo package deletions
function undoDeleteItems() {
    const lastDelete = deletedItems.pop();
    if (lastDelete == null) {
        return;
    }

    allItems.add(lastDelete);
    addListItem(lastDelete.render(deleteItem));
}

function clearItemInput() {
    const inputs = Util.getElementById("LendForm").getElementsByTagName("input");
    for (const input of inputs) {
        input.value = "";
    }
}
