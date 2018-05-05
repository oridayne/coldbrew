// import 'bootstrap/js/dist/collapse';
import 'bootstrap';
export default class Package {
    private static nextAvailableID = 0;
    private static generateID(): number {
        return Package.nextAvailableID++;
    }

    public readonly id: number;
    private readonly firstname: string;
    private readonly lastname: string;
    private readonly packageNumber: string;
    private readonly location: string;
    private readonly carrier: string;
    private readonly comments: string | undefined;

    constructor(obj: { firstname: string, lastname: string, packageNumber: string,
                       location: string, carrier: string, comments?: string }) {
        this.firstname = obj.firstname;
        this.lastname = obj.lastname;
        this.packageNumber = obj.packageNumber;
        this.location = obj.location;
        this.carrier = obj.carrier;
        this.comments = obj.comments;

        this.id = Package.generateID();
    }

    public name(): string {
        return `${this.lastname}, ${this.firstname}`;
    }

    /**
     * Render this Package as a <li> element whose ID is pkg-<id>, where <id> is
     * equal to this.id.
     */
    public render(onDelete: (pkg: Package) => void): HTMLLIElement {
        const name = this.name();

        const li = document.createElement("li");
        li.classList.add("pkg");
        li.id = `pkg-${this.id}`;

        const shownDiv = document.createElement("div");
        const hiddenDiv = document.createElement("div");
      

        const divID = "hidden"+li.id;
        hiddenDiv.id = divID;
        li.appendChild(shownDiv);

        shownDiv.innerText = name;        
        shownDiv.classList.add("hiddenPackage");
        shownDiv.setAttribute("data-toggle", "collapse");
        shownDiv.setAttribute("data-target", "#"+hiddenDiv.id);
        hiddenDiv.classList.add("collapse");
        var text  = this.location + "<br/>"
                             + this.carrier + "<br/>" 
                             + this.packageNumber + "<br/>";
        hiddenDiv.innerHTML = text;
        // console.log(text);
        if(this.comments){
            hiddenDiv.innerHTML+=this.comments;
        }

        const smallBin = document.createElement("p");
        smallBin.classList.add("smallText");
        smallBin.innerText = this.location;


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
