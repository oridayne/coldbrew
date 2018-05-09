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
        displayName: "Packages",
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
    const lendCols = document.getElementsByClassName("lendCol");
    for (const lendCol of lendCols) {
        lendCol.classList.add("hidden");
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

function showLendPage() {
    const lendCols = document.getElementsByClassName("lendCol");
    const pkgCols = document.getElementsByClassName("packageCol");

    for (const pkgCol of pkgCols) {
        pkgCol.classList.add("hidden");
    }
    for (const lendCol of lendCols) {
        lendCol.classList.remove("hidden");
    }

}

function showPackagePage() {
    const pkgCols = document.getElementsByClassName("packageCol");
    const lendCols = document.getElementsByClassName("lendCol");

    for (const lendCol of lendCols) {
        lendCol.classList.add("hidden");
    }
    for (const pkgCol of pkgCols) {
        pkgCol.classList.remove("hidden");
    }
}
