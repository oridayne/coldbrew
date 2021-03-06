import moment from "moment";

export default class Note {
    /**
     * Compares notes chronologically. More recent notes < less recent notes.
     * @param noteA the first note
     * @param noteB the second note
     */
    public static compareTimes(noteA: Note, noteB: Note) {
        return noteA.time.isSame(noteB.time) ? 0 : ((noteA.time.isAfter(noteB.time)) ? -1 : 1);
    }

    private static nextAvailableID = 0;
    private static generateID(): number {
        return Note.nextAvailableID++;
    }

    private readonly id: number;
    private author: string;
    private text: string;
    private time: moment.Moment;
    private pinned: boolean;
    private deleted: boolean;

    constructor(obj: { author: string, text: string, time: moment.Moment, pinned?: boolean, deleted?: boolean }) {
        this.author = obj.author;
        this.text = obj.text;
        this.time = obj.time;

        this.id = Note.generateID();
        this.pinned = obj.pinned || false;
        this.deleted = obj.deleted || false;
    }

    public displayTime(): string {
        return this.time.format("ddd MMM D h:mmA");
    }

    public isPinned(): boolean {
        return this.pinned;
    }

    public isDeleted(): boolean {
        return this.deleted;
    }

    public getElementId(): string {
        return `note-${this.id}`;
    }

    /**
     * Render this Note as a <div> element whose ID is note-<id>, where <id> is
     * equal to this.id. Return the element.
     */
    public renderForHomepageDisplay(
        deleteNoteCallback: (undoer: () => void) => void,
        pinNoteCallback: () => void,
        editNoteCallback: () => void,
        unpinNoteCallback: () => void,
    ): HTMLDivElement {

        const displayTime = this.displayTime();

        const div = document.createElement("div");
        div.id = this.getElementId();
        div.classList.add("note");

        const textDiv = document.createElement("div");
        textDiv.classList.add("note-flex-row");

        // Add note text in <p>
        const paragraph = document.createElement("p");
        // TODO sanitize note input
        paragraph.innerText = this.text;
        textDiv.appendChild(paragraph);

        // Add pin note button
        const pinNoteButton = document.createElement("button");
        const pinIcon = document.createElement("i");
        pinIcon.classList.add("fa", "fa-thumbtack");
        pinNoteButton.appendChild(pinIcon);
        pinNoteButton.classList.add("button", "pin-button");
        pinNoteButton.addEventListener("click", () => {
            if (this.isPinned()) { // unpin the note
                this.pinned = false;
                div.classList.remove("notePinned");
                unpinNoteCallback();
            } else { // pin the note
                this.pinned = true;
                div.classList.add("notePinned");
                pinNoteCallback();
            }
        });

        if (this.isPinned()) {
            div.classList.add("notePinned");
        } else {
            div.classList.remove("notePinned");
        }

        textDiv.appendChild(pinNoteButton);
        div.appendChild(textDiv);

        const controlDiv = document.createElement("div");
        controlDiv.classList.add("note-flex-row");

        // Add edit note button
        const editNoteButton = document.createElement("button");
        const editNoteIcon = document.createElement("i");
        editNoteIcon.classList.add("fas", "fa-edit");
        editNoteButton.appendChild(editNoteIcon);
        const editNoteSpan = document.createElement("span");
        editNoteSpan.innerText = " Edit";
        editNoteButton.appendChild(editNoteSpan);
        editNoteButton.classList.add("button", "edit");
        editNoteButton.addEventListener("click", editNoteCallback);
        controlDiv.appendChild(editNoteButton);

        // Add delete note button
        const deleteNoteButton = document.createElement("button");
        const deleteNoteIcon = document.createElement("i");
        deleteNoteIcon.classList.add("fas", "fa-trash");
        deleteNoteButton.appendChild(deleteNoteIcon);
        const deleteNoteSpan = document.createElement("span");
        deleteNoteSpan.innerText = " Delete";
        deleteNoteButton.appendChild(deleteNoteSpan);
        deleteNoteButton.classList.add("button", "delete");
        deleteNoteButton.addEventListener("click", () => {
            this.deleted = true;

            deleteNoteCallback(() => {
                this.deleted = false;
            });
        });
        controlDiv.appendChild(deleteNoteButton);

        // Add author and timestamp
        const creditSpan = document.createElement("span");
        creditSpan.classList.add("noteCredit");
        creditSpan.innerHTML = `<strong>${this.author}</strong><br>${displayTime}`;
        controlDiv.appendChild(creditSpan);

        div.appendChild(controlDiv);

        return div;
    }

    /**
     * Render note on homepage for editing.
     * @param submitEditCallback A function that takes an undoer (which, when called, will undo the edit)
     * @param cancelEditCallback A function that exits the edit without altering the note
     */
    public renderForHomepageEdit(
        submitEditCallback: (undoer: () => void) => void,
        cancelEditCallback: () => void,
    ): HTMLDivElement {
        const div = document.createElement("div");
        div.id = this.getElementId();
        div.classList.add("note", "noteEditing");

        const form = document.createElement("form");

        const textarea = document.createElement("textarea");
        const textareaId = this.getElementId() + "-text";
        textarea.id = textareaId;
        textarea.setAttribute("name", "noteText");
        textarea.classList.add("noteTextEdit");
        textarea.value = this.text;
        form.appendChild(textarea);

        const noteAuthorLabel = document.createElement("label");
        noteAuthorLabel.innerText = "author";
        noteAuthorLabel.setAttribute("for", "noteAuthor");
        form.appendChild(noteAuthorLabel);

        const noteAuthorInput = document.createElement("input");
        noteAuthorInput.setAttribute("type", "text");
        noteAuthorInput.setAttribute("name", "noteAuthor");
        noteAuthorInput.classList.add("entry");
        noteAuthorInput.value = this.author;
        form.appendChild(noteAuthorInput);

        const submitEditButton = document.createElement("button");
        const submitEditIcon = document.createElement("i");
        submitEditIcon.classList.add("fas", "fa-sticky-note");
        submitEditButton.appendChild(submitEditIcon);
        const submitEditSpan = document.createElement("span");
        submitEditSpan.innerText = " Submit";
        submitEditButton.appendChild(submitEditSpan);
        submitEditButton.classList.add("button");
        submitEditButton.setAttribute("type", "button");

        const currentAuthor = this.author;
        const currentText = this.text;
        const currentTime = this.time;
        const submitEdit = () => {
            this.author = noteAuthorInput.value;
            this.text = textarea.value;
            this.time = moment();

            // Pass an undoer function to the callback
            submitEditCallback(() => {
                this.author = currentAuthor;
                this.text = currentText;
                this.time = currentTime;
            });
        };
        submitEditButton.addEventListener("click", submitEdit);
        form.addEventListener("submit", submitEdit);

        const cancelEditButton = document.createElement("button");
        const cancelEditIcon = document.createElement("i");
        cancelEditIcon.classList.add("fas", "fa-times");
        cancelEditButton.appendChild(cancelEditIcon);
        const cancelEditSpan = document.createElement("span");
        cancelEditSpan.innerText = " Cancel";
        cancelEditButton.appendChild(cancelEditSpan);
        cancelEditButton.classList.add("button", "cancel");
        cancelEditButton.setAttribute("type", "button");
        cancelEditButton.addEventListener("click", cancelEditCallback);

        form.appendChild(submitEditButton);
        form.appendChild(cancelEditButton);

        div.appendChild(form);

        return div;
    }
}
