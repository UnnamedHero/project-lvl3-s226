import { differenceWith } from 'lodash';

export const updateFeedItems = (newfeed, oldFeed) => {
  const { feedId, items: oldItems } = oldFeed;
  const { items: newItems } = newfeed;
  const markedNewItems = differenceWith(newItems, oldItems, (n, o) => o.guid === n.guid)
    .map(item => ({ ...item, state: 'new', itemId: `${feedId}-${item.guid}` }));
  return { ...oldFeed, items: [...oldItems, ...markedNewItems] };
};

export const appendNewFeed = (newFeed, feedArr) => feedArr.concat(newFeed);

export const replaceFeedById = (newFeed, feedArr, feedId) => feedArr
  .filter(feed => feed.feedId !== feedId)
  .concat(newFeed);
