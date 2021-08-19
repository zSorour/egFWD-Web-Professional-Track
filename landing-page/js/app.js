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

function navigateToSection(e){
  e.preventDefault();
  const eTarget = e.target;
  if(eTarget.nodeName === 'A'){
    const sectionID = eTarget.getAttribute('href');
    const section = document.querySelector(sectionID);
    section.scrollIntoView();
  }
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
  //Create anchor tag with href attribute of the corresponding section ID, allowing to scroll to the target section.
  //To ensure smoothness in the scrolling behavior, a CSS styling rule is added in the CSS file to set 'scroll-behavior' of the html element to 'smooth'
  navListItem.insertAdjacentHTML(
    "afterbegin",
    `<a href='#${sectionID}' class="menu__link">${navItemText}</a>`
  );
  htmlFragment.appendChild(navListItem);
});
navItemsList.appendChild(htmlFragment);

// Add class 'active' to section when near top of viewport

// Scroll to anchor ID using scrollTO event
/*Since I am using the native scrolling behavior of the anchor tag alongside CSS styling to have scroll-behavior set to smooth,
scrolling programmatically would not be necessary.
However, since scroll-behavior attribute is not supported on all browsers as per https://caniuse.com/?search=scroll-behavior,
and to meet project requirements, scrolling programmatically can be implemented as found below:
 */
navItemsList.addEventListener("click", (e) => {navigateToSection(e)}, false);

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu

// Scroll to section on link click

// Set sections as active
