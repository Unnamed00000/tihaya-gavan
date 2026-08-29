const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт"];
const calendarWeekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const fullWeekDays = ["понедельник", "вторник", "среду", "четверг", "пятницу"];
const monthNames = [
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

const soundUnits = [
  {
    formula: "I = э",
    title: "I",
    hint: "Это отдельная палочка, не английская буква. Для первого обучения держи звук как короткое «э».",
    example: "Пример: Iуьйре, хIаъ, гIуллакхаш",
  },
  {
    formula: "ъ = э",
    title: "Ъ",
    hint: "Это не мягкий знак. Он похож на знак без своей обычной русской роли и читается ближе к короткому «э».",
    example: "Пример: ъ = э; точные слова можно добавить в админке",
  },
  {
    formula: "х + ь = хь",
    title: "Хь",
    hint: "Не читай как русскую Х. Это более мягкий горловой звук: язык и горло работают иначе.",
    example: "Пример: хьо, хьан, хьоьга",
  },
  {
    formula: "а + ь = аь",
    title: "Аь",
    hint: "Мягкий знак здесь не читается отдельно. Он меняет гласную и делает новый звук.",
    example: "Пример: аь, хьаь",
  },
  {
    formula: "о + ь = оь",
    title: "Оь",
    hint: "Это не обычное русское О. Звук произносится ближе и мягче.",
    example: "Пример: хьоьга",
  },
  {
    formula: "у + ь = уь",
    title: "Уь",
    hint: "Это отдельная гласная. Не растягивай как русское У, держи звук мягче.",
    example: "Пример: суьйре, Iуьйре",
  },
  {
    formula: "к + х = кх",
    title: "Кх",
    hint: "Глубокий звук К, произносится дальше в горле, чем обычная русская К.",
    example: "Пример: кхета, кхита",
  },
  {
    formula: "г + I = гI",
    title: "ГI",
    hint: "Буква I здесь не английская ай. Это палочка: она показывает особый горловой звук.",
    example: "Пример: гIуллакхаш",
  },
  {
    formula: "х + I = хI",
    title: "ХI",
    hint: "Это не ХЬ. Палочка делает звук более глубоким и резким.",
    example: "Пример: хIаъ, хIун",
  },
  {
    formula: "к + I = кI",
    title: "КI",
    hint: "Резкое К со смычкой. Звук короткий, не надо добавлять гласную после него.",
    example: "Пример: кIеззиг",
  },
];

const phrases = [
  {
    id: "salam",
    day: 0,
    category: "greeting",
    tag: "Приветствие",
    russian: "Привет / здравствуй",
    chechen: "Салам",
    pronunciation: "салам",
    query: "привет здравствуй салам",
  },
  {
    id: "marshalla",
    day: 0,
    category: "greeting",
    tag: "Приветствие",
    russian: "Здравствуйте",
    chechen: "Маршалла ду хьоьга",
    pronunciation: "маршалла ду хьога",
    query: "здравствуйте приветствие",
  },
  {
    id: "morning",
    day: 0,
    category: "greeting",
    tag: "Приветствие",
    russian: "Доброе утро",
    chechen: "Iуьйре дика хуьлда",
    pronunciation: "уьйре дика хуьлда",
    query: "доброе утро",
  },
  {
    id: "day",
    day: 0,
    category: "greeting",
    tag: "Приветствие",
    russian: "Добрый день",
    chechen: "Де дика хуьлда",
    pronunciation: "де дика хуьлда",
    query: "добрый день",
  },
  {
    id: "evening",
    day: 0,
    category: "greeting",
    tag: "Приветствие",
    russian: "Добрый вечер",
    chechen: "Суьйре дика хуьлда",
    pronunciation: "суьйре дика хуьлда",
    query: "добрый вечер",
  },
  {
    id: "goodbye",
    day: 1,
    category: "greeting",
    tag: "Приветствие",
    russian: "До свидания",
    chechen: "Марша Iайла",
    pronunciation: "марша айла",
    query: "до свидания пока",
  },
  {
    id: "thanks",
    day: 1,
    category: "polite",
    tag: "Вежливость",
    russian: "Спасибо",
    chechen: "Баркалла",
    pronunciation: "баркалла",
    query: "спасибо благодарю",
  },
  {
    id: "welcome",
    day: 1,
    category: "polite",
    tag: "Вежливость",
    russian: "Пожалуйста / не за что",
    chechen: "Массарна а",
    pronunciation: "массарна а",
    query: "пожалуйста не за что",
  },
  {
    id: "excuse",
    day: 1,
    category: "polite",
    tag: "Вежливость",
    russian: "Извините",
    chechen: "Бехк ма биллахь",
    pronunciation: "бехк ма биллахь",
    query: "извините простите",
  },
  {
    id: "wait",
    day: 1,
    category: "polite",
    tag: "Вежливость",
    russian: "Подождите",
    chechen: "Собар де",
    pronunciation: "собар де",
    query: "подождите жди",
  },
  {
    id: "yes",
    day: 2,
    category: "talk",
    tag: "Разговор",
    russian: "Да",
    chechen: "ХIаъ",
    pronunciation: "хьа",
    query: "да согласие",
  },
  {
    id: "no",
    day: 2,
    category: "talk",
    tag: "Разговор",
    russian: "Нет",
    chechen: "ХIан-хIа",
    pronunciation: "хан-ха",
    query: "нет отказ",
  },
  {
    id: "maybe",
    day: 2,
    category: "talk",
    tag: "Разговор",
    russian: "Может быть",
    chechen: "Хила тарло",
    pronunciation: "хила тарло",
    query: "может быть возможно",
  },
  {
    id: "repeat",
    day: 2,
    category: "polite",
    tag: "Вежливость",
    russian: "Повторите, пожалуйста",
    chechen: "Юхаала хьар ахь",
    pronunciation: "юхаала хьар ахь",
    query: "повторите пожалуйста снова",
  },
  {
    id: "write",
    day: 2,
    category: "polite",
    tag: "Вежливость",
    russian: "Напишите, пожалуйста",
    chechen: "Яздан хьар ахь",
    pronunciation: "яздан хьар ахь",
    query: "напишите пожалуйста",
  },
  {
    id: "howareyou",
    day: 3,
    category: "talk",
    tag: "Разговор",
    russian: "Как дела?",
    chechen: "Муха ду гIуллакхаш?",
    pronunciation: "муха ду гуллакхаш",
    query: "как дела",
  },
  {
    id: "fine",
    day: 3,
    category: "talk",
    tag: "Разговор",
    russian: "Хорошо, спасибо",
    chechen: "Дика ду, баркалла",
    pronunciation: "дика ду, баркалла",
    query: "хорошо спасибо",
  },
  {
    id: "name",
    day: 3,
    category: "talk",
    tag: "Разговор",
    russian: "Как тебя зовут?",
    chechen: "Хьан цIе хIун ю?",
    pronunciation: "хьан це хун ю",
    query: "имя зовут",
  },
  {
    id: "myname",
    day: 3,
    category: "talk",
    tag: "Разговор",
    russian: "Меня зовут ...",
    chechen: "Сан цIе ... ю",
    pronunciation: "сан це ... ю",
    query: "меня зовут имя",
  },
  {
    id: "nice",
    day: 3,
    category: "talk",
    tag: "Разговор",
    russian: "Приятно познакомиться",
    chechen: "Девзина хаза хета",
    pronunciation: "девзина хаза хета",
    query: "приятно познакомиться",
  },
  {
    id: "understand",
    day: 4,
    category: "talk",
    tag: "Разговор",
    russian: "Я понимаю",
    chechen: "Со кхета",
    pronunciation: "со кхета",
    query: "понимаю",
  },
  {
    id: "dontunderstand",
    day: 4,
    category: "talk",
    tag: "Разговор",
    russian: "Я не понимаю",
    chechen: "Со ца кхета",
    pronunciation: "со ца кхета",
    query: "не понимаю",
  },
  {
    id: "dontknow",
    day: 4,
    category: "talk",
    tag: "Разговор",
    russian: "Я не знаю",
    chechen: "Суна ца хаа",
    pronunciation: "суна ца хаа",
    query: "не знаю",
  },
  {
    id: "speakchechen",
    day: 4,
    category: "talk",
    tag: "Разговор",
    russian: "Ты говоришь по-чеченски?",
    chechen: "Ахь нохчийн мотт бийций?",
    pronunciation: "ахь нохчийн мотт бийций",
    query: "говоришь по чеченски",
  },
  {
    id: "little",
    day: 4,
    category: "talk",
    tag: "Разговор",
    russian: "Да, немного",
    chechen: "ХIаъ, цхьан жимма",
    pronunciation: "хьа, цхьан жимма",
    query: "да немного чуть чуть",
  },
];

const today = new Date();
const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const browserDay = todayDate.getDay();
const todayIndex = browserDay === 0 ? 6 : browserDay - 1;
const isWeekend = todayIndex > 4;
const availableDayLimit = isWeekend ? 4 : Math.min(todayIndex, 4);
const contentStorageKey = "tihayaContent";
const contentDraftStorageKey = "tihayaContentDraft";
const settingsStorageKey = "tihayaSettings";
const remoteContentUrl = "./content.json";
const appVersion = "2.0.1";
const accentOptions = [
  { name: "Зелёный", deep: "#0f4d35", green: "#1f7a52", theme: "#0f4d35" },
  { name: "Морской", deep: "#155e63", green: "#23858c", theme: "#155e63" },
  { name: "Синий", deep: "#234f8f", green: "#3774c7", theme: "#234f8f" },
  { name: "Бордовый", deep: "#7f2b38", green: "#b54655", theme: "#7f2b38" },
  { name: "Золотой", deep: "#7a4f13", green: "#c78b2f", theme: "#7a4f13" },
];
const defaultSettings = {
  theme: "light",
  accent: 0,
  sound: true,
  volume: 80,
  vibration: true,
  vibrationStrength: 40,
};
const defaultSoundUnits = JSON.parse(JSON.stringify(soundUnits));

function getSoundKey(unit) {
  return `${unit.title || ""}|${unit.formula || ""}`.toLocaleLowerCase("ru-RU");
}

function addMissingDefaultSoundUnits() {
  const existingKeys = new Set(soundUnits.map(getSoundKey));
  defaultSoundUnits.forEach((unit) => {
    if (!existingKeys.has(getSoundKey(unit))) {
      soundUnits.push(JSON.parse(JSON.stringify(unit)));
    }
  });
}

window.tihayaFactoryDefaults = JSON.parse(JSON.stringify({ soundUnits, phrases }));
window.tihayaContentStorageKey = contentStorageKey;
window.tihayaContentDraftStorageKey = contentDraftStorageKey;
window.tihayaRemoteContentUrl = remoteContentUrl;

try {
  const savedContent = JSON.parse(localStorage.getItem(contentStorageKey) || "null");
  if (savedContent?.soundUnits?.length) soundUnits.splice(0, soundUnits.length, ...savedContent.soundUnits);
  if (savedContent?.phrases?.length) phrases.splice(0, phrases.length, ...savedContent.phrases);
  addMissingDefaultSoundUnits();
} catch {
  localStorage.removeItem(contentStorageKey);
}

function loadSettings() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem(settingsStorageKey) || "null");
    return { ...defaultSettings, ...(savedSettings || {}) };
  } catch {
    localStorage.removeItem(settingsStorageKey);
    return { ...defaultSettings };
  }
}

window.tihayaContent = { soundUnits, phrases };

function applySharedContent(content) {
  if (content?.soundUnits?.length) soundUnits.splice(0, soundUnits.length, ...content.soundUnits);
  if (content?.phrases?.length) phrases.splice(0, phrases.length, ...content.phrases);
  addMissingDefaultSoundUnits();
  window.tihayaContent = { soundUnits, phrases };
}

const state = {
  category: "all",
  scope: "schedule",
  search: "",
  learned: new Set(JSON.parse(localStorage.getItem("learnedPhrases") || "[]")),
  quiz: null,
  calendarYear: todayDate.getFullYear(),
  calendarMonth: todayDate.getMonth(),
  selectedDate: null,
  selectedDay: null,
  settings: loadSettings(),
};

const calendarScreen = document.querySelector("#calendar-screen");
const rulesScreen = document.querySelector("#rules-screen");
const lessonContent = document.querySelector("#lesson-content");
const phraseGrid = document.querySelector("#phrase-grid");
const template = document.querySelector("#phrase-template");
const soundGrid = document.querySelector("#sound-grid");
const soundTemplate = document.querySelector("#sound-template");
const searchInput = document.querySelector("#search-input");
const learnedCount = document.querySelector("#learned-count");
const totalCount = document.querySelector("#total-count");
const totalLabel = document.querySelector("#total-label");
const questionRussian = document.querySelector("#question-russian");
const answerOptions = document.querySelector("#answer-options");
const quizFeedback = document.querySelector("#quiz-feedback");
const scheduleTitle = document.querySelector("#schedule-title");
const scheduleSubtitle = document.querySelector("#schedule-subtitle");
const monthCalendar = document.querySelector("#month-calendar");
const monthTitle = document.querySelector("#month-title");
const lessonTitle = document.querySelector("#lesson-title");
const lessonNote = document.querySelector("#lesson-note");
const lessonKicker = document.querySelector("#lesson-kicker");
const installButton = document.querySelector("#install-app");
const openSettingsButton = document.querySelector("#open-settings");
const settingsModal = document.querySelector("#settings-modal");
const closeSettingsButton = document.querySelector("#close-settings");
const appVersionLabel = document.querySelector("#app-version");
const themeToggle = document.querySelector("#theme-toggle");
const themeValue = document.querySelector("#theme-value");
const accentRange = document.querySelector("#accent-range");
const colorValue = document.querySelector("#color-value");
const soundToggle = document.querySelector("#sound-toggle");
const soundToggleValue = document.querySelector("#sound-toggle-value");
const volumeRange = document.querySelector("#volume-range");
const volumeValue = document.querySelector("#volume-value");
const vibrationToggle = document.querySelector("#vibration-toggle");
const vibrationToggleValue = document.querySelector("#vibration-toggle-value");
const vibrationRange = document.querySelector("#vibration-range");
const vibrationValue = document.querySelector("#vibration-value");

const normalize = (value) => value.toLocaleLowerCase("ru-RU").replaceAll("ӏ", "i").replaceAll("і", "i");

function saveSettings() {
  localStorage.setItem(settingsStorageKey, JSON.stringify(state.settings));
}

function applySettings() {
  const accent = accentOptions[state.settings.accent] || accentOptions[0];
  document.body.dataset.theme = state.settings.theme;
  document.documentElement.style.setProperty("--green-deep", accent.deep);
  document.documentElement.style.setProperty("--green", accent.green);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", accent.theme);

  if (appVersionLabel) appVersionLabel.textContent = appVersion;
  if (themeToggle) themeToggle.checked = state.settings.theme === "dark";
  if (themeValue) themeValue.textContent = state.settings.theme === "dark" ? "Тёмная" : "Светлая";
  if (accentRange) accentRange.value = String(state.settings.accent);
  if (colorValue) colorValue.textContent = accent.name;
  if (soundToggle) soundToggle.checked = state.settings.sound;
  if (soundToggleValue) soundToggleValue.textContent = state.settings.sound ? "Включён" : "Выключен";
  if (volumeRange) volumeRange.value = String(state.settings.volume);
  if (volumeValue) volumeValue.textContent = `${state.settings.volume}%`;
  if (vibrationToggle) vibrationToggle.checked = state.settings.vibration;
  if (vibrationToggleValue) vibrationToggleValue.textContent = state.settings.vibration ? "Включена" : "Выключена";
  if (vibrationRange) vibrationRange.value = String(state.settings.vibrationStrength);
  if (vibrationValue) vibrationValue.textContent = `${state.settings.vibrationStrength}%`;
}

function updateSettings(nextSettings) {
  state.settings = { ...state.settings, ...nextSettings };
  saveSettings();
  applySettings();
}

function triggerVibration(multiplier = 1) {
  if (!state.settings.vibration || !("vibrate" in navigator)) return;
  const duration = Math.max(8, Math.round(state.settings.vibrationStrength * multiplier));
  navigator.vibrate(duration);
}

function playAudioUrl(url) {
  if (!url || !state.settings.sound || state.settings.volume <= 0) return;
  const audio = new Audio(url);
  audio.volume = Math.min(1, Math.max(0, state.settings.volume / 100));
  audio.play().catch(() => {});
}

function openSettings() {
  settingsModal?.classList.remove("is-hidden");
  document.body.classList.add("settings-open");
  openSettingsButton?.setAttribute("aria-expanded", "true");
  closeSettingsButton?.focus();
}

function closeSettings() {
  settingsModal?.classList.add("is-hidden");
  document.body.classList.remove("settings-open");
  openSettingsButton?.setAttribute("aria-expanded", "false");
  openSettingsButton?.focus();
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getCalendarDayIndex(date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

function isSameDate(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function formatLessonDate(date) {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
}

function formatRouteDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseRouteDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function setRoute(route, replace = false) {
  const nextHash = `#${route}`;
  const nextUrl = `${location.pathname}${location.search}${nextHash}`;
  if (location.hash === nextHash) return;
  if (replace) {
    history.replaceState(null, "", nextUrl);
  } else {
    history.pushState(null, "", nextUrl);
  }
}

function getSchedulePhrases() {
  const date = state.selectedDate || todayDate;
  const dayIndex = getCalendarDayIndex(date);

  if (dayIndex > 4) return phrases;
  return phrases.filter((phrase) => phrase.day === dayIndex);
}

function isDayAvailable(index) {
  return index <= availableDayLimit;
}

function isCalendarDateAvailable(date) {
  return startOfDay(date).getTime() <= todayDate.getTime();
}

function getAvailablePhrases() {
  return phrases.filter((phrase) => isDayAvailable(phrase.day));
}

function getScopePhrases() {
  if (state.scope === "schedule") return getSchedulePhrases();
  if (state.scope === "all" || state.scope === "week") return getAvailablePhrases();
  return getSchedulePhrases();
}

function getVisiblePhrases() {
  const search = normalize(state.search.trim());
  return getScopePhrases().filter((phrase) => {
    const inCategory = state.category === "all" || phrase.category === state.category;
    const haystack = normalize(`${phrase.russian} ${phrase.chechen} ${phrase.pronunciation} ${phrase.query}`);
    return inCategory && (!search || haystack.includes(search));
  });
}

function persistProgress() {
  localStorage.setItem("learnedPhrases", JSON.stringify([...state.learned]));
}

function updateStats() {
  const scopedIds = new Set(getScopePhrases().map((phrase) => phrase.id));
  const learnedInScope = [...state.learned].filter((id) => scopedIds.has(id)).length;
  learnedCount.textContent = String(learnedInScope);
  totalCount.textContent = String(scopedIds.size);
  totalLabel.textContent = state.scope === "schedule" ? "в уроке" : "доступно";
}

function updateScheduleCopy() {
  if (state.selectedDate) {
    const dayIndex = getCalendarDayIndex(state.selectedDate);
    const selectedDateLabel = formatLessonDate(state.selectedDate);

    if (dayIndex > 4) {
      scheduleTitle.textContent = "Повторение всей недели.";
      scheduleSubtitle.textContent = "В выходной день новые слова не открываются: повтори весь материал с понедельника по пятницу.";
      lessonKicker.textContent = "Повторение";
      lessonTitle.textContent = selectedDateLabel;
      lessonNote.textContent = "Открыты все 25 слов недели для закрепления.";
      return;
    }

    const dayName = fullWeekDays[dayIndex];
    scheduleTitle.textContent = `Материал на ${dayName}.`;
    scheduleSubtitle.textContent = "Сегодняшний урок: 5 слов дня и короткая проверка.";
    lessonKicker.textContent = "Материал дня";
    lessonTitle.textContent = selectedDateLabel;
    lessonNote.textContent = "Открыты только слова выбранной даты. Будущие даты появятся в календаре позже.";
    return;
  }

  if (isWeekend) {
    scheduleTitle.textContent = "Выходные: повторение всей недели.";
    scheduleSubtitle.textContent =
      "Сегодня новые слова не открываются. Повтори все 25 слов, которые были с понедельника по пятницу.";
    return;
  }

  scheduleTitle.textContent = `Сегодня ${fullWeekDays[todayIndex]}: 5 новых слов.`;
  scheduleSubtitle.textContent =
    "Будущие дни в календаре закрыты. Когда наступит новый день, откроются еще 5 слов; на выходных будет повторение всей недели.";
}

function clearSelectedDay() {
  state.selectedDate = null;
  state.selectedDay = null;
  document.querySelectorAll(".calendar-day").forEach((item) => item.classList.remove("is-selected"));
}

function showCalendar(options = {}) {
  if (options.updateRoute !== false) setRoute("calendar", options.replaceRoute);
  clearSelectedDay();
  state.scope = "schedule";
  state.search = "";
  searchInput.value = "";
  calendarScreen.classList.remove("is-hidden");
  rulesScreen.classList.add("is-hidden");
  lessonContent.classList.add("is-hidden");
  document.querySelectorAll("[data-scope]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scope === "schedule");
  });
  updateScheduleCopy();
  updateStats();
  renderMonthCalendar();
}

function showRules(options = {}) {
  if (options.updateRoute !== false) setRoute("rules", options.replaceRoute);
  clearSelectedDay();
  calendarScreen.classList.add("is-hidden");
  lessonContent.classList.add("is-hidden");
  rulesScreen.classList.remove("is-hidden");
}

function openDate(date, options = {}) {
  if (!isCalendarDateAvailable(date)) return;
  const dayIndex = getCalendarDayIndex(date);

  state.selectedDate = startOfDay(date);
  state.selectedDay = dayIndex > 4 ? null : dayIndex;
  state.calendarYear = date.getFullYear();
  state.calendarMonth = date.getMonth();
  state.scope = "schedule";
  state.category = "all";
  state.search = "";
  if (options.updateRoute !== false) setRoute(`date=${formatRouteDate(date)}`, options.replaceRoute);
  searchInput.value = "";
  calendarScreen.classList.add("is-hidden");
  rulesScreen.classList.add("is-hidden");
  lessonContent.classList.remove("is-hidden");
  document.querySelectorAll("[data-scope]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scope === "schedule");
  });
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === "all");
  });
  updateScheduleCopy();
  updateStats();
  renderMonthCalendar();
  renderPhrases();
  newQuestion();
}

function syncViewToRoute() {
  const route = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (route === "rules") {
    showRules({ updateRoute: false });
    return;
  }

  if (route.startsWith("date=")) {
    const routeDate = parseRouteDate(route.slice(5));
    if (routeDate && isCalendarDateAvailable(routeDate)) {
      openDate(routeDate, { updateRoute: false });
      return;
    }
  }

  showCalendar({ updateRoute: false, replaceRoute: true });
}

function getWeekNumber(date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
}

function renderMonthCalendar() {
  monthCalendar.innerHTML = "";
  monthTitle.textContent = `${monthNames[state.calendarMonth]} ${state.calendarYear}`;

  const firstOfMonth = new Date(state.calendarYear, state.calendarMonth, 1);
  const firstGridDate = new Date(firstOfMonth);
  firstGridDate.setDate(firstOfMonth.getDate() - getCalendarDayIndex(firstOfMonth));

  for (let week = 0; week < 6; week += 1) {
    const weekStart = new Date(firstGridDate);
    weekStart.setDate(firstGridDate.getDate() + week * 7);

    const weekNumber = document.createElement("div");
    weekNumber.className = "week-number";
    weekNumber.textContent = String(getWeekNumber(weekStart));
    monthCalendar.append(weekNumber);

    calendarWeekDays.forEach((_, dayOffset) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayOffset);

      const dayIndex = getCalendarDayIndex(date);
      const isCurrentMonth = date.getMonth() === state.calendarMonth;
      const isAvailable = isCalendarDateAvailable(date);
      const isWeekendDate = dayIndex > 4;
      const lessonPhrases = isWeekendDate ? phrases : phrases.filter((phrase) => phrase.day === dayIndex);
      const learnedCountForDate = lessonPhrases.filter((phrase) => state.learned.has(phrase.id)).length;

      const item = document.createElement("button");
      item.type = "button";
      item.className = "calendar-day";
      item.disabled = !isAvailable || !isCurrentMonth;
      item.classList.toggle("is-outside", !isCurrentMonth);
      item.classList.toggle("is-today", isSameDate(date, todayDate));
      item.classList.toggle("is-selected", state.selectedDate && isSameDate(date, state.selectedDate));
      item.classList.toggle("is-locked", !isAvailable && isCurrentMonth);
      item.classList.toggle("is-review", isWeekendDate && isAvailable && isCurrentMonth);

      const status = !isCurrentMonth
        ? ""
        : !isAvailable
          ? "Закр."
          : isWeekendDate
            ? "Повт."
            : `${learnedCountForDate}/${lessonPhrases.length}`;

      item.setAttribute(
        "aria-label",
        !isCurrentMonth
          ? `${date.getDate()}, другой месяц`
          : !isAvailable
            ? `${date.getDate()} ${monthNames[date.getMonth()]}, пока закрыто`
            : `${date.getDate()} ${monthNames[date.getMonth()]}, ${isWeekendDate ? "повторение" : status}`,
      );

      item.innerHTML = `<strong>${date.getDate()}</strong><span>${status}</span>`;
      item.addEventListener("click", () => openDate(date));
      monthCalendar.append(item);
    });
  }
}

async function loadRemoteContent() {
  try {
    if (localStorage.getItem(contentDraftStorageKey) === "1") return;
    const response = await fetch(`${remoteContentUrl}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const remoteContent = await response.json();
    applySharedContent(remoteContent);
    localStorage.setItem(contentStorageKey, JSON.stringify({ soundUnits, phrases }));
    updateScheduleCopy();
    updateStats();
    renderSoundUnits();
    renderMonthCalendar();
    if (!lessonContent.classList.contains("is-hidden")) {
      renderPhrases();
      newQuestion();
    }
  } catch {
    // Keep the bundled or locally saved content when GitHub content.json is not available locally.
  }
}

function speak(phrase) {
  playAudioUrl(phrase.audioUrl);
}

function speakSound(unit) {
  playAudioUrl(unit.audioUrl);
}

function renderSoundUnits() {
  soundGrid.innerHTML = "";

  soundUnits.forEach((unit) => {
    const card = soundTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".sound-card__formula").textContent = unit.formula;
    card.querySelector("h3").textContent = unit.title;
    card.querySelector(".sound-card__hint").textContent = unit.hint;
    card.querySelector(".sound-card__example").textContent = unit.example;

    const audioButton = card.querySelector(".sound-audio");
    if (unit.audioUrl) {
      audioButton.addEventListener("click", () => {
        triggerVibration(0.45);
        speakSound(unit);
      });
    } else {
      audioButton.classList.add("is-hidden");
      audioButton.setAttribute("aria-hidden", "true");
      audioButton.tabIndex = -1;
    }

    soundGrid.append(card);
  });
}

function renderPhrases() {
  phraseGrid.innerHTML = "";
  const visiblePhrases = getVisiblePhrases();

  if (!visiblePhrases.length) {
    const empty = document.createElement("p");
    empty.className = "pronunciation";
    empty.textContent = "Такой фразы пока нет в этом наборе.";
    phraseGrid.append(empty);
    return;
  }

  visiblePhrases.forEach((phrase) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector(".tag").textContent = phrase.tag;
    card.querySelector(".day-pill").textContent = weekDays[phrase.day];
    card.querySelector(".russian").textContent = phrase.russian;
    card.querySelector(".chechen").textContent = phrase.chechen;
    card.querySelector(".pronunciation").textContent = phrase.pronunciation;

    const audioButton = card.querySelector(".audio-button");
    if (phrase.audioUrl) {
      audioButton.addEventListener("click", () => {
        triggerVibration(0.45);
        speak(phrase);
      });
    } else {
      audioButton.classList.add("is-hidden");
      audioButton.setAttribute("aria-hidden", "true");
      audioButton.tabIndex = -1;
    }

    const learnedButton = card.querySelector(".learned-toggle");
    const isDone = state.learned.has(phrase.id);
    learnedButton.textContent = isDone ? "Выучено" : "Отметить выученным";
    learnedButton.classList.toggle("is-done", isDone);
    learnedButton.addEventListener("click", () => {
      triggerVibration(0.65);
      if (state.learned.has(phrase.id)) {
        state.learned.delete(phrase.id);
      } else {
        state.learned.add(phrase.id);
      }
      persistProgress();
      updateStats();
      renderMonthCalendar();
      renderPhrases();
    });

    phraseGrid.append(card);
  });
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function newQuestion() {
  const quizPool = getScopePhrases();
  if (!quizPool.length) return;
  const correct = quizPool[Math.floor(Math.random() * quizPool.length)];
  const wrongAnswers = shuffle(getAvailablePhrases().filter((phrase) => phrase.id !== correct.id)).slice(0, 3);
  state.quiz = correct;
  quizFeedback.textContent = "";
  questionRussian.textContent = correct.russian;
  answerOptions.innerHTML = "";

  shuffle([correct, ...wrongAnswers]).forEach((phrase) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = phrase.chechen;
    button.addEventListener("click", () => {
      triggerVibration(phrase.id === correct.id ? 0.8 : 0.35);
      const isCorrect = phrase.id === correct.id;
      button.classList.add(isCorrect ? "correct" : "wrong");
      quizFeedback.textContent = isCorrect ? "Верно. Баркалла!" : `Почти. Правильно: ${correct.chechen}`;
      if (isCorrect) {
        state.learned.add(correct.id);
        persistProgress();
        updateStats();
        renderMonthCalendar();
        renderPhrases();
      }
      [...answerOptions.children].forEach((option) => {
        option.disabled = true;
        if (option.textContent === correct.chechen) option.classList.add("correct");
      });
    });
    answerOptions.append(button);
  });
}

applySettings();

openSettingsButton?.addEventListener("click", () => {
  triggerVibration(0.35);
  openSettings();
});

closeSettingsButton?.addEventListener("click", closeSettings);

settingsModal?.querySelector("[data-close-settings]")?.addEventListener("click", closeSettings);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !settingsModal?.classList.contains("is-hidden")) {
    closeSettings();
  }
});

themeToggle?.addEventListener("change", (event) => {
  updateSettings({ theme: event.target.checked ? "dark" : "light" });
  triggerVibration(0.35);
});

accentRange?.addEventListener("input", (event) => {
  updateSettings({ accent: Number(event.target.value) });
});

soundToggle?.addEventListener("change", (event) => {
  updateSettings({ sound: event.target.checked });
  triggerVibration(0.35);
});

volumeRange?.addEventListener("input", (event) => {
  updateSettings({ volume: Number(event.target.value) });
});

vibrationToggle?.addEventListener("change", (event) => {
  updateSettings({ vibration: event.target.checked });
  triggerVibration(0.45);
});

vibrationRange?.addEventListener("input", (event) => {
  updateSettings({ vibrationStrength: Number(event.target.value) });
});

if (phraseGrid) {
  document.querySelectorAll("[data-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      state.scope = button.dataset.scope;
      document.querySelectorAll("[data-scope]").forEach((segment) => {
        segment.classList.toggle("is-active", segment === button);
      });
      updateScheduleCopy();
      updateStats();
      renderMonthCalendar();
      renderPhrases();
      newQuestion();
    });
  });

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      document.querySelectorAll("[data-category]").forEach((segment) => {
        segment.classList.toggle("is-active", segment === button);
      });
      renderPhrases();
    });
  });

  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderPhrases();
  });

  document.querySelector("#next-question").addEventListener("click", newQuestion);
  document.querySelector("#back-to-calendar").addEventListener("click", showCalendar);
  document.querySelector("#open-rules").addEventListener("click", showRules);
  document.querySelector("#back-from-rules").addEventListener("click", showCalendar);
  document.querySelector("#prev-month").addEventListener("click", () => {
    state.calendarMonth -= 1;
    if (state.calendarMonth < 0) {
      state.calendarMonth = 11;
      state.calendarYear -= 1;
    }
    renderMonthCalendar();
  });
  document.querySelector("#next-month").addEventListener("click", () => {
    state.calendarMonth += 1;
    if (state.calendarMonth > 11) {
      state.calendarMonth = 0;
      state.calendarYear += 1;
    }
    renderMonthCalendar();
  });

  renderSoundUnits();
  renderMonthCalendar();
  syncViewToRoute();
  loadRemoteContent();
  window.addEventListener("popstate", syncViewToRoute);
  window.addEventListener("hashchange", syncViewToRoute);
}

let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton?.classList.remove("is-hidden");
});

installButton?.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.classList.add("is-hidden");
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
