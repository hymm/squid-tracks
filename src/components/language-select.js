import React from 'react';
import { FormControl } from 'react-bootstrap';
import { event } from '../analytics';

const languages = [
  { name: 'Default', code: '', statInk: 'en_US' },
  { name: 'Deutsch', code: 'de', statInk: 'de_DE' },
  { name: 'English', code: 'en', statInk: 'en_US' },
  { name: 'Español', code: 'es', statInk: 'es_ES' },
  { name: 'Francais', code: 'fr', statInk: 'fr_FR' },
  { name: 'Italiano', code: 'it', statInk: 'it_IT' },
  { name: '日本語', code: 'ja', statInk: 'ja_JP' },
];
export { languages };

export default class LanguageSelect extends React.Component {
  handleChange = (e) => {
    this.props.setLocale(e.target.value);
    event('settings', 'set-locale', e.target.value);
  };

  render() {
    const { locale } = this.props;
    return (
      <FormControl
        value={locale}
        id="languageSelect"
        componentClass="select"
        onChange={this.handleChange}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </FormControl>
    );
  }
}
