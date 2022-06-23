'use strict';

const bannerInputName = getElement('banner__input-name');


//============= Поле с именем =============
function noDigits(e) {
  if ('1234567890'.indexOf(e.key) != -1) e.preventDefault();
}

bannerInputName.addEventListener('keypress', noDigits);


//============= Маска телефона =============
window.addEventListener('DOMContentLoaded', function() {
  let inputs = document.querySelectorAll('input[type="tel"]');

  Array.prototype.forEach.call(inputs, function(input) {
    new InputMask({
      selector: input, // в качестве селектора может быть элемент, или, собственно css селектор('#input', '.input', 'input'). Если селектор - тег или класс - будет получен только первый элемент
      layout: input.dataset.mask
    })
  })

})

function InputMask(options) {
    this.el = this.getElement(options.selector);
    if (!this.el) return console.log('Что-то не так с селектором');
    this.layout = options.layout || '+_ (___) ___-__-__';
    this.maskreg = this.getRegexp();

    this.setListeners();
}

InputMask.prototype.getRegexp = function() {
    let str = this.layout.replace(/_/g, '\\d')
    str = str.replace(/\(/g, '\\(')
    str = str.replace(/\)/g, '\\)')
    str = str.replace(/\+/g, '\\+')
    str = str.replace(/\s/g, '\\s')

    return str;
}

InputMask.prototype.mask = function(e) {
    let _this = e.target,
        matrix = this.layout,
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = _this.value.replace(/\D/g, "");

    if (def.length >= val.length) val = def;

    _this.value = matrix.replace(/./g, function(a) {
        return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
    });

    if (e.type == "blur") {
        var regexp = new RegExp(this.maskreg);
        if (!regexp.test(_this.value)) _this.value = "";
    } else {
        this.setCursorPosition(_this.value.length, _this);
    }
}

InputMask.prototype.setCursorPosition = function(pos, elem) {
    elem.focus();
    if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
    else if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select()
    }
}

InputMask.prototype.setListeners = function() {
    this.el.addEventListener("input", this.mask.bind(this), false);
    this.el.addEventListener("focus", this.mask.bind(this), false);
    this.el.addEventListener("blur", this.mask.bind(this), false);
}

InputMask.prototype.getElement = function(selector) {
    if (selector === undefined) return false;
    if (this.isElement(selector)) return selector;
    if (typeof selector == 'string') {
        var el = document.querySelector(selector);
        if (this.isElement(el)) return el;
    }
    return false
}

InputMask.prototype.isElement = function(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}
