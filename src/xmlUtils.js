import { isFloat } from 'validator';
import { uniqueId } from 'lodash';

const getNodeTagValue = (node, tag) => {
  const n = node.getElementsByTagName(tag)[0].childNodes;
  return n.length === 0 ? '' : n[0].nodeValue;
};

const getNodeLink = node => getNodeTagValue(node, 'link');
const getNodeTitle = node => getNodeTagValue(node, 'title');
const getNodeDesc = node => getNodeTagValue(node, 'description');
const getNodeGuid = node => getNodeTagValue(node, 'guid');
const getParserError = node => getNodeTagValue(node, 'parsererror');

export const validateRssXml = (xml) => {
  const errorNode = xml.getElementsByTagName('parsererror')[0];
  if (errorNode) {
    return { error: getParserError(xml) };
  }
  const rssNode = xml.getElementsByTagName('rss')[0];
  if (!rssNode) {
    return { error: 'Not a rss feed' };
  }
  const rssVersion = rssNode.getAttribute('version');
  if (!isFloat(rssVersion, { min: 0.90, max: 2.01 })) {
    return { error: `bad RSS version ${rssVersion}` };
  }
  return {};
};

export const makeFeedObject = (xml) => {
  const feedItems = [...xml.getElementsByTagName('item')];
  return {
    title: getNodeTitle(xml),
    description: getNodeDesc(xml),
    items: feedItems.map(item => ({
      guid: getNodeGuid(item),
      title: getNodeTitle(item),
      link: getNodeLink(item),
      description: getNodeDesc(item),
    })),
  };
};

export const makeNewFeedObject = (xml) => {
  const fo = makeFeedObject(xml);
  const feedId = `feedId${uniqueId()}`;
  return {
    ...fo,
    feedId,
    state: 'new',
    items: fo.items.map(item => ({ ...item, itemId: `${feedId}-itemId${uniqueId()}`, state: 'new' })),
  };
};
