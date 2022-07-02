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
  let isOpen  = false;
  let timerId;

  parrentElement.addEventListener('mouseover', e => {
    let that  = e.target;

    if (!isOpen && that.classList.contains(childrenClassName)) {
      isOpen  = true;
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
      isOpen   = false;

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
window.addEventListener('resize',           () => resizing(headerWrapper, headerSubnav));
window.addEventListener('scroll',           () => {
  let scroll = this.pageYOffset;

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
  let itemClassList = {
    1: 'advantage__item_1',
    2: 'advantage__item_2',
    3: 'advantage__item_3'
  };

  let count = 0;

  for (let i = 0; i < target.length; i++) {
    count++;

    target[i].classList.add(itemClassList[count]);

    if (count == 3) count = 0;
  }
}

makeContentGrid(advantageItemsList);

//###################  DETAILS ANIMATION  ###################

class Accordion {
  constructor(el) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector('summary');
    // Store the <div class="content"> element
    this.content = el.querySelector('.details__ul');

    // Store the animation object (so we can cancel it if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden';
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open();
    // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight]
    }, {
      duration: 400,
      easing: 'ease-out'
    });

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => this.isClosing = false;
  }

  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight]
    }, {
      duration: 400,
      easing: 'ease-out'
    });
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => this.isExpanding = false;
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = '';
  }
}

document.querySelectorAll('details').forEach((el) => {
  new Accordion(el);
});

//###################  QUESTIONS  ###################

const questsionsSliderItemsList = Array.from(document.getElementsByClassName('questions__slider-item'));
let   translateSlider           = 0;
const questionsForm             = getElement('questions__form');
const questionsSliderWrapper    = getElement('questions__slider-wrapper');
const questionsSliderContent    = getElement('questions__slider-content');
const questionsControlContainer = getElement('questions__slider-control');
const questionsControlForward   = getElement('questions__control_forward');
const questionsControlBackward  = getElement('questions__control_backward');
let   questionsCount            = 1;
let   questionsCountArea        = getElement('questions__slider-count');
let   questionsCountTotal       = getElement('questions__slider-total');

function setSliderWrapperWidth(target, source) {
  let sourceWidth    = getComputedStyle(source).width;
  target.style.width = sourceWidth;
}

class Slider {
  constructor(wrapper, content, sliderList, counterArea, counterTotal) {
    this.wrapper      = wrapper;
    this.content      = content;
    this.counter      = 1;
    this.counterArea  = counterArea;
    this.counterTotal = counterTotal;
    this.sliderList   = sliderList;
  }

  counterForward() {
    this.counter++;
    if (this.counter >= this.sliderList.length) this.counter = this.sliderList.length;
    this.counterArea.textContent = this.counter;
    this.moveSlider();
    return this.counter;
  }

  counterBackward() {
    this.counter--;
    if (this.counter <= 1) this.counter = 1;
    this.counterArea.textContent = this.counter;
    this.moveSlider();
    return this.counter;
  }

  showCountTotal() {
    this.counterTotal.textContent = this.sliderList.length;
  }

  showCurrentCount() {
    this.counterArea.textContent = this.counter;
  }

  setWrapperWidth() {
    let max = 0;

    //получаю ширину самого большого элемента
    this.sliderList.forEach(item => {
      if (max < parseFloat(getComputedStyle(item).width)) {
        max = parseFloat(getComputedStyle(item).width);
      } else {
        max = max;
      }
    });

    //устанавливаю ширину каждого слайда по максимальному значению
    this.sliderList.forEach(item => item.style.width = max + 'px');

    //задаю ширину wrapper'a равной ширине самого большого слайдера
    this.wrapper.style.width = max + 'px';
  }

  moveSlider() {
    let i = this.counter;
    this.content.style.transform = `translateX(-${(i - 1) * 100 / this.sliderList.length}%)`;
  }
}

let questionsSlider = new Slider(questionsSliderWrapper, questionsSliderContent, questsionsSliderItemsList, questionsCountArea, questionsCountTotal);

window.addEventListener('DOMContentLoaded',        ()  => {
  questionsSlider.setWrapperWidth();
  questionsSlider.showCurrentCount();
  questionsSlider.showCountTotal();
});
window.addEventListener('resize',                  ()  => {
  questionsSlider.setWrapperWidth();
});
questionsControlForward.addEventListener('click',  () => questionsSlider.counterForward());
questionsControlBackward.addEventListener('click', () => questionsSlider.counterBackward());
