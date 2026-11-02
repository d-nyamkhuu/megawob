(function () {
  'use strict';
  const palette = { bg: '#e9edf1', panel: '#ffffff', fg: '#2d3338', muted: '#66707d', line: '#c3cad2' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const tl = u.el('div', 'ds-top-l', top);
      u.el('span', 'ds-brand', tl, 'CivicWorks');
      u.el('span', 'ds-portal', tl, 'City Administration Portal');
      const tr = u.el('div', 'ds-top-r', top);
      ['Help', 'My Account', 'Sign Out'].forEach((t, i) => {
        if (i) u.el('i', '', tr, '|');
        u.el('span', '', tr, t);
      });
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('section', 'ds-pane ds-left', body);
      u.el('h2', 'ds-ph', left, 'City Selection');
      const lbody = u.el('div', 'ds-pb', left);
      const row = u.el('div', 'ds-row', lbody);
      const stage = u.el('main', 'ds-stage', row);
      const det = u.el('div', 'ds-details', row);
      u.el('h3', 'ds-dh', det, 'City Details');
      const dl = u.el('div', 'ds-db', det);
      ['Name:', 'State:', 'Population:', 'Region:'].forEach((t) => {
        const r = u.el('div', 'ds-kv', dl);
        u.el('b', '', r, t);
        u.el('span', '', r, '—');
      });
      const right = u.el('section', 'ds-pane ds-right', body);
      u.el('h2', 'ds-ph', right, 'Additional Information');
      const rb = u.el('div', 'ds-pb ds-rb', right);
      u.el('p', 'ds-hint', rb, 'Details will appear here after you select a city.');
      const kv = u.el('div', 'ds-kvs', rb);
      ['Mayor:', 'Founded:', 'Elevation:', 'Time Zone:', 'Website:'].forEach((t) => {
        const r = u.el('div', 'ds-kv', kv);
        u.el('b', '', r, t);
        u.el('span', '', r, '—');
      });
      u.el('hr', '', rb);
      u.el('div', 'ds-notes-l', rb, 'Notes');
      const ta = u.el('textarea', 'ds-notes', rb);
      ta.placeholder = 'Add notes about the selected city...';
      const acts = u.el('div', 'ds-acts', rb);
      const clear = u.el('button', 'ds-clear', acts, 'Clear');
      clear.type = 'button';
      Object.assign(_c, { header: lbody, siteBody: body, lbody, row, det, siteStage: stage, acts });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-instruction');
        note.classList.toggle('long', note.textContent.length > 70);
        _c.lbody.insertBefore(note, _c.row);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.acts;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.siteBody; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.det;
      base(_c);
      _c.body = body;
      const panel = _c.det.querySelector('.ref-panel');
      if (panel) _c.det.prepend(panel);
    },
    'frame.stage': () => (_c) => { _c.stage = _c.siteStage; },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.lbody.insertBefore(note, _c.row);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = '© 2013 CivicWorks. All rights reserved.';
      const fl = _c.util.el('div', 'ds-fl', foot);
      ['Terms of Use', 'Privacy Policy', 'Contact'].forEach((t, i) => {
        if (i) _c.util.el('i', '', fl, '|');
        _c.util.el('span', '', fl, t);
      });
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ref-tools'));
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
    name: 'design-choose-option-listbox-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1c6bc4'], LOW_ACCENTS: ['#1c6bc4'], parts,
    },
  });
})();
