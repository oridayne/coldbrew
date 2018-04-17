var deletedPackages = []; // list of package objects deleted. This helps with undo.

// not implemented yet, but here's skeleton code
// this is should be used when Add Packages is implemented. 
function addPackage(){
	// TODO: create a list item based on package input, then add it using addListItem function
    // addListItem(li);
}


// Given a list item, add it to it's correct place (alphabetically) in the package list.
function addListItem(listItem){
	var addName = listItem.innerText;
	var ol = document.getElementById("packageList");
	var packages = ol.children;
	for(x=0; x<packages.length; x++){
		var itemName = packages[x].innerText;
		//if it comes before
		if(addName.localeCompare(itemName)==-1){
			packages[x].parentNode.insertBefore(listItem, packages[x]);
			return;
		}
	}
	ol.appendChild(listItem);
	
}

function checkAll(){
	var ol = document.getElementById("packageList");
	var packages = ol.children;
	for(x=packages.length-1;x>=0; x--){
		var item = packages[x];
		item.children[0].checked=true;
	}
}

// removes checked packages from the packages list
function removePackage(){
	var ol = document.getElementById("packageList");
	var packages = ol.children;
	for(x=packages.length-1;x>=0; x--){
		var item = packages[x];
		var isChecked = item.children[0].checked;
		if(isChecked){
			var breadcrumb = packages[x];
			deletedPackages.push(breadcrumb);
			packages[x].remove();			
		}
	}
}

// undo package deletions
function undo(){
	if(deletedPackages.length==0){
		return;
	}
	var item = deletedPackages.pop();
	addListItem(item);

}
