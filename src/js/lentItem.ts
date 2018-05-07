export default class LentItem {
    private static nextAvailableID = 0;
    private static generateID(): number {
        return LentItem.nextAvailableID++;
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

        this.id = LentItem.generateID();
    }

    public label(): string {
        return `${this.lastname}, ${this.firstname}`;
    }

    /**
     * Render this Item as a <li> element whose ID is lent-<id>, where <id> is
     * equal to this.id.
     */
    public render(onDelete: (lent: LentItem) => void): HTMLLIElement {
        const label = this.label();

        const li = document.createElement("li");
        li.classList.add("item");
        li.id = `lent-${this.id}`;

        const shownDiv = document.createElement("div");
        const hiddenDetailsDiv = document.createElement("div");
      
         shownDiv.classList.add("hiddenItem");
        hiddenDetailsDiv.id = "hidden"+li.id;
        li.appendChild(shownDiv);

        if(this.comments){
            const commentsDetail = document.createElement("p");
            commentsDetail.innerHTML = `<strong>Comments:</strong> ${this.comments}`;
            commentsDetail.classList.add("first-detail");
            hiddenDetailsDiv.appendChild(commentsDetail);
            shownDiv.classList.add("hiddenItemExpandable");

        }

        shownDiv.innerText = label;        
        // shownDiv.classList.add("hiddenItem");
        shownDiv.setAttribute("data-toggle", "collapse");
        shownDiv.setAttribute("data-target", "#"+hiddenDetailsDiv.id);
        hiddenDetailsDiv.classList.add("collapse");
        
  

        const smallBin = document.createElement("p");
        smallBin.classList.add("smallText");
        smallBin.innerText = this.item;


        const pickupButton = document.createElement("button");
        pickupButton.type = "button";
        pickupButton.classList.add("button", "pickedUp");

        pickupButton.onclick = onDelete.bind(null, this);
        const pickupIcons = document.createElement("span");
        pickupIcons.classList.add("fa-layers", "fa-fw");
        const boxIcon = document.createElement("i");
        boxIcon.classList.add("fas", "fa-gamepad");
        boxIcon.setAttribute("data-fa-transform", "shrink-5 up-2 left-1");
        pickupIcons.appendChild(boxIcon);
        const arrowIcon = document.createElement("i");
        arrowIcon.classList.add("fas", "fa-arrow-down");
        arrowIcon.setAttribute("data-fa-transform", "shrink-8 down-7 left-2");
        pickupIcons.appendChild(arrowIcon);
        pickupButton.appendChild(pickupIcons);
        const pickupSpan = document.createElement("span");
        pickupSpan.innerText = " Returned";
        pickupButton.appendChild(pickupSpan);
        shownDiv.appendChild(pickupButton);
        shownDiv.appendChild(smallBin);
     
        shownDiv.appendChild(hiddenDetailsDiv);
        return li;
    }
}
