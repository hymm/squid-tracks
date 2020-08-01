# SquidTracks
An unoffical desktop program for viewing splatnet 2 statistics and uploading them to stat.ink.
Splatnet 2 only records the most recent 50 games and this tool is for uploading the
game data to stat.ink for longer term access.  There is also some data that splatnet 2
does not display.  This program gives access to that data too.

## Installing
Currently Windows (exe), OS X (dmg, mac.zip), and Linux (AppImage) are supported.  Get the packages here https://github.com/hymm/squid-tracks/releases

#### Installing on Windows
Download installer .exe from https://github.com/hymm/squid-tracks/releases.
You will get a warning when running the installer.  Bypass the warning by clicking
"more info" and then "Run Anyways."

#### Installing on Mac

#### Installing on Linux

## Contributing

If you're interested in contributing feel free to contact me or create a pull request.  Check [issues](https://github.com/hymm/squid-tracks/issues) to see if there's anything you would be interested in working on.  Help with translations is especially welcome. See [here](./docs/en/development.md) for information about development.

## Built With
* Electron
* create-react-app
* React
* Bootstrap
* Travis

## Alternative stat.ink Clients
* [splatnet2statink](https://github.com/frozenpandaman/splatnet2statink) command line python uploader
* [ikaLog](https://github.com/hasegaw/IkaLog) If you have a capture card, this program can provide a lot more information.  What weapons you're killed by, other onscreen events, ect. I'm unsure how well it support Splatoon 2.
* [stat.ink](https://stat.ink/) The button on the top right allows you to enter data manually.
* [ikaRec](https://play.google.com/store/apps/details?id=ink.pocketgopher.ikarec&hl=en) Manually enter data using this android app.

## Contributors
* **[hymm](https://github.com/hymm)** *Maintainer* [@Wrong_Shoe](https://twitter.com/Wrong_Shoe) (Discord) WrongShoe#9733
* **[DanSyor](https://github.com/DanSyor)** *Schedule tab appearance*, fr Translations [@DanSyor](https://twitter.com/DanSyor) (Discord) BlueDan#8041
* **[okuRaku](https://github.com/okuRaku)** *League Tab, ja Translations* [@okuRaku](https://twitter.com/okuRakuu) (Discord) okuRaku#1417
* **[mcescalante](https://github.com/mcescalante)** *Mac Releases* [@mcescalante](https://twitter.com/mcescalante) (Discord) sofly#3729
* **[ZelenkaChris](https://github.com/ZelenkaChris)** *Annie Store improvements, bug fixes*
* **[wkoichi](https://github.com/wkoichi)** *Bug fixes*

## Acknowledgements
* [frozenpandaman](https://github.com/frozenpandaman/): I referenced his [python uploader](https://github.com/frozenpandaman/splatnet2statink) for parsing splatnet-2 to stat.ink.  For creating part of the login API
* [fetus hina](https://github.com/fetus-hina): for creating [stat.ink](https://stat.ink) and answering my questions about the API.
* [Danny](https://github.com/Rapptz): For originally figuring out how to log into splatnet-2 and making [R.Danny](https://github.com/Rapptz/RoboDanny).
* My girlfriend [@Selkaine](https://twitter.com/Selkaine) for making graphics.
