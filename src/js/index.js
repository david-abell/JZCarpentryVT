import "wicg-inert";
import lozad from "lozad";
import BigPicture from "bigpicture";
// import Dropzone from "dropzone";
// import "dropzone/dist/dropzone.css";

document.body.classList.add("js");

const main = document.querySelector("#main");
const footer = document.querySelector("#footer");
const isActive = "is-active";
const body = document.body;

let navToggle = document.querySelector("#nav-toggle");
let navToggleState = 0;
let pageHeader = document.querySelector(".page-header");
let navMenu = document.querySelector("#nav-menu");
let heroContent = document.querySelector(".hero-content");
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
    ["children"][1].getBoundingClientRect().height;
  const scrollingContainerHeight = scrollingContainer.height;
  const scrollingContainerWidth = scrollingContainer.width;
  const calcScrollingHeight =
    scrollingContainerWidth > scrollingContainerHeight
      ? window.innerHeight
      : scrollingContainerHeight + scrollingChildHeight;
  scrollingBackground.style.height = calcScrollingHeight.toString() + "px";
  // scrollingBackground.style.maxHeight = calcScrollingHeight.toString() + "px";
  // scrollingBackground.style.minHeight = calcScrollingHeight.toString() + "px";
  console.log(scrollingContainer);
  console.log(scrollingContainerWidth);
  console.log(window.innerHeight);
}

/* 
  //////////////////////////////////////////
  ///////////listeners & events/////////////
  //////////////////////////////////////////
*/
const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();

//scroll to show/hide navigation
//https://webdesign.tutsplus.com/tutorials/how-to-hide-reveal-a-sticky-header-on-scroll-with-javascript--cms-33756
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
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
});
if (scrollingBackground) {
  window.addEventListener("load", setFixedScrollingHeights);
}
window.addEventListener("resize", debounce(setFixedScrollingHeights));

//set initial inert state for navtoggle
window.addEventListener("load", navReset);

// fade in animation helper
window.addEventListener("load", addFadeClass);

//reset inert state so that nav isn't broken upon window resize
window.addEventListener("resize", debounce(navReset));

//log current focused element to track inert functionality
// document.addEventListener('focusin', function () {
//   console.log('focused: ', document.activeElement)
// }, true);

//opening nav menu
navToggle.addEventListener("click", menuToggle);

//closing nav menu either with events targeting hamburger, links, or outside nav area
document.addEventListener(
  "click",
  function (e) {
    if (
      pageHeader != e.target &&
      !pageHeader.contains(e.target) &&
      navMenu.classList.contains(isActive)
    ) {
      closeNav();
    }
  },
  false
);

//sets footer current date
window.addEventListener("load", function () {
  document
    .getElementById("copyright-year")
    .appendChild(document.createTextNode(new Date().getFullYear()));
});

// /////////////////////////////////////////
// //////Nav and Inert state functions//////
// /////////////////////////////////////////

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

function addFadeClass() {
  heroContent.classList.add("fade-in");
  pageHeader.classList.add("fade-in");
}

// Timer for window onresize event listener so it doesn't continuesly fire during resize events
// Source: Jonas Wilms, https://stackoverflow.com/questions/45905160/javascript-on-window-resize-end
function debounce(func) {
  let timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 100, event);
  };
}

function menuToggle() {
  if (navToggleState !== 0) {
    closeNav();
  } else {
    setTimeout(openNav, 0);
  }
}

function navReset() {
  if (getComputedStyle(navToggle).display === "block") {
    closeNav();
  }
  clearNav();
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

//sets/resets document inert state when nav toggle is present
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

////////////////////////////////////////////
// ///////////Gallery controls//////////////
// /////////////////////////////////////////

(function () {
  const imageLinks = document.querySelectorAll(".gallery .gallery-item");
  imageLinks.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      BigPicture({
        el: e.target,
        gallery: ".gallery",
        animationStart: function () {
          // executed immediately before open animation starts
          document.documentElement.style.overflowY = "hidden";
          document.body.style.overflowY = "scroll";
          addInertStyle();
        },
        onClose: function () {
          // executed immediately after close animation finishes
          document.documentElement.style.overflowY = "auto";
          document.body.style.overflowY = "auto";
          removeInertStyle();
        },
      });
    });
  });
})();

// //////////////////////////////////////////
// //////////contact form dropzone///////////
// //////////////////////////////////////////

// Dropzone.autoDiscover = false;

// prevent undifined variables by declaring dropzone only on contact page
// let previewZone;
// let myDropzone;
// let contactForm;

// if (document.querySelector("#drop-area")) {
//   contactForm = document.querySelector("#contact-form");
//   myDropzone = new Dropzone("#drop-area", {
//     // url: "contact.html",
//     url: "https://5xd90nuti9.execute-api.eu-west-1.amazonaws.com/development/multipart",
//     headers: {
//       "Cache-Control": null,
//       "X-Requested-With": null,
//     },
//     paramName: "files",
//     autoProcessQueue: false,
//     uploadMultiple: true,
//     parallelUploads: 100,
//     maxFiles: 100,
//     maxFilesize: 6, // MB
//     dictDefaultMessage: "To upload files, click or drag and drop here",
//     // transformFile: function(file, done) {

//     // },
//     init: function () {
//       const submitAll = document.querySelector("#submit-all");
//       // tell Dropzone to process file queue.
//       submitAll.addEventListener("click", function (e) {
//         e.preventDefault();
//         e.stopPropagation();
//         console.log(myDropzone);
//         myDropzone.processQueue();
//       });

//       var myDropzone = this;
//       this.on("addedfile", function (file) {
//         file.previewElement.addEventListener("click", function () {
//           myDropzone.removeFile(file);
//         });
//       });

//       // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
//       // of the sending event because uploadMultiple is set to true.
//       this.on("sendingmultiple", function (files, xhr, formData) {
//         // Gets triggered when the form is actually being sent.
//         // Attach form inputs to transmitting form data
//         const contactData = new FormData(contactForm);
//         const data = {
//           firstName: contactData.get("submitted-first-name"),
//           lastName: contactData.get("submitted-last-name"),
//           email: contactData.get("submitted-email"),
//           message: contactData.get("submitted-description"),
//           "g-recaptcha-response": grecaptcha.getResponse(),
//         };
//         // myDropzone.options.params.body = data;
//         // formData.append("body", data)
//         for (let key in data) {
//           formData.append(key, data[key]);
//         }
//         console.log(Array.from(formData.entries()));
//         console.log(files);
//         // console.log(Array.from(contactData))

//         // Hide the success button or the complete form.
//       });
//       this.on("successmultiple", function (files, response) {
//         // Gets triggered when the files have successfully been sent.
//         // Redirect user or notify of success.
//         console.log(response.message);
//       });
//       this.on("errormultiple", function (files, response) {
//         // Gets triggered when there was an error sending the files.
//         // Maybe show form again, and notify user of error
//         console.error("error:", response.message);
//       });
//     },
//   });
// }

// still to be combined with dropzone
// const form = document.getElementById("form");
//     form.addEventListener("submit", submitForm, true);

//     function submitForm(event) {
//       event.preventDefault();

//       // const formData = new FormData(form);
//       // const data = {
//       //   firstName: formData.get("firstName"),
//       //   lastName: formData.get("lastName"),
//       //   email: formData.get("email"),
//       //   message: formData.get("message"),
//       //   recaptcha: grecaptcha.getResponse(),
//       // };
//       // console.log(Array.from(formData));

//       fetch(
//         "https://5xd90nuti9.execute-api.eu-west-1.amazonaws.com/development/multipart",
//         {
//           method: "POST",
//           mode: "cors",
//           body: new FormData(form),
//           // body: JSON.stringify(data),
//           // headers: {
//           //   Accept: "multipart/form-data",
//           //   "Content-Type": "multipart/form-data",
//           // },
//           // credentials: "same-origin",
//         }
//       ).then(
//         function (response) {
//           console.log(response.statusText);
//         },
//         function (error) {
//           console.error("Error:", error.message);
//         }
//       );
//     }

// //////////////////////////////////////////
// //////////contact form netlify///////////
// //////////////////////////////////////////

const handleSubmit = (e) => {
  e.preventDefault();
  let myForm = document.getElementById("form-container");
  let formData = new FormData(myForm);
  const submittedEmail = formData.get("submitted-email");
  const formSubject = submittedEmail
    ? `New JZ Carpentry contact from ${submittedEmail}`
    : `New JZ Carpentry contact`;
  formData.set("subject", formSubject);
  const redirectUrl = new URL("../form-submission.html", import.meta.url);
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => console.log("Form successfully submitted"))
    .then(() => window.location.replace(redirectUrl))
    .catch((error) => alert(error));
};

const submitAll = document.querySelector("#form-container");
if (submitAll) {
  submitAll.addEventListener("submit", handleSubmit);
}
