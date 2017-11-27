import { addLocaleData } from 'react-intl';
import jaLocaleData from 'react-intl/locale-data/ja';
import frLocaleData from 'react-intl/locale-data/fr';
import ja from './locales/ja';
import fr from './locales/fr';

addLocaleData([...jaLocaleData, ...frLocaleData]);

export default {
  ja,
  fr
};
