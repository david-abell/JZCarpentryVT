import "wicg-inert";
import lozad from "lozad";
// import BigPicture from "bigpicture";
import GLightbox from "glightbox";
import * as EmailValidator from "email-validator";

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

let abortController = new AbortController();

/* 
  //////////////////////////////////////////
  ///////scrolling background setup/////////
  //////////////////////////////////////////
*/

function setFixedScrollingHeights() {
  if (!scrollingBackground) {
    return;
  }
  const scrollingContainer = document.querySelector("#scrolling-container");
  const scrollingChildHeight = document
    .querySelector("#scrolling-container")
    .children[1].getBoundingClientRect().height;
  const scrollingHeight = scrollingContainer.getBoundingClientRect().height;
  const scrollingWidth = scrollingBackground.getBoundingClientRect().width;
  const calcNewHeight =
    scrollingWidth < 1300
      ? scrollingHeight + scrollingChildHeight
      : Math.min(window.innerHeight, 1024) + scrollingChildHeight;
  scrollingBackground.style.height = calcNewHeight.toString() + "px";
  // scrollingBackground.style.maxHeight = calcNewHeight.toString() + "px";
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

function debounce(func, delay = 500) {
  let timeoutId;
  let context = this;
  return (...args) => {
    // cancel the previous timer
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // setup a new timer
    timeoutId = setTimeout(() => {
      func.apply(context, ...args);
    }, delay);
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

// eslint-disable-next-line no-unused-vars
const lightbox = GLightbox({
  touchNavigation: true,
});

// (function addBigPictureListeners() {
//   const imageLinks = document.querySelectorAll(".gallery .gallery-item");
//   imageLinks.forEach((el) => {
//     el.addEventListener("click", (event) => {
//       event.preventDefault();
//       BigPicture({
//         el: event.target,
//         gallery: ".gallery",
//         animationStart: () => {
//           // executed immediately before open animation starts
//           document.documentElement.style.overflowY = "hidden";
//           document.body.style.overflowY = "scroll";
//           addInertStyle();
//         },
//         onClose: () => {
//           // executed immediately after close animation finishes
//           document.documentElement.style.overflowY = "auto";
//           document.body.style.overflowY = "auto";
//           removeInertStyle();
//         },
//       });
//     });
//   });
// })();

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

const isFormValue = (input) => !!input.value.trim();

function isRequiredInput(input) {
  if (!isFormValue(input)) {
    showError(input, "Required field must not be empty");
    return false;
  }
  showSuccess(input);
  return true;
}

function isValidEmail(input) {
  const isEmail = EmailValidator.validate(input.value);
  if (!isEmail) {
    showError(input, "Please enter a valid email");
    return isEmail;
  }
  showSuccess(input);
  return isEmail;
}

function addFormInputListener(input, func) {
  const result = input;
  if (!result.id) {
    return;
  }
  const debouncedFunc = debounce(() => {
    func(input);
  }, 500);

  result.addEventListener("input", debouncedFunc, {
    signal: abortController.signal,
  });

  /*
  // To do: add aria indicator of focus change?
  */
}

function isValidInputValue(input) {
  let result = true;

  switch (input.id) {
    case "submitted-email":
      if (!isValidEmail(input)) {
        addFormInputListener(input, isValidEmail);
        result = false;
      } else if (!isRequiredInput(input)) {
        addFormInputListener(input, isRequiredInput);
        result = false;
      }
      break;

    default:
      if (!isRequiredInput(input)) {
        addFormInputListener(input, isRequiredInput);
        result = false;
      }
      break;
  }
  if (result) {
    showSuccess(input);
  }
  return result;
}

function validateFormFields(event) {
  let result = true;
  const formInputs = [...event.currentTarget.elements];

  formInputs.forEach((input) => {
    if (!input.required) {
      return;
    }
    const validatedField = isValidInputValue(input);
    if (!validatedField) {
      result = false;
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

function handleSubmit(event) {
  event.preventDefault();

  // Cleanup listeners from prior submit attempts
  abortController.abort();
  abortController = new AbortController();
  let myForm = document.getElementById("form-container");

  const isValidForm = validateFormFields(event);
  if (isValidForm === false) {
    const firstInputError = myForm.querySelector(".error input");
    firstInputError.focus();
    return;
  }

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
    .catch((error) => {
      /*
      Not sure if this works, must test. It doesn't catch fetch error 405...
      */
      // console.log("error caught:", error);
      document.querySelector(".form-error").innerText = error;
    });
}

const submitAll = document.querySelector("#form-container");

if (submitAll) {
  submitAll.setAttribute("novalidate", "");
  submitAll.addEventListener("submit", handleSubmit);
}
