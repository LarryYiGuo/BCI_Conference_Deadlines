# 🧠 BCI Conference & Journal Deadlines

**Live site:** https://larryyiguo.github.io/BCI_Conference_Journal_Deadlines/

A publishing tracker for **BCI / EEG / brain-signal** researchers — **40 conferences**
(with deadlines) and **52 rolling-submission journals**, across machine learning, data
mining, vision & multimedia, affective computing, signal processing, biomedical
engineering and neural engineering. Toggle between the two views from the top nav.
Editorial style inspired by [hci-deadlines](https://hci-deadlines.github.io/) and [ccfddl](https://ccfddl.com/).

## Conferences

- **Live countdowns** to every upcoming deadline, grouped into *Upcoming / TBA / Passed*
- **Registration and submission shown separately** — abstract/registration (blue) and
  full-paper submission (red) get their own countdowns and a per-conference **timeline**,
  so the two dates can't be misread as one; multi-round venues are labeled (*Round 1*, *Cycle 1*)
- **Add to calendar** — Google Calendar link and `.ics` download for every deadline
- **Auto-updated** — dates sync weekly from the
  [ccfddl dataset](https://github.com/ccfddl/ccf-deadlines); conferences outside that
  dataset are watched on their official sites and flagged for review when a CFP changes.
  Closed deadlines move to *TBA* until the next cycle is announced
- **Metrics** — CCF rank, CORE rank, and the Google Scholar **h5-index** (conferences
  have no JCR impact factor; h5 is the standard citation metric)

## Journals

- **52 BCI/EEG-relevant journals**, rolling submission (open year-round, no deadline) —
  so no countdown, timeline or calendar
- **Metrics** — JCR quartile, **impact factor** (the headline metric for journals),
  CCF journal-catalog rank and CAS quartile (中科院分区), plus publisher and an
  open-access flag
- Sorted by impact factor; includes everything from Nature BME / TPAMI / Information
  Fusion down to JNE / TNSRE and the OA-friendly journals (Sensors, Frontiers, IEEE Access)

## Shared

- **Four color themes**, shaded by rank — the darker the color, the higher the rank/tier
- **EN / 中文** toggle, with first-visit language auto-picked by IP (CN → 中文, else English)
- **China-specific ranks are Chinese-only** — CCF and CAS quartile show only in Chinese
  mode; English mode keeps international metrics only (conferences: CORE + h5; journals: JCR + IF)
- Shareable filter URLs (`?sub=ML,CV&lang=en`)

## Data

Pure static site — no build step. Conferences live in
[`data/conferences.yml`](data/conferences.yml), journals in
[`data/journals.yml`](data/journals.yml); edit the YAML and the site updates.
Conference dates marked *Est.* are projected from past cycles — confirm with the
official CFP. Journal impact factors and quartiles shift yearly — confirm before submitting.

```bash
# local preview
python3 -m http.server 8000   # open http://localhost:8000
```

## License

MIT

---

# 🧠 BCI 会议 & 期刊投稿日历

**在线访问:** https://larryyiguo.github.io/BCI_Conference_Journal_Deadlines/

面向 **BCI / EEG / 脑信号** 研究者的投稿追踪 —— **40 个会议**(带截稿日)+ **52 本滚动投稿期刊**,
覆盖机器学习、数据挖掘、视觉多媒体、情感计算、信号处理、医工影像与神经工程。顶部导航可在两个视图间切换。
风格参考 [hci-deadlines](https://hci-deadlines.github.io/) 与 [ccfddl](https://ccfddl.com/)。

## 会议

- 所有会议下一届截止的**实时倒计时**,按「即将截止 / 待公布 / 已截止」分组
- **报名与截稿分开显示** —— 报名(摘要/注册,蓝)与全文截稿(红)各有独立倒计时,
  配每个会议的**时间轴**,两个日期不会被误读成一个;多轮会议带轮次标签(*Round 1*、*Cycle 1*)
- **一键加日历** —— 每条截稿支持 Google Calendar 链接和 `.ics` 下载
- **自动更新** —— 日期每周从 [ccfddl 数据集](https://github.com/ccfddl/ccf-deadlines) 同步;
  不在该数据集的会议监视官网,CFP 一变化即标记复核。截稿过后条目进入「待公布」,等待下一届
- **指标** —— CCF 等级、CORE 等级、Google Scholar **h5-index**(会议无 JCR 影响因子,h5 为通行引用指标)

## 期刊

- **52 本 BCI/EEG 相关期刊**,滚动投稿(全年可投,无截稿日)—— 因此无倒计时/时间轴/日历
- **指标** —— JCR 分区、**影响因子 IF**(期刊核心指标)、CCF 推荐期刊目录等级、中科院分区,
  另附出版商和开放获取(OA)标记
- 按影响因子降序;从 Nature BME / TPAMI / Information Fusion 顶刊,到 JNE / TNSRE,
  再到 OA 友好刊(Sensors、Frontiers、IEEE Access)全覆盖

## 通用

- **四大主题色 + 分级深浅** —— 颜色越深代表等级/分区越高
- **中英文切换**,首次访问按 IP 自动选语言(中国 → 中文,其他 → 英文)
- **中国特有评级仅中文显示** —— CCF 与中科院分区只在中文模式出现;英文模式只留国际指标
  (会议:CORE + h5;期刊:JCR + IF)
- 过滤条件可分享(`?sub=ML,CV&lang=en`)

## 数据

纯静态站点,无构建步骤。会议数据在 [`data/conferences.yml`](data/conferences.yml),
期刊数据在 [`data/journals.yml`](data/journals.yml),改完 YAML 即生效。
会议标注「预估」的日期为按往年规律推测,以官网 CFP 为准;期刊影响因子与分区逐年变动,投稿前请复核。

```bash
# 本地预览
python3 -m http.server 8000   # 打开 http://localhost:8000
```

## License

MIT
