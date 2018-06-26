# CHANGELOG

## Version 1.2.0
### New Features
* Added support for rank X
* Mode Icon at the top of the Battle trend now changes color to help you tell when you're sucking on
a specific map
* Added original ability of gear to Annie store page (currently text only, no image)
* Click on background of trend to show details of a battle
* Added win percent to Player Card
* Gear used by user is now uploaded to stat.ink
* Show a prestige players level with a star
* Added turf vibe meter and last used time to weapon table
* Added league medals to records

### Bugfix
* Fixed bug with some of salmon schedule not showing up 

## Version 1.1.1
### Bugfix
* Fixed crashing with Salmon Run Schedule when there's a mystery weapon

## Version 1.1.0
### New Features
* Salmon Run Schedule
* Added icon for Clam Blitz to Battle History Trend

### Bugfix
* New Icon should be less blurry in some places
* Switches to temp screen to prevent multiple clicks on logging in
* Logout will now actually log you out.
* Copying tokens on settings page works again

## Version 1.0.0
### New Features
* Normal login is back!! Thank @YDKK and @frozenpandaman for figuring login out and implementing it.
* New shiny icon to celebrate bump to 1.0.  Thanks @selkaine.
* Thanks @DanSyor and @okuRaku for updating translations.

### Maintenance
* Updated dependencies

## Version 0.3.6
* added support for clam blitz
* added support for newer stat.ink fields (power, star rank)

## Version 0.3.5
* French Language Support (Thanks DanSyor)
* updated default maps
* Error Handling for google analytics

## Version 0.3.4
* Windows 32bit added to exe installer
* added indication on trend of rule (RM, TC, SZ)
* added Error page for when session cookie expires

## Version 0.3.3
### Bugfix
* fixed crash when loading radar charts

## Version 0.3.2
### New Features
* SquidTracks will auto download info from stat.ink so when new weapons and stages are supported on stat.ink
they will also be supported by SquidTracks
* Prettier battle details.

### Bug Fixes
* Fixed annie store ordering
* Fixed battle details not showing sometimes

## Version 0.3.1
This release is does not fix the login system.  There is an alternative login system
that uses session cookie hijacking.  A lot of the code has changed so this is release
is still a little buggy.

### New Features
* login with cookie hijacking
* The most requested feature.  An upload all battles button.
* Early version of a last 50 battles trend
* Start day and combine hero weapons checkbox for League Data tab

## Version 0.3.0
### New Features
* Functional Annie Store!
* League Weapon Usage Tab (thanks okuRaku)
* Export Last 50 Battles to CSV
* Added support for new stat.ink fields like splatnet_id
* Partial Japanese language support
* Gear button now changes color if there's good gear
* Added anonymizer for people who like to screenshot
* Added support for custom jr
* Players who disconnected (inked 0p) are now greyed out in battle details
* Radar charts now show max values
* Max game score in radar chart is now always 100
* Support to show splat fest power
* Added Enemy Team Power for league battle details
* Added ability to turn on fiddler proxy with environment variable
* Added Power to last 50 battles
* Changed some button text to icons
* Added tracking for exceptions

### Bug Fixes
* Fixed bug in battle details when players use the same name
* Fixed records page displaying sz, tc, and rm ranks with the same label
* Fixed bug with stat.ink uploaded status being assigned to the wrong battle

## Version 0.2.4
### New Features
* added radar charts to battle details
* user can now pick splatnet language in settings.  Support languages vary by region
* player level added in more info section of battle details
* copy a discord pastable json of battle stats to clipboard
* added estimate gachi power to last 50 battles table
* added translation support to results, records, and schedule (looking for translators)

### Bug Fixes
* removed turf bonus points for ranked games
* calculation for per minutes stats was wrong, now fixed
* removed s+ numbers from details, splatnet was not sending the real numbers
* removed bonus from turf inked for ranked games uploaded to stat.ink
* added logging of uncaught errors to help with debugging

## Version 0.2.3

* add sloshing machine
* add forge pro
* add manta maria
* add highlighting for pure and shiny gear
* change stat.ink image from image_judge to image_result
* show session token expiration date on settings page
* added iksm tokem for debugging purposes
* show unuploaded battles on last 50 battles table
* change arrows to increment through array instead of battle number
* accept stat.ink 302 errors
* memoize or cache getting game details
* option to show stats as a rate on last 50 battles
* move stat.ink upload info into separate file

## Version 0.2.2
* added weapon images
* added sort order to details table
* added image from splatnet to stat.ink upload
* view gear in details
* changed to k+a(a) and k-d to make table more readable and compact
* fixed bug with bar not displaying on stat ink


## Version 0.2.1

* added squiffer
* map images on schedule page.  Thanks to DanSyor.
* added in google analytics.  See home page for more details.

## Version 0.2.0

* decreased poll timer from 120 seconds to 60 seconds
* records stat.ink battle address onto disk
* shows a link to battles uploaded to stat.ink
* api is now retrieved in users language
* added support for name and s plus number to be uploaded to stat.ink (stat.ink page does not yet display names)
* fixed bug with KO loss scores not being displayed on stat.ink and SquidTracks
* fixes bug with games being uploaded on refresh even when auto-upload was not enabled

## Version 0.1.6

* fixes bug with battles with null ranks not uploading to stat.ink
* added api checker for debugging

## Version 0.1.5

* added sorting to some tables
* fixed problem with turf inked not displaying correctly on stat.ink
* changed results dropdown so it doesn't show battle numbers where you dc'd
* better feedback when pressing buttons
* fixed bug with columns not lining up correctly
* fixed bug when displaying turf war in details

## Version 0.1.4

* added splatoon schedule page
* added umbrella to weapon mapping
* navigation is now fixed to top
* editted text for clarity
* added player ranks to result details
* other various improvements and fixes to the user experience

## Version 0.1.3
Initial Beta Release

* fixes problem with mapping Enperry and Hero Splat Dualies
