import 'bootstrap';
import RssForm from './rssFeedRequestForm';

const rssFormRoot = document.getElementById('point');
const elem = new RssForm(rssFormRoot);
elem.init();
