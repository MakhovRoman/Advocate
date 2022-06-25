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
const headerTop       = getElement('header__top');
const headerBot       = getElement('header__bot');
const subnavMenu      = getElement('subnav__title-list');
let   subnavTitleList = Array.from(document.getElementsByClassName('subnav__title-link'));
let   subnavTitleLi   = Array.from(document.getElementsByClassName('subnav__title-li'));


//top position of subnavMenu
subnavTitleLi.forEach( (item, index) => {
  let child = item.querySelector('.subnav__child-list');
  if(child) {
    child.style.top = -index * parseInt(getComputedStyle(item).height) + 'px';
  }
})


hoverDelay(subnavMenu, subnavTitleList, 'subnav__link', 'subnav-link_active', 500);
window.addEventListener('DOMContentLoaded', () => resizing(headerWrapper, headerSubnav));
window.addEventListener('resize', () => resizing(headerWrapper, headerSubnav));
window.addEventListener('scroll', () => {
  let scroll = this.pageYOffset;
  console.log(scroll);

  if (scroll >= 1) {
    header.style.top = '-' + (parseInt(getComputedStyle(headerTop).height) + 1 + 'px');
    header.style.backgroundColor = 'rgba(0, 66, 70, 1)';
  } else {
    header.style.top = 0;
    header.style.backgroundColor = 'transparent';
  }
})



//###################  ADVANTAGE  ###################

const advantageItemsList = Array.from(document.getElementsByClassName('advantage__item'));

//function for automatical grid making
function makeContentGrid(target) {
  let itemClassList = ['advantage__item_1', 'advantage__item_2', 'advantage__item_3'];
  let count = 0;

  for (let i = 1; i <= target.length; i++) {
    count++;
    if (count % 3 == 0) {
      target[i-1].classList.add(itemClassList[2])
    } else if (count % 2 == 0) {
      target[i-1].classList.add(itemClassList[1]);
    } else {
      target[i-1].classList.add(itemClassList[0]);
    }

    if (count == 3) count = 0;
  }
}

makeContentGrid(advantageItemsList);
