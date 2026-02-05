const TARGET_CLICKS = 10;
const STORAGE_KEY = "clickSpeed10History";

const tapButton = document.getElementById("tapButton");
const retryButton = document.getElementById("retryButton");
const statusText = document.getElementById("statusText");
const countText = document.getElementById("countText");

const totalMsEl = document.getElementById("totalMs");
const totalSecEl = document.getElementById("totalSec");
const cpsEl = document.getElementById("cps");
const avgIntervalEl = document.getElementById("avgInterval");
const historyList = document.getElementById("historyList");

const initialState = {
  count: 0,
  startTime: null,
  endTime: null,
  finished: false,
};

let state = { ...initialState };

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 5)));
};

const renderHistory = () => {
  const history = loadHistory();
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>履歴はまだありません</li>";
    return;
  }

  history.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = `${entry.date}: ${entry.totalMs}ms (${entry.cps} CPS)`;
    historyList.appendChild(item);
  });
};

const resetResult = () => {
  totalMsEl.textContent = "-";
  totalSecEl.textContent = "-";
  cpsEl.textContent = "-";
  avgIntervalEl.textContent = "-";
};

const renderState = () => {
  countText.textContent = `${state.count} / ${TARGET_CLICKS}`;

  if (state.finished) {
    statusText.textContent = "計測完了：結果表示中";
    tapButton.disabled = true;
    return;
  }

  tapButton.disabled = false;
  statusText.textContent =
    state.count === 0 ? "ボタンを押して計測を開始" : "計測中...そのまま10回まで押してください";
};

const finishMeasurement = () => {
  const totalMs = state.endTime - state.startTime;
  const totalSec = totalMs / 1000;
  const cps = TARGET_CLICKS / totalSec;
  const avgIntervalMs = totalMs / (TARGET_CLICKS - 1);

  totalMsEl.textContent = `${totalMs.toFixed(0)} ms`;
  totalSecEl.textContent = `${totalSec.toFixed(3)} 秒`;
  cpsEl.textContent = `${cps.toFixed(2)}`;
  avgIntervalEl.textContent = `${avgIntervalMs.toFixed(1)} ms`;

  const history = loadHistory();
  history.unshift({
    date: new Date().toLocaleString("ja-JP"),
    totalMs: Number(totalMs.toFixed(0)),
    cps: Number(cps.toFixed(2)),
  });
  saveHistory(history);
  renderHistory();
};

const handleTap = (event) => {
  event.preventDefault();

  if (state.finished) return;

  const now = performance.now();

  if (state.count === 0) {
    state.startTime = now;
  }

  state.count += 1;

  if (state.count >= TARGET_CLICKS) {
    state.endTime = now;
    state.finished = true;
    finishMeasurement();
  }

  renderState();
};

const resetMeasurement = () => {
  state = { ...initialState };
  resetResult();
  renderState();
};

tapButton.addEventListener("pointerdown", handleTap);
retryButton.addEventListener("click", resetMeasurement);

resetMeasurement();
renderHistory();
