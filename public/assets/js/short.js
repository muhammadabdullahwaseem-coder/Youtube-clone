"use strict";

/* Shorts List */
const shortsIds = [
  "6Y6C86zRvdI",
  "g8-EVsySHXg",
  "qC-Yadx3O4A",
  "BVyxC68kHdc",
  "XbbBbL8R3rI",
];

/* URL State */
function getQueryId() {
  return new URLSearchParams(window.location.search).get("id");
}

function setQueryId(id) {
  const url = new URL(window.location.href);
  url.searchParams.set("id", id);
  window.history.replaceState({}, "", url);
}

let currentIndex = 0;
const fromUrl = getQueryId();
if (fromUrl) {
  const i = shortsIds.indexOf(fromUrl);
  currentIndex = i >= 0 ? i : 0;
}

const player = document.getElementById("shortWrap");
const btnPrev = document.getElementById("prevShort");
const btnNext = document.getElementById("nextShort");

/* Shorts Player Controls */
function render() {
  const id = shortsIds[currentIndex];
  setQueryId(id);

  player.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1"
      allow="autoplay; encrypted-media"
      allowfullscreen>
    </iframe>
  `;

  btnPrev.disabled = currentIndex === 0;
  btnNext.disabled = currentIndex === shortsIds.length - 1;
}

btnPrev.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    render();
  }
});

btnNext.addEventListener("click", () => {
  if (currentIndex < shortsIds.length - 1) {
    currentIndex++;
    render();
  }
});

/* Keyboard Navigation */
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") btnPrev.click();
  if (e.key === "ArrowDown") btnNext.click();
});

render();
