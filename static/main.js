/* BCI Conference Deadlines — main.js */
(function () {
  'use strict';

  // 分类定义:学科方向(替代原 Tier 影响力分级)
  const SUBS = {
    ML:  { label: 'ML · 机器学习',        color: 'var(--orange)' },
    DM:  { label: 'DM · 数据挖掘·检索',   color: 'var(--blue)' },
    NC:  { label: 'NC · 神经计算',        color: 'var(--purple)' },
    CV:  { label: 'CV · 视觉·多媒体',     color: 'var(--green)' },
    AC:  { label: 'AC · 情感计算',        color: 'var(--pink)' },
    SP:  { label: 'SP · 信号处理',        color: 'var(--teal)' },
    BME: { label: 'BME · 医工·影像',      color: 'var(--gold)' },
    BCI: { label: 'BCI · 神经工程',       color: 'var(--red)' },
  };

  const listEl = document.getElementById('list');
  const filtersEl = document.getElementById('filters');
  const statsEl = document.getElementById('stats');
  const searchEl = document.getElementById('search');

  let confs = [];
  let active = new Set();   // empty = all
  let query = '';
  let timer = null;

  // ── helpers ──────────────────────────────────────────────
  function parseDeadline(c, field) {
    const v = c[field];
    if (!v || v === 'TBD') return null;
    const iso = v.replace(' ', 'T') + ':00' + (c.tz || '-12:00');
    const d = new Date(iso);
    return isNaN(d) ? null : d;
  }

  function fmtCountdown(ms) {
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (d > 0) return `${d} 天 ${h} 时 ${m} 分`;
    return `${h} 时 ${m} 分 ${String(sec).padStart(2, '0')} 秒`;
  }

  function rankClass(rank) {
    if (/CCF-A/.test(rank)) return 'rank-a';
    if (/CCF-B/.test(rank)) return 'rank-b';
    if (/CCF-C/.test(rank)) return 'rank-c';
    return '';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g,
      ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }

  // ── filters from URL / localStorage ──────────────────────
  function loadState() {
    const p = new URLSearchParams(location.search).get('sub');
    const stored = localStorage.getItem('bci-ddl-subs');
    const src = p != null ? p : stored;
    if (src) {
      src.split(',').map(s => s.trim().toUpperCase())
        .filter(s => SUBS[s]).forEach(s => active.add(s));
    }
  }

  function saveState() {
    const v = [...active].join(',');
    localStorage.setItem('bci-ddl-subs', v);
    const url = new URL(location);
    if (v) url.searchParams.set('sub', v); else url.searchParams.delete('sub');
    history.replaceState(null, '', url);
  }

  // ── render filter chips ───────────────────────────────────
  function renderFilters() {
    filtersEl.innerHTML = '';
    const all = document.createElement('button');
    all.className = 'fbtn' + (active.size === 0 ? ' on' : '');
    all.textContent = '全部';
    all.onclick = () => { active.clear(); saveState(); renderFilters(); render(); };
    filtersEl.appendChild(all);

    for (const [key, s] of Object.entries(SUBS)) {
      const b = document.createElement('button');
      b.className = 'fbtn' + (active.has(key) ? ' on' : '');
      b.style.setProperty('--c', s.color);
      b.innerHTML = `<i></i>${esc(s.label)}`;
      b.onclick = () => {
        active.has(key) ? active.delete(key) : active.add(key);
        saveState(); renderFilters(); render();
      };
      filtersEl.appendChild(b);
    }
  }

  // ── card ─────────────────────────────────────────────────
  function cardHTML(c) {
    const sub = SUBS[c.sub] || { label: c.sub, color: 'var(--text-muted)' };
    const dl = parseDeadline(c, 'deadline');
    const abs = parseDeadline(c, 'abstract_deadline');
    const now = Date.now();
    const past = dl && dl.getTime() < now;
    const tbd = !dl;

    let cdHTML, dlHTML = '';
    if (tbd) {
      cdHTML = `<span class="cd tbd">截稿待公布</span>`;
    } else if (past) {
      cdHTML = `<span class="cd over">已截稿</span>`;
      dlHTML = `<span class="dl">${esc(c.deadline)} ${esc(c.tz_label || '')}</span>`;
    } else {
      const ms = dl.getTime() - now;
      const days = ms / 86400000;
      const cls = days < 7 ? 'urgent' : days < 30 ? 'soon' : '';
      cdHTML = `<span class="cd ${cls}" data-dl="${dl.getTime()}">${fmtCountdown(ms)}</span>`;
      dlHTML = `<span class="dl">${esc(c.deadline)} ${esc(c.tz_label || '')}</span>`;
    }

    const absHTML = (abs && abs.getTime() > now)
      ? `<div class="abs">摘要/注册截稿 ${esc(c.abstract_deadline)} ${esc(c.tz_label || '')}</div>` : '';

    const badges = [
      `<span class="badge ${rankClass(c.rank)}">${esc(c.rank)}</span>`,
      `<span class="badge sub" style="--sc:${sub.color}">${esc(c.sub)}</span>`,
      c.estimated ? `<span class="badge est">预估</span>` : '',
      c.friendly ? `<span class="badge friendly">★ 硕士友好</span>` : '',
    ].join('');

    return `<div class="card${past ? ' past' : ''}" style="--sc:${sub.color}">
      <div class="head">
        <a class="name" href="${esc(c.link)}" target="_blank" rel="noopener">${esc(c.title)} <span class="yr">${esc(c.year)}</span></a>
        ${badges}
      </div>
      <div class="full">${esc(c.full_name)}</div>
      <div class="when">${cdHTML}${dlHTML}</div>
      ${absHTML}
      <div class="meta">📅 ${esc(c.date)} · 📍 ${esc(c.place)}</div>
      ${c.bci ? `<div class="bci"><b>BCI 相关 ·</b> ${esc(c.bci)}</div>` : ''}
      ${c.note ? `<div class="note">${esc(c.note)}</div>` : ''}
    </div>`;
  }

  // ── render list ──────────────────────────────────────────
  function visible() {
    const q = query.toLowerCase();
    return confs.filter(c => {
      if (active.size && !active.has(c.sub)) return false;
      if (!q) return true;
      return [c.title, c.full_name, c.place, c.bci, c.note, c.sub, c.rank]
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
    if (upcoming.length) html += `<div class="group-label">即将截稿 · ${upcoming.length}</div><div class="cards">${upcoming.map(cardHTML).join('')}</div>`;
    if (tbd.length) html += `<div class="group-label">截稿待公布 · ${tbd.length}</div><div class="cards">${tbd.map(cardHTML).join('')}</div>`;
    if (past.length) html += `<div class="group-label">已截稿 · ${past.length}</div><div class="cards">${past.map(cardHTML).join('')}</div>`;
    if (!rows.length) html = `<div class="empty">没有匹配的会议</div>`;
    listEl.innerHTML = html;

    statsEl.innerHTML = `
      <span class="chip"><i></i>${confs.length} 个会议</span>
      <span class="chip"><i style="background:var(--orange);box-shadow:0 0 4px rgba(216,90,48,.5)"></i>${confs.filter(c => { const d = parseDeadline(c, 'deadline'); return d && d.getTime() > now; }).length} 个截稿倒计时中</span>
      <span class="chip"><i style="background:var(--purple);box-shadow:0 0 4px rgba(83,74,183,.5)"></i>8 个学科方向</span>`;
  }

  // ── live countdown tick ──────────────────────────────────
  function tick() {
    const now = Date.now();
    let needRerender = false;
    document.querySelectorAll('.cd[data-dl]').forEach(el => {
      const ms = +el.dataset.dl - now;
      if (ms <= 0) { needRerender = true; return; }
      el.textContent = fmtCountdown(ms);
    });
    if (needRerender) render();
  }

  // ── boot ─────────────────────────────────────────────────
  loadState();
  renderFilters();

  searchEl.addEventListener('input', () => { query = searchEl.value.trim(); render(); });

  fetch('data/conferences.yml')
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(text => {
      confs = jsyaml.load(text) || [];
      render();
      timer = setInterval(tick, 1000);
    })
    .catch(err => {
      listEl.innerHTML = `<div class="empty">数据加载失败:${esc(err.message)}<br>请确认通过 HTTP 访问(本地可运行 python3 -m http.server)</div>`;
    });
})();
