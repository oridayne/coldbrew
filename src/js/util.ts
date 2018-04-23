class Util {

	static test(){
		console.log("test");
	}

	static getElementById(id: string): HTMLElement {
	    const elt = document.getElementById(id);
	    if (elt == null) {
	        throw new Error("no such element with id");
	    }
	    return elt;
	}
	static getInputValueById(id: string): string {
    	return (this.getElementById(id) as HTMLInputElement).value;
	}

}

