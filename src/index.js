import 'bootstrap';
import { isURL } from 'validator';
import FeedItem from './feedItem';

const toggleValid = (element, state) => {
  const { condition, message } = state;
  if (condition === 'valid') {
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
  } else {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
    const divElem = element.parentElement.querySelector('div .invalid-feedback');
    divElem.textContent = message;
  }
};

const state = {
  feeds: new Set(),
};


window.addEventListener('load', () => {
  const form = document.getElementById('feedAddForm');
  const feedInput = document.getElementById('feedUrl');
  const feedsParent = document.getElementById('feeds-list');
  feedInput.addEventListener('input', (e) => {
    const { value } = e.target;
    const normalizedValue = value.trim().toLowerCase();
    if (!isURL(normalizedValue)) {
      toggleValid(feedInput, { condition: 'invalid', message: 'Invalid Feed URL' });
      return;
    }
    if (state.feeds.has(normalizedValue)) {
      toggleValid(feedInput, { condition: 'invalid', message: 'Feed URL already exists' });
      return;
    }
    toggleValid(feedInput, { condition: 'valid' });
  });
  form.addEventListener('submit', (e) => {
    const url = feedInput.value;
    state.feeds.add(url);
    e.preventDefault();
    feedInput.value = '';
    if (feedInput.classList.contains('is-valid')) {
      const fi = new FeedItem(url, feedsParent);
      fi.init();
    }
  });
});
