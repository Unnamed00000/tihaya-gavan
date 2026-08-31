(() => {
const contentKey = window.tihayaContentStorageKey || "tihayaContent";
const contentDraftKey = window.tihayaContentDraftStorageKey || "tihayaContentDraft";
const factoryDefaults = window.tihayaFactoryDefaults || { soundUnits: [], phrases: [], lessonSettings: [], daySettings: [] };
const remoteContentUrl = window.tihayaRemoteContentUrl || "./data/content.json";
const starterPhraseIds = new Set(window.tihayaStarterPhraseIds || []);
const defaultCategories = [
  { id: "greeting", label: "Приветствие" },
  { id: "polite", label: "Вежливость" },
  { id: "talk", label: "Разговор" },
  { id: "pronouns", label: "Личные местоимения" },
  { id: "basic", label: "Самые базовые слова" },
  { id: "love", label: "Про любовь" },
];
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
const categorySection = document.querySelector("#admin-categories");
const soundSection = document.querySelector("#admin-sounds");
const audioSection = document.querySelector("#admin-audio");
const audioList = document.querySelector("#admin-audio-list");
const adminMonthCalendar = document.querySelector("#admin-month-calendar");
const adminMonthTitle = document.querySelector("#admin-month-title");
const daySummary = document.querySelector("#admin-day-summary");
const feedback = document.querySelector("#admin-feedback");
const addPhraseButton = document.querySelector("#add-phrase");
const addCategoryButton = document.querySelector("#add-category");
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
const clearConfirmModal = document.querySelector("#clear-confirm-modal");
const clearConfirmNote = document.querySelector("#clear-confirm-note");
const confirmClearButton = document.querySelector("#confirm-clear-date");
const cancelClearButton = document.querySelector("#cancel-clear-date");
const transferDateModal = document.querySelector("#transfer-date-modal");
const transferDateTitle = document.querySelector("#transfer-date-title");
const transferDateNote = document.querySelector("#transfer-date-note");
const transferDateInput = document.querySelector("#transfer-date-input");
const confirmTransferButton = document.querySelector("#confirm-transfer-date");
const pickTransferOnCalendarButton = document.querySelector("#pick-transfer-on-calendar");
const cancelTransferButton = document.querySelector("#cancel-transfer-date");
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
  return items
    .filter((phrase) => !starterPhraseIds.has(phrase?.id))
    .map((phrase) => normalizePhraseSchedule({ ...phrase }));
}

function normalizeCategoryId(value, fallbackLabel = "Категория") {
  const latin = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (latin) return latin;
  return `category-${String(fallbackLabel || "new").trim().toLowerCase().replace(/\s+/g, "-") || Date.now()}`;
}

function normalizeCategories(nextCategories = [], phraseItems = []) {
  const normalized = [];
  const addCategory = (id, label) => {
    const categoryId = normalizeCategoryId(id || label);
    if (!categoryId || normalized.some((item) => item.id === categoryId)) return;
    normalized.push({ id: categoryId, label: String(label || id || "Категория").trim() || "Категория" });
  };

  defaultCategories.forEach((category) => addCategory(category.id, category.label));
  (Array.isArray(nextCategories) ? nextCategories : []).forEach((category) => {
    if (typeof category === "string") addCategory(category, category);
    else addCategory(category?.id || category?.value, category?.label || category?.title || category?.name || category?.id);
  });
  phraseItems.forEach((phrase) => addCategory(phrase.category, phrase.tag || phrase.category));

  return normalized;
}

function getCategoryOptions() {
  return normalizeCategories(content.categories, content.phrases).map((category) => ({
    value: category.id,
    label: category.label,
  }));
}

function getCategoryLabel(categoryId, fallback = "Разговор") {
  return getCategoryOptions().find((category) => category.value === categoryId)?.label || fallback;
}

function mergeContentWithFactoryDefaults(nextContent) {
  const phrases = normalizePhrases(Array.isArray(nextContent?.phrases) ? nextContent.phrases : []);
  const mergedContent = {
    soundUnits: nextContent?.soundUnits?.length ? nextContent.soundUnits : clone(factoryDefaults.soundUnits),
    phrases,
    categories: normalizeCategories(nextContent?.categories || factoryDefaults.categories, phrases),
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
  const categories = normalizeCategories(content.categories, content.phrases);
  return {
    lessonSettings: normalizeLessonSettings(content.lessonSettings),
    categories,
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
      tag: phrase.tag || getCategoryLabel(phrase.category),
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
  suppressNextDateClick = false;
}

function closeClearConfirmModal() {
  clearConfirmModal?.classList.add("is-hidden");
  actionSourceDate = null;
  suppressNextDateClick = false;
}

function setDatePickerMode(mode) {
  adminMonthCalendar?.classList.toggle("is-picking-target", Boolean(mode));
  document.body.dataset.adminDateAction = mode || "";
}

function closeTransferDateModal(options = {}) {
  transferDateModal?.classList.add("is-hidden");
  if (options.keepPending !== true) {
    pendingDateAction = null;
    setDatePickerMode(null);
  }
  suppressNextDateClick = false;
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
      ? `В этой дате ${sourcePhrases.length} слов. Можно полностью очистить дату, скопировать или переместить её слова.`
      : "В этой дате слов пока нет. Можно выключить и очистить дату или выбрать другую дату.";
  }
  if (copyDateButton) copyDateButton.disabled = !sourcePhrases.length;
  if (moveDateButton) moveDateButton.disabled = !sourcePhrases.length;
  dateActionModal?.classList.remove("is-hidden");
  clearDateButton?.focus();
}

function openClearConfirmModal() {
  if (!actionSourceDate) return;
  const sourcePhrases = getPhrasesForAdminDate(actionSourceDate);
  if (clearConfirmNote) {
    clearConfirmNote.textContent = sourcePhrases.length
      ? `Будет полностью очищена выбранная дата: удалятся все ${sourcePhrases.length} слов и их аудиоссылки, урок этой даты выключится. Это действие нельзя отменить.`
      : "В этой дате слов нет, но дата всё равно будет очищена и урок этой даты выключится.";
  }
  dateActionModal?.classList.add("is-hidden");
  clearConfirmModal?.classList.remove("is-hidden");
  confirmClearButton?.focus();
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
    content.lessonSettings = normalizeLessonSettings(content.lessonSettings).filter((item) => item.date !== dateKey);
    setAdminDateEnabled(date, false);
  }
  return beforeCount - content.phrases.length;
}

function getDefaultTransferDate(sourceDate) {
  const nextDate = new Date(sourceDate);
  do {
    nextDate.setDate(nextDate.getDate() + 1);
  } while (getAdminCalendarDayIndex(nextDate) > 4);
  return nextDate;
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
  suppressNextDateClick = false;
  setDatePickerMode(mode);
  dateActionModal?.classList.add("is-hidden");
  if (transferDateTitle) {
    transferDateTitle.textContent = mode === "copy" ? "Куда скопировать слова?" : "Куда переместить слова?";
  }
  if (transferDateNote) {
    transferDateNote.textContent =
      mode === "copy"
        ? `Будет скопировано слов: ${sourcePhrases.length}. Выбери дату с понедельника по пятницу.`
        : `Будет перемещено слов: ${sourcePhrases.length}. Выбери дату с понедельника по пятницу.`;
  }
  if (transferDateInput) transferDateInput.value = formatAdminDateKey(getDefaultTransferDate(actionSourceDate));
  transferDateModal?.classList.remove("is-hidden");
  feedback.textContent =
    mode === "copy"
      ? "Теперь нажми дату, куда скопировать слова."
      : "Теперь нажми дату, куда переместить слова.";
  actionSourceDate = null;
  transferDateInput?.focus();
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
    setDatePickerMode(null);
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
  setDatePickerMode(null);
  closeTransferDateModal({ keepPending: true });
  activeDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  activeDay = getAdminCalendarDayIndex(activeDate);
  adminCalendarYear = targetDate.getFullYear();
  adminCalendarMonth = targetDate.getMonth();
  persistDraft();
  renderAdmin();
  return true;
}

function submitPendingDateTransfer() {
  if (!pendingDateAction) {
    closeTransferDateModal();
    return;
  }
  const targetDate = parseAdminDateKey(transferDateInput?.value || "");
  if (!targetDate) {
    feedback.textContent = "Выбери дату назначения.";
    if (transferDateNote) transferDateNote.textContent = "Нужно выбрать дату с понедельника по пятницу.";
    transferDateInput?.focus();
    return;
  }
  if (getAdminCalendarDayIndex(targetDate) > 4) {
    feedback.textContent = "В выходные новые уроки не ставятся. Выбери понедельник, вторник, среду, четверг или пятницу.";
    if (transferDateNote) transferDateNote.textContent = "Суббота и воскресенье оставлены для повторения.";
    transferDateInput?.focus();
    return;
  }
  if (formatAdminDateKey(pendingDateAction.sourceDate) === formatAdminDateKey(targetDate)) {
    feedback.textContent = "Это та же самая дата. Выбери другую дату.";
    if (transferDateNote) transferDateNote.textContent = "Дата назначения должна отличаться от исходной даты.";
    transferDateInput?.focus();
    return;
  }
  finishPendingDateAction(targetDate);
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
        if (pendingDateAction) {
          window.clearTimeout(longPressTimer);
          suppressNextDateClick = false;
          if (finishPendingDateAction(date)) return;
        }
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
        getCategoryOptions(),
        (value) => {
          phrase.category = value;
          phrase.tag = getCategoryLabel(value);
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

function renderCategoriesAdmin() {
  categorySection.innerHTML = "";
  const categories = normalizeCategories(content.categories, content.phrases);
  content.categories = categories;
  const defaultIds = new Set(defaultCategories.map((category) => category.id));

  const intro = document.createElement("article");
  intro.className = "admin-edit-card admin-helper-card";
  intro.innerHTML = `
    <h2>Категории слов</h2>
    <p>Добавь свою категорию, потом она появится в выборе у каждого слова и в фильтрах клиента после загрузки content.json на GitHub.</p>
  `;
  categorySection.append(intro);

  categories.forEach((category, index) => {
    const card = document.createElement("article");
    card.className = "admin-edit-card";

    const title = document.createElement("h2");
    title.textContent = category.label || "Категория";

    const fields = document.createElement("div");
    fields.className = "admin-field-grid";
    fields.append(
      makeField("Название категории", category.label, (value) => {
        category.label = value || "Категория";
        title.textContent = category.label;
        content.phrases.forEach((phrase) => {
          if (phrase.category === category.id) phrase.tag = category.label;
        });
      }),
    );

    const usedCount = content.phrases.filter((phrase) => phrase.category === category.id).length;
    const meta = document.createElement("p");
    meta.className = "admin-category-meta";
    meta.textContent = `Слов в этой категории: ${usedCount}`;

    card.append(title, fields, meta);

    if (!defaultIds.has(category.id)) {
      const remove = document.createElement("button");
      remove.className = "danger-button";
      remove.type = "button";
      remove.textContent = "Удалить категорию";
      remove.addEventListener("click", () => {
        content.categories.splice(index, 1);
        content.phrases.forEach((phrase) => {
          if (phrase.category === category.id) {
            phrase.category = "talk";
            phrase.tag = getCategoryLabel("talk");
          }
        });
        persistDraft();
        feedback.textContent = "Категория удалена. Слова из неё перенесены в “Разговор”.";
        renderAdmin();
      });
      card.append(remove);
    }

    categorySection.append(card);
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
  renderCategoriesAdmin();
  renderSoundsAdmin();
  renderAudioAdmin();
  phraseSection.classList.toggle("is-hidden", activeTab !== "phrases");
  categorySection.classList.toggle("is-hidden", activeTab !== "categories");
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

function bindAdminTap(button, handler) {
  if (!button) return;
  let lastTouchAt = 0;
  button.addEventListener(
    "touchend",
    (event) => {
      event.preventDefault();
      lastTouchAt = Date.now();
      handler(event);
    },
    { passive: false },
  );
  button.addEventListener("click", (event) => {
    if (Date.now() - lastTouchAt < 700) return;
    handler(event);
  });
}

bindAdminTap(clearDateButton, openClearConfirmModal);

bindAdminTap(confirmClearButton, () => {
  if (!actionSourceDate) return;
  const removedCount = clearLessonDate(actionSourceDate);
  pendingDateAction = null;
  setDatePickerMode(null);
  activeDate = new Date(actionSourceDate.getFullYear(), actionSourceDate.getMonth(), actionSourceDate.getDate());
  activeDay = getAdminCalendarDayIndex(activeDate);
  persistDraft();
  closeClearConfirmModal();
  feedback.textContent = removedCount
    ? `Дата полностью очищена: удалено слов ${removedCount}. Урок выключен.`
    : "Дата полностью очищена. Урок выключен.";
  renderAdmin();
});

bindAdminTap(cancelClearButton, closeClearConfirmModal);
clearConfirmModal?.querySelector("[data-close-clear-confirm]")?.addEventListener("click", closeClearConfirmModal);
bindAdminTap(copyDateButton, () => beginDateTransfer("copy"));
bindAdminTap(moveDateButton, () => beginDateTransfer("move"));
bindAdminTap(closeDateActionButton, closeDateActionModal);
dateActionModal?.querySelector("[data-close-date-action]")?.addEventListener("click", closeDateActionModal);
bindAdminTap(confirmTransferButton, submitPendingDateTransfer);
bindAdminTap(pickTransferOnCalendarButton, () => {
  if (!pendingDateAction) {
    closeTransferDateModal();
    return;
  }
  const mode = pendingDateAction.mode;
  closeTransferDateModal({ keepPending: true });
  setDatePickerMode(mode);
  feedback.textContent =
    mode === "copy"
      ? "Нажми дату в календаре, куда скопировать слова."
      : "Нажми дату в календаре, куда переместить слова.";
  adminMonthCalendar?.scrollIntoView({ behavior: "smooth", block: "center" });
});
bindAdminTap(cancelTransferButton, closeTransferDateModal);
transferDateModal?.querySelector("[data-close-transfer-date]")?.addEventListener("click", () => closeTransferDateModal());

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !transferDateModal?.classList.contains("is-hidden")) {
    submitPendingDateTransfer();
    return;
  }
  if (event.key === "Escape" && !clearConfirmModal?.classList.contains("is-hidden")) {
    closeClearConfirmModal();
    return;
  }
  if (event.key === "Escape" && !transferDateModal?.classList.contains("is-hidden")) {
    closeTransferDateModal();
    return;
  }
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

addCategoryButton.addEventListener("click", () => {
  content.categories = normalizeCategories(content.categories, content.phrases);
  content.categories.push({
    id: `category-${Date.now()}`,
    label: "Новая категория",
  });
  persistDraft();
  activeTab = "categories";
  document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.adminTab === "categories");
  });
  renderAdmin();
  feedback.textContent = "Новая категория добавлена. Напиши ей название.";
  window.requestAnimationFrame(() => {
    categorySection.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  content = mergeContentWithFactoryDefaults({
    soundUnits: clone(factoryDefaults.soundUnits),
    phrases: [],
    categories: clone(factoryDefaults.categories || defaultCategories),
    lessonSettings: [],
    daySettings: factoryDefaults.daySettings,
  });
  removeStorageItem(contentKey);
  removeStorageItem(contentDraftKey);
  feedback.textContent = "Слова очищены. Остались только правила произношения.";
  renderAdmin();
});

renderAdmin();
loadRepoContentForAdmin();
})();
