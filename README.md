# Squid Tracks
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

## Usage
#### Uploading to stat.ink
1. Go to stat.ink and copy your api key.
2. Go to the "Settings" tab and paste the key into "stat.ink API Key"
3. Click "Save"
4. On "Results" pick the battle in "Battle Detail" you want to upload.
5. Click "Upload to stat.ink"
6. Repeat steps 4 and 5 as necessary

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

## Version 1.0 ToDo List:
* memoize or cache getting game details ('/results/512')
* Prettier autoupdate status page
* Better feedback on clicking buttons
* Sorting on Tables
* Prettify Everything
* Get other language users to test
* handle splatnet and stat.ink errors
* fix freezing and crashing bugs
* About/Help Page
* only list battle numbers that are listed in results
* figure out how to use docker to build for different os's
* disable stat.ink buttons if sessiontoken is not defined

### Other ToDo's
* Figure out how to get a smaller nintendo oauth login page
* Use weapon icons from splatnet or custom graphics
* Create an image game summary card to upload to stat.ink
* official splatnet link is broken, probably not setting the cookie correctly into renderer
* Open Splatnet 2 in webview
* Feature parity with splatnet 2
* save records on local disk?
* Invalidate Session Token on getSessionWithSessionToken error
* look into how to use babel on backend process to make code syntax consistent
* implement electron-getText, os-locale to support multiple languages

## Development Notes
Note: Render Process is using babel, but the backend process is not, so allowed syntax between the two is different right now.

## Built With
* Electron
* create-react-app
* React
* Bootstrap

## Authors
**[hymm](https://github.com/hymm)** *Maintainer* [@Wrong_Shoe](https://twitter.com/Wrong_Shoe) (Discord) WrongShoe#9733

## Acknowledgements
* [Danny](https://github.com/Rapptz): For figuring out how to log into splatnet-2 and making [R.Danny](https://github.com/Rapptz/RoboDanny).
* [frozenpandaman](https://github.com/frozenpandaman/): I referenced his [python uploader](https://github.com/frozenpandaman/splatnet2statink) for parsing splatnet-2 to stat.ink
* [fetus hina](https://github.com/fetus-hina): for creating [stat.ink](https://stat.ink) and answering my questions about the API.
* My girlfriend [@Selkaine](https://twitter.com/Selkaine) for making graphics.
