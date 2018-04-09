export default class RssFeedRequestForm {
  html = `<form>
    <div class="form-group">
      <label for="rssFeedUrl">RSS feed URL</label>
      <input type="text" class="form-control" id="rssFeedUrl" placeholder="feed URL">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>`;

  constructor(root) {
    this.root = root;
  }

  init() {
    this.root.innerHTML = this.html;
  }
}
