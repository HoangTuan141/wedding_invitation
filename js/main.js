/* =====================================================================
   LOGIC THIỆP CƯỚI — thường không cần sửa file này.
   Nội dung chỉnh ở js/config.js, ảnh đặt ở /images.
   ===================================================================== */
(() => {
  'use strict';

  const C = window.WEDDING;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  // Tách '2026-12-20T11:00:00+07:00' thành các phần, giữ đúng giờ ghi trong config
  // (không bị lệch múi giờ khi khách ở nước ngoài mở thiệp).
  const parts = (iso) => {
    const [, y, m, d, h = '0', mi = '0'] = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
    const p = { y: +y, m: +m, d: +d, h: +h, mi: +mi };
    p.weekday = WEEKDAYS[new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()];
    p.time = `${pad(p.h)}:${pad(p.mi)}`;
    p.dots = `${pad(p.d)} · ${pad(p.m)} · ${p.y}`;
    p.short = `${pad(p.d)}.${pad(p.m)}.${p.y}`;
    return p;
  };

  const W = parts(C.date);
  Object.assign(C, {
    dateDots: W.dots,
    weekday: W.weekday,
    day: pad(W.d),
    monthText: `Tháng ${W.m}`,
    year: W.y,
    time: W.time,
  });

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  /* ---------------------------------------------------------------
     1. Đổ dữ liệu từ config vào các thẻ có data-cfg
     --------------------------------------------------------------- */
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), C);
  $$('[data-cfg]').forEach((el) => {
    const v = get(el.dataset.cfg);
    if (v != null && v !== '') el.textContent = v;
  });
  document.title = `${C.groom.short} & ${C.bride.short} · ${W.short}`;

  /* ---------------------------------------------------------------
     2. Tên khách mời từ link (?to=...)
     --------------------------------------------------------------- */
  const guest = new URLSearchParams(location.search).get('to');
  if (guest) {
    $('#guestName').textContent = guest;
    $('#guestBox').hidden = false;
    const ig = $('#inviteGuest');
    $('strong', ig).textContent = guest;
    ig.hidden = false;
  }

  /* ---------------------------------------------------------------
     3. Ảnh chưa có file → hiện khung gợi ý kèm tên file cần thêm
     --------------------------------------------------------------- */
  const markMissing = (img) => {
    const box = img.closest('[data-ph]');
    if (!box) { img.style.visibility = 'hidden'; return; }
    box.classList.add('is-missing');
    box.dataset.label = decodeURI(img.currentSrc || img.src).split('/').slice(-2).join('/');
  };
  const watchImg = (img) => {
    if (img.complete && img.naturalWidth === 0) markMissing(img);
    else img.addEventListener('error', () => markMissing(img), { once: true });
  };
  $$('img').forEach((img) => { if (img.getAttribute('src')) watchImg(img); });

  /* ---------------------------------------------------------------
     3b. Ảnh bìa: slide ngang vô tận ('slide') hoặc dải ảnh trôi ('marquee')
     --------------------------------------------------------------- */
  const hero = (() => {
    const idle = { start() {} };
    const media = $('#heroMedia');
    const list = (C.heroSlides || [])
      .map((s) => (typeof s === 'string' ? { src: s } : s))
      .filter((s) => s && s.src);
    if (!list.length) return idle;

    // Tạo <picture> nhưng chưa gán src, để chủ động thời điểm tải ảnh
    const makeImg = (item, alt) => {
      const pic = document.createElement('picture');
      const source = item.mobile ? document.createElement('source') : null;
      if (source) { source.media = '(max-width: 767px)'; pic.append(source); }
      const img = document.createElement('img');
      img.alt = alt;
      img.decoding = 'async';
      if (item.position) img.style.objectPosition = item.position;
      pic.append(img);
      const load = () => {
        if (source) source.srcset = item.mobile;
        img.src = item.src;
        watchImg(img);
      };
      return { pic, img, load };
    };
    const ALT = 'Ảnh cưới của cô dâu và chú rể';

    if (C.heroMode === 'marquee') {
      const track = document.createElement('div');
      track.className = 'hero__track';
      let set = [...list];
      while (set.length < 4) set = set.concat(list); // đủ dài để phủ kín màn hình rộng
      // Nhân đôi dải ảnh, dịch đúng 50% là quay về điểm đầu → lặp liền mạch
      [...set, ...set].forEach((item, i) => {
        const clone = i >= set.length;
        const frame = document.createElement('div');
        frame.className = 'hero__frame';
        frame.dataset.ph = '';
        if (clone) frame.setAttribute('aria-hidden', 'true');
        const m = makeImg(item, clone ? '' : ALT);
        frame.append(m.pic);
        track.append(frame);
        m.load();
      });
      track.style.setProperty('--marquee', `${set.length * (C.heroSpeed || 7)}s`);
      media.append(track);
      return idle;
    }

    const interval = Math.max(2, C.heroInterval || 5) * 1000;
    const SLIDE_MS = 1400; // khớp với transition .hero__slide.is-anim trong CSS
    media.style.setProperty('--hero-kb', `${(interval + SLIDE_MS) / 1000}s`);

    const slides = list.map((item, i) => {
      const el = document.createElement('div');
      el.className = `hero__slide${i === 0 ? ' is-active' : ''}`;
      el.dataset.ph = '';
      const m = makeImg(item, ALT);
      el.append(m.pic);
      media.append(el);
      if (i === 0) { m.img.setAttribute('fetchpriority', 'high'); m.load(); }
      return { el, load: m.load, loaded: i === 0 };
    });
    if (slides.length < 2) return idle;

    // Ảnh đầu tải ngay, các ảnh sau tải khi trang đã tải xong
    const loadRest = () => slides.forEach((s) => { if (!s.loaded) { s.loaded = true; s.load(); } });
    if (document.readyState === 'complete') loadRest();
    else addEventListener('load', loadRest, { once: true });

    const prog = $('#heroProgress');
    const curEl = $('[data-current]', prog);
    $('[data-total]', prog).textContent = pad(slides.length);
    prog.style.setProperty('--hero-interval', `${interval / 1000}s`);
    prog.hidden = false;

    let cur = 0;
    let timer = null;
    let started = false;

    const schedule = () => {
      clearTimeout(timer);
      prog.classList.remove('is-running');
      if (!started || document.hidden) return;
      void prog.offsetWidth; // chạy lại thanh tiến trình từ đầu
      prog.classList.add('is-running');
      timer = setTimeout(() => go(cur + 1, 1), interval);
    };

    const go = (target, dir) => {
      const next = (target + slides.length) % slides.length;
      if (next === cur) return;
      const out = slides[cur].el;
      const inc = slides[next].el;
      // Đặt ảnh mới ở mép (phải nếu tiến, trái nếu lùi) rồi mới bật hiệu ứng trượt vào
      inc.classList.remove('is-anim', 'is-leaving');
      inc.style.transform = `translateX(${dir * 100}%)`;
      void inc.offsetWidth;
      inc.classList.add('is-anim', 'is-active');
      inc.style.transform = '';
      out.classList.remove('is-active');
      out.classList.add('is-anim', 'is-leaving');
      out.style.transform = `translateX(${dir * -30}%)`;
      setTimeout(() => {
        if (out.classList.contains('is-active')) return;
        out.classList.remove('is-anim', 'is-leaving');
        out.style.transform = '';
      }, SLIDE_MS + 50);
      cur = next;
      curEl.textContent = pad(cur + 1);
      schedule();
    };

    document.addEventListener('visibilitychange', schedule);

    // Vuốt ngang trên điện thoại để chuyển ảnh
    let x0 = null;
    let y0 = null;
    const home = $('#home');
    home.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    home.addEventListener('touchend', (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      x0 = null;
    });

    return { start() { started = true; schedule(); } };
  })();

  /* ---------------------------------------------------------------
     4. Mở thiệp + nhạc nền
     --------------------------------------------------------------- */
  const opening = $('#opening');
  const audio = $('#bgm');
  const musicBtn = $('#musicBtn');

  if (C.music) audio.src = C.music;
  else musicBtn.hidden = true;
  audio.addEventListener('error', () => { musicBtn.hidden = true; });

  const setPlaying = (on) => {
    musicBtn.classList.toggle('is-playing', on);
    musicBtn.setAttribute('aria-pressed', String(on));
  };
  const playMusic = () => audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  musicBtn.addEventListener('click', () => {
    if (audio.paused) playMusic();
    else { audio.pause(); setPlaying(false); }
  });

  $('#openBtn').addEventListener('click', () => {
    opening.classList.add('is-open');
    document.body.classList.remove('is-locked');
    document.body.classList.add('is-opened');
    if (C.music) playMusic();
    hero.start();
    setTimeout(() => opening.remove(), 1700);
  });

  /* ---------------------------------------------------------------
     5. Đếm ngược
     --------------------------------------------------------------- */
  const target = new Date(C.date).getTime();
  const cd = $('#countdown');
  const cdEl = Object.fromEntries($$('[data-cd]', cd).map((el) => [el.dataset.cd, el]));
  let cdTimer = null;
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      cd.innerHTML = '<p class="countdown__done">Chúng mình đã chính thức về chung một nhà ♡</p>';
      clearInterval(cdTimer);
      return false;
    }
    const s = Math.floor(diff / 1000);
    cdEl.d.textContent = pad(Math.floor(s / 86400));
    cdEl.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cdEl.m.textContent = pad(Math.floor((s % 3600) / 60));
    cdEl.s.textContent = pad(s % 60);
    return true;
  };
  if (tick()) cdTimer = setInterval(tick, 1000);

  /* ---------------------------------------------------------------
     6. Lịch tháng cưới
     --------------------------------------------------------------- */
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.4-4.5-9.5-9.1C1 8.5 3.1 4.6 6.9 4.6c2.1 0 3.6 1.1 5.1 3 1.5-1.9 3-3 5.1-3 3.8 0 5.9 3.9 4.4 7.3C19.4 16.5 12 21 12 21z"/></svg>';
  (() => {
    const offset = (new Date(Date.UTC(W.y, W.m - 1, 1)).getUTCDay() + 6) % 7; // tuần bắt đầu Thứ Hai
    const days = new Date(Date.UTC(W.y, W.m, 0)).getUTCDate();
    let html = `<div class="cal__head"><span class="cal__month">Tháng ${W.m}</span><span class="cal__year">${W.y}</span></div><div class="cal__grid">`;
    html += ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => `<span class="cal__dow">${d}</span>`).join('');
    html += '<span></span>'.repeat(offset);
    for (let d = 1; d <= days; d++) {
      const isWedding = d === W.d;
      const isSun = (offset + d - 1) % 7 === 6;
      html += `<span class="cal__day${isWedding ? ' is-wedding' : ''}${isSun ? ' is-sun' : ''}">${isWedding ? HEART : ''}${d}</span>`;
    }
    $('#calendar').innerHTML = `${html}</div>`;
  })();

  /* ---------------------------------------------------------------
     7. Thẻ sự kiện + bản đồ
     --------------------------------------------------------------- */
  const ICONS = {
    rings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="9" cy="15" r="5.5"/><circle cx="15" cy="15" r="5.5"/><path d="m9.5 4.5 1-1.5h3l1 1.5L12 7.5z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M12 17.5s-3-1.8-3-3.7c0-1 .8-1.8 1.7-1.8.6 0 1 .3 1.3.8.3-.5.7-.8 1.3-.8.9 0 1.7.8 1.7 1.8 0 1.9-3 3.7-3 3.7z"/></svg>',
    glass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 3h5l-.3 5a2.2 2.2 0 0 1-4.4 0z"/><path d="M7.5 10.2V20M5 20.5h5"/><path d="M14 3h5l-.3 5a2.2 2.2 0 0 1-4.4 0z"/><path d="M16.5 10.2V20M14 20.5h5"/></svg>',
  };
  const PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  const CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';

  const gcalDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const gcalLink = (ev) => {
    const start = new Date(ev.date);
    const end = new Date(start.getTime() + (ev.hours || 2) * 3600e3);
    const q = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${ev.title} · ${C.groom.short} & ${C.bride.short}`,
      dates: `${gcalDate(start)}/${gcalDate(end)}`,
      details: 'Trân trọng kính mời bạn đến chung vui cùng chúng mình!',
      location: `${ev.place}, ${ev.address}`,
    });
    return `https://calendar.google.com/calendar/render?${q}`;
  };
  const mapQuery = (ev) => `${ev.place}, ${ev.address}`;
  const mapLink = (ev) => ev.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery(ev))}`;

  $('#eventList').innerHTML = C.events.map((ev) => {
    const p = parts(ev.date);
    return `
      <article class="event reveal">
        <div class="event__icon">${ICONS[ev.icon] || ICONS.rings}</div>
        <p class="event__host">${esc(ev.host)}</p>
        <h3 class="event__title">${esc(ev.title)}</h3>
        <p class="event__time">${p.time}</p>
        <p class="event__date">${p.weekday}, ${p.short}</p>
        <p class="event__lunar">${esc(ev.lunar || C.lunar)}</p>
        <div class="event__divider"></div>
        <p class="event__place">${esc(ev.place)}</p>
        <p class="event__addr">${esc(ev.address)}</p>
        <div class="event__actions">
          <a class="btn btn--ghost btn--sm" href="${esc(mapLink(ev))}" target="_blank" rel="noopener">${PIN}Chỉ đường</a>
          <a class="btn btn--ghost btn--sm" href="${esc(gcalLink(ev))}" target="_blank" rel="noopener">${CAL}Lưu lịch</a>
        </div>
      </article>`;
  }).join('');

  const mapEvent = C.events.find((e) => e.showMap) || C.events[C.events.length - 1];
  $('#mapFrame').src = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery(mapEvent))}&output=embed`;

  if (C.dressCode && C.dressCode.length) {
    $('#swatches').innerHTML = C.dressCode.map((c) => `<i style="background:${esc(c)}" title="${esc(c)}"></i>`).join('');
  } else {
    $('#dresscode').hidden = true;
  }

  /* ---------------------------------------------------------------
     8. Hiệu ứng xuất hiện khi cuộn
     --------------------------------------------------------------- */
  $$('#gallery .g').forEach((g, i) => { g.style.transitionDelay = `${(i % 3) * 0.08}s`; });
  $$('#eventList .event').forEach((e, i) => { e.style.transitionDelay = `${i * 0.1}s`; });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      // bỏ delay sau khi đã hiện để hiệu ứng hover phản hồi ngay
      setTimeout(() => { e.target.style.transitionDelay = ''; }, 1400);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* ---------------------------------------------------------------
     9. Menu nổi, nút lên đầu trang, đánh dấu mục đang xem
     --------------------------------------------------------------- */
  const nav = $('#nav');
  const toTop = $('#toTop');
  new IntersectionObserver(([e]) => {
    nav.classList.toggle('is-show', !e.isIntersecting);
    toTop.classList.toggle('is-show', !e.isIntersecting);
  }, { threshold: 0.08 }).observe($('#home'));
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  const navList = $('.nav__links');
  const links = $$('a', navList);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => {
        const active = a.getAttribute('href') === `#${e.target.id}`;
        a.classList.toggle('is-active', active);
        if (active) navList.scrollTo({ left: a.offsetLeft - navList.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' });
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });

  /* ---------------------------------------------------------------
     10. Parallax nhẹ cho ảnh banner / cảm ơn
     --------------------------------------------------------------- */
  const plx = $$('[data-parallax]');
  if (plx.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const vh = innerHeight;
      plx.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const progress = (r.top + r.height / 2 - vh / 2) / (vh + r.height); // -0.5 → 0.5
        img.style.transform = `translate3d(0, ${(progress * -18).toFixed(2)}%, 0)`;
      });
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------
     11. Xem ảnh album phóng to (lightbox)
     --------------------------------------------------------------- */
  const gItems = $$('#gallery .g');
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCount = $('#lbCount');
  let lbList = [];
  let lbIndex = 0;

  const lbShow = (i) => {
    lbIndex = (i + lbList.length) % lbList.length;
    const img = $('img', lbList[lbIndex]);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCount.textContent = `${pad(lbIndex + 1)} / ${pad(lbList.length)}`;
  };
  const lbOpen = (fig) => {
    lbList = gItems.filter((g) => !g.classList.contains('is-missing'));
    const i = lbList.indexOf(fig);
    if (i < 0) return;
    lbShow(i);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
  };
  const lbClose = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  };

  gItems.forEach((g) => {
    g.tabIndex = 0;
    g.setAttribute('role', 'button');
    g.addEventListener('click', () => lbOpen(g));
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lbOpen(g); }
    });
  });
  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', () => lbShow(lbIndex - 1));
  $('#lbNext').addEventListener('click', () => lbShow(lbIndex + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) lbClose(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  });
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------------------------------------------------------------
     12. Toast + sao chép số tài khoản
     --------------------------------------------------------------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 3000);
  };

  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = String(get(btn.dataset.copy));
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.append(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      toast(`Đã sao chép số tài khoản ${text}`);
    });
  });

  /* ---------------------------------------------------------------
     13. Xác nhận tham dự + sổ lưu bút
     --------------------------------------------------------------- */
  const STORE_KEY = 'wedding-wishes';
  const readLocal = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; }
  };
  const saveLocal = (wish) => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify([wish, ...readLocal()].slice(0, 50))); } catch { /* bỏ qua */ }
  };

  const wishList = $('#wishList');
  const wishCount = $('#wishCount');
  let wishes = [];

  const fmtTime = (t) => {
    const d = new Date(t);
    return Number.isNaN(d.getTime()) ? '' : `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  };
  const renderWishes = () => {
    wishList.textContent = '';
    if (!wishes.length) {
      wishList.innerHTML = '<li class="wishes__empty">Hãy là người đầu tiên gửi lời chúc<br />tới cô dâu chú rể nhé ♡</li>';
      wishCount.textContent = '';
      return;
    }
    wishCount.textContent = `${wishes.length} lời chúc`;
    wishes.forEach((w) => {
      const li = document.createElement('li');
      li.className = 'wish';
      li.innerHTML = '<div class="wish__head"><span class="wish__avatar"></span><span class="wish__name"></span><time class="wish__time"></time></div><p class="wish__text"></p>';
      $('.wish__avatar', li).textContent = (w.name || '?').trim().charAt(0).toUpperCase();
      $('.wish__name', li).textContent = w.name;
      $('.wish__time', li).textContent = fmtTime(w.time);
      $('.wish__text', li).textContent = w.wish;
      wishList.append(li);
    });
  };

  const loadWishes = async () => {
    wishes = readLocal();
    if (C.rsvpEndpoint) {
      try {
        const res = await fetch(C.rsvpEndpoint);
        const remote = await res.json();
        if (Array.isArray(remote)) wishes = remote;
      } catch { /* dùng dữ liệu tạm trên máy */ }
    }
    renderWishes();
  };
  loadWishes();

  const form = $('#rsvpForm');
  const guestsSelect = $('[name=guests]', form);
  $$('[name=attend]', form).forEach((r) => r.addEventListener('change', () => {
    guestsSelect.disabled = $('[name=attend]:checked', form).value !== 'Có';
  }));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.name = (data.name || '').trim();
    data.wish = (data.wish || '').trim();
    if (!data.name) {
      toast('Bạn vui lòng nhập họ tên nhé');
      $('[name=name]', form).focus();
      return;
    }

    const btn = $('[type=submit]', form);
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Đang gửi...';
    try {
      if (C.rsvpEndpoint) {
        // no-cors: Google Apps Script vẫn nhận dữ liệu, chỉ là không đọc được phản hồi
        await fetch(C.rsvpEndpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) });
      }
      if (data.wish) {
        const wish = { name: data.name, wish: data.wish, time: new Date().toISOString() };
        saveLocal(wish);
        wishes = [wish, ...wishes];
        renderWishes();
        wishList.scrollTop = 0;
      }
      form.reset();
      guestsSelect.disabled = false;
      toast(data.attend === 'Có' ? 'Cảm ơn bạn! Hẹn gặp bạn trong ngày vui nhé ♡' : 'Cảm ơn lời chúc của bạn rất nhiều ♡');
    } catch {
      toast('Gửi chưa thành công, bạn thử lại giúp mình nhé!');
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });

  /* ---------------------------------------------------------------
     14. Cánh hoa rơi
     --------------------------------------------------------------- */
  if (C.petals && !reduceMotion) {
    const cv = $('#petals');
    const ctx = cv.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const COLORS = ['rgba(236,196,186,.75)', 'rgba(243,218,204,.8)', 'rgba(214,183,153,.6)', 'rgba(255,240,232,.85)'];
    let w = 0;
    let h = 0;
    const resize = () => { w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; };
    resize();
    addEventListener('resize', resize);

    const make = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -20 * dpr,
      r: (5 + Math.random() * 6) * dpr,
      vy: (0.35 + Math.random() * 0.7) * dpr,
      vx: (Math.random() - 0.5) * 0.4 * dpr,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.02,
      flip: Math.random() * Math.PI * 2,
      sway: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
    const petals = Array.from({ length: innerWidth < 700 ? 10 : 16 }, () => make(true));

    const draw = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.55 + 0.45 * Math.cos(p.flip)); // lật cánh hoa tạo cảm giác 3D
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r * 0.95, -p.r * 0.55, p.r * 0.6, p.r * 0.75, 0, p.r);
      ctx.bezierCurveTo(-p.r * 0.6, p.r * 0.75, -p.r * 0.95, -p.r * 0.55, 0, -p.r);
      ctx.fill();
      ctx.restore();
    };

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      petals.forEach((p, i) => {
        p.sway += 0.012;
        p.flip += 0.03;
        p.rot += p.vr;
        p.x += p.vx + Math.sin(p.sway) * 0.35 * dpr;
        p.y += p.vy;
        if (p.y > h + 20 * dpr || p.x < -40 * dpr || p.x > w + 40 * dpr) petals[i] = make(false);
        draw(p);
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) loop();
    });
  }
})();
