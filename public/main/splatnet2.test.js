const { getUniqueId } = require('./splatnet2');

describe('getUniqueId', () => {
  it('should get unique id from body', () => {
    const body = '<html data-unique-id="thisIsAnId"></html>';

    const id = getUniqueId(body);

    expect(id).toEqual('thisIsAnId');
  });

  it('should error if it cannot get unique id', () => {
    const body = '<html></html>';
    function testFunc() {
      getUniqueId(body);
    }

    expect(testFunc).toThrow();
  });
});
