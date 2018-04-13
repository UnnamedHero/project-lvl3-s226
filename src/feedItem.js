// const maxId = 1e5;

const makeFeedItemNode = (itemObj, targetId) => {
  const elem = document.createElement('li');
  elem.classList.add('list-group-item', 'd-flex');
  const button = itemObj.description.length > 0 ?
    `<button type="button" class="btn btn-info badge badge-primary badge-pill ml-auto p-2" data-toggle="modal" data-target="#${targetId}"> ? </button>` :
    '';
  const html = `<a href="${itemObj.link}">${itemObj.title}</a>${button}`;
  elem.innerHTML = html;
  return elem;
};

const makeFeedItemModal = (itemObj, targetId) => {
  const modalDiv = document.createElement('div');
  modalDiv.innerHTML = `<div class="modal fade" id="${targetId}" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header font-weight-bold"">
          ${itemObj.title}
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        ${itemObj.description}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>`;
  return modalDiv;
};

const renderItems = (parent, itemsNode, items) => {
  const modalNode = parent.querySelector('#feed-modals');
  items.forEach((item) => {
    // const elemId = `target${Math.floor(Math.random() * maxId)}"`;
    const elemId = item.itemId;
    const elem = makeFeedItemNode(item, elemId);
    if (item.description.length > 0) {
      const elemModal = makeFeedItemModal(item, elemId);
      modalNode.appendChild(elemModal);
    }
    itemsNode.appendChild(elem);
  });
};

export const appendFeed = (parent, feedObj) => {
  const { feedId, items } = feedObj;
  const feedDiv = document.createElement('div');
  feedDiv.classList.add('card');
  feedDiv.innerHTML = `
  <h5 class="card-header text-white bg-secondary"></h5>
  <div class="card-body">
    <h5 class="card-title bg-light"></h5>
    <ul id="${feedId}" class="list-group"></ul>
  </div>`;
  const feedTitleNode = feedDiv.querySelector('.card-header');
  feedTitleNode.textContent = feedObj.title;
  const feedDescNode = feedDiv.querySelector('.card-title');
  feedDescNode.textContent = feedObj.description;
  const feedItemsNode = feedDiv.querySelector('.list-group');
  renderItems(parent, feedItemsNode, items);
  parent.appendChild(feedDiv);
};

export const updateFeed = (parent, feedObj) => {
  const { feedId, items } = feedObj;
  const id = `#${feedId}`;
  const itemsNode = parent.querySelector(id);
  renderItems(parent, itemsNode, items);
};
