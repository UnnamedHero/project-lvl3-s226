const maxId = 1e5;

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
        <div class="modal-header">
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
    const elemId = `target${Math.floor(Math.random() * maxId)}"`;
    const elem = makeFeedItemNode(item, elemId);
    if (item.description.length > 0) {
      const elemModal = makeFeedItemModal(item, elemId);
      parent.appendChild(elemModal);
    }
    feedItemsNode.appendChild(elem);
  });
  parent.appendChild(feedDiv);
};
