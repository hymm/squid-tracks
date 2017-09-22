import React from 'react';
import { FormControl } from 'react-bootstrap';
import { event } from '../analytics'

const languages = [
  { name: 'Default', code: '' },
  { name: 'Deutsch', code: 'de' },
  { name: 'English', code: 'en' },
  { name: 'Español', code: 'es' },
  { name: 'Francais', code: 'fr' },
  { name: 'Italiano', code: 'it' },
  { name: '日本語', code: 'ja' }
];

export default class LanguageSelect extends React.Component {
  handleChange = e => {
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
          {languages.map(language => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </FormControl>
    );
  }
}
