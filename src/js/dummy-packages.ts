import Package from "./package";

const packages: Package[] = [];
export default packages;

const firstnames = [
    "Aaron",
    "Caroline",
    "Lisa",
    "Richard",
];

const lastnames = [
    "Anson",
    "Burke",
    "Carter",
    "Denmark",
    "Evangeline",
    "Frogsteine",
    "Grossman",
    "Holis",
    "Iglu",
    "Jando",
    "Kristoffberg",
    "Lampreay",
    "Monomon",
    "Oppres",
    "Plort",
    "Quinteyville",
    "Zeng",
];

const carriers = [
    "Amazon",
    "FedEx",
    "UPS",
    "USPS",
];

function randInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

function pick<T>(array: T[]): T {
    return array[randInt(array.length)];
}

function randomPackageNumber(): string {
    const digits = [];
    for (let i = 0; i < 24; i++) {
        digits.push(randInt(10));
    }
    return digits.join("");
}

const NUM_BINS = 20;

for (const lastname of lastnames) {
    const firstname = lastname === "Zeng" ? "Aaron" : pick(firstnames);
    const location = `Bin #${1 + randInt(NUM_BINS)}`;
    const packageNumber = randomPackageNumber();
    const carrier = pick(carriers);

    const pkg = new Package({ firstname, lastname, location, packageNumber, carrier });
    packages.push(pkg);
}
