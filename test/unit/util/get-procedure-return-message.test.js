import {getProcedureReturnMessage} from '../../../src/containers/blocks.jsx';

describe('getProcedureReturnMessage', () => {
    test('returns translated message when it contains %1', () => {
        const intl = {
            formatMessage: () => '返回 %1'
        };

        expect(getProcedureReturnMessage(intl)).toBe('返回 %1');
    });

    test('falls back to default if translation does not include %1', () => {
        const intl = {
            formatMessage: () => '返回'
        };

        expect(getProcedureReturnMessage(intl)).toBe('return %1');
    });
});
