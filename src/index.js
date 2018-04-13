import 'bootstrap';
import axios from 'axios';
import _ from 'lodash';
import { isURL } from 'validator';
import { appendFeed, updateFeed } from './feedItem';
import * as xmlUtils from './xmlUtils';
import { replaceFeedById, updateFeedItems, appendNewFeed } from './stateUtils';
import { getAlertErrorNode, getAlertInfoNode } from './alertNode';


const appState = {
  formUrlState: { condition: 'invalid', message: 'empty url' },
  timeoutId: '',
  updateTimeout: 5000,
  submittedUrls: new Set(),
  validFeeds: [],
};

const renderNewFeed = (feed) => {
  const feedsParent = document.getElementById('feeds-list');
  // const renderedItems = feed.items.map(item => ({ ...item, state: 'rendered' }));
  appendFeed(feedsParent, feed);
};

const renderUpdatedFeed = (feed) => {
  const feedsParent = document.getElementById('feeds-list');
  const newItems = feed.items.filter(item => item.state === 'new')
    .map(item => ({ ...item, state: 'rendered' }));
  updateFeed(feedsParent, { ...feed, items: newItems });
};

const feedProperties = [
  {
    state: 'new',
    parser: feedXml => xmlUtils.makeNewFeedObject(feedXml),
    feedUpdater: _.identity,
    stateUpdater: (newFeedObj, stateFeeds) => appendNewFeed(newFeedObj, stateFeeds),
    render: feed => renderNewFeed(feed),
  },
  {
    state: 'rendered',
    parser: feedXml => xmlUtils.makeFeedObject(feedXml),
    feedUpdater: (newFeed, oldFeed) => updateFeedItems(newFeed, oldFeed),
    stateUpdater: (newFeedObj, stateFeeds, feedId) =>
      replaceFeedById(newFeedObj, stateFeeds, feedId),
    render: feed => renderUpdatedFeed(feed),
  },
];

const updateAppFeed = (feedObj) => {
  const { url, state } = feedObj;
  const feedProp = _.find(feedProperties, prop => prop.state === state);
  const alertNode = document.getElementById('feed-url-alerts');
  const infoNode = getAlertInfoNode(`Fetching '${url}'`);
  alertNode.appendChild(infoNode);
  axios.get(url)
    .then((response) => {
      infoNode.remove();
      const dp = new DOMParser();
      const feedXML = dp.parseFromString(response.data, 'application/xml');
      const { error } = xmlUtils.validateRssXml(feedXML);
      if (error) {
        throw new Error(error);
      }
      const parsedFeed = feedProp.parser(feedXML, feedObj);
      const updatedFeed = feedProp.feedUpdater(parsedFeed, feedObj);
      feedProp.render(updatedFeed);
      const renderedFeed = { ...updatedFeed, url, state: 'rendered' };
      const renderedItems = renderedFeed.items.map(item => ({ ...item, state: 'rendered' }));
      appState.validFeeds.push({ ...renderedFeed, items: renderedItems });
    })
    .catch((error) => {
      infoNode.remove();
      alertNode.appendChild(getAlertErrorNode(`Failed on '${url}' with: ${error}`));
    });
};

const startFeedUpdater = () => {
  const feeds = appState.validFeeds.slice();
  appState.validFeeds = [];
  while (feeds.length > 0) {
    const feed = feeds.pop();
    updateAppFeed(feed);
  }
  const newTimeoutId = setTimeout(startFeedUpdater, appState.updateTimeout);
  appState.timeoutId = newTimeoutId;
};


const toggleInputState = (input) => {
  const { condition, message } = appState.urlState;
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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feed-add-form');
  const feedInput = document.getElementById('feed-url');
  feedInput.addEventListener('input', (e) => {
    const { value } = e.target;
    const normalizedUrl = value.trim().toLowerCase();
    if (!isURL(normalizedUrl)) {
      appState.urlState = { condition: 'invalid', message: 'Invalid Feed URL' };
      toggleInputState(feedInput);
      return;
    }
    if (appState.submittedUrls.has(normalizedUrl)) {
      appState.urlState = { condition: 'invalid', message: 'Feed URL already exists' };
      toggleInputState(feedInput);
      return;
    }
    appState.urlState = { condition: 'valid' };
    toggleInputState(feedInput);
  });
  const timeoutTimer = document.getElementById('updateTimeout');
  timeoutTimer.addEventListener('change', (e) => {
    clearTimeout(appState.timeoutId);
    appState.updateTimeout = e.target.value * 1000;
    const newTimeoutId = setTimeout(startFeedUpdater, appState.updateTimeout);
    appState.timeoutId = newTimeoutId;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = feedInput.value.trim().toLowerCase();
    // state.formUrlState = { condition: 'valid' };
    appState.submittedUrls.add(url);
    feedInput.value = '';
    if (appState.urlState.condition !== 'valid') {
      return;
    }
    updateAppFeed({ url, state: 'new' });
    // state.feeds.add(url);
  //   const alertNode = document.getElementById('feed-url-alerts');
  //   const infoNode = getAlertInfoNode(`Fetching '${url}'`);
  //   alertNode.appendChild(infoNode);
  //   axios.get(url)
  //     .then((response) => {
  //       infoNode.remove();
  //       const dp = new DOMParser();
  //       const feedXML = dp.parseFromString(response.data, 'application/xml');
  //       const { error } = xmlUtils.validateRssXml(feedXML);
  //       if (error) {
  //         throw new Error(error);
  //       }
  //       const feedObj = xmlUtils.makeFeedObject(feedXML);
  //       const feedsParent = document.getElementById('feeds-list');
  //       appendFeed(feedsParent, feedObj);
  //     })
  //     .catch((error) => {
  //       infoNode.remove();
  //       alertNode.appendChild(getAlertErrorNode(`Failed on '${url}' with: ${error}`));
  //     });
  });
  startFeedUpdater();
});
