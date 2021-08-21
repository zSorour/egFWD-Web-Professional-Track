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

class Section {
  static activeSectionID;

  sectionElement;
  navElement;

  constructor(sectionEL) {
    this.sectionElement = sectionEL;
  }

  setActive = () => {
    const oldActiveSection = SECTIONS.get(Section.activeSectionID);
    oldActiveSection.sectionElement.classList.toggle("active");
    oldActiveSection.navElement.classList.toggle("active");
    this.sectionElement.classList.toggle("active");
    this.navElement.classList.toggle("active");
    Section.activeSectionID = this.sectionElement.getAttribute("id");
  };
}

/**
 * Define Global Variables
 *
 */

let SECTIONS;

/**
 * End Global Variables
 * Start Helper Functions
 *
 */
const getAllSections = () => {
  const sections = document.querySelectorAll("section");
  const sectionsMap = new Map();
  sections.forEach((sectionElement) => {
    const section = new Section(sectionElement);
    const sectionID = sectionElement.getAttribute("id");
    sectionsMap.set(sectionID, section);
  });

  const activeSectionID = document
    .querySelector("section.active")
    .getAttribute("id");
  Section.activeSectionID = activeSectionID;

  return sectionsMap;
};

const isElementWithinView = (section) => {
  const sectionRect = section.getBoundingClientRect();

  const windowHeight = window.innerHeight;

  return sectionRect.top >= 0 && sectionRect.bottom * 0.7 <= windowHeight;
};

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav

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

// Add class 'active' to section when near top of viewport

const activateSectionInView = () => {
  for (const section of SECTIONS.values()) {
    if (isElementWithinView(section.sectionElement)) {
      section.setActive();
      break;
    }
  }
};

const showScrollTopButton = () => {
  const currentScrollOffset = document.body.scrollTop;
  const scrollTopButton = document.querySelector("#scroll-top");

  if (currentScrollOffset >= 800) {
    scrollTopButton.classList.remove("hidden");
    scrollTopButton.classList.add("shown");
  } else {
    scrollTopButton.classList.remove("shown");
    scrollTopButton.classList.add("hidden");
  }
};

const loadInitialContent = () => {
  SECTIONS = getAllSections();
  const scrollTopButton = document.querySelector("#scroll-top");
  scrollTopButton.addEventListener("click", () => {
    scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  });
  buildNavItems();
};

document.addEventListener("DOMContentLoaded", loadInitialContent);
document.addEventListener("scroll", activateSectionInView);
document.addEventListener("scroll", showScrollTopButton);
