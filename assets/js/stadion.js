import { debounce } from './helpers.js';

const handleSeatClick = e => {
  const seat = e.target.closest('.seat');
  if (!seat) return;

  // НОМЕР МЕСТА НА КОТОРОЕ КЛИКНУЛИ
  const seatNumber = seat.dataset.seatNumber;

  // ТУТ ОТПРАВЛЯЕМ НОМЕР К API, ПОКА ИДЁТ ЗАПРОС ПОКАЗЫВАЕМ КРУТИЛКУ НА КРЕСЛЕ
  seat.classList.add('loading');

  // КОГДА ОТВЕТ ОТ API ПРИШЁЛ:
  // 1) Убираем индикатор загрузки
  // 2) Помечаем номер как выбранный
  // 3) записываем номер в LocalStorage (Чтоб больше не кликали)
  // 4) Показываем всплывашку с призом. ID-шки призовых всплывашек:
  //   (one-chance / one-try / stoloto / sticker-pack / colizeum / knowledge-power / certificate / headphones / iphone)
  // P.S - setTimeout поставил временно чтоб имитировать задерку запроса, его убрать нужно.
  setTimeout(() => {
    seat.classList.remove('loading');
    seat.classList.add('checked');
    seatsInStorage(seatNumber);
    window.popup.open('one-try');
  }, 600);
};

const seatsInStorage = number => {
  const saved = localStorage.getItem('checkedSeats');
  const arr = saved ? JSON.parse(saved) : [];

  if (number && !arr.includes(number)) {
    arr.push(number);
    localStorage.setItem('checkedSeats', JSON.stringify(arr));
  }

  return arr;
};

export const initStadion = () => {
  const SEATS = [
    ['left', 'left', 'left', 'center', 'center', 'center', 'center', 'right', 'right', 'right'],
    ['left', 'left', 'left', 'center', 'center', 'center', 'center', 'center', 'right', 'right', 'right'],
    ['left', 'left', 'left', 'left', 'center', 'center', 'center', 'center', 'center', 'right', 'right', 'right'],
    ['left', 'left', 'left', 'center', 'center', 'center', 'center', 'center', 'right', 'right', 'right'],
    ['left', 'left', 'left', 'center', 'center', 'center', 'center', 'right', 'right', 'right', 'right'],
  ];

  let seatNumber = 0;

  const centerScroll = (el, behavior = 'instant') => {
    if (!el) return;
    const left = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
    el.scrollTo({ left, behavior });
  };

  const renderStadion = seats => {
    const stadionEl = document.querySelector('[data-stadion]');
    const scrollArea = document.querySelector('[data-stadion-scroll-area]');
    if (!stadionEl || !scrollArea) return;

    seatNumber = 0;

    const checkedSeats = seatsInStorage();
    const centerRowIndex = Math.floor((seats.length - 1) / 2);
    const step = 7;

    const html = seats
      .map((row, rowIndex) => {
        const firstCenter = row.indexOf('center');
        const lastCenter = row.lastIndexOf('center');

        const items = row
          .map((pos, seatIndex) => {
            seatNumber++;
            const number = String(seatNumber).padStart(2, '0');

            let offset = 0;
            if (pos !== 'center') {
              let dist = 0;
              if (seatIndex < firstCenter) dist = firstCenter - seatIndex;
              else if (seatIndex > lastCenter) dist = seatIndex - lastCenter;
              const direction = rowIndex < centerRowIndex ? 1 : rowIndex > centerRowIndex ? -1 : 0;
              offset = dist * step * direction;
            }

            const isChecked = checkedSeats.includes(String(seatNumber)) ? ' checked' : '';

            return `
          <li class="seat seat--${pos} ${isChecked}" data-seat-number="${seatNumber}" style="position:relative; top:${-offset}px">
            <span class="gradient-text">${number}</span>
            <span class="icon"></span>
          </li>
        `;
          })
          .join('');

        return `<ul class="row" data-row="${rowIndex + 1}">${items}</ul>`;
      })
      .join('');

    stadionEl.innerHTML = html;
    stadionEl.addEventListener('click', handleSeatClick);
    requestAnimationFrame(() => centerScroll(scrollArea, 'instant'));
    const onLoadOnce = () => {
      centerScroll(scrollArea, 'instant');
      window.removeEventListener('load', onLoadOnce);
    };
    window.addEventListener('load', onLoadOnce);
    let prevWidth = window.innerWidth;
    const onResize = debounce(() => {
      if (window.innerWidth !== prevWidth) {
        prevWidth = window.innerWidth;
        centerScroll(scrollArea, 'instant');
      }
    }, 150);
    window.addEventListener('resize', onResize, { passive: true });
  };

  renderStadion(SEATS);
};
