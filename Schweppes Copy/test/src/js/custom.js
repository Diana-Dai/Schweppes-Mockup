const utils = {
  show: function (animateElem) {
    this.addClass(animateElem, "is_active");
  },
  hide: function (animateElem) {
    this.removeClass(animateElem, "is_active");
  },
  addClass: (animateElem, newClass) => {
    if (animateElem) {
      if (typeof animateElem === "string") {
        document.querySelector(animateElem).classList.add(newClass);
      } else if (typeof animateElem === "object") {
        animateElem.classList.add(newClass);
      }
    }
  },
  removeClass: (animateElem, oldClass) => {
    if (animateElem) {
      if (typeof animateElem === "string") {
        document.querySelector(animateElem).classList.remove(oldClass);
      } else if (typeof animateElem === "object") {
        animateElem.classList.remove(oldClass);
      }
    }
  },
  toggleClass: (item, cls) => {
    if (item && cls) {
      item.classList.toggle(cls);
    }
  },
  changeProperty: (property, color) => {
    if (property && color) {
      document.body.style.setProperty(property, color);
    }
  },
  getDom(string) {
    if (string) {
      return document.querySelector(string);
    }
  },
};

const scroll = {
  init: function () {
    this.showScrollElems();
    this.setScrollAnimations();
  },
  showScrollElems: () => {
    // Show all the title elements
    if (document.documentElement.scrollTop > 500) {
      utils.show(".c-scroll");
    }
  },
  setScrollAnimations: function () {
    this.setHomeElem();
    this.setStillElem();
    this.setFestiveElem();
    this.setScrollElems();
  },
  setHomeElem: () => {
    const homeTrigger = new ScrollHandler(".c-home");
    homeTrigger.addAnimation({
      start: 0,
      end: 0.5,
      enterFunc: function () {
        utils.show(".c-home");
      },
      leaveFunc: function () {
        utils.hide(".c-home");
      },
    });
  },
  setStillElem: () => {
    const stillElemTrigger = new ScrollHandler(".c-still");
    stillElemTrigger.addAnimation({
      start: -0.8,
      end: 0.5,
      enterFunc: function () {
        utils.show(".c-still");
      },
      leaveFunc: function () {
        utils.hide(".c-still");
      },
    });
  },
  setFestiveElem: () => {
    const festiveElemTrigger = new ScrollHandler(".c-festive");
    festiveElemTrigger.addAnimation({
      start: -0.2,
      end: 0.3,
      enterFunc: function () {
        utils.show(".c-festive");
      },
      leaveFunc: function () {
        utils.hide(".c-festive");
      },
    });
  },
  setScrollElems: () => {
    // C-scroll elements
    const scrollElemTrigger = new ScrollHandler(".c-scroll");

    document.querySelectorAll(".c-scroll section").forEach((item, i) => {
      const titleTag = item.querySelector(".c-title");
      const bubbleTag = item.querySelector(".img_mask");
      const buttonTag = item.querySelector(".c-title a");

      const startY = -0.11 + i * 0.17;
      const endY = startY + 0.17;

      const showButtonStartY = startY + 0.074;

      const color = titleTag.getAttribute("data-bg-color");

      scrollElemTrigger.addAnimation({
        start: startY,
        end: endY,
        enterFunc: function () {
          utils.show(titleTag);
          utils.changeProperty("--bg-color", color);
        },
        leaveFunc: function () {
          utils.hide(titleTag);
        },
      });

      scrollElemTrigger.addAnimation({
        start: showButtonStartY,
        end: endY,
        enterFunc: function () {
          utils.show(buttonTag);
          utils.show(bubbleTag);
        },
        leaveFunc: function () {
          utils.hide(buttonTag);
        },
      });
    });
  },
};

// start & end are position relative to trigger Element
class ScrollHandler {
  constructor(triggerElem) {
    this.triggerTarget = utils.getDom(triggerElem);
  }
  addAnimation(info) {
    if (typeof info.start === "number" && typeof info.end === "number") {
      this.init(info);
    }
  }
  init(info) {
    const startY = this.getTriggerPos(this.triggerTarget, info.start);
    const endY = this.getTriggerPos(this.triggerTarget, info.end);
    const elemTop = this.getElemTop(this.triggerTarget);

    // when elemtop + starty <=0, start the animation
    // when elemtop + endY >=0, start the animation
    if (startY + elemTop <= 0 && endY + elemTop >= 0) {
      info.enterFunc();
    } else {
      info.leaveFunc();
    }
  }
  getTriggerPos(triggerTarget, pos) {
    return triggerTarget.getBoundingClientRect().height * pos;
  }
  getElemTop(element) {
    return element.getBoundingClientRect().top;
  }
}

// gooey bubbles
const setGooeyBubbles = {
  init: function () {
    // fast bubbles in home page
    document.querySelectorAll(".bubble path").forEach((item) => {
      this.setBubble(item, 3);
    });

    // slow bubbles in product page
    this.setBubble(document.querySelector(".bubble_slow path"), 2);
  },
  setBubble: (bubble, step) => {
    let deg = 0;
    setInterval(() => {
      if (deg >= 360) {
        deg = 0;
      }
      deg += step;
      const rotate = "rotate(" + deg + ")";
      bubble.setAttribute("transform", rotate);
    }, 50);
  },
};

const separateTitles = {
  init: function () {
    // Change titles to single span elements
    document.querySelectorAll(".seperate_title").forEach((item) => {
      const arrs = this.getContentList(item);

      this.setInnerText(item, "");

      const newNode = this.createNewNode("div", "letter_wrapper");

      arrs.forEach((arr) => {
        const list = arr.trim().split("");

        list.forEach((letter) => {
          const newLetter = this.createNewNode("div", "letter");

          this.setRandomClass(newLetter);

          this.setInnerText(newLetter, letter);

          newNode.appendChild(newLetter);
        });
        const br = this.createNewNode("br");

        newNode.appendChild(br);
      });
      item.appendChild(newNode);
    });
  },
  getContentList: function (item) {
    const innerHTML = item.innerHTML;
    return innerHTML.split("<br>");
  },
  createNewNode: function (tag, cls) {
    const newNode = document.createElement(tag);
    if (!cls) {
      return newNode;
    }
    newNode.classList.add(cls);
    return newNode;
  },
  setRandomClass: function (item) {
    const randomNum = this.getRandomNum(0, 5);

    if (randomNum % 3 === 1) {
      item.classList.add("letter_delay");
    } else if (randomNum % 3 === 2) {
      item.classList.add("letter_delay_1");
    }
  },
  getRandomNum: function (min, max) {
    return parseInt(Math.random() * max + min);
  },
  setInnerText: function (item, content) {
    item.innerText = content;
  },
};

// dropdown toggle
const setDropdownBtns = {
  init: function () {
    const dropdownToggleBtns = document.querySelectorAll(".dropdown-toggle");
    dropdownToggleBtns.forEach((item) => {
      this.setEvent(item);
    });
  },
  setEvent: function (item) {
    item.addEventListener("click", (e) => {
      this.onclick(item);
    });
  },
  onclick: function (item) {
    this.checkDropdown(item);
    this.toggleAllClass(item);
  },
  toggleAllClass: function (item) {
    utils.toggleClass(item, "is_active");
    this.toggleBodyClass();
  },
  toggleBodyClass: function () {
    if (document.querySelector(".dropdown-toggle.is_active")) {
      utils.addClass(document.body, "is_app_paused");
    } else {
      utils.removeClass(document.body, "is_app_paused");
    }
  },
  checkDropdown: function (item) {
    const ativeDropdown = document.querySelector(".dropdown-toggle.is_active");
    if (ativeDropdown !== item) {
      utils.hide(ativeDropdown);
    }
  },
};

// product-dropdown

class DropdownAnimation {
  constructor(dropdown) {
    this.dropdown = dropdown;
  }
  init() {
    this.dropdown.addEventListener("mouseover", (e) => {
      this.mouseover(e);
    });
    this.dropdown.addEventListener("mouseout", (e) => {
      this.mouseOut(e);
    });
  }
  mouseOut() {}
  mouseover() {}
}
class ProductDropdown extends DropdownAnimation {
  constructor() {
    super();
  }
  mouseOut() {}
  mouseover() {}
}
const hoverDropdown1Elem = {
  init: function () {
    const dropDown = document.querySelector("#dropdown1");
    dropDown.addEventListener("mouseover", (e) => {
      this.mouseover(e);
    });
    dropDown.addEventListener("mouseout", (e) => {
      this.mouseOut(e);
    });
  },
  mouseOut: function (e) {
    this.hideImg(e);
    this.changeAtr("#ffe500", "transparent");
  },
  mouseover: function (e) {
    console.log(this);
    this.showImg(e);
    this.changeAtr(
      e.target.getAttribute("data-bg-color"),
      e.target.getAttribute("data-color")
    );
  },
  changeAtr: function (bgColor, color) {
    if (bgColor && color) {
      utils.changeProperty("--bg-color", bgColor);
      utils.changeProperty("--color", color);
    }
  },
  hideImg: function () {
    const img = document.querySelector(".product_img_cover .is_active");
    if (img) {
      utils.hide(img);
    }
  },
  showImg: function (e) {
    const src = e.target.getAttribute("data-src");
    if (src) {
      const node = this.createImage(src);
      utils.show(node);
    }
  },
  myImage: function (src) {
    const imgsCover = document.querySelector(".product_img_cover");

    const newNode = document.createElement("div");
    const newImg = document.createElement("img");
    newImg.src = src;
    newImg.alt = src;
    newNode.appendChild(newImg);
    imgsCover.appendChild(newNode);

    return newNode;
  },
  createImage: (function () {
    let cache = {};
    return function (src) {
      if (src in cache) return cache[src];
      return (cache[src] = this.myImage(src));
    };
  })(),
};
const hoverDropdown2Elem = {
  init: function () {
    const dropDown = document.querySelector("#dropdown2");
    dropDown.addEventListener("mouseover", (e) => {
      this.mouseover(e);
    });
    dropDown.addEventListener("mouseout", (e) => {
      this.mouseOut(e);
    });
  },
  mouseOut: function (e) {
    this.hideImg(e);
    this.removeAnimation(e);
  },
  mouseover: function (e) {
    this.showImg(e);
    this.addAnimation(e);
  },
  addAnimation: function (e) {
    if (e.target.tagName === "A") {
      utils.addClass(document.querySelector("#dropdown2"), "is_hover");
      utils.addClass(e.target.parentNode, "is_active");
    }
  },
  removeAnimation: function (e) {
    utils.removeClass(document.querySelector("#dropdown2"), "is_hover");
    console.log(document.querySelector("#dropdown2 .is_active"));
    utils.removeClass(
      document.querySelector("#dropdown2 .is_active"),
      "is_active"
    );
  },
  hideImg: function () {
    const img = document.querySelector(".background .is_active");
    if (img) {
      utils.hide(img);
    }
  },
  showImg: function (e) {
    const src = e.target.getAttribute("data-src");
    if (src) {
      const node = this.createImage(src);
      setTimeout(() => {
        utils.show(node);
      }, 10);
    }
  },
  myImage: function (src) {
    const imgsCover = document.querySelector(".background");

    const newNode = document.createElement("div");
    const newImg = document.createElement("img");
    newImg.src = src;
    newImg.alt = src;
    newNode.appendChild(newImg);
    imgsCover.appendChild(newNode);

    return newNode;
  },
  createImage: (function () {
    let cache = {};
    return function (src) {
      if (src in cache) return cache[src];
      return (cache[src] = this.myImage(src));
    };
  })(),
};
(function () {
  window.addEventListener("load", (e) => {
    // Show the title Never Still
    utils.show(".c-home");
  });

  window.addEventListener("scroll", (i) => {
    scroll.init();
  });

  setGooeyBubbles.init();

  separateTitles.init();

  setDropdownBtns.init();

  hoverDropdown1Elem.init();
  hoverDropdown2Elem.init();
})();