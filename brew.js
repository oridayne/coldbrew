

function addPackage(){
}

function checkAll(){
	console.log("i am here!");
	var ul = document.getElementById("packageList");
	var packages = ul.children;
	for(x=packages.length-1;x>=0; x--){
		var item = packages[x];
		item.children[0].checked=true;
	}
}

// removes checked packages from the packages list
function removePackage(){
	var ul = document.getElementById("packageList");
	var packages = ul.children;
	for(x=packages.length-1;x>=0; x--){
		var item = packages[x];
		var isChecked = item.children[0].checked;
		if(isChecked){
			packages[x].remove();			
		}
	}
}
