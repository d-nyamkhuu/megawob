(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-debounce-04',
    brand: 'AirTravel Pro',
    rail: 'Travel Help|Finding flights|City names and airports|Changing or canceling|Baggage information|Tips|Type a city name to see a list of matching cities and airports.|You can enter the city name or the airport name.|For best results, use the full name rather than an abbreviation.|Popular destinations|New York (JFK) · United States|London (LHR) · United Kingdom|Tokyo (NRT) · Japan|Sydney (SYD) · Australia',
    menu: '✈   Flights|▣   Hotels|▰   Cars|▣   My Trips|⚙   Preferences',
  };
  const palette = { bg: '#e1e3e5', panel: '#f3f3f3', fg: '#111111', muted: '#394b6c', line: '#929ba8' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const meta = u.el('div', 'ds-window-meta', top);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', 'ds-window-control', meta, t);
        b.type = 'button';
      });
      // The instruction section receives its own strip; tools use the title bar.
      const header = u.el('div', 'ds-note-slot');
      Object.assign(_c, { header, meta });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t, i) => _c.util.el('span', i === 0 ? 'active' : '', nav, t));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.meta;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const classes = ['ds-side-title', 'ds-side-link', 'ds-side-link', 'ds-side-link', 'ds-side-link',
        'ds-side-section', 'ds-side-copy', 'ds-side-copy', 'ds-side-copy', 'ds-side-section',
        'ds-destination', 'ds-destination', 'ds-destination', 'ds-destination'];
      C.rail.split('|').forEach((t, i) => u.el('div', classes[i], rail, t));
      const content = u.el('div', 'ds-content', body);
      document.body.appendChild(_c.header);
      Object.assign(_c, { body, rail, content });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const panel = _c.rail.querySelector('.ref-panel');
      if (panel) _c.rail.insertBefore(panel, _c.rail.children[1]);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.content);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        // The rail keeps the floating note clear of the task's interactive area.
        _c.rail.insertBefore(note, _c.rail.children[1]);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready  ·  AirTravel Pro';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'qt.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1c55a0'],
      LOW_ACCENTS: ['#1c55a0'],
      TITLES: [C.brand],
      parts,
    },
  });
})();
