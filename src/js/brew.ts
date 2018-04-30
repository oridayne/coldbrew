import "./navbar";
import * as Util from "./util";

class Package {
    private firstname: string;
    private lastname: string;
    private packageNumber: string;
    private location: string;
    private carrier: string;
    private comments: string | undefined;

    constructor(firstname: string, lastname: string, packageNumber: string,
                location: string, carrier: string, comments?: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.packageNumber = packageNumber;
        this.location = location;
        this.carrier = carrier;
        this.comments = comments;
    }

    public static fromInputs(): Package {
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

        return new Package(
            firstname,
            lastname,
            packageNumber,
            location,
            carrier,
            comments,
        );
    }

    public render(): HTMLLIElement {
        const name = `${this.lastname}, ${this.firstname}`;
        const popupText = `${this.location}, pkg. #${this.packageNumber}`;

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
}

// stack of package objects deleted. This helps with undo.
// TODO make this a stack of Package
const deletedPackages: HTMLLIElement[][] = [];

const allPackages: Set<Package> = new Set();

document.addEventListener("DOMContentLoaded", () => {

    Util.getElementById("checkAll").addEventListener("click", checkAll);
    Util.getElementById("pickedUp").addEventListener("click", removeCheckedPackages);
    Util.getElementById("delete").addEventListener("click", removeCheckedPackages);
    Util.getElementById("undo").addEventListener("click", undo);
    Util.getElementById("popExample").addEventListener("click", popUp);
    Util.getElementById("packageForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const p = Package.fromInputs();
        allPackages.add(p);
        addListItem(p.render());
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

});

function clearPackageInput() {
    const inputs = Util.getElementById("packageForm").getElementsByTagName("input");
    for (const input of inputs) {
        input.value = "";
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
        const checkbox = li.children[0] as HTMLInputElement;
        checkbox.checked = true;
    }
}

// removes checked packages from the packages list
function removeCheckedPackages() {
    const ol = Util.getElementById("packageList");
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
    const popup = Util.getElementById("zeng");
    popup.classList.toggle("show");
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
