import dummyPackages from "./dummy-packages";
import Package from "./package";
import * as Util from "./util";

import "./navbar";

function makePackageFromInputs(): Package {
    // FIXME should fail if required inputs are not present

    const firstname = Util.getInputValueById("firstname");
    const lastname = Util.getInputValueById("lastname");
    const packageNumber = Util.getInputValueById("packageNumber");

    const location = Util.getInputValueById("location");
    const carrier = Util.getInputValueById("carrier");

    let comments: string | undefined = Util.getInputValueById("comments");
    if (comments.length === 0) {
        comments = undefined;
    }

    return new Package({
        carrier,
        comments,
        firstname,
        lastname,
        location,
        packageNumber,
    });
}

// stack of package objects deleted. This helps with undo.
const deletedPackages: Package[][] = [];

const allPackages: Set<Package> = new Set();

document.addEventListener("DOMContentLoaded", () => {
    
    Util.getElementById("checkAll").addEventListener("click", checkAll);
    Util.getElementById("pickedUp").addEventListener("click", removeCheckedPackages);
    Util.getElementById("delete").addEventListener("click", removeCheckedPackages);
    Util.getElementById("undo").addEventListener("click", undo);
    Util.getElementById("packageForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const pkg = makePackageFromInputs();
        allPackages.add(pkg);
        redrawPackages();

        clearPackageInput();
    });
    Util.getElementById("clearPackageInput").addEventListener("click", clearPackageInput);
    Util.getElementById("addNote").addEventListener("click", (e) => {
        e.preventDefault();
        addNote();
        clearNoteInput();
    });
    // TODO implement search
    // Util.getElementById("search").addEventListener("input", (e) => {
    // });

    // initialize allPackages from dummy package data set
    for (const p of dummyPackages) {
        allPackages.add(p);
    }
    redrawPackages();
});

function clearPackageInput() {
    const inputs = Util.getElementById("packageForm").getElementsByTagName("input");
    for (const input of inputs) {
        input.value = "";
    }
}

function redrawPackages() {
    const ol = Util.getElementById("packageList");
    ol.innerHTML = "";

    const packages = Array.from(allPackages.values());
    packages.sort((a, b) => {
        return a.name().localeCompare(b.name());
    });

    for (const pkg of packages) {
        ol.appendChild(pkg.render());
    }
}

// Given a list item, add it to its correct place (alphabetically) in the package list.
function addListItem(listItem: HTMLLIElement) {
    const addName = listItem.innerText;
    const ol = Util.getElementById("packageList");
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
    const ol = Util.getElementById("packageList");
    for (const li of ol.children) {
        const checkbox = li.querySelector("input") as HTMLInputElement;
        checkbox.checked = true;
    }
}

// removes checked packages from the packages list
function removeCheckedPackages() {
    const deleted = [];
    for (const pkg of allPackages) {
        const checkbox = Util.getElementById(`pkg-${pkg.id}-checkbox`) as HTMLInputElement;
        if (checkbox.checked) {
            deleted.push(pkg);
        }
    }
    for (const pkg of deleted) {
        allPackages.delete(pkg);
    }

    // only add a new undo entry if anything got deleted
    if (deleted.length > 0) {
        deletedPackages.push(deleted);
    }
    redrawPackages();
}

// undo package deletions
function undo() {
    const lastDelete = deletedPackages.pop();
    if (lastDelete == null) {
        return;
    }

    for (const pkg of lastDelete) {
        const li = pkg.render();
        addListItem(li);
    }
}

function clearNoteInput() {
    const newNoteTextArea = Util.getElementById("newNote") as HTMLTextAreaElement;
    newNoteTextArea.value = "";
}

function addNote() {
    const noteDiv = document.createElement("div");

    // Add note text in <p>
    const noteParagraph = document.createElement("p");
    noteDiv.classList.add("note");
    // TODO sanitize note input
    const newNoteTextArea = Util.getElementById("newNote") as HTMLTextAreaElement;
    noteParagraph.innerText = newNoteTextArea.value;
    noteDiv.appendChild(noteParagraph);

    // Add delete note button
    const deleteNoteButton = document.createElement("button");
    deleteNoteButton.innerText = "Delete";
    deleteNoteButton.addEventListener("click", () => {
        noteDiv.remove();
    });
    noteDiv.appendChild(deleteNoteButton);

    // Add pin note button
    const pinNoteButton = document.createElement("button");
    pinNoteButton.innerText = "Pin";
    pinNoteButton.addEventListener("click", pinNote);

    function pinNote() {
        noteDiv.classList.add("notePinned");
        pinNoteButton.innerText = "Unpin";
        pinNoteButton.removeEventListener("click", pinNote);
        pinNoteButton.addEventListener("click", unpinNote);

        const topNote = Util.getElementById("newNoteContainer").nextElementSibling;
        if (topNote && topNote.parentElement) {
            topNote.parentElement.insertBefore(noteDiv, topNote);
        }
    }

    function unpinNote() {
        noteDiv.classList.remove("notePinned");
        pinNoteButton.innerText = "Pin";
        pinNoteButton.removeEventListener("click", unpinNote);
        pinNoteButton.addEventListener("click", pinNote);

        insertAtTopOfUnpinnedNotes();
    }

    noteDiv.appendChild(pinNoteButton);

    // Add new note to DOM (at the top of the unpinned notes)
    function insertAtTopOfUnpinnedNotes() {
        let currentNote = Util.getElementById("newNoteContainer").nextElementSibling;
        if (currentNote === noteDiv) { // make sure this also works if the current note is the first one found
            currentNote = currentNote.nextElementSibling;
        }
        while (currentNote) {
            if (currentNote.classList.contains("notePinned")) {
                currentNote = currentNote.nextElementSibling;
            } else if (currentNote.classList.contains("note")) {
                if (currentNote.parentNode) {
                    currentNote.parentNode.insertBefore(noteDiv, currentNote);
                }
                return;
            }
        }
        Util.getElementById("notesCol").appendChild(noteDiv);
    }

    insertAtTopOfUnpinnedNotes();
}
