import 'bootstrap';
import axios from 'axios';
import { isURL, isFloat } from 'validator';
import appendFeed from './feedItem';
import { getAlertError, getAlertInfo } from './alertNode';

const state = {
  urlState: { condition: 'invalid', message: 'empty url' },
  feeds: new Set(),
};

const toggleInputState = (input) => {
  const { condition, message } = state.urlState;
  if (condition === 'valid') {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  } else {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    const divElem = input.parentElement.querySelector('div .invalid-feedback');
    divElem.textContent = message;
  }
};

const getNodeTagValue = (node, tag) => node.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
const getNodeLink = node => getNodeTagValue(node, 'link');
const getNodeTitle = node => getNodeTagValue(node, 'title');
const getNodeDesc = node => getNodeTagValue(node, 'description');
const getParserError = node => getNodeTagValue(node, 'parsererror');

const validateRssXml = (xml) => {
  const errorNode = xml.getElementsByTagName('parsererror')[0];
  if (errorNode) {
    return { error: getParserError(xml) };
  }
  const rssNode = xml.getElementsByTagName('rss')[0];
  if (!rssNode) {
    return { error: 'Not a rss feed' };
  }
  const rssVersion = rssNode.getAttribute('version');
  if (!isFloat(rssVersion, { min: 0.90, max: 2.01 })) {
    return { error: `bad RSS version ${rssVersion}` };
  }
  return {};
};

const makeFeedObject = (xml) => {
  const feedItems = [...xml.getElementsByTagName('item')] || [];
  return {
    title: getNodeTitle(xml) || '',
    description: getNodeDesc(xml) || '',
    items: feedItems.map(item => ({
      title: getNodeTitle(item),
      link: getNodeLink(item),
    })),
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feed-add-form');
  const feedInput = document.getElementById('feed-url');
  feedInput.addEventListener('input', (e) => {
    const { value } = e.target;
    const normalizedUrl = value.trim().toLowerCase();
    if (!isURL(normalizedUrl, { require_protocol: true })) {
      state.urlState = { condition: 'invalid', message: 'Invalid Feed URL' };
      toggleInputState(feedInput);
      return;
    }
    if (state.feeds.has(normalizedUrl)) {
      state.urlState = { condition: 'invalid', message: 'Feed URL already exists' };
      toggleInputState(feedInput);
      return;
    }
    state.urlState = { condition: 'valid' };
    toggleInputState(feedInput);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = feedInput.value;
    feedInput.value = '';
    if (!state.urlState.condition === 'valid') {
      return;
    }
    state.feeds.add(url);
    const alertNode = document.getElementById('feed-url-alerts');
    const infoNode = getAlertInfo(`Fetching '${url}'`);
    alertNode.appendChild(infoNode);
    axios.get(url)
      .then((response) => {
        infoNode.remove();
        const dp = new DOMParser();
        const feedXML = dp.parseFromString(response.data, 'application/xml');
        const { error } = validateRssXml(feedXML);
        if (error) {
          throw new Error(error);
        }
        const feedObj = makeFeedObject(feedXML);
        const feedsParent = document.getElementById('feeds-list');
        appendFeed(feedsParent, feedObj);
      })
      .catch((error) => {
        infoNode.remove();
        alertNode.appendChild(getAlertError(`Failed on '${url}' with: ${error}`));
      });
  });
});
