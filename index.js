const SEARCH_DELAY = 300;
const KEY_CODES = {
  ARR_UP: 38,
  ARR_DN: 40,
  ARR_LT: 37,
  ARR_RT: 39,
  K: 75,
  J: 74,
  H: 72,
  L: 76,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  TAB: 9
};

const searchEl = document.getElementById('search');
const suggestionsEl = document.getElementById('suggestions');
const linksEl = document.getElementById('links');

const suggestionTemplate = document.getElementById('suggestion-template');


function search(query) {
  document.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function searchKeyPress(e) {
  const query = e.target.value;
  const keyCode = e.keyCode;
  const target = e.target;

  if (keyCode === KEY_CODES.ENTER && query) {
    search(query);
  } else if (keyCode === KEY_CODES.TAB || keyCode === KEY_CODES.ESC) {
    clearSuggestions();
  } else if ((keyCode === KEY_CODES.ARR_UP || keyCode === KEY_CODES.ARR_DN) && suggestionsEl.classList.contains('has-suggestions')) {
    e.preventDefault();
    navigateSuggestions(keyCode)
  }
}

function queryGoogleSuggestions(query) {
  if (query) {
    const suggestionScriptEl = document.createElement('script');
    suggestionScriptEl.src = `https://suggestqueries.google.com/complete/search?client=firefox&format=json&callback=showSuggestions&hl=en&q=${encodeURIComponent(query)}`;
    document.body.appendChild(suggestionScriptEl);
    document.body.removeChild(suggestionScriptEl);
  } else {
    clearSuggestions();
  }
}

function showSuggestions(response) {
  const query = response[0];
  const suggestions = response[1] || [];

  suggestionsEl.innerHTML = '';
  if (suggestions.length) {
    if (query !== suggestions[0]) {
      suggestions.unshift(query);
    }

    suggestions.map((suggestion) => {
      suggestionTemplate.content.firstElementChild.innerHTML = suggestion;
      suggestionsEl.appendChild(document.importNode(suggestionTemplate.content, true));
      return document.importNode(suggestionTemplate.content, true);
    });

    suggestionsEl.classList.add('has-suggestions');
  }
}

function clearSuggestions() {
  suggestionsEl.classList.remove('has-suggestions');
  suggestionsEl.innerHTML = '';
}

function suggestionClick(monitoredEl, delegateClassName, e) {
  let element = e.target;
  do {
    if (element.classList.contains(delegateClassName)) {
      search(element.innerHTML);
      searchEl.value = element.innerHTML;
      clearSuggestions();
      break;
    }

    element = element.parentNode;
  } while(element !== monitoredEl)
}

function navigateSuggestions(keyCode) {
  let selectedSuggestion;

  switch (keyCode) {
    case KEY_CODES.ARR_UP:
      selectedSuggestion = suggestionsEl.getElementsByClassName('is-focused')[0] || suggestionsEl.firstElementChild;
      const prevEl = selectedSuggestion.previousElementSibling || selectedSuggestion.parentElement.lastElementChild;
      selectedSuggestion.classList.remove('is-focused');
      prevEl.classList.add('is-focused');
      searchEl.value = prevEl.innerHTML;
      break;

    case KEY_CODES.ARR_DN:
      selectedSuggestion = suggestionsEl.getElementsByClassName('is-focused')[0] || suggestionsEl.lastElementChild;
      const nextEl = selectedSuggestion.nextElementSibling || selectedSuggestion.parentElement.firstElementChild;
      selectedSuggestion.classList.remove('is-focused');
      nextEl.classList.add('is-focused');
      searchEl.value = nextEl.innerHTML;
      break;
  }
}

function handleLinkNavigation(e) {
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

    case KEY_CODES.SPACE:
      target.click();
      break;

    // case KEY_CODES.TAB:
    //   e.preventDefault();
    //   searchEl.focus();
    //   break;
  }
}

let timeout;

searchEl.addEventListener('keydown', searchKeyPress);
suggestionsEl.addEventListener('click', suggestionClick.bind(null, suggestionsEl, 'search__suggestion'));
searchEl.addEventListener('input', (e) => {
  clearTimeout(timeout);
  const value = e.target.value.trim();
  if (value) {
    timeout = setTimeout(queryGoogleSuggestions.bind(null, value), SEARCH_DELAY);
  } else {
    clearSuggestions();
  }
});
linksEl.addEventListener('keydown', handleLinkNavigation);
