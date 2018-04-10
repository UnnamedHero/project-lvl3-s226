import _ from 'lodash';

export default class Feed {
  const template = `<div class="header"><%= title %></div>
  `;
  constructor(data) {
    this.data = data;
  }

  load() {
  }  
}
