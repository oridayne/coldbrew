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
    public render(): HTMLLIElement {
        const name = this.name();

        const li = document.createElement("li");
        li.classList.add("pkg");
        li.id = `pkg-${this.id}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `pkg-${this.id}-checkbox`;
        li.appendChild(checkbox);

        const label = document.createElement("label");
        label.htmlFor = `pkg-${this.id}-checkbox`;
        li.appendChild(label);

        const pkgInfo = document.createElement("details");
        label.appendChild(pkgInfo);

        const summary = document.createElement("summary");
        summary.innerText = name;
        pkgInfo.appendChild(summary);

        pkgInfo.insertAdjacentText("beforeend", `Location: ${this.location}`);
        pkgInfo.insertAdjacentHTML("beforeend", "<br>");
        pkgInfo.insertAdjacentText("beforeend", `Carrier: ${this.carrier}`);
        pkgInfo.insertAdjacentHTML("beforeend", "<br>");
        pkgInfo.insertAdjacentText("beforeend", `Package #: ${this.packageNumber}`);

        if (this.comments !== undefined) {
            pkgInfo.insertAdjacentHTML("beforeend", "<br>");
            pkgInfo.insertAdjacentText("beforeend", `Comments: ${this.comments}`);
        }

        return li;
    }
}
