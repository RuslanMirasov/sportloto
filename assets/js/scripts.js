import { popup } from './popup.js';
import { fixHeaderOnScroll, hidePreloader, initNavigationMenu } from './helpers.js';
import { initSliders } from './sliders.js';
import { initScrollToBlock } from './scrollToBlock.js';
import { initAccordeons } from './accordeon.js';
import { initStadion } from './stadion.js';
import { initCountdown } from './countdown.js';

popup.init();
window.popup = popup;
initNavigationMenu();
initSliders();
fixHeaderOnScroll();
initScrollToBlock();
initAccordeons();
initStadion();
initCountdown('19 сентября 2025');
setTimeout(() => {
  hidePreloader();
}, 300);
