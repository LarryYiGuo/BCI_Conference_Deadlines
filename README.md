# 🧠 BCI Conference Deadlines

面向 **BCI / EEG / 脑信号** 研究者的会议截稿倒计时网站,组织方式参考 [hci-deadlines](https://hci-deadlines.github.io/) 与 [ccfddl](https://ccfddl.com/)。

**在线访问:** https://larryyiguo.github.io/BCI_Conference_Deadlines/

## 分类

不按影响力 Tier 分级,而是按**学科方向**分类(可在页面顶部多选过滤,支持 `?sub=ML,CV` URL 参数):

| 代号 | 方向 | 代表会议 |
|------|------|----------|
| `ML` | 机器学习 · AI 综合 | NeurIPS · ICLR · ICML · AAAI · IJCAI · UAI · AISTATS · ACML |
| `DM` | 数据挖掘 · 信息检索 | KDD · WWW · SIGIR · ECML PKDD · CIKM · ICDM · SDM · PAKDD |
| `NC` | 神经计算 · 神经网络 | IJCNN · ICONIP |
| `CV` | 计算机视觉 · 多媒体 | CVPR · ICCV · ECCV · ACM MM · WACV · BMVC · ICME · ICIP |
| `AC` | 情感计算 · 多模态交互 | ACII · ICMI |
| `SP` | 信号处理 | ICASSP · EUSIPCO |
| `BME` | 医工 · 生物医学影像 | EMBC · BIBM · MICCAI · ISBI · IEEE SMC |
| `BCI` | 神经工程 · BCI · 神经科学 | IEEE NER · International BCI Meeting · SfN · OHBM |

每个会议卡片附带 **CCF 等级**、**BCI 相关性说明**(该 venue 在 BCI 圈的实际地位/代表工作)以及 **★ 硕士友好** 标记。

## 数据维护

所有数据在 [`data/conferences.yml`](data/conferences.yml),纯静态站点(无构建步骤),改完 YAML 即生效。

- 标注 `estimated: true` 的截稿日为按往年规律推测,以官网 Call for Papers 为准
- 时区:`tz` 为 UTC 偏移(AoE = `-12:00`),`tz_label` 为显示文字
- 期刊(TPAMI / TNNLS / JNE / TNSRE 等)为滚动投稿无截稿日,不收录

欢迎 PR 修正过期或错误的日期。

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## License

MIT
