(() => {
const contentKey = window.tihayaContentStorageKey || "tihayaContent";
const contentDraftKey = window.tihayaContentDraftStorageKey || "tihayaContentDraft";
const factoryDefaults = window.tihayaFactoryDefaults || { soundUnits: [], phrases: [], lessonSettings: [], daySettings: [] };
const remoteContentUrl = window.tihayaRemoteContentUrl || "./data/content.json";
const dayOptions = [
  { value: 0, short: "Пн", label: "Понедельник", mode: "lesson" },
  { value: 1, short: "Вт", label: "Вторник", mode: "lesson" },
  { value: 2, short: "Ср", label: "Среда", mode: "lesson" },
  { value: 3, short: "Чт", label: "Четверг", mode: "lesson" },
  { value: 4, short: "Пт", label: "Пятница", mode: "lesson" },
  { value: 5, short: "Сб", label: "Суббота", mode: "review" },
  { value: 6, short: "Вс", label: "Воскресенье", mode: "review" },
];
const adminMonthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const clone = (value) => JSON.parse(JSON.stringify(value));
const adminToday = new Date();

function getStorageItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

function readStoredContent() {
  try {
    return JSON.parse(getStorageItem(contentKey) || "null");
  } catch {
    removeStorageItem(contentKey);
    return null;
  }
}

let content = mergeContentWithFactoryDefaults(readStoredContent());
let activeTab = "phrases";
let activeDate = new Date(adminToday.getFullYear(), adminToday.getMonth(), adminToday.getDate());
let activeDay = getAdminCalendarDayIndex(activeDate);
let adminCalendarYear = adminToday.getFullYear();
let adminCalendarMonth = adminToday.getMonth();

const phraseSection = document.querySelector("#admin-phrases");
const soundSection = document.querySelector("#admin-sounds");
const audioSection = document.querySelector("#admin-audio");
const audioList = document.querySelector("#admin-audio-list");
const adminMonthCalendar = document.querySelector("#admin-month-calendar");
const adminMonthTitle = document.querySelector("#admin-month-title");
const daySummary = document.querySelector("#admin-day-summary");
const feedback = document.querySelector("#admin-feedback");
const addPhraseButton = document.querySelector("#add-phrase");
const addSoundButton = document.querySelector("#add-sound");
const saveButton = document.querySelector("#save-content");
const exportButton = document.querySelector("#export-content");
const resetButton = document.querySelector("#reset-content");
const importInput = document.querySelector("#import-content");
const dateActionModal = document.querySelector("#date-action-modal");
const dateActionTitle = document.querySelector("#date-action-title");
const dateActionNote = document.querySelector("#date-action-note");
const clearDateButton = document.querySelector("#clear-date-content");
const copyDateButton = document.querySelector("#copy-date-content");
const moveDateButton = document.querySelector("#move-date-content");
const closeDateActionButton = document.querySelector("#close-date-action");
let actionSourceDate = null;
let pendingDateAction = null;
let longPressTimer = null;
let suppressNextDateClick = false;

function getSoundKey(unit) {
  return `${unit.title || ""}|${unit.formula || ""}`.toLocaleLowerCase("ru-RU");
}

function getAdminCalendarDayIndex(date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

function getAdminWeekNumber(date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
}

function isSameAdminDate(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function formatAdminDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseAdminDateKey(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatAdminLongDate(date) {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
}

function getAdminWeekStart(date) {
  const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  weekStart.setDate(weekStart.getDate() - getAdminCalendarDayIndex(weekStart));
  return weekStart;
}

function getLegacyDateKeyForDay(day) {
  const date = getAdminWeekStart(adminToday);
  date.setDate(date.getDate() + Math.min(4, Math.max(0, Number(day) || 0)));
  return formatAdminDateKey(date);
}

function isValidDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "");
}

function getPhraseDateKey(phrase) {
  if (isValidDateKey(phrase?.date)) return phrase.date;
  if (isValidDateKey(phrase?.lessonDate)) return phrase.lessonDate;
  return getLegacyDateKeyForDay(phrase?.day);
}

function normalizePhraseSchedule(phrase) {
  const dateKey = getPhraseDateKey(phrase);
  const date = parseAdminDateKey(dateKey);
  phrase.date = dateKey;
  phrase.day = date ? Math.min(4, getAdminCalendarDayIndex(date)) : Number(phrase.day) || 0;
  return phrase;
}

function normalizePhrases(items = []) {
  return items.map((phrase) => normalizePhraseSchedule({ ...phrase }));
}

function mergeContentWithFactoryDefaults(nextContent) {
  const mergedContent = {
    soundUnits: nextContent?.soundUnits?.length ? nextContent.soundUnits : clone(factoryDefaults.soundUnits),
    phrases: normalizePhrases(nextContent?.phrases?.length ? nextContent.phrases : clone(factoryDefaults.phrases)),
    lessonSettings: normalizeLessonSettings(nextContent?.lessonSettings, nextContent?.daySettings || factoryDefaults.daySettings),
  };
  const existingKeys = new Set(mergedContent.soundUnits.map(getSoundKey));

  factoryDefaults.soundUnits.forEach((unit) => {
    if (!existingKeys.has(getSoundKey(unit))) {
      mergedContent.soundUnits.push(clone(unit));
    }
  });

  return mergedContent;
}

function normalizeDaySettings(nextSettings = []) {
  return dayOptions.slice(0, 5).map((day) => {
    const setting = nextSettings.find((item) => Number(item.day) === day.value);
    return { day: day.value, enabled: setting?.enabled !== false };
  });
}

function normalizeLessonSettings(nextSettings = [], legacySettings = []) {
  const normalized = [];
  const addSetting = (date, enabled) => {
    if (!isValidDateKey(date) || normalized.some((item) => item.date === date)) return;
    normalized.push({ date, enabled: enabled !== false });
  };

  (Array.isArray(nextSettings) ? nextSettings : []).forEach((setting) => {
    addSetting(setting.date || setting.lessonDate, setting.enabled);
  });

  if (!normalized.length) {
    normalizeDaySettings(Array.isArray(legacySettings) ? legacySettings : []).forEach((setting) => {
      addSetting(getLegacyDateKeyForDay(setting.day), setting.enabled);
    });
  }

  return normalized;
}

function isAdminDateEnabled(date) {
  const dayIndex = getAdminCalendarDayIndex(date);
  if (dayIndex > 4) return true;
  const dateKey = formatAdminDateKey(date);
  return content.lessonSettings.find((item) => item.date === dateKey)?.enabled !== false;
}

function setAdminDateEnabled(date, enabled) {
  const dateKey = formatAdminDateKey(date);
  const nextSettings = normalizeLessonSettings(content.lessonSettings);
  const existing = nextSettings.find((item) => item.date === dateKey);
  if (existing) {
    existing.enabled = enabled;
  } else {
    nextSettings.push({ date: dateKey, enabled });
  }
  content.lessonSettings = nextSettings;
}

function getCleanContent() {
  return {
    lessonSettings: normalizeLessonSettings(content.lessonSettings),
    soundUnits: content.soundUnits.map((unit) => ({
      formula: unit.formula || "",
      title: unit.title || "",
      hint: unit.hint || "",
      example: unit.example || "",
      audioUrl: unit.audioUrl || "",
    })),
    phrases: content.phrases.map((phrase) => {
      const dateKey = getPhraseDateKey(phrase);
      const date = parseAdminDateKey(dateKey);
      const day = date ? Math.min(4, getAdminCalendarDayIndex(date)) : Number(phrase.day) || 0;
      return {
      id: phrase.id || `phrase-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      date: dateKey,
      day,
      category: phrase.category || "talk",
      tag: phrase.tag || "Разговор",
      russian: phrase.russian || "",
      chechen: phrase.chechen || "",
      pronunciation: phrase.pronunciation || "",
      query: phrase.query || "",
      audioUrl: phrase.audioUrl || "",
      };
    }),
  };
}

function persistLocal(message = "Сохранено на этом устройстве.") {
  content = mergeContentWithFactoryDefaults(getCleanContent());
  const saved = setStorageItem(contentKey, JSON.stringify(content));
  setStorageItem(contentDraftKey, "1");
  feedback.textContent = saved ? message : "Можно редактировать и скачать content.json, но этот браузер не дает сохранить черновик.";
  renderAdmin();
}

function persistDraft() {
  setStorageItem(contentKey, JSON.stringify(getCleanContent()));
  setStorageItem(contentDraftKey, "1");
}

async function loadRepoContentForAdmin() {
  if (getStorageItem(contentDraftKey) === "1") {
    feedback.textContent =
      "Показаны правки, сохраненные на этом устройстве. Чтобы их увидели все клиенты, скачай content.json и загрузи его в папку data на GitHub.";
    return;
  }

  try {
    feedback.textContent = "Загружаю content.json из GitHub Pages...";
    const response = await fetch(`${remoteContentUrl}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("content.json не найден");
    const repoContent = await response.json();
    content = mergeContentWithFactoryDefaults(repoContent);
    setStorageItem(contentKey, JSON.stringify(content));
    feedback.textContent = "Материал загружен из content.json. Можно редактировать.";
    renderAdmin();
  } catch {
    feedback.textContent = "Показана локальная копия. Для общей публикации скачай content.json и загрузи его в папку data на GitHub.";
  }
}

function downloadContentJson() {
  content = mergeContentWithFactoryDefaults(getCleanContent());
  setStorageItem(contentKey, JSON.stringify(content));
  setStorageItem(contentDraftKey, "1");

  const blob = new Blob([JSON.stringify(content, null, 2) + "\n"], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "content.json";
  link.click();
  URL.revokeObjectURL(link.href);
  feedback.textContent = "Файл content.json скачан. Загрузи его в папку data в GitHub-репозитории.";
}

function importContentJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      content = mergeContentWithFactoryDefaults(JSON.parse(reader.result));
      setStorageItem(contentKey, JSON.stringify(content));
      setStorageItem(contentDraftKey, "1");
      feedback.textContent = "content.json загружен в админку.";
      renderAdmin();
    } catch {
      feedback.textContent = "Не получилось прочитать JSON. Проверь файл content.json.";
    }
  });
  reader.readAsText(file);
}

function closeDateActionModal() {
  dateActionModal?.classList.add("is-hidden");
  actionSourceDate = null;
}

function openDateActionModal(date) {
  if (getAdminCalendarDayIndex(date) > 4) {
    feedback.textContent = "В выходные новые уроки не ставятся. Выбери дату с понедельника по пятницу.";
    return;
  }

  actionSourceDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const sourcePhrases = getPhrasesForAdminDate(actionSourceDate);
  if (dateActionTitle) dateActionTitle.textContent = formatAdminLongDate(actionSourceDate);
  if (dateActionNote) {
    dateActionNote.textContent = sourcePhrases.length
      ? `В этой дате ${sourcePhrases.length} слов. Можно очистить, скопировать или переместить их на другую дату.`
      : "В этой дате слов пока нет. Можно очистить день или выбрать другую дату.";
  }
  dateActionModal?.classList.remove("is-hidden");
  clearDateButton?.focus();
}

function copyPhraseToDate(phrase, targetDate) {
  const dateKey = formatAdminDateKey(targetDate);
  return normalizePhraseSchedule({
    ...phrase,
    id: `phrase-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: dateKey,
    day: Math.min(4, getAdminCalendarDayIndex(targetDate)),
  });
}

function clearLessonDate(date, options = {}) {
  const dateKey = formatAdminDateKey(date);
  const beforeCount = content.phrases.length;
  content.phrases = content.phrases.filter((phrase) => getPhraseDateKey(phrase) !== dateKey);
  if (options.disable !== false && getAdminCalendarDayIndex(date) <= 4) {
    setAdminDateEnabled(date, false);
  }
  return beforeCount - content.phrases.length;
}

function beginDateTransfer(mode) {
  if (!actionSourceDate) return;
  const sourcePhrases = getPhrasesForAdminDate(actionSourceDate);
  if (!sourcePhrases.length) {
    feedback.textContent = "В этой дате нет слов для копирования или перемещения.";
    closeDateActionModal();
    return;
  }

  pendingDateAction = {
    mode,
    sourceDate: new Date(actionSourceDate),
    sourceEnabled: isAdminDateEnabled(actionSourceDate),
  };
  feedback.textContent =
    mode === "copy"
      ? "Теперь нажми дату, куда скопировать слова."
      : "Теперь нажми дату, куда переместить слова.";
  closeDateActionModal();
}

function finishPendingDateAction(targetDate) {
  if (!pendingDateAction) return false;
  if (getAdminCalendarDayIndex(targetDate) > 4) {
    feedback.textContent = "Выбери дату с понедельника по пятницу. В выходные ставится повторение.";
    return true;
  }

  const sourceDate = pendingDateAction.sourceDate;
  const sourceKey = formatAdminDateKey(sourceDate);
  const targetKey = formatAdminDateKey(targetDate);
  if (sourceKey === targetKey) {
    feedback.textContent = "Это та же самая дата. Выбери другую дату.";
    return true;
  }

  const sourcePhrases = getPhrasesForAdminDate(sourceDate);
  if (!sourcePhrases.length) {
    feedback.textContent = "В исходной дате уже нет слов.";
    pendingDateAction = null;
    renderAdmin();
    return true;
  }

  if (pendingDateAction.mode === "copy") {
    content.phrases.push(...sourcePhrases.map((phrase) => copyPhraseToDate(phrase, targetDate)));
    setAdminDateEnabled(targetDate, pendingDateAction.sourceEnabled);
    feedback.textContent = `Скопировано слов: ${sourcePhrases.length}. Скачай content.json и загрузи его в папку data на GitHub.`;
  } else {
    const targetDay = Math.min(4, getAdminCalendarDayIndex(targetDate));
    sourcePhrases.forEach((phrase) => {
      phrase.date = targetKey;
      phrase.day = targetDay;
    });
    setAdminDateEnabled(targetDate, pendingDateAction.sourceEnabled);
    setAdminDateEnabled(sourceDate, false);
    feedback.textContent = `Перемещено слов: ${sourcePhrases.length}. Скачай content.json и загрузи его в папку data на GitHub.`;
  }

  pendingDateAction = null;
  activeDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  activeDay = getAdminCalendarDayIndex(activeDate);
  persistDraft();
  renderAdmin();
  return true;
}

function makeField(labelText, value, onInput, type = "text") {
  const label = document.createElement("label");
  label.className = "admin-field";

  const span = document.createElement("span");
  span.textContent = labelText;

  const input = document.createElement(type === "textarea" ? "textarea" : "input");
  if (type !== "textarea") input.type = type;
  input.value = value || "";
  input.addEventListener("input", () => {
    onInput(input.value);
    persistDraft();
    feedback.textContent = "Черновик сохранен на этом устройстве.";
  });

  label.append(span, input);
  return label;
}

function makeSelect(labelText, value, options, onInput) {
  const label = document.createElement("label");
  label.className = "admin-field";

  const span = document.createElement("span");
  span.textContent = labelText;

  const select = document.createElement("select");
  options.forEach((option) => {
    const item = document.createElement("option");
    item.value = option.value;
    item.textContent = option.label;
    item.selected = String(option.value) === String(value);
    select.append(item);
  });
  select.addEventListener("change", () => {
    onInput(select.value);
    persistDraft();
    feedback.textContent = "Черновик сохранен на этом устройстве.";
  });

  label.append(span, select);
  return label;
}

function renderDayBoard() {
  adminMonthCalendar.innerHTML = "";
  adminMonthTitle.textContent = `${adminMonthNames[adminCalendarMonth]} ${adminCalendarYear}`;

  const firstOfMonth = new Date(adminCalendarYear, adminCalendarMonth, 1);
  const firstGridDate = new Date(firstOfMonth);
  firstGridDate.setDate(firstOfMonth.getDate() - getAdminCalendarDayIndex(firstOfMonth));

  for (let week = 0; week < 6; week += 1) {
    const weekStart = new Date(firstGridDate);
    weekStart.setDate(firstGridDate.getDate() + week * 7);

    const weekNumber = document.createElement("div");
    weekNumber.className = "week-number";
    weekNumber.textContent = String(getAdminWeekNumber(weekStart));
    adminMonthCalendar.append(weekNumber);

    dayOptions.forEach((_, dayOffset) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayOffset);
      const dayIndex = getAdminCalendarDayIndex(date);
      const isCurrentMonth = date.getMonth() === adminCalendarMonth;
      const isWeekendDate = dayIndex > 4;
      const dateKey = formatAdminDateKey(date);
      const dateIsEnabled = isAdminDateEnabled(date);
      const phrasesForDay = isWeekendDate ? getWeekPhrasesForAdminDate(date) : getPhrasesForAdminDate(date);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day admin-calendar-day";
      button.classList.toggle("is-outside", !isCurrentMonth);
      button.classList.toggle("is-today", isSameAdminDate(date, adminToday));
      button.classList.toggle("is-selected", isSameAdminDate(date, activeDate) && isCurrentMonth);
      button.classList.toggle("is-review", isWeekendDate && isCurrentMonth);
      button.classList.toggle("is-disabled-day", !isWeekendDate && (!dateIsEnabled || !phrasesForDay.length) && isCurrentMonth);
      button.disabled = !isCurrentMonth;
      button.innerHTML = `<strong>${date.getDate()}</strong><span>${isWeekendDate ? "Повт." : dateIsEnabled && phrasesForDay.length ? `${phrasesForDay.length}/${phrasesForDay.length}` : "Нет ур."}</span>`;
      button.setAttribute("aria-label", `${dateKey}: ${dayOptions[dayIndex].label}`);
      button.addEventListener("pointerdown", () => {
        if (!isCurrentMonth || isWeekendDate) return;
        window.clearTimeout(longPressTimer);
        longPressTimer = window.setTimeout(() => {
          suppressNextDateClick = true;
          openDateActionModal(date);
        }, 620);
      });
      button.addEventListener("pointerup", () => window.clearTimeout(longPressTimer));
      button.addEventListener("pointerleave", () => window.clearTimeout(longPressTimer));
      button.addEventListener("pointercancel", () => window.clearTimeout(longPressTimer));
      button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        openDateActionModal(date);
      });
      button.addEventListener("click", () => {
        if (suppressNextDateClick) {
          suppressNextDateClick = false;
          return;
        }
        if (finishPendingDateAction(date)) return;
        selectAdminDate(date);
      });
      adminMonthCalendar.append(button);
    });
  }
}

function selectAdminDate(date) {
  activeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  activeDay = getAdminCalendarDayIndex(activeDate);
  renderAdmin();
  window.requestAnimationFrame(() => {
    daySummary.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function getPhrasesForAdminDate(date) {
  const dateKey = formatAdminDateKey(date);
  return content.phrases.filter((phrase) => getPhraseDateKey(phrase) === dateKey);
}

function getWeekPhrasesForAdminDate(date) {
  const weekStart = getAdminWeekStart(date);
  const enabledDateKeys = new Set(
    [0, 1, 2, 3, 4].map((offset) => {
      const item = new Date(weekStart);
      item.setDate(weekStart.getDate() + offset);
      return item;
    }).filter(isAdminDateEnabled).map(formatAdminDateKey),
  );

  return content.phrases.filter((phrase) => enabledDateKeys.has(getPhraseDateKey(phrase)));
}

function getActivePhrasesWithIndex() {
  const activeDateKey = formatAdminDateKey(activeDate);
  const activeWeekPhrases = activeDay > 4 ? new Set(getWeekPhrasesForAdminDate(activeDate).map((phrase) => phrase.id)) : null;
  return content.phrases
    .map((phrase, index) => ({ phrase, index }))
    .filter(({ phrase }) => {
      if (activeDay > 4) return activeWeekPhrases.has(phrase.id);
      return getPhraseDateKey(phrase) === activeDateKey;
    });
}

function renderDaySummary() {
  daySummary.innerHTML = "";

  const day = dayOptions.find((item) => item.value === activeDay);
  const activeDateLabel = formatAdminLongDate(activeDate);
  const currentCount = getPhrasesForAdminDate(activeDate).length;
  const totalWeekPhrases = getWeekPhrasesForAdminDate(activeDate).length;

  if (activeDay > 4) {
    const heading = document.createElement("strong");
    heading.textContent = `${activeDateLabel}: повторение`;

    const text = document.createElement("span");
    text.textContent = `Клиент увидит слова только из включённых дат этой недели: ${totalWeekPhrases}. Новые слова в выходные не добавляются, но ниже можно редактировать слова выбранной недели.`;

    daySummary.append(heading, text);
  } else {
    const dateIsEnabled = isAdminDateEnabled(activeDate);

    const heading = document.createElement("strong");
    heading.textContent = activeDateLabel;

    const text = document.createElement("span");
    text.textContent = currentCount
      ? `Для этой конкретной даты стоит ${currentCount} слов. На календаре будет ${currentCount}/${currentCount}. Следующий ${day.label.toLowerCase()} будет отдельным уроком со своими словами.`
      : `Для этой конкретной даты слов пока нет. Следующий ${day.label.toLowerCase()} будет отдельным уроком со своими словами.`;

    const toggle = document.createElement("label");
    toggle.className = "admin-day-toggle";

    const toggleText = document.createElement("span");
    toggleText.innerHTML = `<b>Показывать клиенту</b><em>${dateIsEnabled ? "Включено: урок этой даты появится у клиента только когда эта дата наступит." : "Выключено: в клиентской части будет написано, что в этот день нет урока."}</em>`;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = dateIsEnabled;
    input.addEventListener("change", () => {
      setAdminDateEnabled(activeDate, input.checked);
      persistDraft();
      feedback.textContent = input.checked
        ? "Эта дата включена. Будущие даты всё равно откроются только в свой день. Скачай content.json и загрузи его в папку data на GitHub."
        : "Эта дата выключена. У клиента будет написано, что в этот день нет урока. Скачай content.json и загрузи его в папку data на GitHub.";
      renderAdmin();
    });

    const switchTrack = document.createElement("i");
    switchTrack.setAttribute("aria-hidden", "true");

    toggle.append(toggleText, input, switchTrack);
    daySummary.append(heading, text, toggle);
  }

  addPhraseButton.disabled = activeDay > 4;
}

function renderPhrasesAdmin() {
  phraseSection.innerHTML = "";
  const visiblePhrases = getActivePhrasesWithIndex();

  if (!visiblePhrases.length) {
    const empty = document.createElement("article");
    empty.className = "admin-edit-card";
    empty.innerHTML = "<h2>Слов пока нет</h2><p>Выбери день с понедельника по пятницу и нажми “Добавить слово”.</p>";
    phraseSection.append(empty);
    return;
  }

  visiblePhrases.forEach(({ phrase, index }, position) => {
    const card = document.createElement("article");
    card.className = "admin-edit-card";

    const numberBadge = document.createElement("span");
    numberBadge.className = "admin-word-number";
    numberBadge.textContent = String(position + 1);

    const title = document.createElement("h2");
    title.textContent = phrase.russian || "Новое слово";

    const fields = document.createElement("div");
    fields.className = "admin-field-grid";
    fields.append(
      makeField("Дата урока", getPhraseDateKey(phrase), (value) => {
        if (!isValidDateKey(value)) return;
        const date = parseAdminDateKey(value);
        phrase.date = value;
        phrase.day = date ? Math.min(4, getAdminCalendarDayIndex(date)) : Number(phrase.day) || 0;
        renderAdmin();
      }, "date"),
      makeSelect(
        "Категория",
        phrase.category,
        [
          { value: "greeting", label: "Приветствие" },
          { value: "polite", label: "Вежливость" },
          { value: "talk", label: "Разговор" },
          { value: "pronouns", label: "Личные местоимения" },
          { value: "basic", label: "Самые базовые слова" },
          { value: "love", label: "Про любовь" },
        ],
        (value) => {
          phrase.category = value;
        },
      ),
      makeField("Русский текст", phrase.russian, (value) => {
        phrase.russian = value;
        title.textContent = value || "Новое слово";
      }),
      makeField("Чеченский текст", phrase.chechen, (value) => {
        phrase.chechen = value;
      }),
      makeField("Произношение", phrase.pronunciation, (value) => {
        phrase.pronunciation = value;
      }),
      makeField("Метка", phrase.tag, (value) => {
        phrase.tag = value;
      }),
      makeField("Слова для поиска", phrase.query, (value) => {
        phrase.query = value;
      }),
      makeField("Ссылка на аудио", phrase.audioUrl, (value) => {
        phrase.audioUrl = value;
      }, "url"),
    );

    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.type = "button";
    remove.textContent = "Удалить";
    remove.addEventListener("click", () => {
      content.phrases.splice(index, 1);
      persistDraft();
      feedback.textContent = "Слово удалено. Черновик сохранен на этом устройстве.";
      renderAdmin();
    });

    card.append(numberBadge, title, fields, remove);
    phraseSection.append(card);
  });
}

function renderSoundsAdmin() {
  soundSection.innerHTML = "";

  content.soundUnits.forEach((unit, index) => {
    const card = document.createElement("article");
    card.className = "admin-edit-card";

    const title = document.createElement("h2");
    title.textContent = unit.title || "Новое правило";

    const fields = document.createElement("div");
    fields.className = "admin-field-grid";
    fields.append(
      makeField("Формула", unit.formula, (value) => {
        unit.formula = value;
      }),
      makeField("Звук", unit.title, (value) => {
        unit.title = value;
        title.textContent = value || "Новое правило";
      }),
      makeField("Объяснение", unit.hint, (value) => {
        unit.hint = value;
      }, "textarea"),
      makeField("Пример", unit.example, (value) => {
        unit.example = value;
      }),
      makeField("Ссылка на аудио", unit.audioUrl, (value) => {
        unit.audioUrl = value;
      }, "url"),
    );

    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.type = "button";
    remove.textContent = "Удалить";
    remove.addEventListener("click", () => {
      content.soundUnits.splice(index, 1);
      persistDraft();
      feedback.textContent = "Правило удалено. Черновик сохранен на этом устройстве.";
      renderAdmin();
    });

    card.append(title, fields, remove);
    soundSection.append(card);
  });
}

function renderAudioAdmin() {
  audioList.innerHTML = "";

  const allItems = [
    ...content.soundUnits.map((item) => ({ item, label: `Правило: ${item.title || item.formula}` })),
    ...content.phrases.map((item) => ({ item, label: `Слово: ${item.russian || item.chechen}` })),
  ];

  allItems.forEach(({ item, label }) => {
    const row = document.createElement("label");
    row.className = "audio-row";

    const span = document.createElement("span");
    span.textContent = label;

    const input = document.createElement("input");
    input.type = "url";
    input.placeholder = "https://raw.githubusercontent.com/.../audio/salam.mp3";
    input.value = item.audioUrl || "";
    input.addEventListener("input", () => {
      item.audioUrl = input.value;
      persistDraft();
      feedback.textContent = "Аудиоссылка сохранена в черновик.";
    });

    const test = document.createElement("button");
    test.type = "button";
    test.className = "secondary-button";
    test.textContent = "Проверить";
    test.addEventListener("click", () => {
      if (!item.audioUrl) return;
      new Audio(item.audioUrl).play().catch(() => {
        feedback.textContent = "Не получилось проиграть аудио. Проверь Raw-ссылку из GitHub.";
      });
    });

    row.append(span, input, test);
    audioList.append(row);
  });
}

function renderAdmin() {
  renderDayBoard();
  renderDaySummary();
  renderPhrasesAdmin();
  renderSoundsAdmin();
  renderAudioAdmin();
  phraseSection.classList.toggle("is-hidden", activeTab !== "phrases");
  soundSection.classList.toggle("is-hidden", activeTab !== "sounds");
  audioSection.classList.toggle("is-hidden", activeTab !== "audio");
}

document.querySelectorAll("[data-admin-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    activeTab = button.dataset.adminTab;
    document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
      tab.classList.toggle("is-active", tab === button);
    });
    renderAdmin();
  });
});

document.querySelector("#admin-prev-month")?.addEventListener("click", () => {
  adminCalendarMonth -= 1;
  if (adminCalendarMonth < 0) {
    adminCalendarMonth = 11;
    adminCalendarYear -= 1;
  }
  renderAdmin();
});

document.querySelector("#admin-next-month")?.addEventListener("click", () => {
  adminCalendarMonth += 1;
  if (adminCalendarMonth > 11) {
    adminCalendarMonth = 0;
    adminCalendarYear += 1;
  }
  renderAdmin();
});

clearDateButton?.addEventListener("click", () => {
  if (!actionSourceDate) return;
  const removedCount = clearLessonDate(actionSourceDate);
  pendingDateAction = null;
  activeDate = new Date(actionSourceDate.getFullYear(), actionSourceDate.getMonth(), actionSourceDate.getDate());
  activeDay = getAdminCalendarDayIndex(activeDate);
  persistDraft();
  closeDateActionModal();
  feedback.textContent = removedCount
    ? `Дата очищена: удалено слов ${removedCount}. Урок выключен.`
    : "Дата очищена. Урок выключен.";
  renderAdmin();
});

copyDateButton?.addEventListener("click", () => beginDateTransfer("copy"));
moveDateButton?.addEventListener("click", () => beginDateTransfer("move"));
closeDateActionButton?.addEventListener("click", closeDateActionModal);
dateActionModal?.querySelector("[data-close-date-action]")?.addEventListener("click", closeDateActionModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !dateActionModal?.classList.contains("is-hidden")) {
    closeDateActionModal();
  }
});

addPhraseButton.addEventListener("click", () => {
  if (activeDay > 4) return;
  content.phrases.push({
    id: `phrase-${Date.now()}`,
    date: formatAdminDateKey(activeDate),
    day: activeDay,
    category: "basic",
    tag: "Разговор",
    russian: "",
    chechen: "",
    pronunciation: "",
    query: "",
    audioUrl: "",
  });
  persistDraft();
  feedback.textContent = "Новое слово добавлено. Заполни поля ниже.";
  renderAdmin();
  window.requestAnimationFrame(() => {
    phraseSection.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

addSoundButton.addEventListener("click", () => {
  content.soundUnits.push({
    formula: "",
    title: "",
    hint: "",
    example: "",
    audioUrl: "",
  });
  persistDraft();
  activeTab = "sounds";
  document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.adminTab === "sounds");
  });
  renderAdmin();
  feedback.textContent = "Новое правило добавлено. Заполни поля ниже.";
  window.requestAnimationFrame(() => {
    soundSection.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

saveButton.addEventListener("click", () => {
  persistLocal("Сохранено на этом устройстве. Для клиентов скачай content.json и загрузи его в папку data на GitHub.");
});

exportButton.addEventListener("click", downloadContentJson);
importInput.addEventListener("change", () => importContentJson(importInput.files?.[0]));

resetButton.addEventListener("click", () => {
  content = clone(factoryDefaults);
  removeStorageItem(contentKey);
  removeStorageItem(contentDraftKey);
  feedback.textContent = "Сброшено к начальному материалу.";
  renderAdmin();
});

renderAdmin();
loadRepoContentForAdmin();
})();
