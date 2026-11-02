// Terrain Audio Studio window frame.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-mixer-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {
      parts: {
        'frame.header': () => (_c) => {
          const { util } = _c;
          const make = (tag, cls, parent, text) => util.el(tag, cls, parent, text || '');
          document.body.classList.add('terrain-window');
          const title = make('header', 'terrain-titlebar', document.body);
          make('span', 'terrain-mark', title, '✦');
          make('strong', 'terrain-appname', title, 'Terrain Audio Studio');
          const windowTools = make('div', 'terrain-windowtools', title);
          for (const [glyph, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
            const b = make('button', 'terrain-winbtn', windowTools, glyph);
            b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
          }
          const menu = make('nav', 'terrain-menubar', document.body, 'File   Edit   Track   Mix   View   Help');
          menu.setAttribute('aria-label', 'Application menu');
          const tabs = make('nav', 'terrain-tabs', document.body);
          for (const [i, label] of ['Mixer', 'Instruments', 'Effects', 'Sequences', 'Mastering'].entries()) {
            const tab = make('div', `terrain-tab${i === 0 ? ' active' : ''}`, tabs, label);
            if (i === 0) tab.setAttribute('aria-current', 'page');
          }
          const band = make('section', 'terrain-overview', document.body);
          const record = make('div', 'terrain-record', band);
          const cover = make('div', 'terrain-cover', record);
          cover.setAttribute('role', 'img'); cover.setAttribute('aria-label', 'Riverside landscape album cover');
          const info = make('div', 'terrain-session', record);
          make('h1', 'terrain-session-title', info, 'Riverside Session');
          make('div', 'terrain-session-meta', info, '5 tracks   |   44.1 kHz   |   24 bit   |   120 BPM');
          make('div', 'terrain-session-time', info, '00:00  /  03:24');
          const player = make('div', 'terrain-player', info);
          for (const [glyph, label] of [['▶','Play'], ['■','Stop'], ['◀◀','Previous'], ['▶▶','Next']]) {
            const b = make('button', 'terrain-transport', player, glyph);
            b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
          }
          const scrub = make('div', 'terrain-scrub', player);
          const scrubline = make('div', 'terrain-scrubline', scrub);
          make('span', 'terrain-scrubknob', scrubline);
          make('span', 'terrain-duration', player, '03:24');
          const summary = make('section', 'terrain-summary', band);
          make('h2', '', summary, 'Track Overview');
          for (const [label, value] of [['Total Tracks','5'], ['Active Tracks','5'], ['Effects','3'], ['Length','03:24']]) {
            const row = make('div', 'terrain-stat', summary);
            make('span', '', row, label); make('span', '', row, value);
          }
          const meter = make('section', 'terrain-meter', band);
          make('h2', '', meter, 'Level Meter');
          for (const side of ['L','R']) {
            const line = make('div', 'terrain-meterrow', meter);
            make('b', '', line, side);
            make('div', 'terrain-meterbar', line);
          }
          make('div', 'terrain-scale', meter, '-60      -36      -24      -12       -6        0');
          Object.assign(_c, { header: title, overview: band });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          const header = _c.header;
          const note = _c.util.el('div', 'terrain-note-home', document.body);
          _c.overview.before(note);
          _c.header = note;
          base(_c);
          _c.header = header;
        },
        'frame.body': () => (_c) => {
          _c.body = _c.util.el('main', 'terrain-workarea', document.body);
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) panel.classList.add('terrain-instruction', 'terrain-side-note');
        },
        'frame.stage': (base) => (_c) => {
          base(_c);
          _c.stage.classList.add('terrain-stage');
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) note.classList.add('terrain-toast-note');
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const footer = document.querySelector('.ref-foot');
          if (footer) footer.classList.add('terrain-footer');
        },
      },
    },
  });
})();
