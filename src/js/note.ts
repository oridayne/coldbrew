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
    private readonly author: string;
    private readonly text: string;
    private readonly time: moment.Moment;
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
        return this.time.format("ddd MMM D h:mA");
    }

    public isPinned(): boolean {
        return this.pinned;
    }

    public isDeleted(): boolean {
        return this.deleted;
    }

    /**
     * Render this Note as a <div> element whose ID is note-<id>, where <id> is
     * equal to this.id. Return the element or void if the
     */
    public renderForHomepage(
        deleteNoteCallback: () => void,
        pinNoteCallback: () => void,
        unpinNoteCallback: () => void,
    ): HTMLDivElement | void {

        if (!this.isDeleted()) {

            const displayTime = this.displayTime();

            const div = document.createElement("div");
            div.id = `note-${this.id}`;
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
            pinNoteButton.classList.add("button", "pin-button");
            pinNoteButton.addEventListener("click", () => {
                if (this.isPinned()) { // unpin the note
                    this.pinned = false;
                    pinNoteButton.innerText = "Pin";
                    div.classList.remove("notePinned");
                    unpinNoteCallback();
                } else { // pin the note
                    this.pinned = true;
                    pinNoteButton.innerText = "Unpin";
                    div.classList.add("notePinned");
                    pinNoteCallback();
                }
            });

            if (this.isPinned()) {
                pinNoteButton.innerText = "Unpin";
                div.classList.add("notePinned");
            } else {
                pinNoteButton.innerText = "Pin";
                div.classList.remove("notePinned");
            }

            textDiv.appendChild(pinNoteButton);
            div.appendChild(textDiv);


            const controlDiv = document.createElement("div");
            controlDiv.classList.add("note-flex-row");

            // Add delete note button
            const deleteNoteButton = document.createElement("button");
            deleteNoteButton.innerText = "Delete";
            deleteNoteButton.classList.add("button");
            deleteNoteButton.addEventListener("click", () => {
                this.deleted = true;
                deleteNoteCallback();
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
    }
}
