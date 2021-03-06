# nvweb

A web based version of [nv](http://notational.net/)/[nvalt](http://brettterpstra.com/projects/nvalt/).

## Install / run

To run app locally:

- Install node and yarn and budo globaly
- `$ yarn install`
- `$ npm start`

Then goto [http://localhost:9966/](http://localhost:9966/) in your web browser.

## Demo site with app

The app can be seen and tested online at [nvweb.eskapism.se](https://nvweb.eskapism.se).

> Meh, I don't wanna need to click a link, can't you just show me what it looks like?

Sure! Screenshot of the app/site/whatever-it-is:

![Screenshot](https://www.dropbox.com/s/c9m88i1xoo4n62t/nvweb%20screenshot.png?raw=1)

## Note format

```js
	{
		// note id in indexDB
		"id": 123,
		"name": "My note.txt",
		"text": "Note text contents",
		// milliseconds since jan 1 1970, (not "unixtime" because ms, not s)
		"dateModified": 1487499066504,
		"updateFromDropboxNeeded": false // true if need to download update
		// FilesFileMetadata as described here http://dropbox.github.io/dropbox-sdk-js/global.html#FilesFileMetadata
		"dropboxMeta": {
			".tag": "file", // can also be 'deleted' or 'folder'
			"client_modified": "2017-02-18T20:33:40Z",
			"content_hash": "e3e2df7777f0b79490b4520d01febf2f081b29cff8544feefbe1b316b6aa3666",
			"id": "id:UaOSTDaN5iwAAQ3PAADanW",
			"name": "Note name.txt",
			"path_display": "/notes/My note.txt",
			"path_lower": "/notes/my note.txt",
			"rev": "54675d7a000b0ef5",
			"server_modified": "2017-02-18T20:33:45Z",
			"size": 324
		}
    }
```

## Todo

### Working on now

- download full note data from dropbox, for notes marked as to be downloaded
- delete notes when .tag = "deleted"

### Soon

- liten notify att den sparats lokalt + när till dropbox

- edit/search-behavior?
	- if exact title match = edit note?
	- if no exact match = create note?
	- when searching - de-select current note?
	- create-message missing with current behavior

- sometimes create note does not work, desktop + shortcuts seems to be the combo

- when switching note with cmd+j/k don't focus search, keep focus on list

- vid dropboxauth: måste ladda om för att token ska vara giltig/funka


### Later

- Markdown:
  https://www.npmjs.com/package/vue-markdown

- https://markdown-it.github.io/

- komma ihåg markörposition/markering

- export-funktion, typ till json

- dark/night mode




