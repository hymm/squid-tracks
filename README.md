# Splat Track
A desktop program for viewing splatnet 2 statistics and uploading them to stat.ink.

## Uploading to stat.ink
1. Go to stat.ink and copy your api key.
2. Go to the "Settings" page and paste the key into "stat.ink API Key"
3. Click "Save"
4. On "Results" pick the battle in "Results Detail" you want to upload and
5. Click "Upload to stat.ink"
6. Repeat steps 4 and 5 as necessary

## Running the project for development
To run in development mode:

Install yarn from https://yarnpkg.com
```
yarn
yarn run dev
```

## TODO List:
* pick battle number from details page
* poll for new battles and auto upload to stat.ink
* autoupdate
* Better feedback on clicking buttons
* Sorting on Tables
* Prettify Everything
* Use weapon icons from splatnet
* memoize or cache getting game details ('/results/512')
* Get other language users to test

### Low Priority
* official splatnet link is broken, probably not setting the cookie correctly into render view
* Open Splatnet 2 in webview
* Schedule Page
* About Page
* Help Page
* save records on local disk?
* Invalidate Session Token on getSessionWithSessionToken error
* look into how to use babel on backend process

## Development Notes
Note: Render Process is using babel, but the backend process is not, so allowed syntax between the two is different right now.
