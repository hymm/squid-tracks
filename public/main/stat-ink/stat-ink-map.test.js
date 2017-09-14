const StatInkMap = require('./stat-ink-map');

describe('StatInkMap', () => {
  describe('new StatInkMap()', () => {
    it('should try to read default file', () => {
      const map = new StatInkMap(
        'weapon.json',
        'https://stat.ink/api/v2/weapon',
        []
      );
    });
  });
});
