const contentKey = window.tihayaContentStorageKey || "tihayaContent";
const factoryDefaults = window.tihayaFactoryDefaults || { soundUnits: [], phrases: [] };

let content = JSON.parse(localStorage.getItem(contentKey) || "null") || JSON.parse(JSON.stringify(factoryDefaults));
let activeTab = "phrases";

const phraseSection = document.querySelector("#admin-phrases");
const soundSection = document.querySelector("#admin-sounds");
const audioSection = document.querySelector("#admin-audio");
const audioList = document.querySelector("#admin-audio-list");
const feedback = document.querySelector("#admin-feedback");

function saveContent() {
  localStorage.setItem(contentKey, JSON.stringify(content));
  feedback.textContent = "Сохранено. Клиентская страница теперь возьмет этот материал.";
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

function renderPhrasesAdmin() {
  phraseSection.innerHTML = "";

  content.phrases.forEach((phrase, index) => {
    const card = document.createElement("article");
    card.className = "admin-edit-card";

    const title = document.createElement("h2");
    title.textContent = phrase.russian || "Новое слово";

    const fields = document.createElement("div");
    fields.className = "admin-field-grid";
    fields.append(
      makeSelect(
        "День",
        phrase.day,
        [
          { value: 0, label: "Понедельник" },
          { value: 1, label: "Вторник" },
          { value: 2, label: "Среда" },
          { value: 3, label: "Четверг" },
          { value: 4, label: "Пятница" },
        ],
        (value) => {
          phrase.day = Number(value);
        },
      ),
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
    input.placeholder = "https://raw.githubusercontent.com/...";
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
        feedback.textContent = "Не получилось проиграть аудио. Проверь ссылку Raw из GitHub.";
      });
    });

    row.append(span, input, test);
    audioList.append(row);
  });
}

function renderAdmin() {
  renderPhrasesAdmin();
  renderSoundsAdmin();
  renderAudioAdmin();
}

document.querySelectorAll("[data-admin-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    activeTab = button.dataset.adminTab;
    document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
      tab.classList.toggle("is-active", tab === button);
    });
    phraseSection.classList.toggle("is-hidden", activeTab !== "phrases");
    soundSection.classList.toggle("is-hidden", activeTab !== "sounds");
    audioSection.classList.toggle("is-hidden", activeTab !== "audio");
  });
});

document.querySelector("#add-phrase").addEventListener("click", () => {
  content.phrases.push({
    id: `phrase-${Date.now()}`,
    day: 0,
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

document.querySelector("#add-sound").addEventListener("click", () => {
  content.soundUnits.push({
    formula: "",
    title: "",
    hint: "",
    example: "",
    audioUrl: "",
  });
  renderAdmin();
});

document.querySelector("#save-content").addEventListener("click", saveContent);

document.querySelector("#reset-content").addEventListener("click", () => {
  content = JSON.parse(JSON.stringify(factoryDefaults));
  localStorage.removeItem(contentKey);
  feedback.textContent = "Сброшено к начальному материалу.";
  renderAdmin();
});

renderAdmin();
