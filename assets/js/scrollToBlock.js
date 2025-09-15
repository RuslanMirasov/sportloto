export const scrollToBlock = (selector, offset = 0) => {
  const element = document.querySelector(selector);
  if (!element) {
    window.location.href = `./${selector}`;
    return;
  }

  const y = element.getBoundingClientRect().top + window.scrollY + offset;

  window.scrollTo({
    top: y,
    behavior: 'smooth',
  });
};

const handleScrollLinkClick = e => {
  const target = e.target.href.split('#')[1];
  const element = document.querySelector(`#${target}`);
  if (!element) return;

  e.preventDefault();
  const offset = e.target.dataset.scrollto || -50;

  // closeMenu();
  scrollToBlock(`#${target}`, Number(offset));
};

export const initScrollToBlock = () => {
  const scrollLinks = document.querySelectorAll('[data-scrollto]');

  if (scrollLinks.length > 0) {
    scrollLinks.forEach(link => link.addEventListener('click', handleScrollLinkClick));
  }
};
