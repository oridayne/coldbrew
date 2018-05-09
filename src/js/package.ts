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

    constructor(obj: {
        firstname: string, lastname: string, packageNumber: string,
        location: string, carrier: string, comments?: string,
    }) {
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
        const hiddenDetailsDiv = document.createElement("div");

        hiddenDetailsDiv.id = `hidden${li.id}`;
        li.appendChild(shownDiv);

        shownDiv.innerText = name;
        shownDiv.classList.add("hiddenPackage", "collapsed");
        shownDiv.setAttribute("data-toggle", "collapse");
        shownDiv.setAttribute("data-target", "#" + hiddenDetailsDiv.id);
        hiddenDetailsDiv.classList.add("hidden-details", "collapse");

        const locDetail = document.createElement("p");
        locDetail.innerHTML = `<strong>Location:</strong> ${this.location}`;
        locDetail.classList.add("first-detail");
        const carrierDetail = document.createElement("p");
        carrierDetail.innerHTML = `<strong>Carrier:</strong> ${this.carrier}`;
        const pkgIdDetail = document.createElement("p");
        pkgIdDetail.innerHTML = `<strong>Package #:</strong> ${this.packageNumber}`;
        hiddenDetailsDiv.appendChild(locDetail);
        hiddenDetailsDiv.appendChild(carrierDetail);
        hiddenDetailsDiv.appendChild(pkgIdDetail);
        if (this.comments) {
            const commentsDetail = document.createElement("p");
            commentsDetail.innerHTML = `<strong>Comments:</strong> ${this.comments}`;
            hiddenDetailsDiv.appendChild(commentsDetail);
        }

        const smallBin = document.createElement("p");
        smallBin.classList.add("smallText");
        const expandIcon = document.createElement("i");
        expandIcon.classList.add("fas", "fa-caret-down");
        smallBin.appendChild(expandIcon);
        const smallBinSpan = document.createElement("span");
        smallBinSpan.innerText = ` ${this.location}`;
        smallBin.appendChild(smallBinSpan);

        const pickupButton = document.createElement("button");
        pickupButton.type = "button";
        pickupButton.classList.add("button", "pickedUp");

        pickupButton.onclick = onDelete.bind(null, this);
        const pickupIcons = document.createElement("span");
        pickupIcons.classList.add("fa-layers", "fa-fw");
        const boxIcon = document.createElement("i");
        boxIcon.classList.add("fas", "fa-box-open");
        boxIcon.setAttribute("data-fa-transform", "shrink-5 down-3 left-2");
        pickupIcons.appendChild(boxIcon);
        const arrowIcon = document.createElement("i");
        arrowIcon.classList.add("fas", "fa-arrow-up");
        arrowIcon.setAttribute("data-fa-transform", "shrink-8 up-7 left-2");
        pickupIcons.appendChild(arrowIcon);
        pickupButton.appendChild(pickupIcons);
        const pickupSpan = document.createElement("span");
        pickupSpan.innerText = " Picked Up";
        pickupButton.appendChild(pickupSpan);
        shownDiv.appendChild(pickupButton);
        shownDiv.appendChild(smallBin);

        shownDiv.appendChild(hiddenDetailsDiv);
        return li;
    }
}
