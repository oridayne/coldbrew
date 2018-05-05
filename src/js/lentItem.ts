import 'bootstrap';
export default class lentItem {
    private static nextAvailableID = 0;
    private static generateID(): number {
        return lentItem.nextAvailableID++;
    }

    public readonly id: number;
    private readonly firstname: string;
    private readonly lastname: string;
    private readonly item: string;
    private readonly comments: string | undefined;

    constructor(obj: { firstname: string, lastname: string, item: string,
                       comments?: string }) {
        this.firstname = obj.firstname;
        this.lastname = obj.lastname;
        this.item = obj.item;
        this.comments = obj.comments;

        this.id = lentItem.generateID();
    }

    public label(): string {
        return `${this.lastname}, ${this.firstname}`;
    }

    /**
     * Render this Item as a <li> element whose ID is lent-<id>, where <id> is
     * equal to this.id.
     */
    public render(onDelete: (lent: lentItem) => void): HTMLLIElement {
        const label = this.label();

        const li = document.createElement("li");
        li.classList.add("entry");
        li.id = `lent-${this.id}`;

        const shownDiv = document.createElement("div");
        const hiddenDiv = document.createElement("div");
      

        const divID = "hidden"+li.id;
        hiddenDiv.id = divID;
        li.appendChild(shownDiv);

        shownDiv.innerText = label;        
        shownDiv.classList.add("hiddenItem");
        shownDiv.setAttribute("data-toggle", "collapse");
        shownDiv.setAttribute("data-target", "#"+hiddenDiv.id);
        hiddenDiv.classList.add("collapse");
        var text  = this.comments+ "<br/>";
        hiddenDiv.innerHTML = text;
        if(this.comments){
            hiddenDiv.innerHTML+=this.comments;
        }

        const smallBin = document.createElement("p");
        smallBin.classList.add("whiteText");
        smallBin.innerText = this.item;


        const pickupButton = document.createElement("button");
        pickupButton.type = "button";
        pickupButton.classList.add("button", "pickedUp");

        pickupButton.onclick = onDelete.bind(null, this);
        pickupButton.innerText = "Picked Up";
        shownDiv.appendChild(pickupButton);
        shownDiv.appendChild(smallBin);
     
        shownDiv.appendChild(hiddenDiv);
        return li;
    }
}
