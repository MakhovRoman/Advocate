"use strict";

// find element by class name
function getElement(selector) {
  return document.querySelector('.' + selector);
}

// change headerSubnav width when page is resizing
function resizing(sample, target) {
  let padding         = getComputedStyle(sample).paddingLeft;
  target.style.width  = getComputedStyle(sample).width;
  target.style.left   = `-${padding}`;
}

// delay when hover on element
function hoverDelay(parrentElement, childrenList, childrenClassName, className, delay) {
  let isOpen = false;
  let timerId;

  parrentElement.addEventListener('mouseover', e => {
    let that = e.target;

    if (!isOpen && that.classList.contains(childrenClassName)) {
      isOpen = true;
      timerId = setTimeout( () => {

        that.classList.add(className);
        childrenList.forEach(item => {
          if (item.classList.contains(className) && item != that) {
            item.classList.remove(className);
          }
        })
      }, delay)
    }
  })

  parrentElement.addEventListener('mouseout', e => {
    if(!e.relatedTarget.classList.contains('subnav__content') && !e.relatedTarget.classList.contains('subnav__title-list')) {
      let that = e.target;
      clearTimeout(timerId);
      isOpen = false;

      setTimeout( () => {
        if (that.classList.contains(className)) {
          that.classList.remove(className);
        }
      }, delay)
    }
  })
}

//###################  HEADER  ###################


const header          = getElement('header');
const headerWrapper   = getElement('header__wrapper');
const headerSubnav    = getElement('header__subnav');
const subnavMenu      = getElement('subnav__title-list');
let   subnavTitleList = Array.from(document.getElementsByClassName('subnav__title-link'));
let   subnavTitleLi   = Array.from(document.getElementsByClassName('subnav__title-li'));

/*
let isOpen = false;
let timerId;

subnavMenu.addEventListener('mouseover', e => {
  let that = e.target;

  if (!isOpen && that.classList.contains('subnav__link')) {
    isOpen = true;
    timerId = setTimeout( () => {

      that.classList.add('subnav-link_active');
      subnavTitleList.forEach(item => {
        if (item.classList.contains('subnav-link_active') && item != that) {
          item.classList.remove('subnav-link_active');
        }
      })
    }, 500)
  }
})

subnavMenu.addEventListener('mouseout', e => {
  let that = e.target;
  clearTimeout(timerId);
  isOpen = false;

  setTimeout( () => {
    if (that.classList.contains('subnav-link_active')) {
      that.classList.remove('subnav-link_active');

    }
  }, 500)
})
*/

//top position of subnavMenu
subnavTitleLi.forEach( (item, index) => {
  let child = item.querySelector('.subnav__child-list');
  if(child) {
    child.style.top = -index * parseInt(getComputedStyle(item).height) + 'px';
    console.log(getComputedStyle(item).height)
  }
})


hoverDelay(subnavMenu, subnavTitleList, 'subnav__link', 'subnav-link_active', 500);
window.addEventListener('DOMContentLoaded', () => resizing(headerWrapper, headerSubnav));
window.addEventListener('resize', () => resizing(headerWrapper, headerSubnav));
