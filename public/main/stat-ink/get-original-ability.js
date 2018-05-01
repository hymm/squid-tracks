const StatInkMap = require('./stat-ink-map');
const defaultHeadMap = require('./default-maps/head.json');
const defaultShirtMap = require('./default-maps/shirt.json');
const defaultShoesMap = require('./default-maps/shoes.json');

const headMap = new StatInkMap(
  'head.json',
  'https://stat.ink/api/v2/gear?type=headgear',
  defaultHeadMap
);

const shirtMap = new StatInkMap(
  'shirt.json',
  'https://stat.ink/api/v2/gear?type=clothing',
  defaultShirtMap
);

const shoesMap = new StatInkMap(
  'shoes.json',
  'https://stat.ink/api/v2/gear?type=shoes',
  defaultShoesMap
);

module.exports = async function(type, id, localization) {
  switch (type) {
    case 'head':
      const headInfo = await headMap.getInfoWithRetry(id);
      return headInfo.primary_ability.name[localization];
    case 'clothes':
      const shirtInfo = await shirtMap.getInfoWithRetry(id);
      return shirtInfo.primary_ability.name[localization];
    case 'shoes':
      const shoesInfo = await shoesMap.getInfoWithRetry(id);
      return shoesInfo.primary_ability.name[localization];
    default:
      throw new Error(`Error Unsupported Clothing Type: ${type}`);
  }
};
