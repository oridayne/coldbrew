import dummyPackages from "./dummy-packages";
import Package from "./package";
import Note from "./note";
import * as Util from "./util";
import moment from 'moment';

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

function makeNoteFromInputs(): Note {
    // FIXME should fail if required inputs are not present

    // const author = Util.getInputValueById("newNoteAuthor");
    const author = "kadauber";
    const newNoteTextArea = Util.getElementById("newNote") as HTMLTextAreaElement;
    const text = newNoteTextArea.value;
    const time = moment();

    return new Note({
        author,
        text,
        time
    });
}

const allNotes: Set<Note> = new Set();

document.addEventListener("DOMContentLoaded", () => {

    Util.getElementById("checkAll").addEventListener("click", checkAll);
    Util.getElementById("pickedUp").addEventListener("click", removeCheckedPackages);
    Util.getElementById("delete").addEventListener("click", removeCheckedPackages);
    Util.getElementById("undo").addEventListener("click", undoDeletePackages);
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
function addPackageListItem(listItem: HTMLLIElement) {
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
// TODO: make this undo when multiple packages at a time are deleted
function undoDeletePackages() {
    const lastDelete = deletedPackages.pop();
    if (lastDelete == null) {
        return;
    }

    for (const pkg of lastDelete) {
        const li = pkg.render();
        addPackageListItem(li);
    }
}

function clearNoteInput() {
    const newNoteTextArea = Util.getElementById("newNote") as HTMLTextAreaElement;
    newNoteTextArea.value = "";
    const noteAuthorInput = Util.getElementById("newNoteAuthor") as HTMLInputElement;
    noteAuthorInput.value = "";
}

function addNote() {
    const newNote = makeNoteFromInputs();
    allNotes.add(newNote);
    redrawNotes();
}

function redrawNotes() {
    const notesCol = Util.getElementById("notesCol");
    // Remove all notes from the DOM
    Array.from(Util.getElementsByClassName("note")).forEach(noteElt => {
        noteElt.remove();
    });

    // Filter deleted notes andn separate pinned and unpinned notes
    const pinnedNotes: Note[] = [];
    const unpinnedNotes: Note[] = [];

    Array.from(allNotes.values())
        .filter(note => !note.isDeleted())
        .forEach(note => note.isPinned() ? pinnedNotes.push(note) : unpinnedNotes.push(note));

    // Put notes in reverse chronological order
    pinnedNotes.sort(Note.compareTimes);
    unpinnedNotes.sort(Note.compareTimes);

    // Render notes in reverse chronological order
    pinnedNotes.forEach(note => {
        const noteDiv = note.renderForHomepage(redrawNotes, redrawNotes, redrawNotes);

        if (noteDiv) {
            notesCol.appendChild(noteDiv);
        }
    });

    unpinnedNotes.forEach(note => {
        const noteDiv = note.renderForHomepage(redrawNotes, redrawNotes, redrawNotes);

        if (noteDiv) {
            notesCol.appendChild(noteDiv);
        }
    });
}