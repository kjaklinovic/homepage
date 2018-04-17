const KEY_CODES = {
  ARR_UP: 38,
  ARR_DN: 40,
  ARR_LT: 37,
  ARR_RT: 39,
  K: 75,
  J: 74,
  H: 72,
  L: 76,
  ENTER: 13
};

function search(query) {
  document.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function searchKeyPress(e) {
  if (e.keyCode === KEY_CODES.ENTER) {
    search(e.currentTarget.value);
  }
}

const searchEl = document.getElementById('search');
const linksEl = document.getElementById('links');

searchEl.addEventListener('keydown', searchKeyPress);
linksEl.addEventListener('keydown', (e) => {
  const keyCode = e.keyCode;
  const target = e.target;
  const origIndex = Array.from(target.parentElement.children).indexOf(target);

  switch (keyCode) {
    // UP
    case KEY_CODES.ARR_UP:
    case KEY_CODES.K:
      const prevEl = target.previousElementSibling || target.parentElement.lastElementChild;
      prevEl.focus();
      break;

    // DOWN
    case KEY_CODES.ARR_DN:
    case KEY_CODES.J:
      const nextEl = target.nextElementSibling || target.parentElement.firstElementChild;
      nextEl.focus();
      break;

    // LEFT
    case KEY_CODES.ARR_LT:
    case KEY_CODES.H:
      const prevRubricEl = target.parentElement.previousElementSibling || target.parentElement.parentElement.lastElementChild;
      prevRubricEl.children[Math.min(origIndex, prevRubricEl.children.length - 1)].focus();
      break;

    // RIGHT
    case KEY_CODES.ARR_RT:
    case KEY_CODES.L:
      const nextRubricEl = target.parentElement.nextElementSibling || target.parentElement.parentElement.firstElementChild;;
      nextRubricEl.children[Math.min(origIndex, nextRubricEl.children.length - 1)].focus();
      break;
  }
});
