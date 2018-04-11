const getAlertType = (type) => {
  switch (type) {
    case 'error':
      return 'alert-danger';
    case 'info':
      return 'alert-info';
    default:
      return 'alert-light';
  }
};

const makeNode = (type, text) => {
  const div = document.createElement('div');
  div.classList.add('alert', getAlertType(type), 'alert-dismissible');
  div.setAttribute('role', 'alert');
  div.innerHTML = `${text}
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>`;
  return div;
};

export const getAlertErrorNode = text => makeNode('error', text);

export const getAlertInfoNode = text => makeNode('info', text);
