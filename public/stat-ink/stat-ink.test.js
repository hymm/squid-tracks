const { convertResultToStatInk } = require('./stat-ink');
const getDefaultResult = require('./example-result');
jest.mock('electron');

describe('convertResultToStatInk', () => {
    it('should add 1000p on a victory', () => {
        const result = getDefaultResult();
        result.player_result.game_paint_point = 123;
        result.my_team_result.key = 'victory';

        const res = convertResultToStatInk(result);

        expect(res.my_point).toEqual(result.player_result.game_paint_point + 1000);
    });
    it('should not add 1000p on a defeat', () => {
        const result = getDefaultResult();
        result.player_result.game_paint_point = 123;
        result.my_team_result.key = 'defeat';

        const res = convertResultToStatInk(result);

        expect(res.my_point).toEqual(result.player_result.game_paint_point);
    });

    it('should add 1000p to teammates on a victory', () => {
        const result = getDefaultResult();
        result.my_team_members[0].game_paint_point = 123;
        result.my_team_result.key = 'victory';

        const res = convertResultToStatInk(result);

        expect(res.players[1].point).toEqual(result.my_team_members[0].game_paint_point + 1000);
    });

    it('should not add 1000p to teammates on a victory', () => {
        const result = getDefaultResult();
        result.my_team_members[0].game_paint_point = 123;
        result.my_team_result.key = 'defeat';

        const res = convertResultToStatInk(result);

        expect(res.players[1].point).toEqual(result.my_team_members[0].game_paint_point);
    });
});
