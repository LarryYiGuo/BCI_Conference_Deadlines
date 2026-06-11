/* BCI Conference Deadlines — main.js */
(function () {
  'use strict';

  // ── themes: 4 high-sat colors; darker shade = higher CCF rank ──
  const THEME_OF = { ML: 'algo', DM: 'algo', NC: 'algo', CV: 'vis', AC: 'vis', SP: 'med', BME: 'med', BCI: 'neuro' };
  const THEME_COLOR = { algo: '#2563EB', vis: '#7C3AED', med: '#D97706', neuro: '#DC2626' };

  function themeShade(c) {
    const base = THEME_COLOR[THEME_OF[c.sub]] || '#141414';
    if (/CCF-A/.test(c.rank)) return `color-mix(in srgb, ${base} 75%, #000 25%)`;
    if (/CCF-B/.test(c.rank)) return base;
    return `color-mix(in srgb, ${base} 60%, #fff 40%)`;
  }

  // ── per-sub icons (white fill, 24x24) ──
  const ICONS = {
    ML: '<path fill-rule="evenodd" d="M4 4h16v16H4V4zm3 3v10h10V7H7z"/><path d="M10 10h4v4h-4z"/>',
    DM: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6c0 1.7-3.6 3-8 3S4 7.7 4 6z"/>',
    NC: '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M11.2 7.7l-4.6 7 1.7 1.1 4.6-7-1.7-1.1zm1.6 0l-1.7 1.1 4.6 7 1.7-1.1-4.6-7z"/>',
    CV: '<path d="M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8z"/>',
    AC: '<path d="M12 21s-8-5.3-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.7-8 11-8 11z"/>',
    SP: '<path d="M3 10h2v4H3zM7 6h2v12H7zM11 2h2v20h-2zM15 6h2v12h-2zM19 10h2v4h-2z"/>',
    BME: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"/>',
    BCI: '<path d="M9.5 3A3.5 3.5 0 006 6.5c-1.8.4-3 2-3 3.9 0 1.2.5 2.3 1.4 3A4 4 0 008 20.5h1.2A2.8 2.8 0 0012 17.7V5.8A2.8 2.8 0 009.5 3zm5 0A2.8 2.8 0 0012 5.8v11.9a2.8 2.8 0 002.8 2.8H16a4 4 0 003.6-7.1c.9-.7 1.4-1.8 1.4-3 0-1.9-1.2-3.5-3-3.9A3.5 3.5 0 0014.5 3z"/>',
  };
  const icon = (sub, cls) => `<span class="ic ${cls || ''}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${ICONS[sub] || ''}</svg></span>`;

  // ── i18n ──
  const I18N = {
    zh: {
      heroTitle: 'BCI 会议<em>截稿</em>日历',
      heroSub: '面向 BCI / EEG / 脑信号研究者的会议截稿追踪。四大主题:算法(蓝)·视觉交互(紫)·医疗信号(黄)·神经(红),颜色越深代表会议分级越高。',
      statConfs: '收录会议',
      statLive: '截稿倒计时中',
      statNext: '下一个截稿',
      all: '全部',
      searchPh: '搜索会议 / 地点 …',
      upcoming: 'Upcoming · 即将截稿',
      tba: 'TBA · 截稿待公布',
      passed: 'Passed · 已截稿',
      tbdText: '待公布',
      overText: '已截稿',
      day: ' 天 ',
      cdLbl: '距全文截稿',
      absK: '摘要·注册',
      subK: '全文截稿',
      dateLbl: '会期',
      placeLbl: '地点',
      est: '预估',
      nonCCF: '非CCF',
      gcal: 'GCal',
      ics: 'ICS',
      today: '今天',
      empty: '没有匹配的会议',
      footer: `数据人工核对于 2026-06-11,并由 GitHub Action 每周自动同步 ccfddl 数据源 · 标注「预估」为按往年规律推测,以官网 CFP 为准<br>
        会议无 JCR 影响因子,引用指标采用 Google Scholar h5-index · 分级:CCF(中国计算机学会)/ CORE(国际)<br>
        组织方式参考 <a href="https://hci-deadlines.github.io/" target="_blank" rel="noopener">hci-deadlines</a> 与 <a href="https://ccfddl.com/" target="_blank" rel="noopener">ccfddl</a>`,
      subs: {
        ML: 'ML 机器学习', DM: 'DM 数据挖掘', NC: 'NC 神经计算', CV: 'CV 视觉多媒体',
        AC: 'AC 情感计算', SP: 'SP 信号处理', BME: 'BME 医工影像', BCI: 'BCI 神经工程',
      },
      langBtn: 'EN',
    },
    en: {
      heroTitle: 'BCI Conference <em>Deadlines</em>',
      heroSub: 'Deadline tracker for BCI / EEG / brain-signal researchers. Four themes: Algorithms (blue) · Vision & Interaction (purple) · Medical & Signal (amber) · Neuro (red) — the darker the color, the higher the venue rank.',
      statConfs: 'conferences tracked',
      statLive: 'counting down',
      statNext: 'next deadline',
      all: 'All',
      searchPh: 'Search conference / place …',
      upcoming: 'Upcoming deadlines',
      tba: 'To be announced',
      passed: 'Passed',
      tbdText: 'TBA',
      overText: 'Passed',
      day: 'd ',
      cdLbl: 'to submission',
      absK: 'Abstract·Reg',
      subK: 'Submission',
      dateLbl: 'When',
      placeLbl: 'Where',
      est: 'Est.',
      nonCCF: 'Non-CCF',
      gcal: 'GCal',
      ics: 'ICS',
      today: 'today',
      empty: 'No matching conferences',
      footer: `Dates manually verified on 2026-06-11 and auto-synced weekly from ccfddl via GitHub Actions · “Est.” = projected from past cycles, confirm with the official CFP<br>
        Conferences have no JCR impact factor; we report the Google Scholar h5-index instead · Ranks: CCF (China) / CORE (international)<br>
        Organization inspired by <a href="https://hci-deadlines.github.io/" target="_blank" rel="noopener">hci-deadlines</a> and <a href="https://ccfddl.com/" target="_blank" rel="noopener">ccfddl</a>`,
      subs: {
        ML: 'ML Machine Learning', DM: 'DM Data Mining', NC: 'NC Neural Computation', CV: 'CV Vision & MM',
        AC: 'AC Affective Comp.', SP: 'SP Signal Processing', BME: 'BME BioMed Eng.', BCI: 'BCI Neural Eng.',
      },
      langBtn: '中文',
    },
  };

  const els = {
    list: document.getElementById('list'),
    filters: document.getElementById('filters'),
    stats: document.getElementById('stats'),
    search: document.getElementById('search'),
    heroTitle: document.getElementById('heroTitle'),
    heroSub: document.getElementById('heroSub'),
    footer: document.getElementById('footerText'),
    langBtn: document.getElementById('langBtn'),
  };

  let confs = [];
  let active = new Set();
  let query = '';
  let lang = 'zh';
  const t = () => I18N[lang];

  // ── helpers ──
  function parseDL(c, field) {
    const v = c[field];
    if (!v || v === 'TBD') return null;
    const d = new Date(v.replace(' ', 'T') + ':00' + (c.tz || '-12:00'));
    return isNaN(d) ? null : d;
  }

  function fmtCountdown(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400);
    const h = String(Math.floor((s % 86400) / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return d > 0 ? `${d}${t().day}${h}:${m}:${sec}` : `${h}:${m}:${sec}`;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g,
      ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }
  const field = (c, n) => (lang === 'en' && c[n + '_en']) ? c[n + '_en'] : c[n];

  // ── calendar links ──
  function calDates(d) {
    const f = x => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    return f(d) + '/' + f(new Date(d.getTime() + 3600000));
  }
  function gcalURL(c, kind, d) {
    const p = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${c.title} ${c.year} ${kind} deadline`,
      dates: calDates(d),
      details: `${c.full_name}\n${c.link}`,
      location: c.place || '',
    });
    return 'https://calendar.google.com/calendar/render?' + p.toString();
  }
  function icsURL(c, kind, d) {
    const f = x => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BCI Deadlines//EN',
      'BEGIN:VEVENT',
      `UID:${c.id}-${kind}@bci-deadlines`,
      `DTSTAMP:${f(new Date())}`,
      `DTSTART:${f(d)}`,
      `DTEND:${f(new Date(d.getTime() + 3600000))}`,
      `SUMMARY:${c.title} ${c.year} ${kind} deadline`,
      `DESCRIPTION:${c.full_name}\\n${c.link}`,
      `LOCATION:${c.place || ''}`,
      `URL:${c.link}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  }
  function calBtns(c, kind, d) {
    return `<span class="cal">
      <a class="calbtn" href="${gcalURL(c, kind, d)}" target="_blank" rel="noopener">${t().gcal}</a>
      <a class="calbtn" href="${icsURL(c, kind, d)}" download="${c.id}-${kind}.ics">${t().ics}</a>
    </span>`;
  }

  // ── state ──
  function loadState() {
    const params = new URLSearchParams(location.search);
    const src = params.get('sub') != null ? params.get('sub') : localStorage.getItem('bci-ddl-subs');
    if (src) src.split(',').map(s => s.trim().toUpperCase()).filter(s => THEME_OF[s]).forEach(s => active.add(s));
    const pl = params.get('lang') || localStorage.getItem('bci-ddl-lang');
    if (pl === 'en' || pl === 'zh') lang = pl;
  }
  function saveState() {
    localStorage.setItem('bci-ddl-subs', [...active].join(','));
    localStorage.setItem('bci-ddl-lang', lang);
    const url = new URL(location);
    const v = [...active].join(',');
    if (v) url.searchParams.set('sub', v); else url.searchParams.delete('sub');
    if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
    history.replaceState(null, '', url);
  }

  // ── chrome ──
  function renderChrome() {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    els.heroTitle.innerHTML = t().heroTitle;
    els.heroSub.textContent = t().heroSub;
    els.search.placeholder = t().searchPh;
    els.footer.innerHTML = t().footer;
    els.langBtn.textContent = t().langBtn;
  }

  function renderFilters() {
    els.filters.innerHTML = '';
    const all = document.createElement('button');
    all.className = 'fbtn all' + (active.size === 0 ? ' on' : '');
    all.textContent = t().all;
    all.onclick = () => { active.clear(); saveState(); renderFilters(); render(); };
    els.filters.appendChild(all);

    for (const key of Object.keys(THEME_OF)) {
      const b = document.createElement('button');
      b.className = 'fbtn' + (active.has(key) ? ' on' : '');
      b.style.setProperty('--c', THEME_COLOR[THEME_OF[key]]);
      b.innerHTML = `${icon(key)}${esc(t().subs[key])}`;
      b.onclick = () => {
        active.has(key) ? active.delete(key) : active.add(key);
        saveState(); renderFilters(); render();
      };
      els.filters.appendChild(b);
    }
  }

  // ── timeline ──
  function timelineHTML(c, dl, abs) {
    const now = Date.now();
    const SPAN = 210 * 86400000, TAIL = 14 * 86400000;
    const start = dl.getTime() - SPAN, end = dl.getTime() + TAIL;
    const pos = ts => Math.max(0, Math.min(100, (ts - start) / (end - start) * 100));
    const fmtD = ts => {
      const d = new Date(ts);
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    };
    // color the stretch between "today" and each upcoming dot with that dot's color
    const pts = [];
    if (abs && abs.getTime() > now) pts.push({ t: abs.getTime(), cls: 'seg-abs' });
    if (dl.getTime() > now) pts.push({ t: dl.getTime(), cls: 'seg-sub' });
    pts.sort((a, b) => a.t - b.t);
    let cursor = now, segs = '';
    for (const p of pts) {
      if (p.t > cursor) {
        const l = pos(cursor), w = pos(p.t) - pos(cursor);
        segs += `<div class="seg ${p.cls}" style="left:${l}%;width:${w}%"></div>`;
      }
      cursor = p.t;
    }
    return `<div class="tl">
      <div class="track">
        <div class="fill" style="width:${pos(now)}%"></div>
        ${segs}
        ${abs ? `<span class="mk abs" style="left:${pos(abs.getTime())}%" title="${t().absK}"></span>` : ''}
        <span class="mk sub" style="left:${pos(dl.getTime())}%" title="${t().subK}"></span>
        <span class="now" style="left:${pos(now)}%" title="${t().today}"></span>
      </div>
      <div class="lbls"><span>${fmtD(start)}</span><span>${fmtD(dl.getTime())}</span></div>
    </div>`;
  }

  // ── card ──
  function cardHTML(c) {
    const shade = themeShade(c);
    const dl = parseDL(c, 'deadline');
    const abs = parseDL(c, 'abstract_deadline');
    const now = Date.now();
    const past = dl && dl.getTime() < now;
    const tbd = !dl;

    let cdHTML;
    if (tbd) cdHTML = `<span class="cd tbd">${t().tbdText}</span>`;
    else if (past) cdHTML = `<span class="cd over">${t().overText}</span>`;
    else {
      const days = (dl.getTime() - now) / 86400000;
      cdHTML = `<span class="cd ${days >= 30 ? 'far' : ''}" data-dl="${dl.getTime()}">${fmtCountdown(dl.getTime() - now)}</span>`;
    }

    const rank = c.rank === '非CCF' ? t().nonCCF : c.rank;
    const badges = [
      `<span class="badge fill">${esc(rank)}</span>`,
      c.core ? `<span class="badge">CORE ${esc(c.core)}</span>` : '',
      c.h5 ? `<span class="badge">h5 ${esc(c.h5)}</span>` : '',
      c.estimated ? `<span class="badge est">${t().est}</span>` : '',
    ].join('');

    const dlRows = [];
    if (abs) dlRows.push(`<div class="dlrow abs"><span class="dot"></span><span class="k">${t().absK}</span><span class="v">${esc(c.abstract_deadline)} ${esc(c.tz_label || '')}</span>${(!past && abs.getTime() > now) ? calBtns(c, 'abstract', abs) : ''}</div>`);
    if (dl) dlRows.push(`<div class="dlrow sub"><span class="dot"></span><span class="k">${t().subK}</span><span class="v">${esc(c.deadline)} ${esc(c.tz_label || '')}</span>${c.track ? `<span class="trk">${esc(c.track)}</span>` : ''}${!past ? calBtns(c, 'submission', dl) : ''}</div>`);

    const place = field(c, 'place') || c.place;
    const placeHTML = (!place || /TBD/i.test(place)) ? esc(place)
      : `<a class="place" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}" target="_blank" rel="noopener">${esc(place)}</a>`;

    const note = field(c, 'note');

    return `<div class="card${past ? ' past' : ''}" style="--tc:${shade}">
      <div class="head">
        ${icon(c.sub)}
        <a class="name" href="${esc(c.link)}" target="_blank" rel="noopener">${esc(c.title)} <span class="yr">${esc(c.year)}</span></a>
        ${badges}
      </div>
      <div class="full">${esc(c.full_name)}</div>
      ${!tbd && !past ? `<div class="cdrow"><span class="cdlbl">${t().cdLbl}</span>${cdHTML}</div>` : `<div class="cdrow">${cdHTML}</div>`}
      ${!tbd && !past ? timelineHTML(c, dl, abs) : ''}
      ${dlRows.length ? `<div class="dls">${dlRows.join('')}</div>` : ''}
      <div class="meta">
        <span><span class="k">${t().dateLbl}</span>${esc(c.date)}</span>
        <span><span class="k">${t().placeLbl}</span>${placeHTML}</span>
      </div>
      ${note ? `<div class="note">${esc(note)}</div>` : ''}
    </div>`;
  }

  // ── render ──
  function visible() {
    const q = query.toLowerCase();
    return confs.filter(c => {
      if (active.size && !active.has(c.sub)) return false;
      if (!q) return true;
      return [c.title, c.full_name, c.place, c.note, c.note_en, c.sub, c.rank, c.core]
        .join(' ').toLowerCase().includes(q);
    });
  }

  function render() {
    const now = Date.now();
    const rows = visible();
    const upcoming = [], tbd = [], past = [];
    for (const c of rows) {
      const dl = parseDL(c, 'deadline');
      if (!dl) tbd.push(c);
      else if (dl.getTime() < now) past.push(c);
      else upcoming.push(c);
    }
    upcoming.sort((a, b) => parseDL(a, 'deadline') - parseDL(b, 'deadline'));
    past.sort((a, b) => parseDL(b, 'deadline') - parseDL(a, 'deadline'));

    let html = '';
    if (upcoming.length) html += `<div class="group-label">${t().upcoming} <span class="cnt">${upcoming.length}</span></div><div class="cards">${upcoming.map(cardHTML).join('')}</div>`;
    if (tbd.length) html += `<div class="group-label">${t().tba} <span class="cnt">${tbd.length}</span></div><div class="cards">${tbd.map(cardHTML).join('')}</div>`;
    if (past.length) html += `<div class="group-label">${t().passed} <span class="cnt">${past.length}</span></div><div class="cards">${past.map(cardHTML).join('')}</div>`;
    if (!rows.length) html = `<div class="empty">${t().empty}</div>`;
    els.list.innerHTML = html;

    // stats (always whole dataset)
    const allUp = confs.filter(c => { const d = parseDL(c, 'deadline'); return d && d.getTime() > now; })
      .sort((a, b) => parseDL(a, 'deadline') - parseDL(b, 'deadline'));
    const next = allUp[0];
    const nextDays = next ? Math.ceil((parseDL(next, 'deadline') - now) / 86400000) : null;
    els.stats.innerHTML = `
      <div class="stat"><span class="num">${confs.length}</span><span class="lbl">${t().statConfs}</span></div>
      <div class="stat"><span class="num">${allUp.length}</span><span class="lbl">${t().statLive}</span></div>
      <div class="stat"><span class="num">${next ? esc(next.title) : '—'}</span><span class="lbl">${t().statNext}${next ? ` · ${nextDays}${lang === 'en' ? 'd' : ' 天'}` : ''}</span></div>`;
  }

  // ── tick ──
  function tick() {
    const now = Date.now();
    let expired = false;
    document.querySelectorAll('.cd[data-dl]').forEach(el => {
      const ms = +el.dataset.dl - now;
      if (ms <= 0) { expired = true; return; }
      el.textContent = fmtCountdown(ms);
      el.classList.toggle('far', ms / 86400000 >= 30);
    });
    if (expired) render();
  }

  // ── boot ──
  loadState();
  renderChrome();
  renderFilters();
  els.search.addEventListener('input', () => { query = els.search.value.trim(); render(); });
  els.langBtn.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    saveState(); renderChrome(); renderFilters(); render();
  });

  fetch('data/conferences.yml', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then(text => {
      confs = jsyaml.load(text) || [];
      render();
      setInterval(tick, 1000);
    })
    .catch(err => {
      els.list.innerHTML = `<div class="empty">Failed to load data: ${esc(err.message)}</div>`;
    });
})();
