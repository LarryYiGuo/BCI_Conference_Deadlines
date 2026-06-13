/* BCI Conference Deadlines — main.js */
(function () {
  'use strict';

  // ── themes: 4 accent colors; darker shade = higher CCF rank ──
  const THEME_OF = { ML: 'algo', DM: 'algo', NC: 'algo', CV: 'vis', AC: 'vis', SP: 'med', BME: 'med', BCI: 'neuro' };
  const THEME_COLOR = { algo: '#2563EB', vis: '#7C3AED', med: '#D97706', neuro: '#DC2626' };

  function themeShade(c) {
    const base = THEME_COLOR[THEME_OF[c.sub]] || '#3a3a38';
    if (/CCF-A/.test(c.rank)) return `color-mix(in srgb, ${base} 82%, #000 18%)`;
    if (/CCF-B/.test(c.rank)) return base;
    return `color-mix(in srgb, ${base} 62%, #fff 38%)`;
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
  const icon = (sub, color) => `<span class="evt-ic" style="background:${color}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${ICONS[sub] || ''}</svg></span>`;

  // ── i18n ──
  const I18N = {
    zh: {
      heroTitle: '脑机接口<br>会议<em>截稿日期</em>',
      heroSub: '',
      statConfs: '收录会议',
      statLive: '倒计时中',
      statNext: '下一个截止',
      all: '全部',
      searchPh: '搜索会议 / 地点 …',
      themeLbl: '主题',
      upcoming: '即将截止',
      tba: '待公布',
      passed: '已截止',
      tbdText: '日期待公布',
      overText: '已截止',
      day: ' 天 ',
      cdReg: '距报名',
      cdSub: '距截稿',
      regK: '报名',
      subK: '截稿',
      dateLbl: '会期',
      placeLbl: '地点',
      est: '预估',
      nonCCF: '非CCF',
      gcal: '＋Google',
      ics: '＋ICS',
      today: '今天',
      empty: '没有匹配的会议',
      footer: `数据人工核对于 2026-06-12,并由 GitHub Action 每周自动同步 <a href="https://github.com/ccfddl/ccf-deadlines" target="_blank" rel="noopener">ccfddl</a> 数据源 · 标注「预估」为按往年规律推测,以官网 CFP 为准<br>
        会议无 JCR 影响因子,引用指标采用 Google Scholar h5-index · 分级:CCF(中国计算机学会)/ CORE(国际)`,
      subs: {
        ML: 'ML 机器学习', DM: 'DM 数据挖掘', NC: 'NC 神经计算', CV: 'CV 视觉多媒体',
        AC: 'AC 情感计算', SP: 'SP 信号处理', BME: 'BME 医工影像', BCI: 'BCI 神经工程',
      },
      langBtn: 'EN',
    },
    en: {
      heroTitle: 'Brain-Computer Interface<br><em>Conference Deadlines</em>',
      heroSub: '',
      statConfs: 'conferences',
      statLive: 'counting down',
      statNext: 'next deadline',
      all: 'All',
      searchPh: 'Search conference / place …',
      themeLbl: 'Theme',
      upcoming: 'Upcoming',
      tba: 'To be announced',
      passed: 'Passed',
      tbdText: 'dates TBA',
      overText: 'passed',
      day: 'd ',
      cdReg: 'to registration',
      cdSub: 'to submission',
      regK: 'Reg',
      subK: 'Paper',
      dateLbl: 'When',
      placeLbl: 'Where',
      est: 'Est.',
      nonCCF: 'Non-CCF',
      gcal: '＋Google',
      ics: '＋ICS',
      today: 'today',
      empty: 'No matching conferences',
      footer: `Dates manually verified on 2026-06-12 and auto-synced weekly from <a href="https://github.com/ccfddl/ccf-deadlines" target="_blank" rel="noopener">ccfddl</a> via GitHub Actions · “Est.” = projected from past cycles, confirm with the official CFP<br>
        Conferences have no JCR impact factor; we report the Google Scholar h5-index instead · Rank: CORE (international)`,
      subs: {
        ML: 'ML Machine Learning', DM: 'DM Data Mining', NC: 'NC Neural Comp.', CV: 'CV Vision & MM',
        AC: 'AC Affective', SP: 'SP Signal Proc.', BME: 'BME BioMed', BCI: 'BCI Neural Eng.',
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
  let langExplicit = false;
  const t = () => I18N[lang];

  // ── helpers ──
  function parseDL(c, field) {
    const v = c[field];
    if (!v || v === 'TBD') return null;
    const d = new Date(String(v).replace(' ', 'T') + ':00' + (c.tz || '-12:00'));
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
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BCI Deadlines//EN', 'BEGIN:VEVENT',
      `UID:${c.id}-${kind}@bci-deadlines`, `DTSTAMP:${f(new Date())}`,
      `DTSTART:${f(d)}`, `DTEND:${f(new Date(d.getTime() + 3600000))}`,
      `SUMMARY:${c.title} ${c.year} ${kind} deadline`,
      `DESCRIPTION:${c.full_name}\\n${c.link}`, `LOCATION:${c.place || ''}`, `URL:${c.link}`,
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
    if (pl === 'en' || pl === 'zh') { lang = pl; langExplicit = true; }
    else lang = (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }
  function detectLangByIP() {
    if (langExplicit) return;
    fetch('https://api.country.is/', { signal: AbortSignal.timeout(4000) })
      .then(r => r.json())
      .then(d => {
        const want = d.country === 'CN' ? 'zh' : 'en';
        if (!langExplicit && want !== lang) { lang = want; renderChrome(); renderFilters(); render(); }
      })
      .catch(() => {});
  }
  function saveState() {
    localStorage.setItem('bci-ddl-subs', [...active].join(','));
    const url = new URL(location);
    const v = [...active].join(',');
    if (v) url.searchParams.set('sub', v); else url.searchParams.delete('sub');
    if (langExplicit) {
      localStorage.setItem('bci-ddl-lang', lang);
      if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
    }
    history.replaceState(null, '', url);
  }

  // ── chrome ──
  function renderChrome() {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    els.heroTitle.innerHTML = t().heroTitle;
    els.heroSub.textContent = t().heroSub;
    els.heroSub.style.display = t().heroSub ? '' : 'none';
    els.search.placeholder = t().searchPh;
    els.footer.innerHTML = t().footer;
    els.langBtn.textContent = t().langBtn;
  }
  function renderFilters() {
    els.filters.innerHTML = `<span class="lbl">${t().themeLbl}</span>`;
    const all = document.createElement('button');
    all.className = 'fbtn all' + (active.size === 0 ? ' on' : '');
    all.textContent = t().all;
    all.onclick = () => { active.clear(); saveState(); renderFilters(); render(); };
    els.filters.appendChild(all);
    for (const key of Object.keys(THEME_OF)) {
      const b = document.createElement('button');
      b.className = 'fbtn' + (active.has(key) ? ' on' : '');
      const col = THEME_COLOR[THEME_OF[key]];
      b.style.setProperty('--c', col);
      b.innerHTML = `<span class="fic"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${ICONS[key] || ''}</svg></span>${esc(t().subs[key])}`;
      b.onclick = () => {
        active.has(key) ? active.delete(key) : active.add(key);
        saveState(); renderFilters(); render();
      };
      els.filters.appendChild(b);
    }
  }

  // ── timeline: today → each upcoming dot is colored with that dot's color ──
  function timelineHTML(reg, dl) {
    const now = Date.now();
    const SPAN = 210 * 86400000, TAIL = 14 * 86400000;
    const start = dl.getTime() - SPAN, end = dl.getTime() + TAIL;
    const pos = ts => Math.max(0, Math.min(100, (ts - start) / (end - start) * 100));
    const fmtD = ts => { const d = new Date(ts); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`; };

    const pts = [];
    if (reg && reg.getTime() > now) pts.push({ t: reg.getTime(), cls: 'reg' });
    if (dl.getTime() > now) pts.push({ t: dl.getTime(), cls: 'sub' });
    pts.sort((a, b) => a.t - b.t);
    let cursor = now, segs = '';
    for (const p of pts) {
      if (p.t > cursor) segs += `<div class="seg ${p.cls}" style="left:${pos(cursor)}%;width:${pos(p.t) - pos(cursor)}%"></div>`;
      cursor = p.t;
    }
    return `<div class="tl"><div class="track">
        <div class="fill" style="width:${pos(now)}%"></div>${segs}
        ${reg ? `<span class="mk reg" style="left:${pos(reg.getTime())}%"></span>` : ''}
        <span class="mk sub" style="left:${pos(dl.getTime())}%"></span>
        <span class="now" style="left:${pos(now)}%"></span>
      </div><div class="lbls"><span>${fmtD(start)}</span><span>${fmtD(dl.getTime())}</span></div></div>`;
  }

  // ── card ──
  function cardHTML(c) {
    const shade = themeShade(c);
    const tcolor = THEME_COLOR[THEME_OF[c.sub]];
    const reg = parseDL(c, 'abstract_deadline');
    const dl = parseDL(c, 'deadline');
    const now = Date.now();
    const past = dl && dl.getTime() < now;
    const tbd = !dl;

    // countdowns: show a separate one for registration and for submission when both are upcoming
    const cdBlock = (lbl, target, kind) => {
      const far = (target.getTime() - now) / 86400000 >= 30;
      return `<div class="cd-block"><span class="cd-lbl">${lbl}</span><span class="cd ${kind}${far ? ' far' : ''}" data-dl="${target.getTime()}">${fmtCountdown(target.getTime() - now)}</span></div>`;
    };
    let cdHTML;
    if (tbd) cdHTML = `<div class="cd-block"><span class="cd tbd">${t().tbdText}</span></div>`;
    else if (past) cdHTML = `<div class="cd-block"><span class="cd over">${t().overText}</span></div>`;
    else {
      const blocks = [];
      if (reg && reg.getTime() > now) blocks.push(cdBlock(t().cdReg, reg, 'reg'));
      blocks.push(cdBlock(t().cdSub, dl, 'sub'));
      cdHTML = blocks.join('');
    }

    // metrics: CCF (zh only) · CORE · h5 · track
    const rankTxt = c.rank === '非CCF' ? t().nonCCF : c.rank;
    const metrics = [
      lang === 'zh' ? esc(rankTxt) : '',
      (c.core && c.core !== 'N') ? `CORE ${esc(c.core)}` : '',
      c.h5 ? `h5 ${esc(c.h5)}` : '',
    ].filter(Boolean).join('<span class="sep">·</span>');
    const trk = c.track ? `<span class="sep">·</span><span class="trk">${esc(c.track)}</span>` : '';

    // both deadline lines, always written out
    const dlRows = [];
    if (reg) {
      const done = reg.getTime() < now;
      dlRows.push(`<div class="dl-row reg${done ? ' done' : ''}"><span class="dot"></span><span class="k">${t().regK}</span><span class="v">${esc(c.abstract_deadline)} ${esc(c.tz_label || '')}</span>${!done ? calBtns(c, 'registration', reg) : ''}</div>`);
    }
    if (dl) {
      dlRows.push(`<div class="dl-row sub${past ? ' done' : ''}"><span class="dot"></span><span class="k">${t().subK}</span><span class="v">${esc(c.deadline)} ${esc(c.tz_label || '')}</span>${!past ? calBtns(c, 'submission', dl) : ''}</div>`);
    }

    const place = field(c, 'place') || c.place;
    const placeHTML = (!place || /TBD/i.test(place)) ? esc(place)
      : `<a class="place" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}" target="_blank" rel="noopener">${esc(place)}</a>`;
    const note = field(c, 'note');

    return `<div class="evt${past ? ' past' : ''}">
      <div class="evt-left">
        <div class="evt-theme"><span class="dot" style="background:${shade}"></span>${esc((t().subs[c.sub] || c.sub).split(' ')[0])}</div>
        ${cdHTML}
      </div>
      <div class="evt-right">
        <div class="evt-name">
          ${icon(c.sub, shade)}
          <a class="nm" href="${esc(c.link)}" target="_blank" rel="noopener">${esc(c.title)} <span class="yr">${esc(c.year)}</span></a>
          ${c.estimated ? `<span class="est">${t().est}</span>` : ''}
        </div>
        <div class="evt-full">${esc(c.full_name)}</div>
        <div class="evt-metrics">${metrics}${trk}</div>
        ${!tbd && !past ? timelineHTML(reg, dl) : ''}
        ${dlRows.length ? `<div class="dls">${dlRows.join('')}</div>` : ''}
        <div class="evt-meta"><span class="k">${t().dateLbl}</span>${esc(c.date)}<span class="sep">·</span><span class="k">${t().placeLbl}</span>${placeHTML}</div>
        ${note ? `<div class="evt-note">${esc(note)}</div>` : ''}
      </div>
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
    // sort upcoming by the nearest actionable deadline (registration if still open, else submission)
    const nextOf = c => {
      const reg = parseDL(c, 'abstract_deadline'), dl = parseDL(c, 'deadline');
      return (reg && reg.getTime() > now ? reg : dl).getTime();
    };
    upcoming.sort((a, b) => nextOf(a) - nextOf(b));
    past.sort((a, b) => parseDL(b, 'deadline') - parseDL(a, 'deadline'));

    let html = '';
    if (upcoming.length) html += `<div class="group-head">${t().upcoming} <span class="cnt">${upcoming.length}</span></div>${upcoming.map(cardHTML).join('')}`;
    if (tbd.length) html += `<div class="group-head">${t().tba} <span class="cnt">${tbd.length}</span></div>${tbd.map(cardHTML).join('')}`;
    if (past.length) html += `<div class="group-head">${t().passed} <span class="cnt">${past.length}</span></div>${past.map(cardHTML).join('')}`;
    if (!rows.length) html = `<div class="empty">${t().empty}</div>`;
    els.list.innerHTML = html;

    const allUp = confs.filter(c => { const d = parseDL(c, 'deadline'); return d && d.getTime() > now; }).sort((a, b) => nextOf(a) - nextOf(b));
    const next = allUp[0];
    const nextDays = next ? Math.ceil((nextOf(next) - now) / 86400000) : null;
    els.stats.innerHTML = `
      <div class="stat"><div class="n">${confs.length}</div><div class="l">${t().statConfs}</div></div>
      <div class="stat"><div class="n">${allUp.length}</div><div class="l">${t().statLive}</div></div>
      <div class="stat"><div class="n sm">${next ? esc(next.title) : '—'}</div><div class="l">${t().statNext}${next ? ` · ${nextDays}${lang === 'en' ? 'd' : ' 天'}` : ''}</div></div>`;
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
    langExplicit = true;
    saveState(); renderChrome(); renderFilters(); render();
  });
  detectLangByIP();

  fetch('data/conferences.yml', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then(text => { confs = jsyaml.load(text) || []; render(); setInterval(tick, 1000); })
    .catch(err => { els.list.innerHTML = `<div class="empty">Failed to load data: ${esc(err.message)}</div>`; });
})();
