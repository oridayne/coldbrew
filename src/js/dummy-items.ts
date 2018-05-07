import lentItem from "./lentItem";

const items: lentItem[] = [];
export default items;

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

const itemsToLend = [
    "Men In Black", 
    "Avatar",
    "Basketball", 
    "Bike Pump", 
    "Extension Cord", 
    "Smash", 
    "Inception", 
    "Ping Pong Ball", 
    "Monopoly", 
    "Avengers", 
];

const randomComments = [
    "Thanks!",
    "I will return in 2 weeks",
    "Was checked out in bad condition",
    "I will return in 1 week",
    "",
    "",
    "For my suite",
];

function randInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

function pick<T>(array: T[]): T {
    return array[randInt(array.length)];
}



for (const lastname of lastnames) {
    const firstname = lastname === "Zeng" ? "Aaron" : pick(firstnames);
    const item = itemsToLend[randInt(itemsToLend.length)];
    const comments = randomComments[randInt(randomComments.length)];
    const dummyItem = new lentItem({ firstname, lastname, item, comments});
    items.push(dummyItem);
}