// To include a navbar on a page:
//  1. Import this script
//  2. Include a <ul id="navbar" data-pagename="[pagename of that page]">

import { getElementById } from "./util";

interface Page {
    pagename: string;
    displayName: string;
    link: string;
    elementId: string;
}

const pages: Page[] = [
    {
        pagename: "home",
        displayName: "Home",
        link: "coldbrew.html",
        elementId: "home"
    },
    {
        pagename: "history",
        displayName: "Package History",
        link: "history.html",
        elementId: "packageHistory"
    },
    {
        pagename: "addPackage",
        displayName: "Add Package",
        link: "add-package.html",
        elementId: "addPackage.html"
    },
    {
        pagename: "notes",
        displayName: "Notes",
        link: "notes.html",
        elementId: "notes"
    },
    {
        pagename: "lend",
        displayName: "Lent Items",
        link: "lend.html",
        elementId: "lend"
    },
    {
        pagename: "directory",
        displayName: "Directory",
        link: "directory.html",
        elementId: "directory"
    },
    {
        pagename: "checkIn",
        displayName: "Check In/Check Out",
        link: "check-in.html",
        elementId: "checkIn"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    // navbar ul
    const navbar = getElementById("navbar");

    // add links to other pages
    if (navbar) {
        const pagename = navbar.dataset.pagename;

        pages.forEach((page) => {
            const navLi = document.createElement("li");

            const navLink = document.createElement("a");
            navLink.setAttribute("href", page.link);

            const nav = document.createElement("div");
            nav.classList.add("colHeader");
            if (pagename && pagename === page.pagename) {
                nav.classList.add("active");
            }
            nav.innerText = page.displayName;
            nav.id = page.elementId;

            navLink.appendChild(nav);
            navLi.appendChild(navLink);
            navbar.appendChild(navLi);
        });
    }
});
