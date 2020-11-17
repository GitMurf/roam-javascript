# Roam Projects by Murf

Each section below outlines details for each script that can be installed in Roam via roam/js.

## Table of Contents

- [Roam-Javascript GitHub Pages](https://gitmurf.github.io/roam-javascript/)
- [Attribute Table Filters](#attribute-table-filters)
- [Scratch Pad](#scratch-pad)
- [Roam-highlighter Browser Extension](#roam-highlighter-browser-extension)
- [Filter Improvements](#filter-improvements)
- [Query Improvements for TODO](#query-improvements-for-todo)
- [Cleanup before paste into Roam](#cleanup-before-paste-into-roam)\
- [Smart Linking](#smart-linking)
- [TEMPLATE](#template)
- [License](#license)

## Attribute Table Filters

### Description

- Detailed Instructions can be found below in the Demo section
- To activate filtering, click the '---' in header row of attribute table (1st column)
- MUST have David's Sorting Attribute Tables script installed (see below)
  - Details on David Vargas' Sorting Attribute Tables script:
    - Website: https://roamjs.com/extensions/attr-tables/
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
2. Create a new block on this page and enter: `{{[[roam/js]]}}`
3. Nest under that block a `Code Block`
4. Make sure the code language is set as `JavaScript`
5. Paste the following into the new `Code Block`

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://gitmurf.github.io/roam-javascript/attr-tables-filter.js";
document.getElementsByTagName("head")[0].appendChild(s);

6. A warning box shows up asking you to review the risks of using roam/js.
7. Once you have reviewed the warning and understand/accept the risk, click Yes.
8. Refresh Roam and the script should now be installed!

### Demo

**Detailed Instructions**

INSERT SCREENSHOTS HERE...

**General Demo**

![How to Use](https://user-images.githubusercontent.com/64155612/96104315-8cc79600-0e8d-11eb-9c68-bf930d041054.gif)

**Setting Default Filters**

![Default Filters](https://user-images.githubusercontent.com/64155612/96158005-e056d580-0ec7-11eb-8510-3b363ba6c605.gif)

### Ideas Backlog

- Create a custom function to parse the number values for aggregation to add thousands separators.
  - The advanced regex I had working doesn't work on all browsers and definitely doesn't work on ipad.
  - Likely the regex doesn't work on any safari based browser.

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

## TEMPLATE

### Description

### Installation

### Demo

# License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

This project is licensed under the **MIT license** - see the [LICENSE](LICENSE.md) file for details
