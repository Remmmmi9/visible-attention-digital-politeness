
const words = document.querySelectorAll(".pause-word");
const dropArea = document.getElementById("dropArea");
const chosenWords = document.getElementById("chosenWords");
const reflection = document.getElementById("generatedReflection");

let selected = [];

function joinWords(list) {
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;
}

function updateReflection() {
  if (!selected.length) {
    reflection.innerHTML = "<span>before the reply</span><p>Choose a few words to make the invisible part of the pause visible.</p>";
    return;
  }

  const sentence = joinWords(selected.slice(0, 4));
  let ending = "This pause is not empty.";

  if (selected.includes("translating") || selected.includes("finding words")) {
    ending = "The reply needs language before it needs speed.";
  }

  if (selected.includes("still caring") || selected.includes("softening")) {
    ending = "It carries care before the message is sent.";
  }

  if (selected.includes("too direct?")) {
    ending = "It becomes a small space for judging tone.";
  }

  reflection.innerHTML = `<span>your pause carries</span><p>${sentence}. ${ending}</p><button type="button" class="clear-pause" id="clearPause">clear</button>`;

  const clear = document.getElementById("clearPause");
  if (clear) {
    clear.addEventListener("click", () => {
      selected = [];
      chosenWords.innerHTML = "";
      document.querySelectorAll(".pause-word.selected").forEach(word => word.classList.remove("selected"));
      updateReflection();
    });
  }
}

function addWord(word, sourceButton) {
  if (!word || selected.includes(word)) return;
  selected.push(word);

  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chosen-chip";
  chip.textContent = word;
  chip.setAttribute("aria-label", `Remove ${word}`);
  chip.addEventListener("click", () => {
    selected = selected.filter(item => item !== word);
    chip.remove();
    if (sourceButton) sourceButton.classList.remove("selected");
    updateReflection();
  });

  chosenWords.appendChild(chip);
  if (sourceButton) sourceButton.classList.add("selected");
  updateReflection();
}

words.forEach(wordButton => {
  wordButton.addEventListener("dragstart", event => {
    event.dataTransfer.setData("text/plain", wordButton.dataset.word);
  });

  wordButton.addEventListener("click", () => {
    addWord(wordButton.dataset.word, wordButton);
  });
});

if (dropArea) {
  ["dragenter", "dragover"].forEach(type => {
    dropArea.addEventListener(type, event => {
      event.preventDefault();
      dropArea.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach(type => {
    dropArea.addEventListener(type, () => {
      dropArea.classList.remove("is-dragging");
    });
  });

  dropArea.addEventListener("drop", event => {
    event.preventDefault();
    const word = event.dataTransfer.getData("text/plain");
    const sourceButton = document.querySelector(`.pause-word[data-word="${CSS.escape(word)}"]`);
    addWord(word, sourceButton);
  });
}

updateReflection();
