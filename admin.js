const contentKey = window.tihayaContentStorageKey || "tihayaContent";
const contentDraftKey = window.tihayaContentDraftStorageKey || "tihayaContentDraft";
const factoryDefaults = window.tihayaFactoryDefaults || { soundUnits: [], phrases: [] };
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

const clone = (value) => JSON.parse(JSON.stringify(value));

let content = mergeContentWithFactoryDefaults(JSON.parse(localStorage.getItem(contentKey) || "null"));
let activeTab = "phrases";
let activeDay = 0;

const phraseSection = document.querySelector("#admin-phrases");
const soundSection = document.querySelector("#admin-sounds");
const audioSection = document.querySelector("#admin-audio");
const audioList = document.querySelector("#admin-audio-list");
const dayGrid = document.querySelector("#admin-day-grid");
const daySummary = document.querySelector("#admin-day-summary");
const feedback = document.querySelector("#admin-feedback");
const addPhraseButton = document.querySelector("#add-phrase");
const addSoundButton = document.querySelector("#add-sound");
const saveButton = document.querySelector("#save-content");
const exportButton = document.querySelector("#export-content");
const resetButton = document.querySelector("#reset-content");
const importInput = document.querySelector("#import-content");

function getSoundKey(unit) {
  return `${unit.title || ""}|${unit.formula || ""}`.toLocaleLowerCase("ru-RU");
}

function mergeContentWithFactoryDefaults(nextContent) {
  const mergedContent = {
    soundUnits: nextContent?.soundUnits?.length ? nextContent.soundUnits : clone(factoryDefaults.soundUnits),
    phrases: nextContent?.phrases?.length ? nextContent.phrases : clone(factoryDefaults.phrases),
  };
  const existingKeys = new Set(mergedContent.soundUnits.map(getSoundKey));

  factoryDefaults.soundUnits.forEach((unit) => {
    if (!existingKeys.has(getSoundKey(unit))) {
      mergedContent.soundUnits.push(clone(unit));
    }
  });

  return mergedContent;
}

function getCleanContent() {
  return {
    soundUnits: content.soundUnits.map((unit) => ({
      formula: unit.formula || "",
      title: unit.title || "",
      hint: unit.hint || "",
      example: unit.example || "",
      audioUrl: unit.audioUrl || "",
    })),
    phrases: content.phrases.map((phrase) => ({
      id: phrase.id || `phrase-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      day: Number(phrase.day) || 0,
      category: phrase.category || "talk",
      tag: phrase.tag || "Разговор",
      russian: phrase.russian || "",
      chechen: phrase.chechen || "",
      pronunciation: phrase.pronunciation || "",
      query: phrase.query || "",
      audioUrl: phrase.audioUrl || "",
    })),
  };
}

function persistLocal(message = "Сохранено на этом устройстве.") {
  content = mergeContentWithFactoryDefaults(getCleanContent());
  localStorage.setItem(contentKey, JSON.stringify(content));
  localStorage.setItem(contentDraftKey, "1");
  feedback.textContent = message;
  renderAdmin();
}

async function loadRepoContentForAdmin() {
  if (localStorage.getItem(contentDraftKey) === "1") {
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
    localStorage.setItem(contentKey, JSON.stringify(content));
    feedback.textContent = "Материал загружен из content.json. Можно редактировать.";
    renderAdmin();
  } catch {
    feedback.textContent = "Показана локальная копия. Для общей публикации скачай content.json и загрузи его в папку data на GitHub.";
  }
}

function downloadContentJson() {
  content = mergeContentWithFactoryDefaults(getCleanContent());
  localStorage.setItem(contentKey, JSON.stringify(content));
  localStorage.setItem(contentDraftKey, "1");

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
      localStorage.setItem(contentKey, JSON.stringify(content));
      localStorage.setItem(contentDraftKey, "1");
      feedback.textContent = "content.json загружен в админку.";
      renderAdmin();
    } catch {
      feedback.textContent = "Не получилось прочитать JSON. Проверь файл content.json.";
    }
  });
  reader.readAsText(file);
}

function makeField(labelText, value, onInput, type = "text") {
  const label = document.createElement("label");
  label.className = "admin-field";

  const span = document.createElement("span");
  span.textContent = labelText;

  const input = document.createElement(type === "textarea" ? "textarea" : "input");
  if (type !== "textarea") input.type = type;
  input.value = value || "";
  input.addEventListener("input", () => onInput(input.value));

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
  select.addEventListener("change", () => onInput(select.value));

  label.append(span, select);
  return label;
}

function renderDayBoard() {
  dayGrid.innerHTML = "";

  dayOptions.forEach((day) => {
    const phrasesForDay = content.phrases.filter((phrase) => Number(phrase.day) === day.value);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "admin-day";
    button.classList.toggle("is-active", activeDay === day.value);
    button.classList.toggle("is-review", day.mode === "review");
    button.innerHTML = `
      <span>${day.short}</span>
      <strong>${day.label}</strong>
      <em>${day.mode === "review" ? "повторение" : `${phrasesForDay.length}/5 слов`}</em>
    `;
    button.addEventListener("click", () => {
      activeDay = day.value;
      renderAdmin();
    });
    dayGrid.append(button);
  });
}

function getActivePhrasesWithIndex() {
  return content.phrases
    .map((phrase, index) => ({ phrase, index }))
    .filter(({ phrase }) => activeDay > 4 || Number(phrase.day) === activeDay);
}

function renderDaySummary() {
  const day = dayOptions.find((item) => item.value === activeDay);
  const weekdayCounts = dayOptions
    .slice(0, 5)
    .map((item) => content.phrases.filter((phrase) => Number(phrase.day) === item.value).length);
  const totalWeekPhrases = weekdayCounts.reduce((sum, count) => sum + count, 0);

  if (activeDay > 4) {
    daySummary.innerHTML = `<strong>${day.label}: повторение</strong><span>Клиент увидит все слова недели: ${totalWeekPhrases}. Новые слова в выходные не добавляются.</span>`;
  } else {
    const currentCount = weekdayCounts[activeDay];
    daySummary.innerHTML = `<strong>${day.label}</strong><span>Для этого дня желательно 5 слов. Сейчас: ${currentCount}/5.</span>`;
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

  visiblePhrases.forEach(({ phrase, index }) => {
    const card = document.createElement("article");
    card.className = "admin-edit-card";

    const title = document.createElement("h2");
    title.textContent = phrase.russian || "Новое слово";

    const fields = document.createElement("div");
    fields.className = "admin-field-grid";
    fields.append(
      makeSelect("День", phrase.day, dayOptions.slice(0, 5), (value) => {
        phrase.day = Number(value);
        renderAdmin();
      }),
      makeSelect(
        "Категория",
        phrase.category,
        [
          { value: "greeting", label: "Приветствие" },
          { value: "polite", label: "Вежливость" },
          { value: "talk", label: "Разговор" },
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
      renderAdmin();
    });

    card.append(title, fields, remove);
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

addPhraseButton.addEventListener("click", () => {
  if (activeDay > 4) return;
  content.phrases.push({
    id: `phrase-${Date.now()}`,
    day: activeDay,
    category: "talk",
    tag: "Разговор",
    russian: "",
    chechen: "",
    pronunciation: "",
    query: "",
    audioUrl: "",
  });
  renderAdmin();
});

addSoundButton.addEventListener("click", () => {
  content.soundUnits.push({
    formula: "",
    title: "",
    hint: "",
    example: "",
    audioUrl: "",
  });
  activeTab = "sounds";
  document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.adminTab === "sounds");
  });
  renderAdmin();
});

saveButton.addEventListener("click", () => {
  persistLocal("Сохранено на этом устройстве. Для клиентов скачай content.json и загрузи его в папку data на GitHub.");
});

exportButton.addEventListener("click", downloadContentJson);
importInput.addEventListener("change", () => importContentJson(importInput.files?.[0]));

resetButton.addEventListener("click", () => {
  content = clone(factoryDefaults);
  localStorage.removeItem(contentKey);
  localStorage.removeItem(contentDraftKey);
  feedback.textContent = "Сброшено к начальному материалу.";
  renderAdmin();
});

renderAdmin();
loadRepoContentForAdmin();
