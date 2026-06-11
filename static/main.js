/* BCI Conference Deadlines — main.js */
(function () {
  'use strict';

  // ── i18n ─────────────────────────────────────────────────
  const I18N = {
    zh: {
      heroTitle: 'BCI 会议截稿日历',
      heroSub: '面向 BCI / EEG / 脑信号研究者的会议截稿倒计时。覆盖机器学习、数据挖掘、神经计算、视觉多媒体、情感计算、信号处理、医工影像与神经工程八个方向。',
      statConfs: n => `${n} 个会议`,
      statLive: n => `${n} 个截稿倒计时中`,
      statSubs: '8 个学科方向',
      all: '全部',
      searchPh: '搜索会议名称 / 地点 / 关键词 …',
      upcoming: '即将截稿',
      tba: '截稿待公布',
      passed: '已截稿',
      tbdText: '截稿待公布',
      overText: '已截稿',
      day: ' 天 ',
      deadlineLbl: '截稿',
      absLbl: '摘要',
      dateLbl: '会期',
      placeLbl: '地点',
      bciLbl: 'BCI 相关',
      est: '预估',
      friendly: '★ 硕士友好',
      nonCCF: '非CCF',
      empty: '没有匹配的会议',
      footer: `数据人工核对于 2026-06-11 · 标注「预估」的截稿日为按往年规律推测,以官网 Call for Papers 为准<br>
        分类参考 <a href="https://hci-deadlines.github.io/" target="_blank" rel="noopener">hci-deadlines</a> 与 <a href="https://ccfddl.com/" target="_blank" rel="noopener">ccfddl</a> 的组织方式 ·
        数据文件: <a href="https://github.com/LarryYiGuo/BCI_Conference_Deadlines/blob/main/data/conferences.yml" target="_blank" rel="noopener">data/conferences.yml</a> · 欢迎 PR 修正`,
      subs: {
        ML: 'ML · 机器学习', DM: 'DM · 数据挖掘·检索', NC: 'NC · 神经计算',
        CV: 'CV · 视觉·多媒体', AC: 'AC · 情感计算', SP: 'SP · 信号处理',
        BME: 'BME · 医工·影像', BCI: 'BCI · 神经工程',
      },
      langBtn: 'EN',
    },
    en: {
      heroTitle: 'BCI Conference Deadlines',
      heroSub: 'Countdowns to paper deadlines for BCI / EEG / brain-signal researchers — across eight areas from machine learning and signal processing to neural engineering.',
      statConfs: n => `${n} conferences`,
      statLive: n => `${n} counting down`,
      statSubs: '8 research areas',
      all: 'All',
      searchPh: 'Search conference / place / keyword …',
      upcoming: 'Upcoming deadlines',
      tba: 'To be announced',
      passed: 'Passed',
      tbdText: 'TBA',
      overText: 'Passed',
      day: 'd ',
      deadlineLbl: 'Deadline',
      absLbl: 'Abstract',
      dateLbl: 'When',
      placeLbl: 'Where',
      bciLbl: 'BCI relevance',
      est: 'Est.',
      friendly: '★ MS-friendly',
      nonCCF: 'Non-CCF',
      empty: 'No matching conferences',
      footer: `Dates manually verified on 2026-06-11 · deadlines marked “Est.” are projected from past cycles — always confirm with the official CFP<br>
        Organization inspired by <a href="https://hci-deadlines.github.io/" target="_blank" rel="noopener">hci-deadlines</a> and <a href="https://ccfddl.com/" target="_blank" rel="noopener">ccfddl</a> ·
        Data: <a href="https://github.com/LarryYiGuo/BCI_Conference_Deadlines/blob/main/data/conferences.yml" target="_blank" rel="noopener">data/conferences.yml</a> · PRs welcome`,
      subs: {
        ML: 'ML · Machine Learning', DM: 'DM · Data Mining & IR', NC: 'NC · Neural Computation',
        CV: 'CV · Vision & Multimedia', AC: 'AC · Affective Computing', SP: 'SP · Signal Processing',
        BME: 'BME · BioMed Engineering', BCI: 'BCI · Neural Engineering',
      },
      langBtn: '中文',
    },
  };

  const SUB_COLORS = {
    ML: 'var(--orange)', DM: 'var(--blue)', NC: 'var(--purple)', CV: 'var(--green)',
    AC: 'var(--pink)', SP: 'var(--teal)', BME: 'var(--gold)', BCI: 'var(--red)',
  };

  const els = {
    list: document.getElementById('list'),
    filters: document.getElementById('filters'),
    stats: document.getElementById('stats'),
    search: document.getElementById('search'),
    heroTitle: document.getElementById('heroTitle'),
    heroSub: document.getElementById('heroSub'),
    footer: document.getElementById('footer'),
    langBtn: document.getElementById('langBtn'),
  };

  let confs = [];
  let active = new Set();   // empty = all
  let query = '';
  let lang = 'zh';

  const t = () => I18N[lang];

  // ── helpers ──────────────────────────────────────────────
  function parseDeadline(c, field) {
    const v = c[field];
    if (!v || v === 'TBD') return null;
    const iso = v.replace(' ', 'T') + ':00' + (c.tz || '-12:00');
    const d = new Date(iso);
    return isNaN(d) ? null : d;
  }

  // Always show ticking seconds so it's visibly alive: "327 天 04:12:55" / "327d 04:12:55"
  function fmtCountdown(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400);
    const h = String(Math.floor((s % 86400) / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return d > 0 ? `${d}${t().day}${h}:${m}:${sec}` : `${h}:${m}:${sec}`;
  }

  function rankClass(rank) {
    if (/CCF-A/.test(rank)) return 'rank-a';
    if (/CCF-B/.test(rank)) return 'rank-b';
    if (/CCF-C/.test(rank)) return 'rank-c';
    return '';
  }

  function rankLabel(rank) {
    return rank === '非CCF' ? t().nonCCF : rank;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g,
      ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }

  function field(c, name) {
    return (lang === 'en' && c[name + '_en']) ? c[name + '_en'] : c[name];
  }

  // ── state from URL / localStorage ────────────────────────
  function loadState() {
    const params = new URLSearchParams(location.search);
    const p = params.get('sub');
    const stored = localStorage.getItem('bci-ddl-subs');
    const src = p != null ? p : stored;
    if (src) {
      src.split(',').map(s => s.trim().toUpperCase())
        .filter(s => SUB_COLORS[s]).forEach(s => active.add(s));
    }
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

  // ── chrome (texts outside the list) ──────────────────────
  function renderChrome() {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    els.heroTitle.textContent = t().heroTitle;
    els.heroSub.textContent = t().heroSub;
    els.search.placeholder = t().searchPh;
    els.footer.innerHTML = t().footer;
    els.langBtn.textContent = t().langBtn;
  }

  function renderFilters() {
    els.filters.innerHTML = '';
    const all = document.createElement('button');
    all.className = 'fbtn' + (active.size === 0 ? ' on' : '');
    all.textContent = t().all;
    all.onclick = () => { active.clear(); saveState(); renderFilters(); render(); };
    els.filters.appendChild(all);

    for (const key of Object.keys(SUB_COLORS)) {
      const b = document.createElement('button');
      b.className = 'fbtn' + (active.has(key) ? ' on' : '');
      b.style.setProperty('--c', SUB_COLORS[key]);
      b.innerHTML = `<i></i>${esc(t().subs[key])}`;
      b.onclick = () => {
        active.has(key) ? active.delete(key) : active.add(key);
        saveState(); renderFilters(); render();
      };
      els.filters.appendChild(b);
    }
  }

  // ── card ─────────────────────────────────────────────────
  function placeHTML(c) {
    const p = field(c, 'place') || c.place;
    if (!p || /TBD/i.test(p)) return esc(p);
    const q = encodeURIComponent(p);
    return `<a class="place" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">${esc(p)}</a>`;
  }

  function cardHTML(c) {
    const color = SUB_COLORS[c.sub] || 'var(--text-muted)';
    const dl = parseDeadline(c, 'deadline');
    const abs = parseDeadline(c, 'abstract_deadline');
    const now = Date.now();
    const past = dl && dl.getTime() < now;
    const tbd = !dl;

    let cdHTML, dlHTML = '';
    if (tbd) {
      cdHTML = `<span class="cd tbd">${t().tbdText}</span>`;
    } else if (past) {
      cdHTML = `<span class="cd over">${t().overText}</span>`;
      dlHTML = `<span class="dl"><span class="lbl">${t().deadlineLbl}</span> ${esc(c.deadline)} ${esc(c.tz_label || '')}</span>`;
    } else {
      const days = (dl.getTime() - now) / 86400000;
      const cls = days < 7 ? 'urgent' : days < 30 ? 'soon' : '';
      cdHTML = `<span class="cd ${cls}" data-dl="${dl.getTime()}">${fmtCountdown(dl.getTime() - now)}</span>`;
      dlHTML = `<span class="dl"><span class="lbl">${t().deadlineLbl}</span> ${esc(c.deadline)} ${esc(c.tz_label || '')}</span>`;
    }

    const absHTML = (abs && abs.getTime() > now)
      ? `<span class="abs"><span class="lbl">${t().absLbl}</span> ${esc(c.abstract_deadline)} ${esc(c.tz_label || '')}</span>` : '';

    const badges = [
      `<span class="badge ${rankClass(c.rank)}">${esc(rankLabel(c.rank))}</span>`,
      `<span class="badge sub" style="--sc:${color}">${esc(c.sub)}</span>`,
      c.estimated ? `<span class="badge est">${t().est}</span>` : '',
      c.friendly ? `<span class="badge friendly">${t().friendly}</span>` : '',
    ].join('');

    const bci = field(c, 'bci');
    const note = field(c, 'note');

    return `<div class="card${past ? ' past' : ''}" style="--sc:${color}">
      <div class="top">
        <div class="main">
          <div class="head">
            <a class="name" href="${esc(c.link)}" target="_blank" rel="noopener">${esc(c.title)} <span class="yr">${esc(c.year)}</span></a>
            ${badges}
          </div>
          <div class="full">${esc(c.full_name)}</div>
          <div class="meta">
            <span class="mi"><span class="lbl">${t().dateLbl}</span> ${esc(c.date)}</span>
            <span class="mi"><span class="lbl">${t().placeLbl}</span> ${placeHTML(c)}</span>
          </div>
        </div>
        <div class="dlpanel">
          ${cdHTML}
          ${dlHTML}
          ${absHTML}
        </div>
      </div>
      ${bci ? `<div class="extra"><div class="tagline">${t().bciLbl}</div>${esc(bci)}${note ? `<div class="note">${esc(note)}</div>` : ''}</div>`
            : (note ? `<div class="extra"><div class="note" style="margin-top:0">${esc(note)}</div></div>` : '')}
    </div>`;
  }

  // ── render list ──────────────────────────────────────────
  function visible() {
    const q = query.toLowerCase();
    return confs.filter(c => {
      if (active.size && !active.has(c.sub)) return false;
      if (!q) return true;
      return [c.title, c.full_name, c.place, c.bci, c.bci_en, c.note, c.note_en, c.sub, c.rank]
        .join(' ').toLowerCase().includes(q);
    });
  }

  function render() {
    const now = Date.now();
    const rows = visible();

    const upcoming = [], tbd = [], past = [];
    for (const c of rows) {
      const dl = parseDeadline(c, 'deadline');
      if (!dl) tbd.push(c);
      else if (dl.getTime() < now) past.push(c);
      else upcoming.push(c);
    }
    upcoming.sort((a, b) => parseDeadline(a, 'deadline') - parseDeadline(b, 'deadline'));
    past.sort((a, b) => parseDeadline(b, 'deadline') - parseDeadline(a, 'deadline'));

    let html = '';
    if (upcoming.length) html += `<div class="group-label">${t().upcoming} · ${upcoming.length}</div><div class="cards">${upcoming.map(cardHTML).join('')}</div>`;
    if (tbd.length) html += `<div class="group-label">${t().tba} · ${tbd.length}</div><div class="cards">${tbd.map(cardHTML).join('')}</div>`;
    if (past.length) html += `<div class="group-label">${t().passed} · ${past.length}</div><div class="cards">${past.map(cardHTML).join('')}</div>`;
    if (!rows.length) html = `<div class="empty">${t().empty}</div>`;
    els.list.innerHTML = html;

    const live = confs.filter(c => { const d = parseDeadline(c, 'deadline'); return d && d.getTime() > now; }).length;
    els.stats.innerHTML = `
      <span class="chip"><i></i>${t().statConfs(confs.length)}</span>
      <span class="chip"><i style="background:var(--orange);box-shadow:0 0 4px rgba(216,90,48,.5)"></i>${t().statLive(live)}</span>
      <span class="chip"><i style="background:var(--purple);box-shadow:0 0 4px rgba(83,74,183,.5)"></i>${t().statSubs}</span>`;
  }

  // ── live countdown tick (every second) ───────────────────
  function tick() {
    const now = Date.now();
    let expired = false;
    document.querySelectorAll('.cd[data-dl]').forEach(el => {
      const ms = +el.dataset.dl - now;
      if (ms <= 0) { expired = true; return; }
      el.textContent = fmtCountdown(ms);
      const days = ms / 86400000;
      el.classList.toggle('urgent', days < 7);
      el.classList.toggle('soon', days >= 7 && days < 30);
    });
    if (expired) render();
  }

  // ── boot ─────────────────────────────────────────────────
  loadState();
  renderChrome();
  renderFilters();

  els.search.addEventListener('input', () => { query = els.search.value.trim(); render(); });
  els.langBtn.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    saveState(); renderChrome(); renderFilters(); render();
  });

  fetch('data/conferences.yml')
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(text => {
      confs = jsyaml.load(text) || [];
      render();
      setInterval(tick, 1000);
    })
    .catch(err => {
      els.list.innerHTML = `<div class="empty">Failed to load data: ${esc(err.message)}<br>Serve over HTTP (e.g. python3 -m http.server)</div>`;
    });
})();
