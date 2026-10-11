/* BCI Deadlines — 首页:九宫格 + 全站搜索 */
(function () {
  'use strict';

  // ── 图标(24×24,白描在分区色方块上) ──
  const ICON = {
    cal: '<path fill-rule="evenodd" d="M7 2h2.2v2H15V2h2.2v2h1.3A2.5 2.5 0 0121 6.5v13a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5v-13A2.5 2.5 0 015.5 4H7V2zM5.2 9.4v10.1c0 .2.1.3.3.3h13c.2 0 .3-.1.3-.3V9.4H5.2zm2.3 1.9h2.2v2.2H7.5v-2.2zm4.4 0h2.2v2.2h-2.2v-2.2zm4.4 0h2.2v2.2h-2.2v-2.2zM7.5 15.7h2.2v2.2H7.5v-2.2zm4.4 0h2.2v2.2h-2.2v-2.2z"/>',
    book: '<path fill-rule="evenodd" d="M2.5 3.5h6.3A3.2 3.2 0 0112 6.7v14.1a3.2 3.2 0 00-3.2-3.2H2.5V3.5zm19 0h-6.3A3.2 3.2 0 0012 6.7v14.1a3.2 3.2 0 013.2-3.2h6.3V3.5z"/>',
    db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6c0 1.7-3.6 3-8 3S4 7.7 4 6z"/>',
    brain: '<path d="M9.5 3A3.5 3.5 0 006 6.5c-1.8.4-3 2-3 3.9 0 1.2.5 2.3 1.4 3A4 4 0 008 20.5h1.2A2.8 2.8 0 0012 17.7V5.8A2.8 2.8 0 009.5 3zm5 0A2.8 2.8 0 0012 5.8v11.9a2.8 2.8 0 002.8 2.8H16a4 4 0 003.6-7.1c.9-.7 1.4-1.8 1.4-3 0-1.9-1.2-3.5-3-3.9A3.5 3.5 0 0014.5 3z"/>',
    wrench: '<path d="M17.6 2a5.4 5.4 0 00-5 7.5L2.8 19.3l1.9 1.9 9.8-9.8A5.4 5.4 0 0021.4 4l-3 3-2.4-2.4 3-3A5.4 5.4 0 0017.6 2z"/>',
    wave: '<path d="M3 10h2v4H3zM7 6h2v12H7zM11 2h2v20h-2zM15 6h2v12h-2zM19 10h2v4h-2z"/>',
    flow: '<path d="M3 3h7v7H3zM14 14h7v7h-7zM10 5.5h5a3 3 0 013 3V14h-2V8.5a1 1 0 00-1-1h-5z"/>',
  };

  // ── 九宫格:一项一格,三列;第三行留给以后。kw 是额外的搜索词 ──
  const TILES = [
    { key: 'conf', href: 'deadlines.html', c: '#D85A30', ic: ICON.cal,
      zh: ['会议截稿', '报名与截稿倒计时 · 一键加日历'], en: ['Conferences', 'Registration & submission countdowns · add to calendar'],
      kw: 'conference deadline ddl ccf core 会议 截稿 投稿 倒计时' },
    { key: 'journal', href: 'deadlines.html?mode=journal', c: '#2563EB', ic: ICON.book,
      zh: ['期刊', '滚动投稿 · 影响因子与分区'], en: ['Journals', 'Rolling submission · impact factor & quartile'],
      kw: 'journal impact factor jcr if 期刊 影响因子 分区' },
    { key: 'dataset', href: 'deadlines.html?mode=dataset', c: '#0F766E', ic: ICON.db,
      zh: ['数据集', '公开脑电数据集 · 按范式筛选'], en: ['Datasets', 'Public EEG datasets, filtered by paradigm'],
      kw: 'dataset data 数据集 公开 范式 paradigm' },
    { key: 'atlas', href: 'atlas.html', c: '#7C3AED', ic: ICON.brain,
      zh: ['EEG 波形', '节律、任务信号与电极脑区对照'], en: ['EEG Atlas', 'Rhythms & task signals ↔ electrodes & regions'],
      kw: 'atlas alpha beta theta delta gamma 节律 波形 电极 脑区 10-20 10-10' },
    { key: 'env', href: 'BCI_Basic_Development_Environment_Setup/', enQ: '?lang=en', c: '#0E7490', ic: ICON.wrench,
      zh: ['入门环境', '三平台每周实测的安装清单'], en: ['Starter env', 'Setup verified weekly on three platforms'],
      kw: 'environment setup install conda mne pytorch braindecode moabb 环境 安装 配置' },
    { key: 'sim', href: 'EEG_Artifact_Simulator/', c: '#DB2777', ic: ICON.wave,
      zh: ['伪迹模拟器', '实时合成 12 种伪迹 · 怎么认、怎么去掉'], en: ['Artifact simulator', '12 EEG artifacts, live · spot & remove them (中文)'], beta: true,
      kw: 'artifact simulator 伪迹 眨眼 眼动 肌电 心电 工频 ica 滤波 blink emg' },
    { key: 'pipe', href: 'EEG_Processing_Pipeline/', enQ: '?lang=en', c: '#B45309', ic: ICON.flow,
      zh: ['处理管线', '滤波、ICA、xDAWN、LDA · 交叉验证与泄漏检验'], en: ['EEG pipeline', 'Filtering, ICA, xDAWN, LDA · cross-validation & leakage checks'],
      kw: 'pipeline 管线 处理 p300 erp pca ica xdawn lda 分类 classification 交叉验证 cross-validation 消融 ablation 收缩 shrinkage 泄漏 leakage mne pyriemann blink 眨眼 eog 去伪迹 artifact removal' },
  ];
  const TILE_OF = Object.fromEntries(TILES.map(t => [t.key, t]));

  const T = {
    zh: {
      h1: '脑机接口<br>研究<em>工具箱</em>', ph: '搜会议、期刊、数据集或工具', clr: '清空', langBtn: 'EN',
      group: { conf: '会议', journal: '期刊', dataset: '数据集' },
      all: n => `在列表里看全部 ${n} 条 →`,
      empty: q => `没找到「${q}」,换个关键词试试`, loading: '数据还在加载…',
      open: '打开 →',
      k: { conf: n => `${n} 场即将截稿 →`, journal: n => `收录 ${n} 本 →`, dataset: n => `收录 ${n} 个 →`,
           atlas: () => '交互图谱 →', env: d => d ? `三平台验证 ${d} →` : '三平台每周验证 →', sim: () => '中文 · 分 4 页 →', pipe: () => '中英对照 · 可交互 →' },
      due: d => `截稿 ${d}`, tba: '待公布', closed: '已截止',
      foot: '会议截稿每周从 <a href="https://github.com/ccfddl/ccf-deadlines" target="_blank" rel="noopener">ccfddl</a> 自动同步 · 期刊影响因子为最新 JCR,投稿前请复核 · 数据集与模板链接每周做健康检查',
    },
    en: {
      h1: 'Brain-Computer Interface<br>Research <em>Toolbox</em>', ph: 'Search conferences, journals, datasets or tools', clr: 'Clear', langBtn: '中文',
      group: { conf: 'Conferences', journal: 'Journals', dataset: 'Datasets' },
      all: n => `See all ${n} in the list →`,
      empty: q => `Nothing for “${q}” — try another word`, loading: 'Still loading data…',
      open: 'Open →',
      k: { conf: n => `${n} upcoming →`, journal: n => `${n} journals →`, dataset: n => `${n} datasets →`,
           atlas: () => 'Interactive →', env: d => d ? `Verified ${d} →` : 'Verified weekly →', sim: () => 'Chinese · 4 tabs →', pipe: () => 'Bilingual · interactive →' },
      due: d => `due ${d}`, tba: 'TBA', closed: 'closed',
      foot: 'Conference deadlines sync weekly from <a href="https://github.com/ccfddl/ccf-deadlines" target="_blank" rel="noopener">ccfddl</a> · Journal impact factors are the latest JCR — check before submitting · Dataset and template links are health-checked weekly',
    },
  };

  const $ = id => document.getElementById(id);
  const els = { h1: $('h1'), q: $('q'), clr: $('clr'), results: $('results'), tiles: $('tiles'), fnote: $('fnote'), langBtn: $('langBtn') };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // ── 语言:和列表页共用同一个存储键与 IP 判定 ──
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 隐私模式 */ } },
  };
  const params = new URLSearchParams(location.search);
  let lang, langExplicit = false;
  const pl = params.get('lang') || store.get('bci-ddl-lang');
  if (pl === 'en' || pl === 'zh') { lang = pl; langExplicit = true; }
  else lang = (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  const t = () => T[lang];

  // ── 数据:三份 yml + 入门环境的验证日期;首页一打开就拉(合计约 140KB) ──
  const DATA = { conf: null, journal: null, dataset: null, envDate: null, ready: false };
  const yml = f => fetch(f, { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(x => (window.jsyaml ? jsyaml.load(x) : null) || [])
    .catch(() => null);

  // 截稿时间:和列表页同一套解析(未写时区按 AoE)
  function parseDL(c, field) {
    const v = c[field];
    if (!v || v === 'TBD') return null;
    const d = new Date(String(v).replace(' ', 'T') + ':00' + (c.tz || '-12:00'));
    return isNaN(d) ? null : d;
  }
  // 最近一个还能赶的节点:注册没截就看注册,否则看全文
  function nextDue(c, now) {
    const reg = parseDL(c, 'abstract_deadline'), dl = parseDL(c, 'deadline');
    if (!dl) return { state: 'tba' };
    if (dl.getTime() < now) return { state: 'closed', at: dl };
    const at = reg && reg.getTime() > now ? reg : dl;
    return { state: 'open', at, raw: at === reg ? c.abstract_deadline : c.deadline };
  }

  // ── 搜索:字段与列表页的筛选完全一致,这样「看全部」点过去数量对得上 ──
  const hay = {
    conf: c => [c.title, c.full_name, c.place, c.note, c.note_en, c.sub, c.rank, c.core],
    journal: j => [j.title, j.full_name, j.publisher, j.note, j.note_en, j.sub, j.cas, j.jcr],
    dataset: d => [d.name, d.paradigm, d.modality, d.cohort, d.note, d.note_en, (d.tags || []).join(' ')],
  };
  const match = (arr, q) => arr.join(' ').toLowerCase().includes(q);
  const tileHay = tl => [tl.zh[0], tl.zh[1], tl.en[0], tl.en[1], tl.kw].join(' ').toLowerCase();

  function listURL(mode, q) {
    const p = new URLSearchParams();
    if (mode !== 'conf') p.set('mode', mode);
    if (q) p.set('q', q);
    const s = p.toString();
    return 'deadlines.html' + (s ? '?' + s : '');
  }

  function hitsFor(q) {
    const now = Date.now(), out = {};
    if (DATA.conf) {
      const rank = d => d.state === 'open' ? 0 : d.state === 'tba' ? 1 : 2;
      out.conf = DATA.conf.filter(c => match(hay.conf(c), q))
        .map(c => ({ c, d: nextDue(c, now) }))
        .sort((a, b) => rank(a.d) - rank(b.d) || (a.d.at && b.d.at ? (a.d.state === 'closed' ? b.d.at - a.d.at : a.d.at - b.d.at) : 0))
        .map(({ c, d }) => {
          let k, due = false;
          if (d.state === 'open') { k = t().due(String(d.raw).slice(5, 10)); due = d.at - now < 14 * 864e5; }
          else k = d.state === 'tba' ? t().tba : t().closed;
          return { nm: `${c.title} ${c.year || ''}`.trim(), sub: c.full_name, k, due, href: listURL('conf', c.title) };
        });
    }
    if (DATA.journal) {
      out.journal = DATA.journal.filter(j => match(hay.journal(j), q))
        .sort((a, b) => (b.impact_factor || 0) - (a.impact_factor || 0))
        .map(j => ({ nm: j.title, sub: j.full_name, k: [j.impact_factor ? 'IF ' + j.impact_factor : '', j.jcr].filter(Boolean).join(' · '), href: listURL('journal', j.title) }));
    }
    if (DATA.dataset) {
      out.dataset = DATA.dataset.filter(d => match(hay.dataset(d), q))
        .map(d => ({ nm: d.name, sub: [d.modality, d.note && lang === 'zh' ? d.note : d.note_en].filter(Boolean).join(' · '),
                     k: [d.paradigm, d.n ? 'n=' + d.n : ''].filter(Boolean).join(' · '), href: listURL('dataset', d.name) }));
    }
    return out;
  }

  let kbIdx = -1;
  function search() {
    const raw = els.q.value.trim(), q = raw.toLowerCase();
    els.clr.hidden = !raw;
    kbIdx = -1;
    if (!q) {
      els.results.hidden = true; els.results.innerHTML = '';
      els.tiles.classList.remove('searching');
      els.tiles.querySelectorAll('.tile').forEach(e => e.classList.remove('hit-on'));
      return;
    }
    const hits = hitsFor(q);
    const groups = ['conf', 'journal', 'dataset'].filter(k => hits[k] && hits[k].length);
    // 格子:名字、说明、关键词命中,或它名下的数据有命中,都亮起来
    els.tiles.classList.add('searching');
    els.tiles.querySelectorAll('.tile').forEach(e => {
      const tl = TILE_OF[e.dataset.key];
      e.classList.toggle('hit-on', tileHay(tl).includes(q) || groups.includes(tl.key));
    });
    const anyTile = !!els.tiles.querySelector('.tile.hit-on');
    let html = groups.map(k => {
      const list = hits[k], tl = TILE_OF[k];
      return `<div class="rg" style="--c:${tl.c}"><div class="rg-head"><span class="dot"></span>${t().group[k]} <span class="cnt">${list.length}</span>`
        + `<a class="all" href="${listURL(k, raw)}">${t().all(list.length)}</a></div>`
        + list.slice(0, 5).map(h => `<a class="hit" href="${h.href}"><span class="hit-nm">${esc(h.nm)}</span><span class="hit-sub">${esc(h.sub)}</span><span class="hit-k${h.due ? ' due' : ''}">${esc(h.k)}</span></a>`).join('')
        + '</div>';
    }).join('');
    if (!html && !DATA.ready) html = `<div class="empty">${t().loading}</div>`;
    else if (!html && !anyTile) html = `<div class="empty">${esc(t().empty(raw))}</div>`;
    els.results.innerHTML = html;
    els.results.hidden = !html;
  }

  // ── 渲染 ──
  function renderTiles() {
    const now = Date.now(), en = lang === 'en';
    const count = {
      conf: DATA.conf && DATA.conf.filter(c => { const d = parseDL(c, 'deadline'); return d && d.getTime() >= now; }).length,
      journal: DATA.journal && DATA.journal.length,
      dataset: DATA.dataset && DATA.dataset.length,
    };
    els.tiles.innerHTML = TILES.map((tl, i) => {
      const [nm, sub] = en ? tl.en : tl.zh;
      const kf = t().k[tl.key];
      const k = (tl.key in count) ? (count[tl.key] == null ? t().open : kf(count[tl.key]))
        : tl.key === 'env' ? kf(DATA.envDate) : kf();
      const href = tl.href + (en && tl.enQ ? tl.enQ : '');
      return `<a class="tile" href="${href}" data-key="${tl.key}" style="--c:${tl.c}">`
        + `<span class="tile-top"><span class="tile-ic"><svg viewBox="0 0 24 24" aria-hidden="true">${tl.ic}</svg></span><span class="tile-no">${String(i + 1).padStart(2, '0')}</span></span>`
        + `<span class="tile-nm">${esc(nm)}${tl.beta ? `<span class="tile-beta">${en ? 'Beta' : 'Beta · 测试中'}</span>` : ''}</span><span class="tile-sub">${esc(sub)}</span><span class="tile-k">${esc(k)}</span></a>`;
    }).join('');
  }
  function renderAll() {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    els.h1.innerHTML = t().h1;
    els.q.placeholder = t().ph;
    els.clr.textContent = t().clr;
    els.langBtn.textContent = t().langBtn;
    els.fnote.innerHTML = t().foot;
    renderTiles();
    search();
  }

  // ── 交互 ──
  let timer = 0;
  els.q.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(search, 110); });
  els.clr.addEventListener('click', e => { e.preventDefault(); els.q.value = ''; search(); els.q.focus(); });
  els.q.addEventListener('keydown', e => {
    const hits = [...els.results.querySelectorAll('a.hit')];
    if (e.key === 'Escape') {
      if (els.q.value) { els.q.value = ''; search(); } else els.q.blur();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!hits.length) return;
      e.preventDefault();
      kbIdx = (kbIdx + (e.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length;
      hits.forEach((h, i) => h.classList.toggle('kb', i === kbIdx));
      hits[kbIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      clearTimeout(timer); search();
      const go = hits[kbIdx] || els.results.querySelector('a.hit') || els.tiles.querySelector('.tile.hit-on');
      if (go) { e.preventDefault(); location.href = go.getAttribute('href'); }
    }
  });
  // 「/」或 ⌘K / Ctrl+K 聚焦搜索
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName);
    if ((e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault(); els.q.focus(); els.q.select();
    }
  });
  els.langBtn.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    langExplicit = true;
    store.set('bci-ddl-lang', lang);
    const url = new URL(location);
    if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
    history.replaceState(null, '', url);
    renderAll();
  });

  renderAll();

  if (!langExplicit) {
    fetch('https://api.country.is/', { signal: AbortSignal.timeout(4000) })
      .then(r => r.json())
      .then(d => { const want = d.country === 'CN' ? 'zh' : 'en'; if (!langExplicit && want !== lang) { lang = want; renderAll(); } })
      .catch(() => {});
  }

  Promise.all([
    yml('data/conferences.yml'), yml('data/journals.yml'), yml('data/datasets.yml'),
    fetch('BCI_Basic_Development_Environment_Setup/verified.json', { cache: 'no-cache' }).then(r => r.json()).catch(() => null),
  ]).then(([c, j, d, v]) => {
    DATA.conf = c; DATA.journal = j; DATA.dataset = d;
    const vd = v && v.verified && v.verified.date;
    DATA.envDate = vd ? String(vd).slice(5, 10) : null;
    DATA.ready = true;
    renderTiles();
    search();
  });
})();
