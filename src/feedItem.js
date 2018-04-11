const makeFeedItemNode = (itemObj) => {
  const elem = document.createElement('li');
  const link = document.createElement('a');
  link.setAttribute('href', itemObj.link);
  link.textContent = itemObj.title;
  elem.appendChild(link);
  return elem;
};

export default (parent, feedObj) => {
  const feedDiv = document.createElement('div');
  feedDiv.classList.add('card');
  feedDiv.innerHTML = `
  <h5 class="card-header text-white bg-secondary"></h5>
  <div class="card-body">
    <h5 class="card-title bg-light"></h5>
    <ul class="list-group"></ul>
  </div>`;
  const feedTitleNode = feedDiv.querySelector('.card-header');
  const feedDescNode = feedDiv.querySelector('.card-title');
  const feedItemsNode = feedDiv.querySelector('.list-group');
  feedTitleNode.textContent = feedObj.title;
  feedDescNode.textContent = feedObj.description;
  feedObj.items.forEach((item) => {
    const elem = makeFeedItemNode(item);
    feedItemsNode.appendChild(elem);
  });
  parent.appendChild(feedDiv);
};
