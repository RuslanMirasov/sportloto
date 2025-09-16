export const initCountdown = (date, time) => {
  if (!date) return;

  const MONTHS = {
    января: 0,
    февраля: 1,
    марта: 2,
    апреля: 3,
    мая: 4,
    июня: 5,
    июля: 6,
    августа: 7,
    сентября: 8,
    октября: 9,
    ноября: 10,
    декабря: 11,
  };

  const m = String(date)
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})\s+([а-яё]+)\s+(\d{4})$/i);
  if (!m || !(m[2] in MONTHS)) {
    console.warn('Неверный формат даты! Пример: "13 января 2025"');
    return;
  }

  // --- время "HH:MM" ---
  let hh = 0,
    mm = 0;
  if (typeof time === 'string' && time.trim()) {
    const t = time.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (t && +t[1] <= 23 && +t[2] <= 59) {
      hh = +t[1];
      mm = +t[2];
    } else console.warn('Неверный формат времени! Ожидается "HH:MM", например "15:30".');
  }

  const target = new Date(+m[3], MONTHS[m[2]], +m[1], hh, mm, 0, 0);
  const pad2 = n => String(n).padStart(2, '0');

  const UNITS = [
    { key: 'days', sec: 86400, el: document.querySelector('[data-days]') },
    { key: 'hours', sec: 3600, el: document.querySelector('[data-hours]') },
    { key: 'minutes', sec: 60, el: document.querySelector('[data-minutes]') },
    { key: 'seconds', sec: 1, el: document.querySelector('[data-seconds]') },
  ].filter(u => u.el);

  if (!UNITS.length) {
    console.warn('Нет элементов счётчика.');
    return;
  }

  // контейнер отсчитываемого блока
  const COUNTDOWN_ROOT = UNITS[0].el.closest('[data-countdown]') || document.querySelector('[data-countdown]');

  const BASE = { hours: 24, minutes: 60, seconds: 60 };
  let timerId;

  function finish() {
    clearInterval(timerId);
    // обновим на "00" для избежания мерцаний
    UNITS.forEach(u => (u.el.textContent = '00'));
    // удалим блок счётчика
    if (COUNTDOWN_ROOT) COUNTDOWN_ROOT.remove();
  }

  function tick() {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return finish();

    let total = Math.floor(diff / 1000);

    const first = UNITS[0];
    const firstVal = Math.floor(total / first.sec);
    first.el.textContent = pad2(firstVal);
    total -= firstVal * first.sec;

    for (let i = 1; i < UNITS.length; i++) {
      const u = UNITS[i];
      const base = BASE[u.key] ?? Infinity;
      const raw = Math.floor(total / u.sec);
      const val = isFinite(base) ? raw % base : raw;
      u.el.textContent = pad2(val);
      total -= raw * u.sec;
    }
  }

  tick();
  timerId = setInterval(tick, 1000);
  return () => clearInterval(timerId);
};
