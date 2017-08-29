# SquidTracks
A desktop program for viewing splatnet 2 statistics and uploading them to stat.ink.
Splatnet 2 only records the most recent 50 games and this tool is for uploading the
game data to stat.ink for longer term access.  There is also some data that splatnet 2
does not display.  This program gives access to that data too.

## Installing
At the moment, the only installer package is for Windows x64. Support for other platforms
is planned if I can figure out how to build them on my windows machine or I get help in
building them from people with access to other platforms.

#### Installing on Windows
Download installer .exe from https://github.com/hymm/squid-tracks/releases.
You will get a warning when running the installer.  Bypass the warning by clicking
"more info" and then "Run Anyways."

## Development
To run in development mode install [yarn](https://yarnpkg.com).
```
yarn
yarn run dev
```

## Building
if your platform is not supported you should be able to create an installer by
running in development mode or by building it by calling:
```
yarn run build
```  
The installer will be created in `/dist`.

## Development Notes
Note: Render Process is using babel, but the backend process is not, so allowed syntax between the two is different right now.

## Translations
translations are located in `scr/locales/<locale code>.json`

### Adding a translation language
In `src/messages.js`,
1. add translation package from `react-intl`
    ```js
    import szLocaleData from 'react-intl/locale-data/zz';
    ```
2. add package to addLocaleData
    ```js
    addLocaleData([...jaLocaleData, ...zzLocaleData]);
    ```
3. import messages and add to export
    ```js
    import sz from './locales/zz';
    export default {
        ja,
        zz,
    };
    ```
In `translationRunner.js`
```js
manageTranslations({
    ...
    languages: ['ja', 'zz'],
});
```

### Updating the translation keys
If there are new strings in the program or new langauges added, run these commands.
```
yarn run dev
yarn run manage:translations
```

## Roadmap
[Version 1.0](https://github.com/hymm/squid-tracks/issues/3)

[Version 2.0](https://github.com/hymm/squid-tracks/issues/4)

## Built With
* Electron
* create-react-app
* React
* Bootstrap

## Alternative stat.ink Clients
* [ikaLog](https://github.com/hasegaw/IkaLog) If you have a capture card, this program can provide a lot more information.  What weapons you're killed by, other onscreen events, ect.
* [ikaRec](https://play.google.com/store/apps/details?id=ink.pocketgopher.ikarec&hl=en) Manually enter data using this android app.
* [stat.ink](https://stat.ink/) The button on the top right allows you to enter data manually.

## Authors
* **[hymm](https://github.com/hymm)** *Maintainer* [@Wrong_Shoe](https://twitter.com/Wrong_Shoe) (Discord) WrongShoe#9733
* **[mcescalante](https://github.com/mcescalante)** *Mac Releases* [@mcescalante](https://twitter.com/mcescalante) (Discord) sofly#3729
* **[DanSyor](https://github.com/DanSyor)** *Schedule tab appearance* [@DanSyor](https://twitter.com/DanSyor) (Discord) BlueDan#8041

## Acknowledgements
* [Danny](https://github.com/Rapptz): For figuring out how to log into splatnet-2 and making [R.Danny](https://github.com/Rapptz/RoboDanny).
* [frozenpandaman](https://github.com/frozenpandaman/): I referenced his [python uploader](https://github.com/frozenpandaman/splatnet2statink) for parsing splatnet-2 to stat.ink
* [fetus hina](https://github.com/fetus-hina): for creating [stat.ink](https://stat.ink) and answering my questions about the API.
* My girlfriend [@Selkaine](https://twitter.com/Selkaine) for making graphics.
