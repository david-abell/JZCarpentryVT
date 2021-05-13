import "wicg-inert";
import BigPicture from 'bigpicture';
// import images from '../images/gallery/woodwork-nooks/*.jpg';

document.body.classList.add('js');

// //////////////////////////////////////////
// ///////////////variables//////////////////
// //////////////////////////////////////////

const main = document.querySelector('#main');
const footer = document.querySelector('#footer');
const active = "is-active";
const body = document.body;

let navToggle = document.querySelector('#nav-toggle');
let navToggleState = 0;
let pageHeader = document.querySelector('.page-header');
let navMenu = document.querySelector('#nav-menu');
let heroContent = document.querySelector('.hero-content-background');

const scrollDown = "scroll-down";
const scrollUp = "scroll-up";
let lastScroll = 0;


// //////////////////////////////////////////
// ///////////listeners & events/////////////
// //////////////////////////////////////////


//scroll to show/hide navigation
//https://webdesign.tutsplus.com/tutorials/how-to-hide-reveal-a-sticky-header-on-scroll-with-javascript--cms-33756
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  const footerHeight = footer.offsetHeight;

  if (currentScroll <= 0) {
    body.classList.remove(scrollUp);
    return;
  }

  if (currentScroll + window.innerHeight >= document.body.scrollHeight - footerHeight) {
    body.classList.remove(scrollDown);
    return;
  }
   
  if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
    // down
    body.classList.remove(scrollUp);
    body.classList.add(scrollDown);
    navReset();
    } else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
    // up
    body.classList.remove(scrollDown);
    body.classList.add(scrollUp);
  }
  lastScroll = currentScroll;
});



//set initial inert state for navtoggle
document.addEventListener("load", navReset () );

// fade in animation helper
window.addEventListener('load', addFadeClass () );

//reset inert state so that nav isn't broken upon window resize
window.addEventListener('resize', debounce (navReset) );

//log current focused element to track inert functionality
// document.addEventListener('focusin', function () {
//   console.log('focused: ', document.activeElement)
// }, true);


//opening nav menu
navToggle.addEventListener("click", menuToggle);

//closing nav menu either with events targeting hamburger, links, or outside nav area
document.addEventListener("click", function (e) {
  if (pageHeader != e.target &&
    !pageHeader.contains(e.target) &&
    navMenu.classList.contains(active)) {
      closeNav();
  } 
}, false);

//sets footer current date
window.addEventListener('load', (
  function () {
      document.getElementById('copyright-year').appendChild(
          document.createTextNode(
              new Date().getFullYear()
          )
      );
  }
));

// /////////////////////////////////////////
// //////////////Functions//////////////////
// /////////////////////////////////////////


function addInertStyle () {
  const containsInert = document.querySelectorAll("[inert]");
  containsInert.forEach(el => {
    el.classList.add('is-not-active');
  });
}

function removeInertStyle () {
  const notActive = document.querySelectorAll('.is-not-active');
  notActive.forEach(el => {
    el.classList.remove('is-not-active');
  });
}


function addFadeClass () {
  heroContent.classList.add('fade-in');
  pageHeader.classList.add('fade-in');

}

// Timer for window onresize event listener so it doesn't continuesly fire during resize events
// Source: Jonas Wilms, https://stackoverflow.com/questions/45905160/javascript-on-window-resize-end
function debounce (func) {
  let timer;
  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,100,event);
  };
}

function menuToggle () {
  if (navToggleState !== 0) {
    closeNav();
  } else {
    setTimeout(openNav, 0);
  }
}

function navReset () {
  if (getComputedStyle(navToggle).display === 'block') {
    closeNav();
  } clearNav();
}

function openNav () {
  main.inert = true;
  footer.inert = true;
  navMenu.inert = false;
  navMenu.classList.add(active);
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.classList.add(active);
  navToggleState = 1;
  addInertStyle();
}

//sets/resets document inert state when nav toggle is present
function closeNav () {
  navToggle.setAttribute('aria-expanded', 'false');
  navMenu.classList.remove(active);
  main.inert = false;
  footer.inert = false;
  navMenu.inert = true;
  navToggle.classList.remove(active);
  navToggleState = 0;
  removeInertStyle();
}

// sets/resets document inert state when nav toggle is not present
function clearNav () {
  main.inert = false;
  footer.inert = false;
  navMenu.inert = false;
  navMenu.classList.remove(active);
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.classList.remove(active);
  removeInertStyle();
}

////////////////////////////////////////////
// ///////////Gallery controls//////////////
// /////////////////////////////////////////

;(function () {
  const imageLinks = document.querySelectorAll ('#test-gallery .gallery-item')
  // const file_name = "file-name"
  // console.log(images)

  imageLinks.forEach(el => {
    el.addEventListener('click', function(e) {
      console.log(el)
      e.preventDefault()
      BigPicture ({
        el:e.target,
        gallery: '#test-gallery',
        animationStart: function () {
          // executed immediately before open animation starts
          document.documentElement.style.overflowY = 'hidden'
          document.body.style.overflowY = 'scroll'
          addInertStyle()
        },
        onClose: function () {
          // executed immediately after close animation finishes
          document.documentElement.style.overflowY = 'auto'
          document.body.style.overflowY = 'auto'
          removeInertStyle()
        },
        // galleryAttribute: 'src',
      })
    })
  })
})()