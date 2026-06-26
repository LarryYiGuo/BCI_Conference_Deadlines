# 🧠 BCI Conference Deadlines

**Live site:** https://larryyiguo.github.io/BCI_Conference_Deadlines/

A publishing & research tracker for **BCI / EEG / brain-signal** researchers. Three views,
switchable from the top nav — **Conferences · Journals · Datasets** — plus an optional
per-venue **recent-paper index**. Editorial style inspired by
[hci-deadlines](https://hci-deadlines.github.io/) and [ccfddl](https://ccfddl.com/).

## Conferences

- **Live countdowns** to every upcoming deadline, grouped into *Upcoming / TBA / Passed*
- **Registration and submission shown separately** — abstract/registration (blue) and
  full-paper submission (red) get their own countdowns and a per-conference **timeline**,
  so the two dates can't be misread as one; multi-round venues are labeled (*Round 1*, *Cycle 1*)
- **Add to calendar** — Google Calendar link and `.ics` download for every deadline
- **Paper template / author kit** — each venue carries a 📄 **format** link (LaTeX/Word
  template, author kit, or abstract guidelines)
- **Auto-updated** — dates sync weekly from the
  [ccfddl dataset](https://github.com/ccfddl/ccf-deadlines); venues outside it are watched on
  their official sites and flagged when a CFP changes. Closed deadlines move to *TBA*
- **Metrics** — CCF rank, CORE rank, and the Google Scholar h5-index

## Journals

- **53 BCI/EEG-relevant journals**, rolling submission (open year-round, no deadline)
- **Metrics** — JCR quartile, **impact factor**, CCF journal rank and CAS quartile
  (中科院分区), plus publisher and an open-access flag; sorted by impact factor

## Datasets

- **110 public BCI/EEG/MEG/fNIRS datasets**, grouped by era (*Wave 1/2/3*) and filtered by
  **paradigm** (MI / Vision / Emotion / Speech / Cognitive / Sleep / ERP-SSVEP / Clinical)
- Each card shows subject count (**N**), modality, cohort and tags; clinical and
  invasive/consumer-grade datasets are flagged

## Papers (toggle)

- A **📄 Papers** toggle in the nav (Conferences & Journals views) expands a *recent BCI/EEG
  papers* index under each venue card — **209 representative 2021-2026 papers across 57
  venues**, each linking to a Google Scholar search
- Curated from a top-venue paper list plus source-verified parallel search; **fully
  bilingual** (titles + one-line descriptions in EN/中文)

## Shared

- **EN / 中文** toggle, first-visit language auto-picked by IP (CN → 中文, else English)
- **China-specific ranks are Chinese-only** — CCF and CAS quartile show in Chinese mode
  only; English mode keeps international metrics (conferences: CORE + h5; journals: JCR + IF)
- Color themes shaded by rank/quartile; shareable filter URLs (`?sub=ML,CV&lang=en`)
- **Auto-maintenance** — a weekly GitHub Action syncs deadlines and health-checks the
  conference deadline links, format/template links and dataset source links, opening an
  issue when any breaks

## Data

Pure static site, no build step. All data is in [`data/`](data/):
[`conferences.yml`](data/conferences.yml), [`journals.yml`](data/journals.yml),
[`datasets.yml`](data/datasets.yml), [`papers.yml`](data/papers.yml). Edit the YAML and the
site updates. Conference dates marked *Est.* are projected from past cycles; journal IFs and
quartiles shift yearly — confirm before submitting.

```bash
# local preview
python3 -m http.server 8000   # open http://localhost:8000
```

## License

MIT

---

# 🧠 BCI 会议截稿日历

**在线访问:** https://larryyiguo.github.io/BCI_Conference_Deadlines/

面向 **BCI / EEG / 脑信号** 研究者的投稿与科研追踪。顶部导航三个视图——**会议 · 期刊 · 数据集**,
另有可开关的**各 venue 近年论文索引**。风格参考
[hci-deadlines](https://hci-deadlines.github.io/) 与 [ccfddl](https://ccfddl.com/)。

## 会议

- 所有会议下一届截止的**实时倒计时**,按「即将截止 / 待公布 / 已截止」分组
- **报名与截稿分开显示** —— 报名(摘要/注册,蓝)与全文截稿(红)各有独立倒计时 + 时间轴,
  两个日期不会被误读成一个;多轮会议带轮次标签(*Round 1*、*Cycle 1*)
- **一键加日历** —— 每条截稿支持 Google Calendar 链接和 `.ics` 下载
- **论文模板 / author kit** —— 每个会议附 📄 **format** 链接(LaTeX/Word 模板、author kit 或摘要格式说明)
- **自动更新** —— 日期每周从 [ccfddl 数据集](https://github.com/ccfddl/ccf-deadlines) 同步;
  不在该数据集的会议监视官网,CFP 变化即标记;截稿过后进入「待公布」
- **指标** —— CCF 等级、CORE 等级、Google Scholar h5-index

## 期刊

- **53 本 BCI/EEG 相关期刊**,滚动投稿(全年可投,无截稿日)
- **指标** —— JCR 分区、**影响因子 IF**、CCF 推荐期刊目录等级、中科院分区,
  另附出版商与开放获取(OA)标记;按 IF 降序

## 数据集

- **110 个公开 BCI/EEG/MEG/fNIRS 数据集**,按时代(*Wave 1/2/3*)分组,按**范式**过滤
  (运动想象 / 视觉 / 情绪 / 语音 / 认知负荷 / 睡眠 / ERP-SSVEP / 临床)
- 卡片显示被试数(**N**)、模态、cohort 与标签;临床、侵入式/消费级数据集会标记

## 论文(开关)

- 导航栏 **📄 论文** 开关(会议与期刊视图)在每个 venue 卡片下展开*近年 BCI/EEG 论文*索引——
  **209 篇 2021-2026 代表作,覆盖 57 个 venue**,每篇链到 Google Scholar 搜索
- 整理自顶会论文清单 + 带来源核验的并行检索;**完全中英双语**(标题 + 一句话说明)

## 通用

- **中英文切换**,首次访问按 IP 自动选语言(中国 → 中文,其他 → 英文)
- **中国特有评级仅中文显示** —— CCF 与中科院分区只在中文模式出现;英文模式只留国际指标
  (会议:CORE + h5;期刊:JCR + IF)
- 颜色按等级/分区深浅;过滤条件可分享(`?sub=ML,CV&lang=en`)
- **自动维护** —— GitHub Action 每周同步截稿日期,并对会议官网、format 模板链接、数据集源链接
  做健康检查,失效自动开 Issue

## 数据

纯静态站点,无构建步骤。所有数据在 [`data/`](data/):
[`conferences.yml`](data/conferences.yml)、[`journals.yml`](data/journals.yml)、
[`datasets.yml`](data/datasets.yml)、[`papers.yml`](data/papers.yml),改完 YAML 即生效。
会议标「预估」的日期为按往年规律推测;期刊 IF 与分区逐年变动,投稿前请复核。

```bash
# 本地预览
python3 -m http.server 8000   # 打开 http://localhost:8000
```

## License

MIT
