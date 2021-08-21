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

/*
Define a Section class to encapsulate the data of a section and its corresponding nav anchor element.
The logic of setting a section and its corresponding nav element can be achieved by the method setActive defined in the class.
*/

class Section {
  // A static public member variable to hold the ID of the current active section.
  // NOTE: I do not store a whole Section object as an active section to reduce memory consumption.
  // The ID is sufficient to access the Section object when required within a function by accessing the global SECTIONS Map object as shown later.
  static activeSectionID;

  // Public member variables to hold the HTML section element and its corresponding nav anchor element.
  sectionElement;
  navElement;

  // Constructor function to create a Section object given a section HTML element. The navElement is set later after the navbar is built dynamically.
  constructor(sectionEL) {
    this.sectionElement = sectionEL;
  }

  setInactive = () => {
    this.sectionElement.classList.toggle("active");
    this.navElement.classList.toggle("active");
  };

  setActive = () => {
    const oldActiveSection = SECTIONS.get(Section.activeSectionID);
    oldActiveSection.setInactive();
    this.sectionElement.classList.toggle("active");
    this.navElement.classList.toggle("active");
    Section.activeSectionID = this.sectionElement.getAttribute("id");
  };
}

/**
 * Define Global Variables
 *
 */

let SECTIONS; // To hold a Map data structure of all the sections after they have been encapsulated in a Section object each.
let NAVBAR; // To hold the navbar element so that we do not have to traverse the DOM to select it on every scroll, which would be expensive.
let SCROLL_TOP_BUTTON; // To hold the scroll to top button so that we do not have to traverse the DOM to select it on every scroll.
let SCROLL_TIMEOUT; // To hold a timer when the screen is scrolled to know whether to show or hide the navbar.
let CURRENT_SCROLL_OFFSET; // To hold the latest scroll offset so that it can be compared with the one calculated when the timer callback func executes.

/**
 * Start Helper Functions
 *
 */
// Get all HTML Sections and store them in a gloval Map data structure of key/value pairs where the key is the section ID,
// and the value is an instantiated Section object that contains the section HTML element and its corresponding nav HTML element (anchor element).
// NOTE: Map is used to sync HTML Sections with their corresponding nav items while accessing both in O(1) time complexity.
// The function returns this Map datastructure so that it can be stored in the SECTIONS global variable later on DOMContentLoad.
const getAllSections = () => {
  const sections = document.querySelectorAll("section");
  const sectionsMap = new Map();

  sections.forEach((sectionElement) => {
    const section = new Section(sectionElement);
    const sectionID = sectionElement.getAttribute("id");
    //Add the section in its new format in the global SECTIONS Map data structure.
    sectionsMap.set(sectionID, section);
  });

  //Set the static variable of the Section class to hold the section ID of the first section element by default.
  const activeSectionID = document
    .querySelector("section.active")
    .getAttribute("id");
  Section.activeSectionID = activeSectionID;

  return sectionsMap;
};

// Check whether an HTML element is within the top and bottom borders of the window
const isElementWithinView = (section) => {
  const sectionRect = section.getBoundingClientRect();

  const windowHeight = window.innerHeight;
  //I use sectionRect.bottom * 0.65 to ensure that if about 65% of the section is displayed within the screen, then it is sufficient to make it active.
  //This overcomes the issue I faced on smaller viewports where the section was always greater than the viewport itself.
  return sectionRect.top >= 0 && sectionRect.bottom * 0.65 <= windowHeight;
};

// Show navbar by adding and removing 'shown' and 'hidden' CSS classes, respectively.
const showNavbar = () => {
  NAVBAR.classList.add("shown");
  NAVBAR.classList.remove("hidden");
};

// Hide navbar by adding and removing 'hidden' and 'shown' CSS classes, respectively.
const hideNavbar = () => {
  nabvar.classList.add("hidden");
  nabvar.classList.remove("shown");
};

// Build the navbar dynamically. The function is called when the DOM content is loaded.
const buildNavItems = () => {
  const navItemsList = document.querySelector("#navbar__list");
  const htmlFragment = document.createDocumentFragment();
  SECTIONS.forEach((section) => {
    sectionElement = section.sectionElement;
    const navItemText = sectionElement.getAttribute("data-nav");
    const sectionID = sectionElement.getAttribute("id");
    const navListItem = document.createElement("li");
    const anchorElement = document.createElement("a");
    anchorElement.textContent = navItemText;
    anchorElement.setAttribute("href", `#${sectionID}`);
    anchorElement.setAttribute("data-nav", sectionID);
    anchorElement.classList.add("menu__link");
    if (sectionID === "section1") {
      anchorElement.classList.add("active");
    }
    navListItem.appendChild(anchorElement);
    section.navElement = anchorElement;
    htmlFragment.appendChild(navListItem);
  });
  navItemsList.appendChild(htmlFragment);
  navItemsList.addEventListener("click", (e) => {
    navigateToSection(e);
  });
};

/**
 * Start Nav Item Click Event Handler
 *
 */
const navigateToSection = (e) => {
  //Prevent the default behavior of the anchor tag and how it adds the element's ID to the URL.
  e.preventDefault();
  const eTarget = e.target;
  //Since event delegation pattern is used for better performance, I must ensure that the click is on an anchor tag of one of the nav items,
  //not the navbar itself.
  if (eTarget.nodeName === "A") {
    const sectionID = eTarget.getAttribute("data-nav");
    const section = SECTIONS.get(sectionID);
    section.sectionElement.scrollIntoView({ behavior: "smooth" });
  }
};

/**
 * Start Scroll Event Handlers
 *
 */
// Add class 'active' to section when near top of viewport
const activateSectionInView = () => {
  for (const section of SECTIONS.values()) {
    if (isElementWithinView(section.sectionElement)) {
      section.setActive();
      break;
    }
  }
};

// Show Scroll to top button when the user scrolls more than 800 pixels
const showScrollTopButton = () => {
  const currentScrollOffset = document.body.scrollTop;

  if (currentScrollOffset >= 800) {
    SCROLL_TOP_BUTTON.classList.remove("hidden");
    SCROLL_TOP_BUTTON.classList.add("shown");
  } else {
    SCROLL_TOP_BUTTON.classList.remove("shown");
    SCROLL_TOP_BUTTON.classList.add("hidden");
  }
};

//Hide the navbar when the user is scrolling
const hideNavbar = () => {
  hideNavbar();
  CURRENT_SCROLL_OFFSET = document.body.scrollTop;
  SCROLL_TIMEOUT = setTimeout(() => {
    const newScrollOffset = document.body.scrollTop;
    //Check after 400 milliseconds that the user has not scrolled anymore by comparing previous scroll offset with the new scroll offset.
    //Re-show the navbar
    if (newScrollOffset === CURRENT_SCROLL_OFFSET) {
      showNavbar();
      clearTimeout(SCROLL_TIMEOUT);
    }
  }, 400);
};

/**
 * Start DOMContentLoad Event Handler
 *
 */
const loadInitialContent = () => {
  //INITIALIZE DOM RELATED GLOBAL VARIABLES
  SECTIONS = getAllSections();
  NAVBAR = document.querySelector(".navbar__menu");
  SCROLL_TOP_BUTTON = document.querySelector("#scroll-top");
  //Attach click event listener to the scroll-top button so that it scrolls the page smoothly configured by the JS Object passed to the scrollTo() func.
  SCROLL_TOP_BUTTON.addEventListener("click", () => {
    scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  });
  //Build navigation items dynamically based on the available sections.
  buildNavItems();
};

document.addEventListener("DOMContentLoaded", loadInitialContent);
document.addEventListener("scroll", activateSectionInView);
document.addEventListener("scroll", showScrollTopButton);
document.addEventListener("scroll", hideNavbar);
