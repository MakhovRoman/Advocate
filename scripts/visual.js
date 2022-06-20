"use strict";

// find element by class name
function getElement(selector) {
  return document.querySelector('.' + selector);
}

// change headerSubnav width when page is resizing
function resizing(sample, target) {
  let padding = getComputedStyle(sample).paddingLeft;
  target.style.width = getComputedStyle(sample).width;
  target.style.left = `-${padding}`;
}



//###################  HEADER  ###################


const header        = getElement('header');
const headerWrapper = getElement('header__wrapper');
const headerSubnav  = getElement('header__subnav');

window.addEventListener('DOMContentLoaded', () => resizing(headerWrapper, headerSubnav));
window.addEventListener('resize', () => resizing(headerWrapper, headerSubnav));
