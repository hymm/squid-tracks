# Splat Track
A desktop program for viewing splatnet 2 statistics and uploading them to stat.ink.

## Configure stat.ink
1. Go to stat.ink and copy your api key.
2. Go to the configuration page and paste the key into "stat.ink API Key"
3. Click save.

## Running the project for development
Install yarn from https://yarnpkg.com

Get modules:
```
yarn
```

To run in development mode:
```
yarn run dev
```

## TODO List:
* Implement a Packager
* Sorting on Tables
* Better feedback on clicking buttons
* save records on local disk?
* Prettify Everything
* Use weapon icons from splatnet
* memoize or cache getting game details ('/results/512')
* Invalidate Session Token on getSessionWithSessionToken error
* Schedule Page
* Get other language users to test
* pick battle number from details page

### low priority
* official splatnet link is broken, probably not setting the cookie correctly into render view
* Open Splatnet 2 in webview
* look into how to use babel on backend process (low priority)

## Development Notes
Note: Render Process is using babel, but the backend process is not, so allowed syntax between the two is different right now.
