import axios from 'axios';

const getNodeTagValue = (node, tag) => node.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
const getNodeLink = node => getNodeTagValue(node, 'link');
const getNodeTitle = node => getNodeTagValue(node, 'title');
const getNodeDesc = node => getNodeTagValue(node, 'description');

const makeFeedObject = (xml) => {
  const feedObj = {
    title: getNodeTitle(xml),
    description: getNodeDesc(xml),
  };
  const feedItems = [...xml.getElementsByTagName('item')];
  feedObj.items = feedItems.map(item => ({
    title: getNodeTitle(item),
    link: getNodeLink(item),
  }));
  return feedObj;
};

const makeFeedItemNode = (itemObj) => {
  const elem = document.createElement('li');
  const link = document.createElement('a');
  link.setAttribute('href', itemObj.link);
  link.textContent = itemObj.title;
  elem.appendChild(link);
  return elem;
};

const progressBar = `<div class="progress">
<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
</div>`;


export default class Feed {
  template = `
  <h5 class="card-header text-white bg-secondary"></h5>
  <div class="card-body">
    <h5 class="card-title bg-light"></h5>
    <ul class="list-group"></ul>
  </div>`;
  constructor(url, parent) {
    this.url = url;
    this.parent = parent;
  }
  init() {
    const feedDiv = document.createElement('div');
    feedDiv.classList.add('card', 'w-75');
    feedDiv.innerHTML = this.template;
    this.parent.appendChild(feedDiv);
    const feedTitleNode = feedDiv.querySelector('.card-header');
    const feedDescNode = feedDiv.querySelector('.card-title');
    const feedItemsNode = feedDiv.querySelector('.list-group');
    feedDescNode.innerHTML = progressBar;
    axios.get(this.url)
      .then((response) => {
        const dp = new DOMParser();
        const feedXML = dp.parseFromString(response.data, 'application/xml');
        const feedObj = makeFeedObject(feedXML);
        feedTitleNode.textContent = feedObj.title;
        feedDescNode.textContent = feedObj.description;
        feedObj.items.forEach((item) => {
          const elem = makeFeedItemNode(item);
          feedItemsNode.appendChild(elem);
        });
      })
      .catch((error) => {
        feedTitleNode.textContent = `Some error has happend with ${this.url}`;
        feedDescNode.textContent = error;
      });
  }
}

