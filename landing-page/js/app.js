/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */
let SECTIONS;
let ACTIVE_TAB;

/**
 * End Global Variables
 * Start Helper Functions
 *
 */
const getAllSections = () => {
  const sections = document.querySelectorAll("section");
  return sections;
};

const setActiveTab = (newActiveTab) => {
  if (!ACTIVE_TAB) {
    ACTIVE_TAB = document.querySelector(".menu__link.active ");
  }
  ACTIVE_TAB.classList.toggle("active");
  newActiveTab.classList.toggle("active");
  ACTIVE_TAB = newActiveTab;
};

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav

const buildNavItems = () => {
  const navItemsList = document.querySelector("#navbar__list");
  navItemsList.addEventListener(
    "click",
    (e) => {
      navigateToSection(e);
    },
    false
  );

  const htmlFragment = document.createDocumentFragment();
  if (!SECTIONS) {
    SECTIONS = getAllSections();
  }
  SECTIONS.forEach((section) => {
    const navItemText = section.getAttribute("data-nav");
    const sectionID = section.getAttribute("id");
    const navListItem = document.createElement("li");
    //Create anchor tag with href attribute of the corresponding section ID, allowing to scroll to the target section.
    //To ensure smoothness in the scrolling behavior, a CSS styling rule is added in the CSS file to set 'scroll-behavior' of the html element to 'smooth'
    navListItem.insertAdjacentHTML(
      "afterbegin",
      `<a href='#${sectionID}'class="menu__link${
        sectionID === "section1" ? " active" : ""
      }">${navItemText}</a>`
    );
    htmlFragment.appendChild(navListItem);
  });
  navItemsList.appendChild(htmlFragment);
};

const navigateToSection = (e) => {
  //Prevent the default behavior of the anchor tag and how it adds the element's ID to the URL.
  e.preventDefault();
  const eTarget = e.target;
  //Since event delegation pattern is used for better performance, I must ensure that the click is on an anchor tag of one of the nav items,
  //not the navbar itself.
  if (eTarget.nodeName === "A") {
    const sectionID = eTarget.getAttribute("href");
    const section = document.querySelector(sectionID);
    section.scrollIntoView();
    setActiveTab(eTarget);
  }
};

// Add class 'active' to section when near top of viewport

document.addEventListener("DOMContentLoaded", buildNavItems);
