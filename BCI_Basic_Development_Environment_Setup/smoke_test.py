"""BCI 入门环境冒烟测试 / BCI starter environment smoke test.

用法 / Usage:
    conda activate bci
    python smoke_test.py

不下载任何数据,全部用合成 EEG。第一次运行要一两分钟(Python 在编译缓存),之后十几秒。
No data is downloaded; everything runs on synthetic EEG. The first run takes a minute or two
(Python is building its cache); later runs take about ten seconds.

CI 用 `--json out.json` 把结果写成文件,再汇总到网页。
"""
import importlib
import importlib.metadata as md
import json
import os
import platform
import sys
import time
import warnings

warnings.filterwarnings("ignore")
try:  # Windows 控制台默认不是 UTF-8,中文会直接报错;这里改成 UTF-8 并容错
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

T0 = time.time()
RESULTS = {"tests": []}

# (发行名, import 名)
CORE = [
    ("mne", "mne"), ("braindecode", "braindecode"), ("moabb", "moabb"),
    ("pyriemann", "pyriemann"), ("torch", "torch"), ("torchaudio", "torchaudio"),
    ("scikit-learn", "sklearn"), ("numpy", "numpy"), ("scipy", "scipy"),
]
ALSO = ["matplotlib", "pandas", "h5py", "jupyterlab", "ipykernel"]
# 这些包要么需要编译,要么被 pip 覆盖后会和 conda 版本打架,在 conda 环境里必须来自 conda
MUST_BE_CONDA = ["torch", "torchaudio", "numpy", "scipy", "pandas", "h5py", "mne"]


def line(status, text, extra=""):
    print(f"  {status:<5} {text}{('  ' + extra) if extra else ''}")


def record(name, status, detail=""):
    RESULTS["tests"].append({"name": name, "status": status, "detail": detail})
    line(status, name, detail)


def version(dist):
    try:
        return md.version(dist)
    except md.PackageNotFoundError:
        return None


def installer(dist):
    try:
        return (md.distribution(dist).read_text("INSTALLER") or "").strip() or "conda"
    except md.PackageNotFoundError:
        return None


in_conda = os.path.isdir(os.path.join(sys.prefix, "conda-meta"))
env_name = os.environ.get("CONDA_DEFAULT_ENV") or (os.path.basename(sys.prefix) if in_conda else "venv/system")
os_name = {"Darwin": "macOS", "Windows": "Windows", "Linux": "Linux"}.get(platform.system(), platform.system())
RESULTS.update(os=os_name, machine=platform.machine(), python=platform.python_version(), conda=in_conda)

print("BCI starter environment · smoke test / 冒烟测试")
print(f"python {platform.python_version()} · {os_name} {platform.machine()} · env: {env_name}\n")

# ── 1 导入 ────────────────────────────────────────────────────────────────
print("[1] Import / 导入")
versions, sources = {}, {}
for dist, mod in CORE:
    v = version(dist)
    versions[dist], sources[dist] = v, installer(dist)
    try:
        importlib.import_module(mod)
        record(f"import {dist}", "PASS", f"{v}  ({sources[dist]})")
    except Exception as e:
        record(f"import {dist}", "FAIL", f"{type(e).__name__}: {str(e).splitlines()[0][:160] if str(e) else ''}")
for dist in ALSO:
    versions[dist], sources[dist] = version(dist), installer(dist)
RESULTS.update(versions=versions, sources=sources)

# ── 2 来源 ────────────────────────────────────────────────────────────────
print("\n[2] Where packages came from / 包的来源")
if in_conda:
    from_pip = [d for d in MUST_BE_CONDA if sources.get(d) == "pip"]
    if from_pip:
        record("compiled packages from conda / 编译型包来自 conda", "FAIL",
               f"pip 装的: {', '.join(from_pip)} —— 用 conda 重装它们 / reinstall these with conda")
    else:
        record("compiled packages from conda / 编译型包来自 conda", "PASS")
else:
    line("INFO", "not a conda env, source check skipped / 不是 conda 环境,跳过来源检查")

# ── 3 设备 ────────────────────────────────────────────────────────────────
print("\n[3] Compute device / 计算设备")
device = "cpu"
try:
    import torch
    if torch.cuda.is_available():
        device = "cuda"
        line("INFO", f"cuda · {torch.cuda.get_device_name(0)}")
    elif getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
        device = "mps"
        line("INFO", "mps · Apple GPU")
    else:
        line("INFO", "cpu · 入门够用 / fine for getting started")
except Exception:
    line("INFO", "torch unavailable / torch 不可用")
RESULTS["device"] = device

# ── 4 合成数据上的最小流程 ────────────────────────────────────────────────
print("\n[4] Mini pipelines on synthetic EEG / 合成 EEG 上的最小流程")
import numpy as np

rng = np.random.default_rng(0)
n, ch, t = 60, 8, 250
X = rng.standard_normal((n, ch, t))
y = np.repeat([0, 1], n // 2)
X[y == 1, :2] *= 2.5  # 第 1 类前两个通道方差更大,正常的流程应该能分开

try:
    import mne
    mne.set_log_level("ERROR")
    from mne.decoding import CSP
    from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
    from sklearn.model_selection import cross_val_score
    from sklearn.pipeline import make_pipeline
    acc = cross_val_score(make_pipeline(CSP(n_components=4, log=True), LinearDiscriminantAnalysis()), X, y, cv=5).mean()
    record("CSP + LDA", "PASS" if acc > 0.9 else "FAIL", f"acc {acc:.2f}")
except Exception as e:
    record("CSP + LDA", "FAIL", f"{type(e).__name__}: {e}"[:200])

try:
    from pyriemann.classification import MDM
    from pyriemann.estimation import Covariances
    from sklearn.model_selection import cross_val_score
    from sklearn.pipeline import make_pipeline
    acc = cross_val_score(make_pipeline(Covariances("oas"), MDM()), X, y, cv=5).mean()
    record("Riemann MDM / 黎曼分类器", "PASS" if acc > 0.9 else "FAIL", f"acc {acc:.2f}")
except Exception as e:
    record("Riemann MDM / 黎曼分类器", "FAIL", f"{type(e).__name__}: {e}"[:200])

try:
    import torch
    from braindecode.models import ShallowFBCSPNet
    model = ShallowFBCSPNet(n_chans=ch, n_outputs=2, n_times=t, final_conv_length="auto")
    xb = torch.tensor(X[:4], dtype=torch.float32)
    try:
        out = model.to(device)(xb.to(device))
        record("braindecode ShallowFBCSPNet", "PASS", f"forward on {device} -> {tuple(out.shape)}")
    except Exception as e:  # GPU 路径失败时退回 CPU,环境本身仍算可用
        out = model.to("cpu")(xb)
        record("braindecode ShallowFBCSPNet", "WARN", f"{device} failed ({type(e).__name__}), cpu ok -> {tuple(out.shape)}")
except Exception as e:
    record("braindecode ShallowFBCSPNet", "FAIL", f"{type(e).__name__}: {e}"[:200])

try:
    from moabb.datasets import BNCI2014_001
    k = len(BNCI2014_001().subject_list)
    record("MOABB dataset metadata / 数据集元信息", "PASS" if k == 9 else "FAIL", f"BNCI2014_001: {k} subjects, no download")
except Exception as e:
    record("MOABB dataset metadata / 数据集元信息", "FAIL", f"{type(e).__name__}: {e}"[:200])

# ── 5 数据目录 ────────────────────────────────────────────────────────────
print("\n[5] Data folder / 数据目录")
mne_data = os.environ.get("MNE_DATA")
RESULTS["mne_data_set"] = bool(mne_data)
if mne_data:
    line("PASS", "MNE_DATA is set / 已设置", mne_data.replace(os.path.expanduser("~"), "~"))
else:
    line("WARN", "MNE_DATA not set / 未设置",
         "MOABB 会把数据下到 ~/mne_data;想换位置见页面第三步 / see step 3 on the page")

# ── 结果 ─────────────────────────────────────────────────────────────────
failed = [r["name"] for r in RESULTS["tests"] if r["status"] == "FAIL"]
RESULTS["passed"] = not failed
RESULTS["elapsed"] = round(time.time() - T0, 1)
print()
if failed:
    print(f"RESULT: {len(failed)} FAILED / 有 {len(failed)} 项失败  ({RESULTS['elapsed']} s)")
    print("  -> " + "; ".join(failed))
else:
    print(f"RESULT: ALL PASSED / 全部通过  ({RESULTS['elapsed']} s)")

if "--json" in sys.argv:
    path = sys.argv[sys.argv.index("--json") + 1]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(RESULTS, f, ensure_ascii=False, indent=2)

sys.exit(1 if failed else 0)
