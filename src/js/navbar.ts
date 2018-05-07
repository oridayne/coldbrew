// To include a navbar on a page:
//  1. Import this script
//  2. Include a <ul id="navbar" data-pagename="[pagename of that page]">

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
            nav.id = `nav-${page.pagename}`;

            navLink.appendChild(nav);
            navLi.appendChild(navLink);
            navbar.appendChild(navLi);
        });
    }
});
