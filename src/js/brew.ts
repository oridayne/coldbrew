import moment from "moment";

import dummyPackages from "./dummy-packages";
import Note from "./note";
import Package from "./package";
import * as Util from "./util";

import "./navbar";

function makePackageFromInputs(): Package {
    // FIXME should fail if user enters in only spaces
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
const deletedPackages: Package[] = [];

const allPackages: Set<Package> = new Set();

function makeNoteFromInputs(): Note {
    // FIXME should fail if user enters only spaces

    return new Note({
        author: Util.getInputValueById("newNoteAuthor"),
        text: Util.getInputValueById("newNote"),
        time: moment(),
    });
}

const allNotes: Set<Note> = new Set([
    new Note({
        author: "kadauber",
        pinned: false,
        text: "Maya left her shoe here as collateral for her spare key.",
        time: moment("2018-04-27 10:00:34 am", "YYYY-MM-DD h:m:s A"),
    }),
    new Note({
        author: "kadauber",
        pinned: false,
        text: "Joe is looking for his laptop",
        time: moment("2018-04-24 03:32:01 pm", "YYYY-MM-DD h:m:s A"),
    }),
    new Note({
        author: "Lisa",
        pinned: true,
        text: "zbarryte had an amazon fresh delivery at 8pm",
        time: moment("2018-04-24 08:12:33 pm", "YYYY-MM-DD h:m:s A"),
    }),
    new Note({
        author: "Alyssa",
        pinned: true,
        text: "ONLY GIVE CPW BOOKLETS TO ACTUAL PREFROSH",
        time: moment("2018-04-01 12:05:38 am", "YYYY-MM-DD h:m:s A"),
    }),
]);

document.addEventListener("DOMContentLoaded", () => {

    // PACKAGES
    Util.getElementById("undo").addEventListener("click", undoDeletePackages);
    Util.getElementById("packageForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const pkg = makePackageFromInputs();
        allPackages.add(pkg);
        redrawPackages();

        clearPackageInput();
        Util.getElementById("firstname").focus();
    });
    Util.getElementById("clearPackageInput").addEventListener("click", clearPackageInput);
    Util.getElementById("search").addEventListener("input", (e) => {
        const elt = e.target as HTMLInputElement;
        filterPackages(elt.value);
    });

    // initialize allPackages from dummy package data set
    for (const p of dummyPackages) {
        allPackages.add(p);
    }
    redrawPackages();

    // NOTES
    Util.getElementById("noteForm").addEventListener("submit", (e) => {
        e.preventDefault();
        addNote();
        clearNoteInput();
        Util.getElementById("newNote").focus();
    });
    Util.getElementById("noteUndo").addEventListener("click", () => {
        const currentUndo = noteUndoers.pop();
        if (currentUndo) {
            currentUndo();
        }
        redrawNotes();
    });

    redrawNotes();
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
        ol.appendChild(pkg.render(deletePackage));
    }

    filterPackages(Util.getInputValueById("search"));
}

function deletePackage(pkg: Package) {
    deletedPackages.push(pkg);
    allPackages.delete(pkg);
    Util.getElementById(`pkg-${pkg.id}`).remove();
}

function filterPackages(query: string) {
    // fc => case-folding, but JavaScript doesn't have Unicode case-folding
    // support :(
    const fcQuery = query.toLocaleLowerCase();

    const ol = Util.getElementById("packageList");

    for (const li of ol.children) {
        const summary = li.querySelector(".hiddenPackage") as HTMLElement;
        const fcSummaryText = summary.innerText.toLocaleLowerCase();
        const containsQuery = fcSummaryText.indexOf(fcQuery) !== -1;
        li.classList.toggle("filtered-out", !containsQuery);
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

// undo package deletions
function undoDeletePackages() {
    const lastDelete = deletedPackages.pop();
    if (lastDelete == null) {
        return;
    }

    allPackages.add(lastDelete);
    addPackageListItem(lastDelete.render(deletePackage));
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

const noteUndoers: Array<() => void> = [];

function redrawNotes() {
    const notesCol = Util.getElementById("notesCol");
    // Remove all notes from the DOM
    Array.from(notesCol.getElementsByClassName("note")).forEach((noteElt) => {
        noteElt.remove();
    });

    // Filter deleted notes andn separate pinned and unpinned notes
    const pinnedNotes: Note[] = [];
    const unpinnedNotes: Note[] = [];

    Array.from(allNotes.values())
        .filter((note) => !note.isDeleted())
        .forEach((note) => note.isPinned() ? pinnedNotes.push(note) : unpinnedNotes.push(note));

    // Put notes in reverse chronological order
    pinnedNotes.sort(Note.compareTimes);
    unpinnedNotes.sort(Note.compareTimes);

    const deleteNote = (undoer: () => void) => {
        noteUndoers.push(undoer);
        redrawNotes();
    };

    const editNote = (note: Note) => {
        const displayNoteElt = Util.getElementById(note.getElementId());
        const editNoteElt = note.renderForHomepageEdit(
            (undoer) => {
                noteUndoers.push(undoer);
                const newDisplayNoteElt = note.renderForHomepageDisplay(
                    deleteNote,
                    redrawNotes,
                    () => { editNote(note); },
                    redrawNotes,
                );
                notesCol.replaceChild(newDisplayNoteElt, Util.getElementById(note.getElementId()));
            },
            () => {
                const newDisplayNoteElt = note.renderForHomepageDisplay(
                    deleteNote,
                    redrawNotes,
                    () => { editNote(note); },
                    redrawNotes,
                );
                notesCol.replaceChild(newDisplayNoteElt, Util.getElementById(note.getElementId()));
            },
        );
        notesCol.replaceChild(editNoteElt, displayNoteElt);
        const noteTextarea = editNoteElt.querySelector("textarea");
        if (noteTextarea) { noteTextarea.focus(); }
    };

    // Render notes in reverse chronological order
    pinnedNotes.forEach((note) => {
        const noteDiv = note.renderForHomepageDisplay(deleteNote, redrawNotes, () => { editNote(note); }, redrawNotes);

        if (noteDiv) {
            notesCol.appendChild(noteDiv);
        }
    });

    unpinnedNotes.forEach((note) => {
        const noteDiv = note.renderForHomepageDisplay(deleteNote, redrawNotes, () => { editNote(note); }, redrawNotes);

        if (noteDiv) {
            notesCol.appendChild(noteDiv);
        }
    });
}
