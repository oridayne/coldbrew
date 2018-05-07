// To include a navbar on a page:
//  1. Import this script
//  2. Include a <ul id="navbar" data-pagename="[pagename of that page]">
import * as Util from "./util";

import { getElementById } from "./util";

interface IPage {
    displayName: string;
    link: string;
    pagename: string;
}

const pages: IPage[] = [
    {
        displayName: "Home",
        link: "index.html",
        pagename: "home",
    },
  
    {
        displayName: "Lent Items",
        link: "lend.html",
        pagename: "lend",
    },
  
];



document.addEventListener("DOMContentLoaded", () => {

    // Hide the lend columns...
    var lendCols = document.getElementsByClassName("lendCol");
    for(var i=0; i<lendCols.length; i++){
        lendCols[i].classList.add("hidden");
    }
    // navbar ul
    const navbar = getElementById("navbar");

    // add links to other pages
    if (navbar) {
        const pagename = navbar.dataset.pagename;

        pages.forEach((page) => {
            const navLi = document.createElement("li");

            // const navLink = document.createElement("a");
            // navLink.setAttribute("href", page.link);

            const nav = document.createElement("div");
            nav.classList.add("colHeader");
            if (pagename && pagename === page.pagename) {
                nav.classList.add("active");
            }
            nav.innerText = page.displayName;
            nav.id = `nav-${page.pagename}`;

            // navLink.appendChild(nav);
            // navLi.appendChild(navLink);
            // navbar.appendChild(navLi);
            navLi.appendChild(nav);
            navbar.appendChild(navLi);
        });
    }
    Util.getElementById("nav-lend").addEventListener("click", showLendPage);
    Util.getElementById("nav-home").addEventListener("click", showPackagePage);
});

function showLendPage(){
    var lendCols = document.getElementsByClassName("lendCol");
    var pkgCols = document.getElementsByClassName("packageCol");

    for(var i=0; i<pkgCols.length; i++){
        pkgCols[i].classList.add("hidden");
    }
    for(var i=0; i<lendCols.length; i++){
        lendCols[i].classList.remove("hidden");
    }  


}

function showPackagePage(){
    var pkgCols = document.getElementsByClassName("packageCol");
    var lendCols = document.getElementsByClassName("lendCol");

    for(var i=0; i<lendCols.length; i++){
        lendCols[i].classList.add("hidden");
    }
    for(var i=0; i<pkgCols.length; i++){
        pkgCols[i].classList.remove("hidden");
    }  
}




