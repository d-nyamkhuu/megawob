// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-context-02',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Documents',
        'theme': 'yosemite',
        'layout': 'dock',
        'tools': '◀    ▶    ▦    ☰    ▥    ⚙    ⇧    ◈',
        'rail':
          'Favorites|All My Files|iCloud Drive|Applications|Desktop|Documents|Downloads|Devices|Macintosh HD|Tags|Red|Orange|Yellow|Green|Blue|Purple|Gray|All Tags...',
        'side':
          'File interaction tips|Click to select|Select a file or folder to view its details.|Double-click to open|Open files and folders in this window.|Right-click for more options|See actions like Copy, Move, Rename, and Delete.',
        'foot': 'Task List|Status|Notes|Actions',
      },
      parts: {
        'frame.30': (base, S) =>
          function (_c) {
            const { endBank, endRng, endText } = _c;
            const label = endRng.bool(0.5) ? 'OK' : endText(endRng.pick(endBank.filter((x) => endText(x) !== 'OK')));
            const placement = endRng.pick(['header', 'header', 'actions', 'status']);
            Object.assign(_c, { label, placement });
          },
        'frame.31': () => () => {},
      },
    },
  });
})();
