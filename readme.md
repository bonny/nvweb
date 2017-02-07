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

## Todo

### Working on now

- sync with dropbox
	- add notes when connected, load first time

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




