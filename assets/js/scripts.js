import { popup } from './popup.js';
import { fixHeaderOnScroll, hidePreloader, initNavigationMenu } from './helpers.js';
import { initSliders } from './sliders.js';
import { initScrollToBlock } from './scrollToBlock.js';
import { initAccordeons } from './accordeon.js';
import { initStadion } from './stadion.js';

popup.init();
window.popup = popup;
initNavigationMenu();
initSliders();
fixHeaderOnScroll();
initScrollToBlock();
initAccordeons();
initStadion();
setTimeout(() => {
  hidePreloader();
}, 300);
