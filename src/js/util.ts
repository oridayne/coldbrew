export function getElementById(id: string): HTMLElement {
    const elt = document.getElementById(id);
    if (elt == null) {
        throw new Error("no such element with id");
    }
    return elt;
}




export function getInputValueById(id: string): string {
    return (getElementById(id) as HTMLInputElement).value;
}

export function getFirstChildOfElement(parent: Node): HTMLElement{
    const elt =  parent.firstChild;
    if(elt==null){
    	throw new Error("no first child");
    }
    return (elt as HTMLElement);
}
