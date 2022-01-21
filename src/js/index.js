import "wicg-inert";
import lozad from "lozad";
import BigPicture from "bigpicture";

document.body.classList.add("js");

const main = document.querySelector("#main");
const footer = document.querySelector("#footer");
const isActive = "is-active";
const body = document.body;

let navToggle = document.querySelector("#nav-toggle");
let navToggleState = 0;
let pageHeader = document.querySelector(".page-header");
let navMenu = document.querySelector("#nav-menu");
// let heroContent = document.querySelector(".hero-content");
let scrollingBackground = document.querySelector("#scrolling-bg");

const scrollDown = "scroll-down";
const scrollUp = "scroll-up";
let lastScroll = 0;

/* 
  //////////////////////////////////////////
  ///////scrolling background setup/////////
  //////////////////////////////////////////
*/

function setFixedScrollingHeights() {
  if (!scrollingBackground) {
    return;
  }
  const scrollingContainer = document
    .querySelector("#scrolling-container")
    .getBoundingClientRect();
  const scrollingChildHeight = document
    .querySelector("#scrolling-container")
    .children[1].getBoundingClientRect().height;
  const scrollingContainerHeight = scrollingContainer.height;
  const scrollingContainerWidth = scrollingContainer.width;
  const calcScrollingHeight =
    scrollingContainerWidth > scrollingContainerHeight
      ? window.innerHeight
      : scrollingContainerHeight + scrollingChildHeight;
  scrollingBackground.style.height = calcScrollingHeight.toString() + "px";
}

/* 
  /////////////////////////////////////////
  //////Nav and Inert state functions//////
  /////////////////////////////////////////
*/

function addInertStyle() {
  const containsInert = document.querySelectorAll("[inert]");
  containsInert.forEach((el) => {
    el.classList.add("is-not-active");
  });
}

function removeInertStyle() {
  const notActive = document.querySelectorAll(".is-not-active");
  notActive.forEach((el) => {
    el.classList.remove("is-not-active");
  });
}

// function addFadeClass() {
//   heroContent.classList.add("fade-in");
//   pageHeader.classList.add("fade-in");
// }

/*
  Timer for window onresize event listener so it doesn't continuesly fire during resize events
  Source: Jonas Wilms, https://stackoverflow.com/questions/45905160/javascript-on-window-resize-end
*/
function debounce(func, delay = 100) {
  let timer;
  return (event) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, delay, event);
  };
}

function openNav() {
  main.inert = true;
  footer.inert = true;
  navMenu.inert = false;
  navMenu.classList.add(isActive);
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.classList.add(isActive);
  navToggleState = 1;
  addInertStyle();
}

// sets or resets document inert state when nav toggle is present
function closeNav() {
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove(isActive);
  main.inert = false;
  footer.inert = false;
  navMenu.inert = true;
  navToggle.classList.remove(isActive);
  navToggleState = 0;
  removeInertStyle();
}

// sets/resets document inert state when nav toggle is not present
function clearNav() {
  main.inert = false;
  footer.inert = false;
  navMenu.inert = false;
  navMenu.classList.remove(isActive);
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.classList.remove(isActive);
  removeInertStyle();
}

function navReset() {
  if (getComputedStyle(navToggle).display === "block") {
    closeNav();
  }
  clearNav();
}

/*
  scroll to show/hide navigation
  https://webdesign.tutsplus.com/tutorials/how-to-hide-reveal-a-sticky-header-on-scroll-with-javascript--cms-33756
*/

function scrollingNav() {
  const currentScroll = window.scrollY;
  const footerHeight = footer.offsetHeight;

  if (currentScroll <= 0) {
    body.classList.remove(scrollUp);
    return;
  }

  if (
    currentScroll + window.innerHeight >=
    document.body.scrollHeight - footerHeight
  ) {
    body.classList.remove(scrollDown);
    return;
  }

  if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
    // down
    body.classList.remove(scrollUp);
    body.classList.add(scrollDown);
    navReset();
  } else if (
    currentScroll < lastScroll &&
    body.classList.contains(scrollDown)
  ) {
    // up
    body.classList.remove(scrollDown);
    body.classList.add(scrollUp);
  }
  lastScroll = currentScroll;
}

function menuToggle() {
  if (navToggleState !== 0) {
    closeNav();
  } else {
    setTimeout(openNav, 0);
  }
}

/* 
  //////////////////////////////////////////
  ///////////listeners & events/////////////
  //////////////////////////////////////////
*/

const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();

window.addEventListener("scroll", scrollingNav);

if (scrollingBackground) {
  window.addEventListener("load", setFixedScrollingHeights);
}
window.addEventListener("resize", debounce(setFixedScrollingHeights));

// set initial inert state for navtoggle
window.addEventListener("load", navReset);

// fade in animation helper
// window.addEventListener("load", addFadeClass);

// reset inert state so that nav isn't broken upon window resize
window.addEventListener("resize", debounce(navReset));

// opening nav menu
navToggle.addEventListener("click", menuToggle);

// closing nav menu either with events targeting hamburger, links, or outside nav area
document.addEventListener(
  "click",
  function closeNavCondition(event) {
    if (
      pageHeader !== event.target &&
      !pageHeader.contains(event.target) &&
      navMenu.classList.contains(isActive)
    ) {
      closeNav();
    }
  },
  false
);

// sets footer current date
window.addEventListener("load", () => {
  document
    .getElementById("copyright-year")
    .appendChild(document.createTextNode(new Date().getFullYear()));
});

/*
  ////////////////////////////////////////////
  /////////////Gallery controls//////////////
  ///////////////////////////////////////////
*/

(function addBigPictureListeners() {
  const imageLinks = document.querySelectorAll(".gallery .gallery-item");
  imageLinks.forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      BigPicture({
        el: event.target,
        gallery: ".gallery",
        animationStart: () => {
          // executed immediately before open animation starts
          document.documentElement.style.overflowY = "hidden";
          document.body.style.overflowY = "scroll";
          addInertStyle();
        },
        onClose: () => {
          // executed immediately after close animation finishes
          document.documentElement.style.overflowY = "auto";
          document.body.style.overflowY = "auto";
          removeInertStyle();
        },
      });
    });
  });
})();

/*
  ////////////////////////////////////////////
  ////////////contact form netlify///////////
  ////////////////////////////////////////////
*/

function showError(input, message) {
  const formField = input.parentElement;
  if (!formField.classList.contains("label-group")) {
    return;
  }
  const messageDisplay = formField.querySelector(".form-message");
  if (!messageDisplay) {
    return;
  }

  formField.classList.remove("success");
  formField.classList.add("error");
  messageDisplay.innerText = message;
  // eslint-disable-next-line no-use-before-define
  // addFormInputListener(input);
}

function showSuccess(input) {
  const formField = input.parentElement;
  const messageDisplay = formField.querySelector(".form-message");
  if (!messageDisplay) {
    return;
  }

  formField.classList.add("success");
  formField.classList.remove("error");
  messageDisplay.innerText = "";
}

const isFormValue = (el) => el.value.trim();

function checkRequiredInput(input) {
  let result = false;
  if (!isFormValue(input)) {
    return showError(input, "required field must not be empty");
  }
  showSuccess(input);
  result = true;
  return result;
}

function validateInputById(el) {
  let result = true;
  switch (el.id) {
    case "test":
      break;

    default:
      if (!checkRequiredInput(el)) {
        result = false;
      }
      break;
  }
  return result;
}

function addFormInputListener(input) {
  const result = input;
  // const inputId = result.id;
  if (!result.id) {
    return;
  }
  result.addEventListener(
    "input",
    debounce((inputId) => {
      switch (inputId) {
        default:
          checkRequiredInput(input);
      }
    }, 500)(result.id)
  );
  result.scrollIntoView();
}

function validateFormFields(event) {
  let result = true;
  const formElements = [...event.currentTarget.elements];

  formElements.forEach((el) => {
    if (!el.required) {
      return;
    }
    if (!validateInputById(el)) {
      result = false;
      addFormInputListener(el);
    }
  });
  // const submittedFirstName = document.querySelector("#submitted-first-name");
  // const submittedLastName = document.querySelector("#submitted-last-name");
  // const submittedPhone = document.querySelector("#submitted-phone");
  // const submittedEmail = document.querySelector("#submitted-email");
  // const submittedDescription = document.querySelector("#submitted-description");

  if (!event.currentTarget.getElementsByClassName("error")[0]) {
    result = true;
  }

  return result;
}

const handleSubmit = (event) => {
  event.preventDefault();
  // console.log(Object.getOwnPropertyNames(event.currentTarget.elements));

  const isValidForm = validateFormFields(event);
  // console.log(isValidForm);
  if (isValidForm === false) {
    return;
  }

  let myForm = document.getElementById("form-container");
  let formData = new FormData(myForm);
  const submittedEmail = formData.get("submitted-email");
  const formSubject = submittedEmail
    ? `New JZ Carpentry contact from ${submittedEmail}`
    : `New JZ Carpentry contact`;
  formData.set("subject", formSubject);
  let redirectUrl = new URL("../form-submission.html", import.meta.url);
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    // .then(() => console.log("Form successfully submitted"))
    .then(() => {
      window.location.href = redirectUrl;
    })
    .catch((error) => console.log(error));
};

const submitAll = document.querySelector("#form-container");
// let areFormErrors;

// console.log(areFormErrors);

if (submitAll) {
  submitAll.setAttribute("novalidate", "");
  submitAll.addEventListener("submit", handleSubmit);
  // areFormErrors = submitAll.getElementsByClassName("error")[0];
}
