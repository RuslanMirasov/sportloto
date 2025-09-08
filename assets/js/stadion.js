const handleSeatClick = e => {
  const seat = e.target.closest('.seat');
  if (!seat) return;

  // НОМЕР МЕСТА НА КОТОРОЕ КЛИКНУЛИ
  const number = seat.dataset.seatNumber;

  // ТУТ ОТПРАВЛЯЕМ НОМЕР К API, ПОКА ИДЁТ ЗАПРОС ПОКАЗЫВАЕМ КРУТИЛКУ НА КРЕСЛЕ
  seat.classList.add('loading');

  // КОГДА ОТВЕТ ОТ API ПРИШЁЛ:
  // 1) Убираем индикатор загрузки
  // 2) Помечаем номер как выбранный
  // 3) записываем номер в LocalStorage (Чтоб больше не кликали)
  //4) Показываем всплывашку с призом. ID-шки призовых всплывашек: ( one-chance / one-try / points / sticker-pack / colizeum / knowledge-power )
  // P.S - setTimeout поставил временно чтоб имитировать задерку запроса, его убрать нужно.
  setTimeout(() => {
    seat.classList.remove('loading');
    seat.classList.add('checked');
    seatsInStorage(number);
    window.popup.open('points');
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

  const SEATS_MOBIL = [
    ['left', 'left', 'center', 'right', 'right'],
    ['left', 'left', 'center', 'center', 'right', 'right'],
    ['left', 'left', 'center', 'center', 'right', 'right'],
    ['left', 'left', 'center', 'center', 'right', 'right', 'right'],
    ['left', 'left', 'left', 'center', 'center', 'right', 'right'],
    ['left', 'left', 'center', 'center', 'right', 'right'],
    ['left', 'left', 'center', 'center', 'right', 'right', 'right'],
    ['left', 'left', 'center', 'center', 'right', 'right'],
    ['left', 'left', 'center', 'center', 'right'],
  ];

  let seatNumber = 0;

  const renderStadion = seats => {
    const stadionEl = document.querySelector('[data-stadion]');
    if (!stadionEl) return;

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
  };

  renderStadion(SEATS);
};
