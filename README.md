# 🧠 BCI Conference Deadlines

**Live site:** https://larryyiguo.github.io/BCI_Conference_Deadlines/

A deadline tracker for **BCI / EEG / brain-signal** researchers — 40 conferences across
machine learning, data mining, vision & multimedia, affective computing, signal processing,
biomedical engineering and neural engineering. Organized after
[hci-deadlines](https://hci-deadlines.github.io/) and [ccfddl](https://ccfddl.com/).

## Features

- **Live countdowns** to the next submission deadline of every tracked conference,
  sorted into *Upcoming / To-be-announced / Passed*
- **Two deadlines, two colors** — abstract/registration (blue) vs. full-paper
  submission (red), plotted on a per-conference **timeline** with a "today" marker;
  multi-round venues carry a track label (e.g. WACV *Round 1*, KDD *Cycle 1*)
- **Add to calendar** — every deadline has a one-click Google Calendar link and an
  `.ics` download that works with Apple / Outlook mail clients
- **Auto-sync** — a weekly GitHub Action
  ([`scripts/update_deadlines.py`](scripts/update_deadlines.py)) refreshes dates from the
  [ccfddl dataset](https://github.com/ccfddl/ccf-deadlines). Once a deadline passes, the
  entry waits in *TBA* until the next CFP appears upstream. Manually verified dates
  (`estimated: false`) are **never overwritten** — community datasets are occasionally
  off by a day, so estimates and expired entries are the only ones auto-updated
- **Venue metrics** on every card — **CCF** rank (China), **CORE** rank (international),
  and the Google Scholar **h5-index** (32 of 40 venues; conferences have no JCR impact
  factor, h5 is the standard citation metric; abstract-based meetings like SfN/OHBM are
  not indexed)
- **Theme colors with rank shading** — four high-saturation themes; *the darker the
  color, the higher the venue rank* (CCF-A darkest)
- **EN / 中文 toggle** and shareable filter URLs (`?sub=ML,CV&lang=en`)

## Categories

| Theme | Color | Subs | Conferences |
|-------|-------|------|-------------|
| Algorithms | 🔵 blue | `ML` `DM` `NC` | NeurIPS · ICLR · ICML · AAAI · IJCAI · UAI · AISTATS · ACML · KDD · WWW · SIGIR · ECML PKDD · CIKM · ICDM · SDM · PAKDD · IJCNN · ICONIP |
| Vision & Interaction | 🟣 purple | `CV` `AC` | CVPR · ICCV · ECCV · ACM MM · MM Asia · WACV · BMVC · ICME · ICIP · ACII · ICMI |
| Medical & Signal | 🟡 amber | `BME` `SP` | EMBC · BIBM · MICCAI · ISBI · IEEE SMC · ICASSP · EUSIPCO |
| Neuro | 🔴 red | `BCI` | IEEE NER · International BCI Meeting · SfN · OHBM |

## Data

A pure static site — no build step. Everything lives in
[`data/conferences.yml`](data/conferences.yml); edit the YAML and the site updates.

- Entries with a `ccfddl` key refresh automatically every Monday; the rest
  (SfN, OHBM, EMBC, NER, BCI Meeting, ACII, ISBI) are maintained by hand
- `estimated: true` marks dates projected from past cycles — always confirm with the
  official CFP
- Journals (TPAMI, TNNLS, JNE, TNSRE, …) have rolling submissions and are not tracked

PRs fixing dates are welcome.

```bash
# local preview
python3 -m http.server 8000   # then open http://localhost:8000
```

## License

MIT

---

# 🧠 BCI 会议截稿日历

**在线访问:** https://larryyiguo.github.io/BCI_Conference_Deadlines/

面向 **BCI / EEG / 脑信号** 研究者的会议截稿追踪——覆盖机器学习、数据挖掘、视觉多媒体、
情感计算、信号处理、医工影像与神经工程共 40 个会议。组织方式参考
[hci-deadlines](https://hci-deadlines.github.io/) 与 [ccfddl](https://ccfddl.com/)。

## 功能

- 每个会议下一届投稿截止的**实时倒计时**,按「即将截稿 / 待公布 / 已截稿」分组
- **双截稿颜色区分**——摘要/注册(蓝)与全文提交(红),配每个会议的**时间轴**
  和"今天"标记;多轮会议带轮次标签(如 WACV *Round 1*、KDD *Cycle 1*)
- **一键加日历**——每条截稿支持 Google Calendar 链接和 `.ics` 下载
  (适用于 Apple / Outlook 等邮箱日历)
- **自动同步**——GitHub Action([`scripts/update_deadlines.py`](scripts/update_deadlines.py))
  每周一从 [ccfddl 数据集](https://github.com/ccfddl/ccf-deadlines) 刷新日期;截稿过后条目
  进入「待公布」,等待上游下一届 CFP。人工核实过的日期(`estimated: false`)**不会被覆盖**
  ——社区数据集偶有一天误差,自动更新只作用于预估和过期条目
- 每张卡片附**会议指标**——**CCF** 等级(中国)、**CORE** 等级(国际)、Google Scholar
  **h5-index**(40 个中收录 32 个;会议没有 JCR 影响因子,h5 为通行引用指标;
  SfN/OHBM 等摘要制大会不被收录)
- **主题色 + 分级深浅**——四大高饱和主题色,*颜色越深代表会议分级越高*(CCF-A 最深)
- **中英文切换**,过滤条件可分享(`?sub=ML,CV&lang=en`)

## 分类

| 主题 | 颜色 | 方向 | 会议 |
|------|------|------|------|
| 算法 | 🔵 蓝 | `ML` `DM` `NC` | NeurIPS · ICLR · ICML · AAAI · IJCAI · UAI · AISTATS · ACML · KDD · WWW · SIGIR · ECML PKDD · CIKM · ICDM · SDM · PAKDD · IJCNN · ICONIP |
| 视觉·交互 | 🟣 紫 | `CV` `AC` | CVPR · ICCV · ECCV · ACM MM · MM Asia · WACV · BMVC · ICME · ICIP · ACII · ICMI |
| 医疗·信号 | 🟡 黄 | `BME` `SP` | EMBC · BIBM · MICCAI · ISBI · IEEE SMC · ICASSP · EUSIPCO |
| 神经 | 🔴 红 | `BCI` | IEEE NER · International BCI Meeting · SfN · OHBM |

## 数据

纯静态站点,无构建步骤。所有数据在 [`data/conferences.yml`](data/conferences.yml),
改完 YAML 即生效。

- 带 `ccfddl` 字段的条目每周一自动刷新;其余(SfN、OHBM、EMBC、NER、BCI Meeting、
  ACII、ISBI)人工维护
- `estimated: true` 表示按往年规律推测的日期,以官网 CFP 为准
- 期刊(TPAMI / TNNLS / JNE / TNSRE 等)为滚动投稿,不收录

欢迎 PR 修正日期。

```bash
# 本地预览
python3 -m http.server 8000   # 打开 http://localhost:8000
```

## License

MIT
