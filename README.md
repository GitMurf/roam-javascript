# Roam Projects by Murf

Each section below outlines details for each script that can be installed in Roam via roam/js.

## Table of Contents

- [Roam-Javascript GitHub Pages](https://gitmurf.github.io/roam-javascript/)
- [Attribute Table Filters](#attribute-table-filters)
- [Scratch Pad](#scratch-pad)
- [Roam-highlighter Browser Extension](#roam-highlighter-browser-extension)
- [Filter Improvements](#filter-improvements)
- [Query Improvements for TODO](#query-improvements-for-todo)
- [Cleanup before paste into Roam](#cleanup-before-paste-into-roam)
- [Smart Linking](#smart-linking)
- [Kanban Agenda](#kanban-agenda)
- [TEMPLATE](#template)
- [License](#license)

## Attribute Table Filters

### Description

- Script located at: https://gitmurf.github.io/roam-javascript/attr-tables-filter.js
- Detailed Instructions can be found below in the Demo section
- To activate filtering, click the `---` in header row of attribute table (1st column)
  - ![image](https://user-images.githubusercontent.com/64155612/99346592-ceab7980-2849-11eb-807b-213dba4b3f78.png)
- MUST have David's Sorting Attribute Tables script installed (see below)
  - Details on David Vargas' Sorting Attribute Tables script:
    - Website: https://roamjs.com/docs/extensions/attr-tables
    - Tweet: https://twitter.com/dvargas92495/status/1313897302201958401?s=20
  - The script now auto installs David's if it isn't already present
- List of all "special" characters
  - ` backtick --> allows user to type the filter without onInput applying filter after every keystroke (quicker on large tables)
  - {a} --> AND condition
  - {o} --> OR condition
  - {n} --> NOT modifier
  - {b} --> BLANKS
  - {(} --> open parenthesis for grouping
  - {)} --> closed parenthesis for grouping
  - {s} --> start date (hides anything before that date)
  - {e} --> end date (hides anything after that date)
  - {d} --> match a single date
  - {t} --> look for TODO item
  - {done} --> look for DONE item
- GitHub Gist (out-dated): https://gist.github.com/GitMurf/aece9f105628640cb79925d1310449ec

### Installation

To install, do the same thing you do for any roam/js script.

1. Create page in Roam (if not already present) called `[[roam/js]]`
2. If you previously installed this script by copying from a GitHub Gist, remove it from `[[roam/js]]` now.
3. Create a new block on this page and enter: `{{[[roam/js]]}}`
4. Nest under that block a `Code Block`
5. Make sure the code language is set as `JavaScript`
6. Paste the following into the new `Code Block`
```
var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://gitmurf.github.io/roam-javascript/attr-tables-filter.js";
document.getElementsByTagName("head")[0].appendChild(s);
```
7. A warning box shows up asking you to review the risks of using roam/js.
8. Once you have reviewed the warning and understand/accept the risk, click Yes.
9. Refresh Roam and the script should now be installed!

### Demo

**Detailed Instructions**

![screenshot](https://user-images.githubusercontent.com/64155612/96098438-f6907180-0e86-11eb-9cd4-ca23d9263d4f.png)
![screenshot](https://user-images.githubusercontent.com/64155612/96098494-04de8d80-0e87-11eb-98dc-f8de7d01967c.png)
![screenshot](https://user-images.githubusercontent.com/64155612/96098507-090aab00-0e87-11eb-8069-62a89738892c.png)
![screenshot](https://user-images.githubusercontent.com/64155612/96098520-0e67f580-0e87-11eb-93a4-b03e6df5285c.png)

**General Demo**

![How to Use](https://user-images.githubusercontent.com/64155612/96104315-8cc79600-0e8d-11eb-9c68-bf930d041054.gif)

**Setting Default Filters**

![Default Filters](https://user-images.githubusercontent.com/64155612/96158005-e056d580-0ec7-11eb-8510-3b363ba6c605.gif)

### Ideas Backlog

I am keeping track of new ideas here: [Attribute Table Filters - Backlog of Ideas / Features · Issue #5 · GitMurf/roam-javascript](https://github.com/GitMurf/roam-javascript/issues/5)

### Change Log

**v0.5.0**

- Merged back from using [Gist](https://gist.github.com/GitMurf/aece9f105628640cb79925d1310449ec) to now using roam-javascript Repository moving forward
- roam-javascript Repository has GitHub Pages configured which allows for users to set JS source to this Repo so they will always have the most up-to-date code

**v0.4.8**

- Fixed bug when using David default sort and filter default on same column

**v0.4.7**

- Load David's sorting script if not already loaded
- Add semicolon at end of script for extra security

**v0.4.6**

- Add {t} for filtering TODO items
- Fix issue with complex "lookbehind" regex that Safari doesn't support

**v0.4.5**

- Default filter comparison to match column header changed to use lower case
- Minor bug fixes
- Added grouping logic with parenthesis using {(} and {)}

**v0.3**

- Big improvements all around

## Scratch Pad

### Description

### Installation

### Demo

## Roam-highlighter Browser Extension

### Description

### Installation

### Demo

## Filter Improvements

### Description

- autofocus
- select w/ ENTER
- clear all filters

### Installation

### Demo

## Query Improvements for TODO

### Description

### Installation

### Demo

## Cleanup before paste into Roam

### Description

- roam-format.html
- roam-format.js

### Installation

### Demo

## Smart Linking

### Description

### Installation

### Demo

## Kanban Agenda

### Description

Run this SmartBlock on any block to schedule/send it to a Kanban Agenda on any Daily Notes Page.

### Installation

Copy the raw JS code from here: https://raw.githubusercontent.com/GitMurf/roam-javascript/master/kanban-agenda.js

Paste that code into this smartblock "shell" where it says `//paste code here...`:

- ````
  #42SmartBlock Kanban Agenda
  ````
  - ````
    <%JA:
    ```javascript
    //paste code here from https://raw.githubusercontent.com/GitMurf/roam-javascript/master/kanban-agenda.js```
    %>
    ````

![image](https://user-images.githubusercontent.com/64155612/108020351-0ce34100-6fd1-11eb-9cf6-f2bee61c2bf0.png)

Should end up looking something like this:

![image](https://user-images.githubusercontent.com/64155612/108020289-e7563780-6fd0-11eb-8dbc-212d7b4ce70f.png)

### Demo

![Kanban agenda GitHub Demo 1](https://user-images.githubusercontent.com/64155612/108021764-0efacf00-6fd4-11eb-8030-2681ef1b5b13.gif)

## TEMPLATE

### Description

### Installation

### Demo

# License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

This project is licensed under the **MIT license** - see the [LICENSE](LICENSE.md) file for details
