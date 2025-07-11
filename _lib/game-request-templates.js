// ==UserScript==
// @name        F95 Game Request Templates
// @namespace   1330126-edexal
// @license     Unlicense
// @version     1.1
// @author      Edexal
// @description Templates for creating game requests on F95
// ==/UserScript==
function _getRules() {
  return `[CENTER][B][COLOR=#ff0000]Rules - Remove this before posting.[/COLOR][/B][/CENTER]
[LIST]
[*][COLOR=#FFA500]Any [U]Online only[/U] or [U]Multiplayer[/U] requests will be [B]denied[/B] and [B]deleted[/B][/COLOR]
[*][COLOR=#FFA500][B]Don't[/B] ask for games that haven't been released yet[/COLOR]
[*][COLOR=#FFA500][B]Don't[/B] request more than 1 game per request (this includes site-rips)[/COLOR]
[*][COLOR=#FFA500]The requested game [I]must[/I] be available in [B]English[/B]! Otherwise, use the [URL='https://f95zone.to/forums/request.119/'][U]Translation Request subforum[/U][/URL] instead[/COLOR]
[*][COLOR=#FFA500]If the game is a translated game (from any language to English) a link to the translator's page is required, eg [URL='https://ulmf.org/'][U]ULMF[/U][/URL][/COLOR]
[/LIST]`;
}

function getUpdateTemplate() {
  return {
    title: "[Store][$Price] Game Name [Version]",
    body: `Title:
Thread: (link to thread on F95zone)
Developer website:
Version:

${_getRules()}`
  };
}

function getRequestTemplate() {
  return {
    title: "[Store][$Price] Game Name [Version]",
    body: `Title:
Developer website:
Language:
Samples:

${_getRules()}`
  };
}

function getNewTemplate() {
  return {
    title: "[GAME ENGINE] Game Name [Version][Developer]",
    body: `[CENTER](COVER ART; DELETE THIS)

[B]Overview:[/B]
(STORY OVERVIEW GOES HERE AND USE A SPOILER TAG IN-CASE OF A WALL OF TEXT; DELETE THIS)[/CENTER]

[B]Thread Updated[/B]: (USE "YYYY-MM-DD" NUMBERS ONLY, DATE ADDED TO F95ZONE ; DELETE THIS)
[B]Release Date[/B]: (USE "YYYY-MM-DD" NUMBERS ONLY, DATE RELEASE BY DEV; DELETE THIS)
[B]Developer[/B]: (DEVELOPER NAME/SOCIAL LINKS HERE) Patreon - Website
[B]Publisher[/B]: (REMOVE IF NOT APPLICABLE)
[B]Translator[/B]: (REMOVE IF NOT APPLICABLE)
[B]Censored[/B]: (Yes/No)
[B]Version[/B]:
[B]OS[/B]: (REN'PY GAMES WITH "PC" IN THE TITLE INCLUDE BOTH WINDOWS + LINUX, MAKE SURE TO TYPE BOTH; DELETE THIS)
[B]Language[/B]: English
[B]Voice[/B]: English (REMOVE IF NOT APPLICABLE)
[B]VNDB[/B]: Link (LINK TO VNDB PAGE - REMOVE IF NOT APPLICABLE)
[B]Store[/B]: DLSite - Steam (STORE PAGES - REMOVE IF NOT APPLICABLE)
[B]Other Games[/B]: (LINKS TO OTHER GAMES BY DEVELOPER FOUND ON F95ZONE - REMOVE IF NOT APPLICABLE)
[B]Genre[/B]:
[SPOILER]
(GENRE TAGS HERE, CAPITALIZE EACH TAG FOR PARITY, DELETE THIS)
[/SPOILER]

[B]Installation[/B]:
[SPOILER]
1. Extract and run.
[/SPOILER]

[B]Changelog[/B]:
[SPOILER]
(CHANGELOG GOES HERE. IF NO CHANGELOG IS AVAILABLE, USE "vX.XX Release" OR SIMILAR; DELETE THIS LINE)
[/SPOILER]

[B]Developer Notes[/B]:
[SPOILER]
(IN CASE THE DEVELOPER WISHES TO SHARE SOME INFO REGARDING THE GAME; DELETE THIS ENTIRE BLOCK IF NONE)
[/SPOILER]

[B]Translator Notes[/B]:
[SPOILER]
(IN CASE THE TRANSLATOR WISHES TO SHARE SOME INFO REGARDING THE GAME; DELETE THIS ENTIRE BLOCK IF NONE)
[/SPOILER]

(ADD ANY OTHER BLOCK FOLLOWING THE SAME FORMATTING AS ABOVE IF NECESSARY HERE; DELETE THIS LINE)
[CENTER][B][SIZE=6]DOWNLOAD[/SIZE][/B]
[SIZE=5][B]Win[/B]: TORRENT - MIRROR - MIRROR - MIRROR
[B]Linux[/B]: TORRENT - MIRROR - MIRROR - MIRROR
[B]Mac[/B]: TORRENT - MIRROR - MIRROR - MIRROR
[B]Others[/B]: COMPRESSED - ANDROID (OR UNOFFICIAL ANDROID)

[B]Patches[/B]: INCEST PATCH - BUGFIX
[B]Extras[/B]: WALKTHROUGH - 100% SAVE - MOD - MOD2 - MOD3[/SIZE]
[SIZE=1](THANK YOU NOTES AND UNOFFICIAL ANDROID MESSAGE GOES, ALWAYS AT THE VERY BOTTOM OF ALL DL LINKS; EXAMPLE: "Unofficial build by [USER=1]@F95[/USER]. Thank you [USER=2222]@Bloo[/USER] for sharing the game and [USER=92]@TCMS[/USER] for the walkthrough."; DELETE THIS LINE)[/SIZE]

(SAMPLES/SCREENSHOTS; DELETE THIS)[/CENTER]`
  };
}