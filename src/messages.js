import { addLocaleData } from 'react-intl';
import jaLocaleData from 'react-intl/locale-data/ja';
import ja from './locales/ja';

addLocaleData([...jaLocaleData]);

export default {
    ja,
};
