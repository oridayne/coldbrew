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



function populateMembers(){
	var lastNames = ["Smith", "Shreve", "Holtzman", "Deng", "Zeng", "Potter", "Dauber"];
	var firstNames = ["David", "Lisa", "Toby", "Kim", "Aaron", "Richard", "Caroline"];
	var x;
	for(x=0; x<10; x++)
	{
		var last = Math.floor(Math.random() * lastNames.length);
		var first = Math.floor(Math.random() * firstNames.length);

		var name = lastNames[last]+ ", " + firstNames[first];
		var member = document.createElement("div");
		member.className = "memberRow";
		var text = document.createElement("p");
		text.className = "memberEntry";
		text.innerHTML = name;
		member.appendChild(text);
		Util.getElementById("memberList").appendChild(member);

	}

}


function filterMembers(query: string) {

    var shown = Array.from(document.getElementsByClassName("memberRow"));
    var hidden = Array.from(document.getElementsByClassName("memberHide"));
    var children = shown.concat(hidden);
    var query = query.toLocaleLowerCase();
    for(var child of children){
    	var name = Util.getFirstChildOfElement(child).innerText.toLocaleLowerCase();
    	var containsQuery = name.indexOf(query) !==-1;
    	if (containsQuery){
    		child.className="memberRow";
    	}
    	else{
    		child.className="memberHide";
    	}
    }

}