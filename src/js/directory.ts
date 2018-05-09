import "./navbar";
import * as Util from "./util";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded: Directory");
  populateMembers();

  Util.getElementById("memberSearch").addEventListener("input", (e) => {
    const elt = e.target as HTMLInputElement;
    filterMembers(elt.value);
  });
});

function populateMembers() {
  const lastNames = ["Smith", "Shreve", "Holtzman", "Deng", "Zeng", "Potter", "Dauber"];
  const firstNames = ["David", "Lisa", "Toby", "Kim", "Aaron", "Richard", "Caroline"];
  let x;
  for (x = 0; x < 10; x++) {
    const last = Math.floor(Math.random() * lastNames.length);
    const first = Math.floor(Math.random() * firstNames.length);

    const name = lastNames[last] + ", " + firstNames[first];
    const member = document.createElement("div");
    member.className = "memberRow";
    const text = document.createElement("p");
    text.className = "memberEntry";
    text.innerHTML = name;
    member.appendChild(text);
    Util.getElementById("memberList").appendChild(member);

  }

}

function filterMembers(query: string) {

  const shown = Array.from(document.getElementsByClassName("memberRow"));
  const hidden = Array.from(document.getElementsByClassName("memberHide"));
  const children = shown.concat(hidden);
  const query = query.toLocaleLowerCase();
  for (const child of children) {
    const name = Util.getFirstChildOfElement(child).innerText.toLocaleLowerCase();
    const containsQuery = name.indexOf(query) !== -1;
    if (containsQuery) {
      child.className = "memberRow";
    } else {
      child.className = "memberHide";
    }
  }

}
