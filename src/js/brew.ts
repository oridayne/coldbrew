 // stack of package objects deleted. This helps with undo.
const deletedPackages: HTMLLIElement[] = [];

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

});

// not implemented yet, but here's skeleton code
// this should be used when Add Packages is implemented.
function addPackage() {
    // TODO: create a list item based on package input, then add it using addListItem function
    // var li = createListItem(blah blah blah);
    // addListItem(li);
}

// TODO: make this thingy
function createListItem() {
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
    for (let x = packages.length - 1; x >= 0; x--) {
        const checkbox = packages[x].children[0] as HTMLInputElement;
        if (checkbox.checked) {
            const breadcrumb = packages[x] as HTMLLIElement;
            deletedPackages.push(breadcrumb);
            packages[x].remove();
        }
    }
}

// undo package deletions
function undo() {
    const item = deletedPackages.pop();
    if (item == null) {
        return;
    }

    const checkbox = item.children[0] as HTMLInputElement;
    checkbox.checked = false; // uncheck the item
    addListItem(item);
}

function popUp() {
    const popup = getElementById("zeng");
    popup.classList.toggle("show");
}
