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
let sections = getAllSections();
/**
 * End Global Variables
 * Start Helper Functions
 *
 */
function getAllSections() {
  const sections = document.querySelectorAll("section");
  return sections;
}
/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
const navItemsList = document.querySelector("#navbar__list");
const htmlFragment = document.createDocumentFragment();

sections.forEach((section) => {
  const navItemText = section.getAttribute("data-nav");
  const sectionID = section.getAttribute("id");
  const navListItem = document.createElement("li");
  navListItem.insertAdjacentHTML(
    "afterbegin",
    `<a href='#${sectionID}' class="menu__link">${navItemText}</a>`
  );
  htmlFragment.appendChild(navListItem);
});
navItemsList.appendChild(htmlFragment);

// Add class 'active' to section when near top of viewport

// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu

// Scroll to section on link click

// Set sections as active
