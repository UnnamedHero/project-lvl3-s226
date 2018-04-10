import axios from 'axios';

const getNodeTagValue = (node, tag) => node.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
const getNodeLink = node => getNodeTagValue(node, 'link');
const getNodeTitle = node => getNodeTagValue(node, 'title');
const getNodeDesc = node => getNodeTagValue(node, 'description');

export default class FeedItem {
  template = `<div class="feedTitle"></div>
    <div class="feedDesc"></div>
    <ul class="itemList"></ul>`;
  constructor(url, parent) {
    this.url = url;
    this.parent = parent;
  }

  init() {
    const feedDiv = document.createElement('div');
    feedDiv.classList.add('feedItem');
    feedDiv.innerHTML = this.template;
    this.parent.appendChild(feedDiv);
    const title = feedDiv.querySelector('.feedTitle');
    const desc = feedDiv.querySelector('.feedDesc');
    const items = feedDiv.querySelector('.itemList');
    axios.get(this.url)
      .then((response) => {
        const dp = new DOMParser();
        const feedXML = dp.parseFromString(response.data, 'application/xml');
        title.textContent = getNodeTitle(feedXML);
        desc.textContent = getNodeDesc(feedXML);
        const feedItems = [...feedXML.getElementsByTagName('item')];
        feedItems.forEach((item) => {
          const elem = document.createElement('li');
          const link = document.createElement('a');
          link.setAttribute('href', getNodeLink(item));
          link.textContent = getNodeTitle(item);
          elem.appendChild(link);
          items.appendChild(elem);
        });
      })
      .catch((error) => {
        title.textContent = `${this.url} is bad URL, ${error}`;
      });
  }
}

