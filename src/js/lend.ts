import "./navbar";
import * as Util from "./util";
import lentItem from "./lentItem";
import dummyItems from "./dummy-items";

// stack of package objects deleted. This helps with undo.
const deletedItems: lentItem[] = [];

const allItems: Set<lentItem> = new Set();

document.addEventListener("DOMContentLoaded", () => {

    Util.getElementById("searchItems").addEventListener("input", (e) => {
        const elt = e.target as HTMLInputElement;
        filterItems(elt.value);
    });

   Util.getElementById("LendForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const item = makeLendItemFromInputs();
        allItems.add(item);
        redrawItems();

        clearItemInput();
        Util.getElementById("firstnameLend").focus();
    });
    Util.getElementById("clearItemInput").addEventListener("click", clearItemInput);
    // initialize allPackages from dummy package data set
    console.log(dummyItems);
    for (const p of dummyItems) {
        allItems.add(p);
    }
    redrawItems();
});




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
    console.log(items);
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
       
        const summary = li.querySelector(".hiddenItem") as HTMLElement;
        const itemName = li.querySelector(".smallText") as HTMLElement;
        const fcSummaryText = summary.innerText.toLocaleLowerCase();
        const itemText = itemName.innerText.toLocaleLowerCase();
        const containsQuery = fcSummaryText.indexOf(fcQuery) !== -1 || itemText.indexOf(fcQuery)!==-1;

        li.classList.toggle("filtered-out", !containsQuery);
    }
}

// function generateDummyItems(){
//     const lastnames = ["Deng", "Anson", "Shreve", "Holtzman", "Dauber", "Zeng", "Smith"];
//     const firstnames = ["Lisa", "Caroline", "Kim", "Aaron", "Toby", "Megan", "Jim", "David"];
//     const items = ["Smash", "Monopoly", "Bike Pump", "Basketball", "Men In Black", "Charger", "Ping Pong Paddle", "Lion King"];

//     for(let x = 0; x<items.length; x++){
//         const item = new lentItem({
//             // firstnames[Math.floor(Math.random()*firstnames.length)],
//             // lastnames[Math.floor(Math.random()*lastnames.length)],
//             firstname"Deng",
//             "Lisa",
//             items[x],

//         });
//         allItems.add(item);
//         redrawItems();
//     }

// }



function clearItemInput() {
    const inputs = Util.getElementById("LendForm").getElementsByTagName("input");
    for (const input of inputs) {
        input.value = "";
    }
}
